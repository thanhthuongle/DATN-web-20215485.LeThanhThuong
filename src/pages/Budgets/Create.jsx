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
import FieldErrorAlert from '~/component/Form/FieldErrorAlert'
import { FIELD_REQUIRED_MESSAGE } from '~/utils/validators'
import { NumericFormat } from 'react-number-format'
import AttachMoneyIcon from '@mui/icons-material/AttachMoney'
import { Checkbox, Divider, FormControl, FormControlLabel, InputLabel, MenuItem, Select } from '@mui/material'
import { TRANSACTION_TYPES } from '~/utils/constants'
import { toast } from 'react-toastify'
import CategorySelector from '../NewTransaction/CategorySelector'
import moment from 'moment'
import { DatePicker } from '@mui/x-date-pickers'
import { createIndividualBudgetAPI } from '~/apis'

const timeOptions = {
  THIS_MONTH: 'Tháng này',
  THIS_QUARTER: 'Quý này',
  THIS_YEAR: 'Năm này',
  CUSTOM: 'Tùy chọn'
}

const getTimeRange = (option) => {
  switch (option) {
  case timeOptions.THIS_MONTH:
    return {
      startDate: moment().startOf('month'),
      endDate: moment().endOf('month')
    }

  case timeOptions.THIS_QUARTER:
    return {
      startDate: moment().startOf('quarter'),
      endDate: moment().endOf('quarter')
    }

  case timeOptions.THIS_YEAR:
    return {
      startDate: moment().startOf('year'),
      endDate: moment().endOf('year')
    }

  default:
    return {
      startDate: null,
      endDate: null
    }
  }
}

function Create({ afterCreateNew }) {
  const { register, control, handleSubmit, reset, formState: { errors } } = useForm({
    defaultValues: {
      repeat: false
    }
  })
  const [open, setOpen] = React.useState(false)
  const [time, setTime] = React.useState('')
  const [startDate, setStartDate] = React.useState(null)
  const [endDate, setEndDate] = React.useState(null)

  const handleOpen = () => setOpen(true)
  const handleClose = () => {
    setOpen(false)
    reset()
  }
  const handleChangeTime = async (event) => {
    const newTime = event.target.value
    setTime(newTime)
    if (newTime === timeOptions.CUSTOM) {
      setStartDate(null)
      setEndDate(null)
    } else {
      const timeRange = getTimeRange(newTime)
      setStartDate(timeRange.startDate)
      setEndDate(timeRange.endDate)
    }
  }

  const submitCreateNewAccount = (data) => {
    if (!startDate || !endDate) {
      toast.warn('Cần chọn cả hai mốc thời gian!')
      return
    }

    const { category, amount, repeat } = data
    const newBudget = {
      categoryId: category._id,
      amount,
      repeat
    }
    if (startDate) newBudget.startTime = startDate.toISOString()
    if (endDate) newBudget.endTime = endDate.toISOString()

    toast.promise(
      createIndividualBudgetAPI(newBudget),
      { pending: 'Đang tạo ngân sách mới...' }
    ).then((res) => {
      if (!res.error) {
        toast.success('Tạo ngân sách mới thành công!')
        handleClose()
        afterCreateNew()
      }
    })
  }

  React.useEffect(() => {
    setTime(timeOptions.THIS_MONTH)
    const timeRange = getTimeRange(timeOptions.THIS_MONTH)
    setStartDate(timeRange.startDate)
    setEndDate(timeRange.endDate)
  }, [])

  return (
    <>
      <Box>
        <Button
          onClick={handleOpen}
          variant="contained"
          startIcon={<LibraryAddIcon />}
          sx={{ paddingY: '12px' }}
        >
          Tạo ngân sách
        </Button>
      </Box>
      <Modal
        open={open}
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
            <Typography variant="h6" component="h2">Tạo ngân sách mới</Typography>
          </Box>

          <Box id="modal-modal-description" sx={{ my: 2 }}>
            <form onSubmit={handleSubmit(submitCreateNewAccount)}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                {/* Hạng mục */}
                <Box display={'flex'} justifyContent={'center'} alignItems={'center'} flexDirection={'column'} marginTop={2} >
                  <Box display={'flex'} alignItems={'center'} width={'100%'} >
                    <Controller
                      render={({ field: { onChange, value } }) => (
                        <CategorySelector
                          transactionType={TRANSACTION_TYPES.EXPENSE}
                          onChange={onChange}
                          value={value}
                          error={!!errors['category']}
                          sx={{ width: '100%', paddingY: 1.5 }}
                        />
                      )}
                      {...register('category', {
                        required: FIELD_REQUIRED_MESSAGE
                      })}
                      control={control}
                    />
                  </Box>
                  <Box width={'100%'}>
                    <FieldErrorAlert errors={errors} fieldName={'category'}/>
                  </Box>
                </Box>

                {/* Số tiền */}
                <Box>
                  <Box display={'flex'} alignItems={'center'}>
                    <Controller
                      control={control}
                      name="amount"
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
                          error={!!errors['amount']}
                        />
                      )}
                    />
                  </Box>
                  <Box>
                    <FieldErrorAlert errors={errors} fieldName={'amount'}/>
                  </Box>
                </Box>

                {/* Chọn thời gian */}
                <Box width={'100%'} display={'flex'} justifyContent={'center'} alignItems={'center'} gap={2} flexDirection={'column'}>
                  <Box width={'100%'}>
                    <FormControl fullWidth>
                      <InputLabel id="demo-simple-select-label">Thời gian</InputLabel>
                      <Select
                        labelId="time-select-label"
                        id="time-select"
                        value={time}
                        label="Thời gian"
                        onChange={handleChangeTime}
                      >
                        {Object.entries(timeOptions).map(([key, value]) => (
                          <MenuItem key={key} value={value}>{value}</MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Box>
                  {time == timeOptions.CUSTOM &&
                  <Box display={'flex'} justifyContent={'space-between'} width={'100%'}>
                    <DatePicker format="DD/MM/YYYY" label="Từ" maxDate={endDate} value={startDate} onChange={(newValue) => setStartDate(newValue)} />
                    <Divider orientation="vertical" variant="middle" flexItem />
                    <DatePicker format="DD/MM/YYYY" label="Đến" minDate={startDate} value={endDate} onChange={(newValue) => setEndDate(newValue)} />
                  </Box>
                  }
                </Box>

                {/* Repeat */}
                <Box>
                  <Controller
                    control={control}
                    name="repeat"
                    defaultValue={false}
                    render={({ field: { onChange, value } }) => (
                      <FormControlLabel
                        control={<Checkbox />}
                        onChange={(e) => onChange(e.target.checked)}
                        checked={!!value}
                        label="Lặp lại ở kỳ hạn tiếp theo"
                      />
                    )}
                  />
                  <Box>
                    <FieldErrorAlert errors={errors} fieldName={'repeat'}/>
                  </Box>
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

export default Create
