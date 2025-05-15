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
import Avatar from '@mui/material/Avatar'
import RestaurantIcon from '@mui/icons-material/Restaurant'
import ContactSelector from './ContactSelector'
import { Controller, FormProvider, useForm } from 'react-hook-form'
import { createIndividualTransactionAPI, getIndividualAccountAPI } from '~/apis'
import { FIELD_REQUIRED_MESSAGE } from '~/utils/validators'
import FieldErrorAlert from '~/component/Form/FieldErrorAlert'
import CategorySelector from './CategorySelector'
import { MONEY_SOURCE_TYPE, TRANSACTION_TYPES } from '~/utils/constants'
import { toast } from 'react-toastify'

function CreateLend() {
  const [wallets, setWallets] = useState([])

  const methods = useForm()
  const { register, setValue, control, reset, watch, formState: { errors } } = methods
  const transactionTime = watch('transactionTime')
  const collectTime = watch('collectTime')
  const resetForm = () => {
    reset({
      amount: '',
      description: '',
      category: null,
      transactionTime: moment(),
      collectTime: null,
      moneyFromId: wallets[0]?._id || '',
      borrower: null,
      images: []
    })
  }

  const onSubmit = (data) => {
    // console.log('🚀 ~ onSubmit ~ data:', data)

    const hasFiles = Array.isArray(data.images) && data.images.some(img => img.file instanceof File)
    if (hasFiles) {
      const formData = new FormData()

      formData.append('type', TRANSACTION_TYPES.LOAN)
      formData.append('amount', data.amount)
      formData.append('name', data.category.name)
      if (!data.description) data.description = `Cho ${data.borrower.name} vay`
      formData.append('description', data.description)
      formData.append('categoryId', data.category._id)
      formData.append('transactionTime', data.transactionTime.toISOString())
      const detailInfo = {
        moneyFromType: MONEY_SOURCE_TYPE.ACCOUNT,
        moneyFromId: data.moneyFromId,
        borrowerId: data.borrower._id
      }
      if (data.collectTime) detailInfo.collectTime = data.collectTime.toISOString()
      formData.append('detailInfo', JSON.stringify(detailInfo ))

      data.images.forEach((imgObj, idx) => {
        formData.append('images', imgObj.file)
      })

      toast.promise(
        createIndividualTransactionAPI(formData),
        { pending: 'Đang tạo giao dịch...' }
      ).then(async res => {
        if (!res.error) {
          toast.success('Tạo giao dịch cho vay thành công!')
          await refreshWallets()
          resetForm()
        }
      })
    } else {
      if (!data.description) data.description = `Cho ${data.borrower.name} vay`
      const payload = {
        type: TRANSACTION_TYPES.LOAN,
        amount: data.amount,
        name: data.category.name,
        description: data.description,
        categoryId: data.category._id,
        transactionTime: data.transactionTime,
        detailInfo: {
          moneyFromType: MONEY_SOURCE_TYPE.ACCOUNT,
          moneyFromId: data.moneyFromId,
          borrowerId: data.borrower._id
        }
      }
      if (data.collectTime) payload.detailInfo.collectTime = data.collectTime.toISOString()
      toast.promise(
        createIndividualTransactionAPI(payload),
        { pending: 'Đang tạo giao dịch...' }
      ).then(async res => {
        if (!res.error) {
          toast.success('Tạo giao dịch cho vay thành công!')
          await refreshWallets()
          resetForm()
        }
      })
    }
  }

  const refreshWallets = async () => {
    const res = await getIndividualAccountAPI()
    setWallets(res)
    if (res?.[0]?._id) {
      setValue('moneyFromId', res[0]._id)
    }
  }

  useEffect(() => {
    getIndividualAccountAPI().then((res) => {
      setWallets(res)
      if (res?.[0]?._id) {
        setValue('moneyFromId', res[0]._id)
      }
    })
  }, [setValue])

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)}>
        <Box display={'flex'} flexDirection={'column'} gap={2} marginTop={2}>
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
                    InputProps={{ style: { color: '#e74c3c' } }}
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

          {/* Mô tả */}
          <Box>
            <Box display={'flex'}>
              <Typography sx={{ width: '100px', flexShrink: 0 }}>Mô tả</Typography>
              <TextField
                // label="Mô tả"
                placeholder="Nhập mô tả"
                multiline
                minRows={3}
                variant="outlined"
                fullWidth
                error={!!errors['description']}
                {...register('description')}
              />
            </Box>
            <Box marginLeft={'100px'}>
              <FieldErrorAlert errors={errors} fieldName={'description'}/>
            </Box>
          </Box>

          {/* Hạng mục */}
          <Box>
            <Box display={'flex'} alignItems={'center'}>
              <Typography sx={{ width: '100px', flexShrink: 0 }}>Hạng mục</Typography>
              <Controller
                render={({ field: { onChange, value } }) => (
                  <CategorySelector
                    transactionType={TRANSACTION_TYPES.LOAN}
                    onChange={onChange}
                    value={value}
                    error={!!errors['category']}
                  />
                )}
                {...register('category', {
                  required: FIELD_REQUIRED_MESSAGE
                })}
                control={control}
              />
            </Box>
            <Box marginLeft={'100px'}>
              <FieldErrorAlert errors={errors} fieldName={'category'}/>
            </Box>
          </Box>

          {/* Người vay */}
          <Box>
            <Box display={'flex'} alignItems={'center'}>
              <Typography sx={{ width: '100px', flexShrink: 0 }}>Người vay</Typography>
              <Controller
                control={control}
                name='borrower'
                rules={{ required: FIELD_REQUIRED_MESSAGE }}
                render={({ field: { onChange, value } }) => (
                  <ContactSelector
                    onChange={onChange}
                    value={value}
                    error={!!errors['borrower']}
                  />
                )}
              />
            </Box>
            <Box marginLeft={'100px'}>
              <FieldErrorAlert errors={errors} fieldName={'borrower'}/>
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
                    maxDateTime={collectTime}
                    value={value || moment()}
                    onChange={onChange}
                    onBlur={onBlur}
                    error={!!errors['transactionTime']}
                  />
                )}
              />
            </Box>
            <Box marginLeft={'100px'}>
              <FieldErrorAlert errors={errors} fieldName={'transactionTime'}/>
            </Box>
          </Box>

          {/* Ngày thu nợ */}
          <Box>
            <Box display={'flex'} alignItems={'center'}>
              <Typography sx={{ width: '100px', flexShrink: 0 }}>Ngày thu nợ</Typography>
              <Controller
                control={control}
                name='collectTime'
                rules={{
                  validate: (value) => {
                    if (!value || !transactionTime) return true
                    return moment(value).isAfter(moment(transactionTime))
                      ? true
                      : 'Thời gian thu nợ phải sau thời gian cho vay'
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
                    error={!!errors['collectTime']}
                    autoFocus
                  />
                )}
              />
            </Box>
            <Box marginLeft={'100px'}>
              <FieldErrorAlert errors={errors} fieldName={'collectTime'}/>
            </Box>
          </Box>

          {/* Nguồn tiền */}
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

          {/* submit create new expense */}
          <Box display={'flex'} justifyContent={'center'} marginTop={8}>
            <Button variant='contained' type="submit" className='interceptor-loading'>Tạo giao dịch</Button>
          </Box>
        </Box>
      </form>
    </FormProvider>
  )
}

export default CreateLend