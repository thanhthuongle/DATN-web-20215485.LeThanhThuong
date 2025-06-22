import { Box, Button, Modal, TextField, Typography } from '@mui/material'
import { DateTimePicker } from '@mui/x-date-pickers'
import moment from 'moment'
import React from 'react'
import { Controller, FormProvider, useForm } from 'react-hook-form'
import { NumericFormat } from 'react-number-format'
import { toast } from 'react-toastify'
import { createIndividualTransactionAPI } from '~/apis'
import FieldErrorAlert from '~/component/Form/FieldErrorAlert'
import CategorySelector from '~/pages/NewTransaction/CategorySelector'
import ImageUploader from '~/pages/NewTransaction/ImageUploader'
import { MONEY_SOURCE_TYPE, TRANSACTION_TYPES } from '~/utils/constants'
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

function UseAccumulationPopup({ isOpen, onClose, accumulation, afterCreateNew }) {
  const methods = useForm()
  const { control, reset, formState: { errors } } = methods
  const resetForm = () => {
    reset({
      amount: '',
      category: null,
      transactionTime: moment(),
      images: []
    })
  }

  const onSubmit = (data) => {
    // console.log('🚀 ~ onSubmit ~ data:', data)

    const hasFiles = Array.isArray(data.images) && data.images.some(img => img.file instanceof File)
    if (hasFiles) {
      const formData = new FormData()

      formData.append('type', TRANSACTION_TYPES.EXPENSE)
      formData.append('amount', data.amount)
      formData.append('name', data.category.name)
      formData.append('description', `Sử dụng tích lũy: ${accumulation?.accumulationName}`)
      formData.append('categoryId', data.category._id)
      formData.append('transactionTime', data.transactionTime.toISOString())
      formData.append('detailInfo', JSON.stringify({
        moneyFromType: MONEY_SOURCE_TYPE.ACCUMULATION,
        moneyFromId: accumulation?._id
      }))

      data.images.forEach((imgObj) => {
        formData.append('images', imgObj.file)
      })

      toast.promise(
        createIndividualTransactionAPI(formData),
        { pending: 'Đang sử dụng tích lũy...' }
      ).then(async res => {
        if (!res.error) {
          toast.success('Sử dụng tích lũy thành công!')
          onClose()
          resetForm()
          afterCreateNew()
        }
      })
    } else {
      const payload = {
        type: TRANSACTION_TYPES.EXPENSE,
        amount: data.amount,
        description: `Sử dụng tích lũy: ${accumulation?.accumulationName}`,
        name: data.category.name,
        categoryId: data.category._id,
        transactionTime: data.transactionTime,
        detailInfo: {
          moneyFromType: MONEY_SOURCE_TYPE.ACCUMULATION,
          moneyFromId: accumulation?._id
        }
      }
      toast.promise(
        createIndividualTransactionAPI(payload),
        { pending: 'Đang sử dụng tích lũy...' }
      ).then(async res => {
        if (!res.error) {
          toast.success('Sử dụng tích lũy thành công!')
          onClose()
          resetForm()
          afterCreateNew()
        }
      })
    }
  }
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
          <Box>
            <Typography>Sử dụng</Typography>
            <Typography id="modal-modal-title" variant="h6" component="h2">
              {accumulation?.accumulationName}
            </Typography>
          </Box>

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
                          InputProps={{ style: { color: '#e74c3c' } }}
                          onValueChange={(v) => { onChange(v.value) }}
                          value={value}
                          error={!!errors['amount']}
                        />)}
                    />
                  </Box>
                  <Box marginLeft={{ sm: '100px' }}>
                    <FieldErrorAlert errors={errors} fieldName={'amount'}/>
                  </Box>
                </Box>

                {/* Hạng mục */}
                <Box>
                  <Box display={{ xs: 'block', sm: 'flex' }} alignItems={'center'}>
                    <Typography sx={{ width: '100px', flexShrink: 0 }}>Hạng mục</Typography>
                    <Controller
                      control={control}
                      name='category'
                      rules={{ required: FIELD_REQUIRED_MESSAGE }}
                      render={({ field: { onChange, value } }) => (
                        <CategorySelector
                          transactionType={TRANSACTION_TYPES.EXPENSE}
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

                {/* Thời gian */}
                <Box>
                  <Box display={{ xs: 'block', sm: 'flex' }} alignItems={'center'}>
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
                  <Box marginLeft={{ sm: '100px' }}>
                    <FieldErrorAlert errors={errors} fieldName={'transactionTime'}/>
                  </Box>
                </Box>

                {/* Hình ảnh */}
                <Box display={{ xs: 'block', sm: 'flex' }}>
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

export default UseAccumulationPopup