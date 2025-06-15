import { Avatar, Box, Button, FormControl, MenuItem, Modal, Select, Typography } from '@mui/material'
import moment from 'moment'
import { useEffect, useState } from 'react'
import { Controller, FormProvider, useForm } from 'react-hook-form'
import { NumericFormat } from 'react-number-format'
import { toast } from 'react-toastify'
import { closeSavingsAccountAPI, getIndividualAccountAPI } from '~/apis'
import FinanceItem1 from '~/component/FinanceItemDisplay/FinanceItem1'
import FieldErrorAlert from '~/component/Form/FieldErrorAlert'
import { MONEY_SOURCE_TYPE } from '~/utils/constants'
import { FIELD_REQUIRED_MESSAGE } from '~/utils/validators'

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 700,
  bgcolor: 'background.paper',
  // border: '2px solid #000',
  boxShadow: 24,
  p: 4
}

function CalcInterest (initBalance, startDate, term, rate = 10, nonTermRate = 10) {
  const isRegulation = moment().isSameOrAfter(moment(startDate).add(term, 'months'))
  let interest = 0
  if (isRegulation) {// Tất toán đúng kỳ hạn
    interest = Math.round((initBalance*rate*term)/1200)
  } else {// Tất toán không kỳ hạn
    const dayOfSavings = moment().diff(moment(startDate), 'days')
    interest = Math.round((initBalance*nonTermRate*dayOfSavings)/36500)
  }
  return interest
}

