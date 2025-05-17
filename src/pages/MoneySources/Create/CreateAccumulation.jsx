import * as React from 'react'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import Modal from '@mui/material/Modal'
import LibraryAddIcon from '@mui/icons-material/LibraryAdd'
import { Controller, useForm } from 'react-hook-form'
import CancelIcon from '@mui/icons-material/Cancel'
import TextField from '@mui/material/TextField'
import InputAdornment from '@mui/material/InputAdornment'
import AbcIcon from '@mui/icons-material/Abc'
import FieldErrorAlert from '~/component/Form/FieldErrorAlert'
import { FIELD_REQUIRED_MESSAGE } from '~/utils/validators'
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined'
import { NumericFormat } from 'react-number-format'
import AttachMoneyIcon from '@mui/icons-material/AttachMoney'
import { toast } from 'react-toastify'
import { createIndividualAccumulationAPI } from '~/apis'
import { DatePicker } from '@mui/x-date-pickers'
import moment from 'moment'

function CreateAccumulation({ afterCreateAccumulation }) {
  const { register, control, handleSubmit, reset, watch, formState: { errors } } = useForm()
  const startDate = watch('startDate')
  const endDate = watch('endDate')
  const [open, setOpen] = React.useState(false)

  const handleOpen = () => setOpen(true)
  const handleClose = () => {
    setOpen(false)
    reset()
  }
  const submitCreateAccumulation = (data) => {
    // console.log('🚀 ~ submitCreateAccumulation ~ data:', data)
    const { accumulationName, targetBalance, startDate, endDate } = data
    const newAccumulation= {
      accumulationName,
      targetBalance,
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString()
    }
    if (data.description) newAccumulation.description = data.description

    toast.promise(
      createIndividualAccumulationAPI(newAccumulation),
      { pending: 'Đang tạo khoản tích lũy...' }
    ).then((res) => {
      if (!res.error) {
        toast.success('Tạo khoản tích lũy thành công!')
        handleClose()
        afterCreateAccumulation()
      }
    })
  }

  return (
    <>
      <Box>
        <Button
          onClick={handleOpen}
          variant="outlined"
          startIcon={<LibraryAddIcon />}
          sx={{ paddingY: '12px' }}
        >
          Thêm tích lũy
        </Button>
      </Box>
      <Modal
        open={open}
        // onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 600,
          bgcolor: 'white',
          boxShadow: 24,
          borderRadius: '8px',
          border: 'none',
          outline: 0,
          padding: '20px 30px',
          backgroundColor: (theme) => theme.palette.mode === 'dark' ? '#1A2027' : 'white'
        }}>
          <Box sx={{
            position: 'absolute',
            top: '10px',
            right: '10px',
            cursor: 'pointer'
          }}>
            <CancelIcon
              color="error"
              sx={{ '&:hover': { color: 'error.light' } }}
              onClick={handleClose} />
          </Box>
          <Box id="modal-modal-title" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <LibraryAddIcon />
            <Typography variant="h6" component="h2">Tạo khoản tích lũy mới</Typography>
          </Box>

          <Box id="modal-modal-description" sx={{ my: 2 }}>
            <form onSubmit={handleSubmit(submitCreateAccumulation)}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                {/* Tên tích lũy */}
                <Box>
                  <TextField
                    fullWidth
                    label="Tên tích lũy"
                    type="text"
                    variant="outlined"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <AbcIcon fontSize="small" />
                        </InputAdornment>
                      )
                    }}
                    {...register('accumulationName', {
                      required: FIELD_REQUIRED_MESSAGE,
                      minLength: { value: 3, message: 'Min Length is 3 characters' },
                      maxLength: { value: 256, message: 'Max Length is 256 characters' }
                    })}
                    error={!!errors['accumulationName']}
                  />
                  <FieldErrorAlert errors={errors} fieldName={'accumulationName'} />
                </Box>

                {/* Số tiền */}
                <Box>
                  <Box display={'flex'} alignItems={'center'}>
                    <Controller
                      control={control}
                      name="targetBalance"
                      rules={{ required: FIELD_REQUIRED_MESSAGE }}
                      render={({ field: { onChange, value } }) => (
                        <NumericFormat
                          fullWidth
                          customInput={TextField}
                          placeholder='Nhập số tiền'
                          label="Số tiền"
                          thousandSeparator="."
                          decimalSeparator=","
                          allowNegative={false}
                          decimalScale={0}
                          allowLeadingZeros={false}
                          suffix="&nbsp;₫"
                          InputProps={{
                            style: { color: '#27ae60' },
                            startAdornment: (
                              <InputAdornment position="start">
                                <AttachMoneyIcon fontSize="small" />
                              </InputAdornment>
                            )
                          }}
                          onValueChange={(v) => { onChange(v.value) }}
                          value={value}
                          error={!!errors['targetBalance']}
                        />
                      )}
                    />
                  </Box>
                  <Box>
                    <FieldErrorAlert errors={errors} fieldName={'targetBalance'}/>
                  </Box>
                </Box>

                {/* Ngày bắt đầu */}
                <Box>
                  <Controller
                    control={control}
                    name="startDate"
                    rules={{
                      required: FIELD_REQUIRED_MESSAGE
                    }}
                    defaultValue={moment().startOf('day')}
                    render={({ field: { onChange, value } }) => (
                      <DatePicker
                        disableFuture={true}
                        format="DD/MM/YYYY"
                        label="Ngày bắt đầu"
                        maxDate={endDate}
                        value={value}
                        error={!!errors['startDate']}
                        sx={{ width: '100%' }}
                        onChange={(newValue) => {
                          const startDate = moment(newValue).startOf('day')
                          onChange(startDate)
                        }}
                      />
                    )}
                  />
                  <FieldErrorAlert errors={errors} fieldName={'startDate'} />
                </Box>

                {/* Ngày kết thúc */}
                <Box>
                  <Controller
                    control={control}
                    name="endDate"
                    rules={{
                      required: FIELD_REQUIRED_MESSAGE,
                      validate: (endDate) => {
                        if (!endDate || !startDate) return true
                        return moment(endDate).isSameOrAfter(moment(startDate))
                          || 'Ngày kết thúc không thể trước ngày bắt đầu'
                      }
                    }}
                    defaultValue={null}
                    render={({ field: { onChange, value } }) => (
                      <DatePicker
                        format="DD/MM/YYYY"
                        label="Ngày kết thúc"
                        minDate={startDate}
                        value={value}
                        error={!!errors['endDate']}
                        sx={{ width: '100%' }}
                        onChange={(newValue) => {
                          const endDate = moment(newValue).endOf('day')
                          onChange(endDate)
                        }}
                      />
                    )}
                  />
                  <FieldErrorAlert errors={errors} fieldName={'endDate'} />
                </Box>

                {/* Mô tả */}
                <Box>
                  <TextField
                    fullWidth
                    label="Mô tả"
                    type="text"
                    variant="outlined"
                    multiline
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <DescriptionOutlinedIcon fontSize="small" />
                        </InputAdornment>
                      )
                    }}
                    {...register('description', {})}
                    error={!!errors['description']}
                  />
                  <FieldErrorAlert errors={errors} fieldName={'description'} />
                </Box>

                {/* button */}
                <Box sx={{ alignSelf: 'flex-end' }}>
                  <Button
                    variant='outlined'
                    onClick={handleClose}
                    sx={{ marginRight: 2 }}
                  >Cancel</Button>
                  <Button
                    className="interceptor-loading"
                    type="submit"
                    variant="contained"
                    color="primary"
                  >
                    Create
                  </Button>
                </Box>
              </Box>
            </form>
          </Box>
        </Box>
      </Modal>
    </>
  )
}

export default CreateAccumulation
