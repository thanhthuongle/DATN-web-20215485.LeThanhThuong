import * as React from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Modal from '@mui/material/Modal'
import { Controller, FormProvider, useForm } from 'react-hook-form'
import { FIELD_REQUIRED_MESSAGE } from '~/utils/validators'
import { NumericFormat } from 'react-number-format'
import { Avatar, Button, FormControl, MenuItem, Select, TextField } from '@mui/material'
import FieldErrorAlert from '~/component/Form/FieldErrorAlert'
import FinanceItem1 from '~/component/FinanceItemDisplay/FinanceItem1'
import { createIndividualTransactionAPI, getIndividualAccountAPI, getIndividualCategoryAPI } from '~/apis'
import ImageUploader from '~/pages/NewTransaction/ImageUploader'
import { DateTimePicker } from '@mui/x-date-pickers'
import moment from 'moment'
import { MONEY_SOURCE_TYPE, TRANSACTION_TYPES } from '~/utils/constants'
import { createSearchParams } from 'react-router-dom'
import { toast } from 'react-toastify'

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

function DepositAccumulationPopup({ isOpen, onClose, accumulation, afterCreateNew }) {
  const [wallets, setWallets] = React.useState([])
  const [transferCategory, setTransferCategory] = React.useState(null)

  const methods = useForm()
  const { setValue, control, reset, formState: { errors } } = methods
  const resetForm = () => {
    reset({
      amount: '',
      transactionTime: moment(),
      moneyFromId: wallets[0]?._id || '',
      images: []
    })
  }

  const onSubmit = (data) => {
    // console.log('🚀 ~ onSubmit ~ data:', data)

    const hasFiles = Array.isArray(data.images) && data.images.some(img => img.file instanceof File)
    if (hasFiles) {
      const formData = new FormData()

      formData.append('type', TRANSACTION_TYPES.TRANSFER)
      formData.append('amount', data.amount)
      formData.append('name', transferCategory?.name)
      formData.append('description', `Gửi tiền vào tích lũy: ${accumulation?.accumulationName}`)
      formData.append('categoryId', transferCategory?._id)
      formData.append('transactionTime', data.transactionTime.toISOString())
      formData.append('detailInfo', JSON.stringify({
        moneyFromType: MONEY_SOURCE_TYPE.ACCOUNT,
        moneyFromId: data.moneyFromId,
        moneyTargetType: MONEY_SOURCE_TYPE.ACCUMULATION,
        moneyTargetId: accumulation?._id
      }))

      data.images.forEach((imgObj, idx) => {
        formData.append('images', imgObj.file)
      })

      toast.promise(
        createIndividualTransactionAPI(formData),
        { pending: 'Đang gửi tiền vào tích lũy...' }
      ).then(async res => {
        if (!res.error) {
          toast.success('Gửi tiền vào tích lũy thành công!')
          onClose()
          resetForm()
          afterCreateNew()
        }
      })
    } else {
      const payload = {
        type: TRANSACTION_TYPES.TRANSFER,
        amount: data.amount,
        description: `Gửi tiền vào tích lũy: ${accumulation?.accumulationName}`,
        name: transferCategory?.name,
        categoryId: transferCategory?._id,
        transactionTime: data.transactionTime,
        detailInfo: {
          moneyFromType: MONEY_SOURCE_TYPE.ACCOUNT,
          moneyFromId: data.moneyFromId,
          moneyTargetType: MONEY_SOURCE_TYPE.ACCUMULATION,
          moneyTargetId: accumulation?._id
        }
      }
      // console.log('🚀 ~ onSubmit ~ payload:', payload)
      toast.promise(
        createIndividualTransactionAPI(payload),
        { pending: 'Đang gửi tiền vào tích lũy...' }
      ).then(async res => {
        if (!res.error) {
          toast.success('Gửi tiền vào tích lũy thành công!')
          onClose()
          resetForm()
          afterCreateNew()
        }
      })
    }
  }

  React.useEffect(() => {
    getIndividualAccountAPI().then((res) => {
      setWallets(res)
      if (res?.[0]?._id) {
        setValue('moneyFromId', res[0]._id)
      }
    })
    const searchPath = `?${createSearchParams({ 'q[type]': TRANSACTION_TYPES.TRANSFER })}`
    getIndividualCategoryAPI(searchPath).then(res => {
      setTransferCategory(res?.[0])
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
          <Box>
            <Typography>Gửi tiền vào</Typography>
            <Typography id="modal-modal-title" variant="h6" component="h2">
              {accumulation?.accumulationName}
            </Typography>
          </Box>

          <FormProvider {...methods}>
            <form onSubmit={methods.handleSubmit(onSubmit)}>
              <Box display={'flex'} flexDirection={'column'} gap={2} marginTop={3}>
                {/* Số tiền */}
                <Box>
                  <Box display={'flex'} alignItems={'center'}>
                    <Typography sx={{ width: '100px', flexShrink: 0 }}>Số tiền</Typography>
                    <Controller
                      control={control}
                      name='amount'
                      rules={{ required: FIELD_REQUIRED_MESSAGE }}
                      render={({ field: { onChange, value } }) => (
                        <NumericFormat
                          fullWidth
                          customInput={TextField}
                          placeholder='Nhập số tiền'
                          thousandSeparator="."
                          decimalSeparator=","
                          allowNegative={false}
                          decimalScale={0}
                          allowLeadingZeros={false}
                          suffix="&nbsp;₫"
                          onValueChange={(v) => { onChange(v.value) }}
                          value={value}
                          error={!!errors['amount']}
                        />
                      )}
                    />
                  </Box>
                  <Box marginLeft={'100px'}>
                    <FieldErrorAlert errors={errors} fieldName={'amount'}/>
                  </Box>
                </Box>

                {/* tài khoản nguồn */}
                <Box>
                  <Box display={'flex'} alignItems={'center'}>
                    <Typography sx={{ width: '100px', flexShrink: 0 }}>Nguồn tiền</Typography>
                    <Box sx={{ width: '100%' }}>
                      <Controller
                        control={control}
                        rules={{ required: FIELD_REQUIRED_MESSAGE }}
                        name="moneyFromId"
                        render={({ field: { onChange, onBlur, value } }) => (
                          <FormControl fullWidth>
                            <Select
                              labelId="wallet-select-label"
                              id="wallet-select"
                              value={value || ''}
                              onChange={onChange}
                              onBlur={onBlur}
                              error={!!errors['moneyFromId']}
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
                    <FieldErrorAlert errors={errors} fieldName={'moneyFromId'}/>
                  </Box>
                </Box>

                {/* Thời gian */}
                <Box>
                  <Box display={'flex'} alignItems={'center'}>
                    <Typography sx={{ width: '100px', flexShrink: 0 }}>Thời gian</Typography>
                    <Controller
                      control={control}
                      name='transactionTime'
                      rules={{ required: FIELD_REQUIRED_MESSAGE }}
                      defaultValue={moment()}
                      render={({ field: { onChange, onBlur, value } }) => (
                        <DateTimePicker
                          ampm={false}
                          timeSteps={{ hours: 1, minutes: 1 }}
                          value={value || moment()}
                          onChange={onChange}
                          onBlur={onBlur}
                          error={!!errors['transactionTime']}
                          disableFuture={true}
                        />
                      )}
                    />
                  </Box>
                  <Box marginLeft={'100px'}>
                    <FieldErrorAlert errors={errors} fieldName={'transactionTime'}/>
                  </Box>
                </Box>

                {/* Hình ảnh */}
                <Box display={'flex'}>
                  <Typography sx={{ width: '100px', flexShrink: 0 }}>Hình ảnh</Typography>
                  <Controller
                    control={control}
                    name="images"
                    defaultValue={[]}
                    render={({ field: { onChange, value } }) => (
                      <ImageUploader
                        value={value}
                        onChange={onChange}
                      />
                    )}
                  />
                </Box>

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

export default DepositAccumulationPopup