function CloseSavingPopup({ isOpen, onClose, saving, afterCloseSaving }) {
  console.log('🚀 ~ CloseSavingPopup ~ saving:', saving)
  const [wallets, setWallets] = useState([])

  const methods = useForm()
  const { setValue, control, reset, formState: { errors } } = methods
  const resetForm = () => {
    reset({
      moneyTargetId: wallets[0]?._id || ''
    })
  }

  const onSubmit = (data) => {
    // console.log('🚀 ~ onSubmit ~ data:', data)
    let payload = {}
    if (data.moneyTargetId) {
      payload = {
        moneyTargetType: MONEY_SOURCE_TYPE.ACCOUNT,
        moneyTargetId: data.moneyTargetId
      }
    }
    // console.log('🚀 ~ onSubmit ~ payload:', payload)
    toast.promise(
      closeSavingsAccountAPI(saving._id, payload),
      { pending: 'Đang kết thúc khoản tích lũy...' }
    ).then(async res => {
      if (!res.error) {
        toast.success('Kết thúc khoản tích lũy thành công!')
        onClose()
        resetForm()
        afterCloseSaving()
      }
    })
  }

  useEffect(() => {
    getIndividualAccountAPI().then((res) => {
      setWallets(res)
      if (res?.[0]?._id) {
        setValue('moneyTargetId', res[0]._id)
      }
    })
  }, [setValue])
  return (
    <div onClick={(event) => event.stopPropagation()}>
      <Modal
        open={isOpen}
        onClose={onClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Box textAlign={'center'}>
            <Typography>Tất toán</Typography>
            <Typography id="modal-modal-title" variant="h6" component="h2">
              {saving?.savingsAccountName}
            </Typography>
          </Box>

          <FormProvider {...methods}>
            <form onSubmit={methods.handleSubmit(onSubmit)}>
              <Box display={'flex'} flexDirection={'column'} gap={2} marginTop={5}>
                <Box display={'flex'} alignItems='center'>
                  {!moment().isSameOrAfter(moment(saving.startDate).add(saving.term, 'months')) &&
                  <>
                    <Typography sx={{ width: '120px' }}>Lãi suất<br/>không kỳ hạn</Typography>
                    <Typography>{saving?.nonTermRate}%/năm</Typography>
                  </>
                  }
                  {moment().isSameOrAfter(moment(saving.startDate).add(saving.term, 'months')) &&
                  <>
                    <Typography sx={{ width: '120px' }}>Lãi suất</Typography>
                    <Typography>{saving?.rate}%/năm</Typography>
                  </>
                  }
                </Box>
                {/* số tiền ban đầu */}
                <Box>
                  <Box display={'flex'}>
                    <Typography sx={{ width: '120px' }}>Số tiền gửi</Typography>
                    <NumericFormat
                      displayType="text"
                      thousandSeparator="."
                      decimalSeparator=","
                      allowNegative={true}
                      suffix=" ₫"
                      value={Number(saving.initBalance)}
                      style={{ fontWeight: 'bold', color: '', maxWidth: '100%' }}
                    />
                  </Box>
                </Box>
                {/* số tiền lãi */}
                <Box>
                  <Box display={'flex'}>
                    <Typography sx={{ width: '120px' }}>Số tiền lãi</Typography>
                    <NumericFormat
                      displayType="text"
                      thousandSeparator="."
                      decimalSeparator=","
                      allowNegative={true}
                      suffix=" ₫"
                      value={Number(CalcInterest(saving.initBalance, saving.startDate, saving.term, saving.rate, saving.nonTermRate))}
                      style={{ fontWeight: 'bold', color: '#27ae60', maxWidth: '100%' }}
                    />
                  </Box>
                </Box>
                {/* số tiền nhận */}
                <Box>
                  <Box display={'flex'}>
                    <Typography sx={{ width: '120px' }}>Tổng tiền</Typography>
                    <NumericFormat
                      displayType="text"
                      thousandSeparator="."
                      decimalSeparator=","
                      allowNegative={true}
                      suffix=" ₫"
                      value={Number(CalcInterest(saving.initBalance, saving.startDate, saving.term, saving.rate, saving.nonTermRate)) + Number(saving.initBalance)}
                      style={{ fontWeight: 'bold', color: '#27ae60', maxWidth: '100%' }}
                    />
                  </Box>
                </Box>
                {/* tài khoản nhận */}
                <Box>
                  <Box display={'flex'} alignItems={'center'}>
                    <Typography sx={{ width: '120px', flexShrink: 0 }}>Nơi nhận</Typography>
                    <Box sx={{ width: '100%' }}>
                      <Controller
                        control={control}
                        rules={{ required: FIELD_REQUIRED_MESSAGE }}
                        name="moneyTargetId"
                        render={({ field: { onChange, onBlur, value } }) => (
                          <FormControl fullWidth>
                            <Select
                              labelId="wallet-select-label"
                              id="wallet-select"
                              value={value || ''}
                              onChange={onChange}
                              onBlur={onBlur}
                              error={!!errors['moneyTargetId']}
                              MenuProps={{
                                PaperProps: {
                                  style: {
                                    maxHeight: 250,
                                    overflowY: 'auto'
                                  }
                                }
                              }}
                              renderValue={(value) => {
                                const selectedWallet = wallets.find(w => w._id === value)
                                return (
                                  <Box display="flex" alignItems="center" gap={1}>
                                    <Avatar
                                      alt="Logo"
                                      src=""
                                      sx={{
                                        bgcolor: 'yellow',
                                        width: 40,
                                        height: 40,
                                        flexShrink: 0
                                      }}
                                    >
                                      {' '}
                                    </ Avatar>
                                    <Typography noWrap>
                                      {selectedWallet?.accountName}&nbsp;({selectedWallet?.balance?.toLocaleString()}&nbsp;₫)
                                    </Typography>
                                  </Box>
                                )
                              }}
                            >
                              {wallets?.map((w, index) => (
                                <MenuItem value={w._id} key={index}>
                                  <FinanceItem1
                                    title={w.accountName}
                                    amount={w.balance}
                                  />
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                        )}
                      />
                    </Box>
                  </Box>
                  <Box marginLeft={'100px'}>
                    <FieldErrorAlert errors={errors} fieldName={'moneyTargetId'}/>
                  </Box>
                </Box>
                <Typography variant='caption' sx={{ opacity: 0.7 }}>Số dư sẽ cần được chuyển về tài khoản để tất toán sổ tiết kiệm</Typography>

                {/* submit */}
                <Box display={'flex'} justifyContent={'center'} marginTop={5} gap={3}>
                  <Button variant='outlined' onClick={onClose}>Hủy</Button>
                  <Button variant='contained' type="submit" className='interceptor-loading'>Xác nhận</Button>
                </Box>
              </Box>
            </form>
          </FormProvider>
        </Box>
      </Modal>
    </div>
)
}

export default CloseSavingPopup