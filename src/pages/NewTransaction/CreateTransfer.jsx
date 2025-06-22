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
import { toast } from 'react-toastify'
import { Controller, FormProvider, useForm } from 'react-hook-form'
import { createIndividualTransactionAPI, getIndividualAccountAPI } from '~/apis'
import { FIELD_REQUIRED_MESSAGE } from '~/utils/validators'
import FieldErrorAlert from '~/component/Form/FieldErrorAlert'
import { MONEY_SOURCE_TYPE, TRANSACTION_TYPES } from '~/utils/constants'
import CategorySelector from './CategorySelector'
import { useSearchParams } from 'react-router-dom'

function CreateTransfer() {
  let [searchParams] = useSearchParams()

  const [wallets, setWallets] = useState([])

  const methods = useForm()
  const { register, setValue, control, reset, watch, formState: { errors } } = methods
  const moneyFromId = watch('moneyFromId')
  const resetForm = () => {
    reset({
      amount: '',
      description: '',
      category: null,
      transactionTime: moment(),
      moneyFromId: wallets[0]?._id || '',
      moneyTargetId: null,
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
      formData.append('name', data.category.name)
      if (data.description) formData.append('description', data.description)
      formData.append('categoryId', data.category._id)
      formData.append('transactionTime', data.transactionTime.toISOString())
      formData.append('detailInfo', JSON.stringify({
        moneyFromType: MONEY_SOURCE_TYPE.ACCOUNT,
        moneyFromId: data.moneyFromId,
        moneyTargetType: MONEY_SOURCE_TYPE.ACCOUNT,
        moneyTargetId: data.moneyTargetId
      }))

      data.images.forEach((imgObj) => {
        formData.append('images', imgObj.file)
      })

      toast.promise(
        createIndividualTransactionAPI(formData),
        { pending: 'Đang tạo giao dịch...' }
      ).then(async res => {
        if (!res.error) {
          toast.success('Tạo giao dịch chuyển khoản thành công!')
          await refreshWallets()
          resetForm()
        }
      })
    } else {
      const payload = {
        type: TRANSACTION_TYPES.TRANSFER,
        amount: data.amount,
        name: data.category.name,
        categoryId: data.category._id,
        transactionTime: data.transactionTime,
        detailInfo: {
          moneyFromType: MONEY_SOURCE_TYPE.ACCOUNT,
          moneyFromId: data.moneyFromId,
          moneyTargetType: MONEY_SOURCE_TYPE.ACCOUNT,
          moneyTargetId: data.moneyTargetId
        }
      }
      if (data.description) payload.description = data.description
      toast.promise(
        createIndividualTransactionAPI(payload),
        { pending: 'Đang tạo giao dịch...' }
      ).then(async res => {
        if (!res.error) {
          toast.success('Tạo giao dịch chuyển khoản thành công!')
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
    const { moneyFromId } = Object.fromEntries([...searchParams])
    getIndividualAccountAPI().then((res) => {
      setWallets(res)
      if ( moneyFromId ) {
        setValue('moneyFromId', moneyFromId)
      } else if (res?.[0]?._id) {
        setValue('moneyFromId', res[0]._id)
      }
    })
  }, [searchParams, setValue])

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)}>
        <Box display={'flex'} flexDirection={'column'} gap={2} marginTop={2}>
          {/* Số tiền */}
          <Box>
            <Box display={{ xs: 'block', sm: 'flex' }} alignItems={'center'}>
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
            <Box marginLeft={{ sm: '100px' }}>
              <FieldErrorAlert errors={errors} fieldName={'amount'}/>
            </Box>
          </Box>

          {/* Mô tả */}
          <Box display={{ xs: 'block', sm: 'flex' }}>
            <Typography sx={{ width: '100px', flexShrink: 0 }}>Mô tả</Typography>
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
              <Typography sx={{ width: '100px', flexShrink: 0 }}>Hạng mục</Typography>
              <Controller
                render={({ field: { onChange, value } }) => (
                  <CategorySelector
                    transactionType={TRANSACTION_TYPES.TRANSFER}
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
            <Box marginLeft={{ sm: '100px' }}>
              <FieldErrorAlert errors={errors} fieldName={'category'}/>
            </Box>
          </Box>

          {/* tài khoản nguồn */}
          <Box>
            <Box display={{ xs: 'block', sm: 'flex' }} alignItems={'center'}>
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
                                src={selectedWallet?.bankInfo?.logo ? selectedWallet?.bankInfo?.logo : selectedWallet?.icon}
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
              <FieldErrorAlert errors={errors} fieldName={'moneyFromId'}/>
            </Box>
          </Box>

          {/* Tài khoản đích */}
          <Box>
            <Box display={{ xs: 'block', sm: 'flex' }} alignItems={'center'}>
              <Typography sx={{ width: '100px', flexShrink: 0 }}>Nơi nhận</Typography>
              <Box sx={{ width: '100%' }}>
                <Controller
                  control={control}
                  rules={{
                    required: FIELD_REQUIRED_MESSAGE,
                    validate: (value) => {
                      if (!value || !moneyFromId) return true
                      return (value != moneyFromId)
                        ? true
                        : 'Không thể chuyển tiền trong cùng một tài khoản'
                    }
                  }}
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

          {/* Thời gian */}
          <Box>
            <Box display={{ xs: 'block', sm: 'flex' }} alignItems={'center'}>
              <Typography sx={{ width: '100px', flexShrink: 0 }}>Thời gian</Typography>
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
          <Box display={'flex'} justifyContent={'center'} marginTop={5} marginBottom={3}>
            <Button variant='contained' type="submit" className='interceptor-loading'>Tạo giao dịch</Button>
          </Box>
        </Box>
      </form>
    </FormProvider>
  )
}

export default CreateTransfer