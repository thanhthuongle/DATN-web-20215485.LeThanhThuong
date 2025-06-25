import { Avatar, Box, Button, FormControl, MenuItem, Modal, Select, Typography } from '@mui/material'
import { useEffect, useState } from 'react'
import { Controller, FormProvider, useForm } from 'react-hook-form'
import { NumericFormat } from 'react-number-format'
import { toast } from 'react-toastify'
import { finishIndividualAccumulationAPI } from '~/apis'
import FinanceItem1 from '~/component/FinanceItemDisplay/FinanceItem1'
import FieldErrorAlert from '~/component/Form/FieldErrorAlert'
import { MONEY_SOURCE_TYPE } from '~/utils/constants'
import { FIELD_REQUIRED_MESSAGE } from '~/utils/validators'

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

function FinishAccumulationPopup({ isOpen, onClose, accumulation, accountData, refreshData }) {
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
      finishIndividualAccumulationAPI(accumulation._id, payload),
      { pending: 'Đang kết thúc khoản tích lũy...' }
    ).then(async res => {
      if (!res.error) {
        toast.success('Kết thúc khoản tích lũy thành công!')
        onClose()
        resetForm()
        refreshData()
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
        onClose={() => {
          onClose()
          resetForm()
        }}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Box textAlign={'center'}>
            <Typography>Kết thúc tích lũy</Typography>
            <Typography id="modal-modal-title" variant="h6" component="h2">
              {accumulation?.accumulationName}
            </Typography>
          </Box>

          <FormProvider {...methods}>
            <form onSubmit={methods.handleSubmit(onSubmit)}>
              <Box display={'flex'} flexDirection={'column'} gap={2} marginTop={5}>
                {/* tài khoản nhận */}
                {Number(accumulation?.balance) > 0 &&
                <>
                  <Box>
                    <Box display={'flex'}>
                      <Typography sx={{ width: '100px' }}>Số dư</Typography>
                      <NumericFormat
                        displayType="text"
                        thousandSeparator="."
                        decimalSeparator=","
                        allowNegative={true}
                        suffix=" ₫"
                        value={accumulation?.balance}
                        style={{ fontWeight: 'bold', color: '#27ae60', maxWidth: '100%' }}
                      />
                    </Box>
                  </Box>
                  <Box>
                    <Box display={{ xs: 'block', sm: 'flex' }} alignItems={'center'}>
                      <Typography sx={{ width: '100px', flexShrink: 0 }}>Nơi nhận</Typography>
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
                  <Typography variant='body2' sx={{ opacity: 0.7 }}>Số dư sẽ cần được chuyển về tài khoản để kết thúc khoản tích lũy</Typography>
                </>
                }
                {Number(accumulation?.balance) <= 0 &&
                  <Box>
                    Bạn chắc chắn muốn kết thúc tích lũy:&nbsp; <strong>{accumulation?.accumulationName}</strong>
                  </Box>
                }

                {/* submit */}
                <Box display={'flex'} justifyContent={'center'} marginTop={5} gap={3}>
                  <Button
                    variant='outlined'
                    onClick={() => {
                      onClose()
                      resetForm()
                    }}
                  >Hủy</Button>
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

export default FinishAccumulationPopup
