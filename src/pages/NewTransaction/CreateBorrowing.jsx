import React, { useEffect, useState } from 'react'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import { NumericFormat } from 'react-number-format'
import TextField from '@mui/material/TextField'
import moment from 'moment'
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker'
import FinanceItem1 from '~/component/FinanceItemDisplay/FinanceItem1'
import ImageUploader from './ImageUploader'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import Select from '@mui/material/Select'
import ContactSelector from './ContactSelector'
import { Controller, FormProvider, useForm } from 'react-hook-form'
import { createIndividualTransactionAPI, getIndividualAccountAPI } from '~/apis'
import { FIELD_REQUIRED_MESSAGE } from '~/utils/validators'
import FieldErrorAlert from '~/component/Form/FieldErrorAlert'
import CategorySelector from './CategorySelector'
import { MONEY_SOURCE_TYPE, TRANSACTION_TYPES } from '~/utils/constants'
import { toast } from 'react-toastify'
import { CircularProgress } from '@mui/material'

function CreateBorrowing() {
  const [wallets, setWallets] = useState([])

  const methods = useForm()
  const { register, setValue, control, reset, watch, formState: { errors, isSubmitting } } = methods
  const transactionTime = watch('transactionTime')
  const repaymentTime = watch('repaymentTime')
  const resetForm = () => {
    reset({
      amount: '',
      rate: '',
      description: '',
      category: '',
      transactionTime: moment(),
      repaymentTime: null,
      moneyTargetId: wallets?.[0]?._id || '',
      lender: '',
      images: []
    }, {
      keepErrors: false, // Xóa lỗi hiện tại
      keepDirty: false, // Đánh dấu form là "sạch" (chưa chỉnh sửa)
      keepTouched: false // Đánh dấu các trường chưa được "chạm vào"
    })
  }

  const onSubmit = async (data) => {
    // console.log('🚀 ~ onSubmit create income ~ data:', data)

    const hasFiles = Array.isArray(data.images) && data.images.some(img => img?.file instanceof File)
    if (hasFiles) {
      const formData = new FormData()

      formData.append('type', TRANSACTION_TYPES.BORROWING)
      formData.append('amount', data.amount)
      formData.append('name', data.category.name)
      if (!data?.description) data.description = `Vay tiền ${data?.lender?.name}`
      formData.append('description', data.description)
      formData.append('categoryId', data.category._id)
      formData.append('transactionTime', data.transactionTime.toISOString())
      const detailInfo = {
        moneyTargetType: MONEY_SOURCE_TYPE.ACCOUNT,
        moneyTargetId: data.moneyTargetId,
        lenderId: data.lender._id,
        rate: Number(data.rate)
      }
      if (data.repaymentTime) detailInfo.repaymentTime = data.repaymentTime.toISOString()
      formData.append('detailInfo', JSON.stringify(detailInfo ))

      data.images.forEach((imgObj) => {
        formData.append('images', imgObj.file)
      })

      const promiseCreateAPI = createIndividualTransactionAPI(formData)

      const res = await toast.promise(
        promiseCreateAPI,
        { pending: 'Đang tạo giao dịch...' }
      )
      if (!res.error) {
        toast.success('Tạo giao dịch đi vay thành công!')
        resetForm()
        await refreshWallets()
      }
    } else {
      if (!data?.description) data.description = `Vay tiền ${data?.lender?.name}`
      const payload = {
        type: TRANSACTION_TYPES.BORROWING,
        amount: data.amount,
        name: data.category.name,
        description: data.description,
        categoryId: data.category._id,
        transactionTime: data.transactionTime,
        detailInfo: {
          moneyTargetType: MONEY_SOURCE_TYPE.ACCOUNT,
          moneyTargetId: data.moneyTargetId,
          lenderId: data.lender._id,
          rate: Number(data.rate)
        }
      }
      if (data.repaymentTime) payload.detailInfo.repaymentTime = data.repaymentTime.toISOString()

      const promiseCreateAPI = createIndividualTransactionAPI(payload)
      const res = await toast.promise(
        promiseCreateAPI,
        { pending: 'Đang tạo giao dịch...' }
      )

      if (!res.error) {
        toast.success('Tạo giao dịch đi vay thành công!')
        resetForm()
        await refreshWallets()
      }
    }
  }

  const refreshWallets = async () => {
    const res = await getIndividualAccountAPI()
    setWallets(res)
    if (res?.[0]?._id) {
      setValue('moneyTargetId', res[0]._id)
    }
  }

  useEffect(() => {
    getIndividualAccountAPI().then((res) => {
      setWallets(res)
      if (res?.[0]?._id) {
        setValue('moneyTargetId', res[0]._id)
      }
    })
  }, [])

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)}>
        <Box display={'flex'} flexDirection={'column'} gap={2} marginTop={2}>
          {/* Số tiền */}
          <Box>
            <Box display={{ xs: 'block', sm: 'flex' }} alignItems={'center'}>
              <Typography sx={{ width: '110px', flexShrink: 0 }}>Số tiền</Typography>
              <Controller
                control={control}
                name="amount"
                rules={{ required: FIELD_REQUIRED_MESSAGE }}
                render={({ field: { onChange, value, onBlur } }) => (
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
                    InputProps={{ style: { color: '#27ae60' } }}
                    onValueChange={(v) => { onChange(v.value == '' ? null : v.value) }}
                    onBlur={onBlur}
                    value={value}
                    error={!!errors['amount']}
                  />
                )}
              />
            </Box>
            <Box marginLeft={{ sm: '100px' }}>
              <FieldErrorAlert errors={errors} fieldName={'amount'}/>
            </Box>
          </Box>

          {/* Lãi suất */}
          <Box>
            <Box display={{ xs: 'block', sm: 'flex' }} alignItems={'center'}>
              <Typography sx={{ width: '110px', flexShrink: 0 }}>Lãi suất</Typography>
              <Controller
                control={control}
                name='rate'
                rules={{
                  required: FIELD_REQUIRED_MESSAGE,
                  validate: (value) => {
                    if (value <= 20 && value >= 0) return
                    else return 'Lãi suất không được vượt quá 20% theo quy định nhà nước!'
                  }
                }}
                render={({ field: { onChange, value, onBlur } }) => (
                  <NumericFormat
                    fullWidth
                    customInput={TextField}
                    placeholder='Nhập lãi suất (/năm)'
                    thousandSeparator="."
                    decimalSeparator=","
                    allowNegative={false}
                    allowLeadingZeros={false}
                    suffix="&nbsp;%/năm"
                    onValueChange={(v) => { onChange(v.value) }}
                    onBlur={onBlur}
                    value={value}
                    error={!!errors['rate']}
                  />
                )}
              />
            </Box>
            <Box marginLeft={{ sm: '100px' }}>
              <FieldErrorAlert errors={errors} fieldName={'rate'}/>
            </Box>
          </Box>

          {/* Mô tả */}
          <Box display={{ xs: 'block', sm: 'flex' }}>
            <Typography sx={{ width: '110px', flexShrink: 0 }}>Mô tả</Typography>
            <TextField
              // label="Mô tả"
              placeholder="Nhập mô tả"
              multiline
              minRows={3}
              variant="outlined"
              fullWidth
              {...register('description')}
            />
          </Box>

          {/* Hạng mục */}
          <Box>
            <Box display={{ xs: 'block', sm: 'flex' }} alignItems={'center'}>
              <Typography sx={{ width: '110px', flexShrink: 0 }}>Hạng mục</Typography>
              <Controller
                control={control}
                name="category"
                rules={{ required: FIELD_REQUIRED_MESSAGE }}
                render={({ field: { onChange, value } }) => (
                  <CategorySelector
                    transactionType={TRANSACTION_TYPES.BORROWING}
                    onChange={onChange}
                    value={value}
                    error={!!errors['category']}
                  />
                )}
              />
            </Box>
            <Box marginLeft={{ sm: '100px' }}>
              <FieldErrorAlert errors={errors} fieldName={'category'}/>
            </Box>
          </Box>

          {/* Người cho vay */}
          <Box>
            <Box display={{ xs: 'block', sm: 'flex' }} alignItems={'center'}>
              <Typography sx={{ width: '110px', flexShrink: 0 }}>Người cho vay</Typography>
              <Controller
                control={control}
                name='lender'
                rules={{ required: FIELD_REQUIRED_MESSAGE }}
                render={({ field: { onChange, value } }) => (
                  <ContactSelector
                    onChange={onChange}
                    value={value}
                    error={!!errors['lender']}
                  />
                )}
              />
            </Box>
            <Box marginLeft={{ sm: '100px' }}>
              <FieldErrorAlert errors={errors} fieldName={'lender'}/>
            </Box>
          </Box>

          {/* Thời gian */}
          <Box>
            <Box display={{ xs: 'block', sm: 'flex' }} alignItems={'center'}>
              <Typography sx={{ width: '110px', flexShrink: 0 }}>Thời gian</Typography>
              <Controller
                control={control}
                name='transactionTime'
                rules={{
                  required: FIELD_REQUIRED_MESSAGE,
                  validate: (value) => {
                    if (moment(value).isAfter(moment())) {
                      return 'Không thể tạo giao dịch trong tương lai!'
                    }

                    return true
                  }
                }}
                defaultValue={moment()}
                render={({ field: { onChange, onBlur, value } }) => (
                  <DateTimePicker
                    ampm={false}
                    timeSteps={{ hours: 1, minutes: 1 }}
                    maxDateTime={repaymentTime}
                    value={value || moment()}
                    onChange={onChange}
                    onBlur={onBlur}
                    error={!!errors['transactionTime']}
                    disableFuture={true}
                  />
                )}
              />
            </Box>
            <Box marginLeft={{ sm: '100px' }}>
              <FieldErrorAlert errors={errors} fieldName={'transactionTime'}/>
            </Box>
          </Box>

          {/* Ngày trả nợ */}
          <Box>
            <Box display={{ xs: 'block', sm: 'flex' }} alignItems={'center'}>
              <Typography sx={{ width: '110px', flexShrink: 0 }}>Ngày trả nợ</Typography>
              <Controller
                control={control}
                name='repaymentTime'
                rules={{
                  validate: (value) => {
                    if (!value || !transactionTime) return true
                    return moment(value).isAfter(moment(transactionTime))
                      ? true
                      : 'Thời gian trả nợ phải sau thời gian cho vay'
                  }
                }}
                defaultValue={null}
                render={({ field: { onChange, onBlur, value } }) => (
                  <DateTimePicker
                    ampm={false}
                    timeSteps={{ hours: 1, minutes: 1 }}
                    minDateTime={transactionTime}
                    value={value}
                    onChange={onChange}
                    onBlur={onBlur}
                    error={!!errors['repaymentTime']}
                  />
                )}
              />
            </Box>
            <Box marginLeft={{ sm: '100px' }}>
              <FieldErrorAlert errors={errors} fieldName={'repaymentTime'}/>
            </Box>
          </Box>

          {/* Nơi nhận */}
          <Box>
            <Box display={{ xs: 'block', sm: 'flex' }} alignItems={'center'}>
              <Typography sx={{ width: '110px', flexShrink: 0 }}>Nơi nhận</Typography>
              <Box sx={{ width: '100%' }}>
                <Controller
                  control={control}
                  rules={{ required: FIELD_REQUIRED_MESSAGE }}
                  name="moneyTargetId"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <FormControl fullWidth>
                      <Select
                        displayEmpty
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
                      >
                        {wallets?.map((w) => (
                          <MenuItem value={w._id} key={w._id}>
                            <FinanceItem1
                              logo={w?.bankInfo?.logo ? w?.bankInfo?.logo : w?.icon}
                              title={w.accountName}
                              amount={w.balance}
                              sx={{ padding: 0 }}
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

          {/* Hình ảnh */}
          <Box display={'flex'}>
            <Typography sx={{ width: '110px', flexShrink: 0 }}>Hình ảnh</Typography>
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

          {/* submit create new expense */}
          <Box display={'flex'} justifyContent={'center'} marginTop={5} marginBottom={3}>
            <Button
              type="submit"
              variant="contained"
              disabled={isSubmitting}
              startIcon={isSubmitting && <CircularProgress size={20} />}
            >
              {isSubmitting ? 'Đang xử lý...' : 'Tạo giao dịch'}
            </Button>
          </Box>
        </Box>
      </form>
    </FormProvider>
  )
}

export default CreateBorrowing