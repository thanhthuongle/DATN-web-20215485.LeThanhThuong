import { Avatar, Box, Button, FormControl, MenuItem, Modal, Select, Typography } from '@mui/material'
import moment from 'moment'
import { useEffect, useState } from 'react'
import { Controller, FormProvider, useForm } from 'react-hook-form'
import { NumericFormat } from 'react-number-format'
import { toast } from 'react-toastify'
import { closeSavingsAccountAPI } from '~/apis'
import FinanceItem1 from '~/component/FinanceItemDisplay/FinanceItem1'
import FieldErrorAlert from '~/component/Form/FieldErrorAlert'
import { INTEREST_PAID, MONEY_SOURCE_TYPE, TERM_ENDED } from '~/utils/constants'
import { FIELD_REQUIRED_MESSAGE } from '~/utils/validators'
import InfoIcon from '@mui/icons-material/Info'

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: { xs: '100%', sm: 700 },
  bgcolor: 'background.paper',
  // border: '2px solid #000',
  boxShadow: 24,
  p: 4
}

function getAccumulationDaysInCurrentMonth(startDate, now) {
  const sentDay = startDate.date()
  let interestStart = now.clone().date(sentDay)
  if (interestStart.isAfter(now)) interestStart = interestStart.subtract(1, 'month')
  return now.diff(interestStart, 'days') + 1
}

function calcInterest(saving) {
  const now = moment()
  const startDate = moment(saving?.startDate)
  let interest = 0

  const isRollOver = [
    TERM_ENDED.ROLL_OVER_PRINCIPAL,
    TERM_ENDED.ROLL_OVER_PRINCIPAL_AND_INTEREST
  ].includes(saving?.termEnded)

  const isMonthly = saving?.interestPaid === INTEREST_PAID.MONTHLY
  const isMaturity = saving?.interestPaid === INTEREST_PAID.MATURITY
  const maturityDate = startDate.clone().add(saving?.term, 'months')
  const isEarly = now.isBefore(maturityDate)

  let accumulationDays = 0

  if (isRollOver || isEarly) {
    if (isMonthly) {
      accumulationDays = getAccumulationDaysInCurrentMonth(startDate, now)
    } else if (isMaturity) {
      accumulationDays = now.diff(startDate, 'days') + 1
    }
    interest = Math.round((saving?.initBalance * saving?.nonTermRate * accumulationDays) / 36500)
  } else {
    // Đúng hạn
    // eslint-disable-next-line no-lonely-if
    if (isMonthly) {
      interest = 0
    } else if (isMaturity) {
      interest = Math.round((saving?.initBalance * saving?.rate * saving?.term) / 1200)
    }
  }

  return interest
}

function CloseSavingPopup({ isOpen, onClose, saving, accountData, afterCloseSaving }) {
  // console.log('🚀 ~ CloseSavingPopup ~ saving:', saving)
  const [wallets] = useState(accountData)

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
    // getIndividualAccountAPI().then((res) => {
    //   setWallets(res)
    //   if (res?.[0]?._id) {
    //     setValue('moneyTargetId', res[0]._id)
    //   }
    // })

    setValue('moneyTargetId', wallets[0]._id)
  }, [setValue, wallets])
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

          {/* Thông báo lưu ý cho người dùng khi tất toán */}
          <Box
            display={'flex'}
            alignItems={'center'}
            padding={1}
            gap={1}
            marginTop={3}
            sx={{ border: 'solid 1px rgb(13, 99, 197)', borderRadius: 1.5 }}
          >
            <InfoIcon fontSize='large' sx={{ color: 'rgb(69, 145, 231)' }} />
            {(saving?.termEnded == TERM_ENDED.ROLL_OVER_PRINCIPAL || saving?.termEnded == TERM_ENDED.ROLL_OVER_PRINCIPAL_AND_INTEREST) &&
              <Typography sx={{ color: 'rgb(69, 145, 231)', opacity: 1 }}>
                Sổ tiết kiệm của bạn đang ở chế độ <strong>tái tục</strong>. Khi tất toán, <strong>lãi suất không kỳ hạn</strong> sẽ được áp dụng - mức này thường thấp hơn nhiều so với lãi suất có kỳ hạn.
              </Typography>
            }
            {(saving?.termEnded == TERM_ENDED.CLOSE_ACCOUNT && moment().isBefore(moment(saving?.startDate).add(saving?.term, 'months'))) &&
            <Typography sx={{ color: 'rgb(69, 145, 231)', opacity: 1 }}>
                Bạn đang tất toán sổ tiết kiệm trước kỳ hạn. <strong>Lãi suất không kỳ hạn</strong> sẽ được áp dụng - mức này thường thấp hơn nhiều so với lãi suất có kỳ hạn.
            </Typography>
            }
            {(moment().isSameOrAfter(moment(saving?.startDate).add(saving?.term, 'months'))) &&
            <Typography sx={{ color: 'rgb(69, 145, 231)', opacity: 1 }}>
                Bạn đang tất toán sổ tiết kiệm đến kỳ hạn. <strong>Lãi suất năm</strong> sẽ được áp dụng để tính tiền lãi.
            </Typography>
            }
          </Box>

          <FormProvider {...methods}>
            <form onSubmit={methods.handleSubmit(onSubmit)}>
              <Box display={'flex'} flexDirection={'column'} gap={2} marginTop={2}>
                {/* Ngân hàng */}
                <Box>
                  <Box display={'flex'} alignItems={'center'}>
                    <Typography sx={{ width: '120px' }}>Ngân hàng</Typography>
                    <Typography>{saving?.bankInfo?.name}</Typography>
                  </Box>
                </Box>
                {/* Lãi suất */}
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
                      value={Number(calcInterest(saving))}
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
                      value={Number(saving?.balance) + Number(calcInterest(saving))}
                      style={{ fontWeight: 'bold', color: '#27ae60', maxWidth: '100%' }}
                    />
                  </Box>
                </Box>
                {/* tài khoản nhận */}
                <Box>
                  <Box display={{ xs: 'block', sm: 'flex' }} alignItems={'center'}>
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
                                      src= {selectedWallet?.bankInfo?.logo ? selectedWallet?.bankInfo?.logo : selectedWallet?.icon}
                                      sx={{
                                        bgcolor: 'yellow',
                                        width: 40,
                                        height: 40,
                                        flexShrink: 0,
                                        border: (theme) => theme.palette.mode == 'light' ? 'solid 0.5px yellow' : ''
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
                                    logo={w?.bankInfo?.logo ? w?.bankInfo?.logo : w?.icon}
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
                  <Box marginLeft={{ sm: '100px' }}>
                    <FieldErrorAlert errors={errors} fieldName={'moneyTargetId'}/>
                  </Box>
                </Box>
                <Typography variant='body2' sx={{ opacity: 0.7 }}>Số dư sẽ cần được chuyển về tài khoản để tất toán sổ tiết kiệm</Typography>

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