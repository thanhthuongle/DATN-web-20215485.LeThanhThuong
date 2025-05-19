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
import { Avatar, FormControl, InputLabel, MenuItem, Select } from '@mui/material'
import { INTEREST_PAID, MONEY_SOURCE_TYPE, TERM_ENDED } from '~/utils/constants'
import { createIndividualSavingAPI, getBanks, getIndividualAccountAPI } from '~/apis'
import { toast } from 'react-toastify'
import moment from 'moment'
import { DatePicker } from '@mui/x-date-pickers'
import CalendarTodayIcon from '@mui/icons-material/CalendarToday'
import FinanceItem1 from '~/component/FinanceItemDisplay/FinanceItem1'

function CreateSaving({ afterCreateSaving }) {
  const { register, setValue, control, handleSubmit, reset, watch, formState: { errors } } = useForm()
  let interestPaid = watch('interestPaid')
  let termEnded = watch('termEnded')
  const [open, setOpen] = React.useState(false)
  const [banks, setBanks] = React.useState([])
  const [accounts, setAccounts] = React.useState([])

  const handleOpen = () => setOpen(true)
  const handleClose = () => {
    setOpen(false)
    reset()
  }
  const submitCreateSaving= (data) => {
    data.moneyFromType = MONEY_SOURCE_TYPE.ACCOUNT
    const { savingsAccountName, bankId, initBalance, startDate, term, rate, nonTermRate, interestPaid, termEnded, moneyFromType, moneyFromId } = data
    const newSaving = { savingsAccountName, bankId, initBalance, startDate, term, rate, nonTermRate, interestPaid, termEnded, moneyFromType, moneyFromId }
    if (data.interestPaidTargetId) {
      newSaving.interestPaidTargetId = data.interestPaidTargetId,
      newSaving.interestPaidTargetType = MONEY_SOURCE_TYPE.ACCOUNT
    }
    if (data.description) newSaving.description = data.description

    toast.promise(
      createIndividualSavingAPI(newSaving),
      { pending: 'Đang tạo sổ tiết kiệm...' }
    ).then((res) => {
      if (!res.error) {
        toast.success('Tạo sổ tiết kiệm thành công!')
        handleClose()
        afterCreateSaving()
      }
    })
  }

  React.useEffect(() => {
    const fetchData = async () => {
      const banks = await getBanks()
      const accounts = await getIndividualAccountAPI()
      setBanks(banks)
      setAccounts(accounts)
    }

    fetchData()
  }, [])

  React.useEffect(() => {
    if (interestPaid != INTEREST_PAID.MATURITY && termEnded == TERM_ENDED.ROLL_OVER_PRINCIPAL_AND_INTEREST)
      setValue('termEnded', '', { shouldValidate: true })
    if (interestPaid == INTEREST_PAID.MATURITY)
      setValue('interestPaidTargetId', '', { shouldValidate: true })
  }, [interestPaid, setValue, termEnded])

  return (
    <>
      <Box>
        <Button
          onClick={handleOpen}
          variant="outlined"
          startIcon={<LibraryAddIcon />}
          sx={{ paddingY: '12px' }}
        >
          Thên sổ tiết kiệm
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
          maxHeight: '80vh',
          overflowY: 'auto',
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
            <Typography variant="h6" component="h2">Tạo sổ tiết kiệm mới</Typography>
          </Box>

          <Box id="modal-modal-description" sx={{ my: 2 }}>
            <form onSubmit={handleSubmit(submitCreateSaving)}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {/* Tên sổ tiết kiệm */}
                <Box>
                  <TextField
                    fullWidth
                    label="Tên sổ tiết kiệm"
                    type="text"
                    variant="outlined"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <AbcIcon fontSize="small" />
                        </InputAdornment>
                      )
                    }}
                    {...register('savingsAccountName', {
                      required: FIELD_REQUIRED_MESSAGE,
                      minLength: { value: 3, message: 'Min Length is 3 characters' },
                      maxLength: { value: 256, message: 'Max Length is 256 characters' }
                    })}
                    error={!!errors['savingsAccountName']}
                  />
                  <FieldErrorAlert errors={errors} fieldName={'savingsAccountName'} />
                </Box>

                {/* Ngân hàng */}
                <Box>
                  <Controller
                    control={control}
                    name="bankId"
                    rules={{ required: FIELD_REQUIRED_MESSAGE }}
                    defaultValue={''}
                    render={({ field: { onChange, onBlur, value } }) => (
                      <FormControl fullWidth>
                        <InputLabel id="bank-select-label">Ngân hàng</InputLabel>
                        <Select
                          labelId="bank-select-label"
                          id="bank-select"
                          value={value}
                          label="Ngân hàng"
                          onChange={onChange}
                          onBlur={onBlur}
                          error={!!errors['bankId']}
                          MenuProps={{
                            PaperProps: {
                              style: {
                                maxHeight: 250,
                                overflowY: 'auto'
                              }
                            }
                          }}
                        >
                          {banks.map((bank) => (
                            <MenuItem key={bank._id} value={bank._id}>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Avatar src={bank.logo} sx={{ width: 24, height: 24, bgcolor: 'white' }} />
                                <Typography>{bank.name}</Typography>
                              </Box>
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    )}
                  />
                  <FieldErrorAlert errors={errors} fieldName={'bankId'} />
                </Box>

                {/* Số tiền */}
                <Box>
                  <Box display={'flex'} alignItems={'center'}>
                    <Controller
                      control={control}
                      name="initBalance"
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
                          error={!!errors['initBalance']}
                        />
                      )}
                    />
                  </Box>
                  <Box>
                    <FieldErrorAlert errors={errors} fieldName={'initBalance'}/>
                  </Box>
                </Box>

                {/* Ngày gửi */}
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
                        format="DD/MM/YYYY"
                        label="Ngày gửi"
                        value={value || moment().startOf('day')}
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

                {/* Kỳ hạn */}
                <Box>
                  <Box display={'flex'} alignItems={'center'}>
                    <Controller
                      control={control}
                      name="term"
                      rules={{ required: FIELD_REQUIRED_MESSAGE }}
                      render={({ field: { onChange, value } }) => (
                        <NumericFormat
                          fullWidth
                          customInput={TextField}
                          placeholder='Nhập kỳ hạn'
                          label="Kỳ hạn (Đơn vị: Tháng)"
                          allowNegative={false}
                          decimalScale={0}
                          allowLeadingZeros={false}
                          suffix="&nbsp;Tháng"
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <CalendarTodayIcon fontSize="small" />
                              </InputAdornment>
                            )
                          }}
                          onValueChange={(v) => { onChange(v.value) }}
                          value={value}
                          error={!!errors['term']}
                        />
                      )}
                    />
                  </Box>
                  <Box>
                    <FieldErrorAlert errors={errors} fieldName={'term'}/>
                  </Box>
                </Box>

                {/* Lãi suất */}
                <Box>
                  <Box display={'flex'} alignItems={'center'}>
                    <Controller
                      control={control}
                      name="rate"
                      rules={{ required: FIELD_REQUIRED_MESSAGE }}
                      render={({ field: { onChange, value } }) => (
                        <NumericFormat
                          fullWidth
                          customInput={TextField}
                          placeholder='Nhập lãi suất'
                          label="Lãi suất (/năm)"
                          thousandSeparator="."
                          decimalSeparator=","
                          allowNegative={false}
                          allowLeadingZeros={false}
                          suffix="&nbsp;%/năm"
                          onValueChange={(v) => { onChange(v.value) }}
                          value={value}
                          error={!!errors['rate']}
                        />
                      )}
                    />
                  </Box>
                  <Box>
                    <FieldErrorAlert errors={errors} fieldName={'rate'}/>
                  </Box>
                </Box>

                {/* Lãi suất không kỳ hạn */}
                <Box>
                  <Box display={'flex'} alignItems={'center'}>
                    <Controller
                      control={control}
                      name="nonTermRate"
                      rules={{ required: FIELD_REQUIRED_MESSAGE }}
                      render={({ field: { onChange, value } }) => (
                        <NumericFormat
                          fullWidth
                          customInput={TextField}
                          placeholder='Nhập lãi suất không kỳ hạn'
                          label="Lãi suất không kỳ hạn (/năm)"
                          thousandSeparator="."
                          decimalSeparator=","
                          allowNegative={false}
                          allowLeadingZeros={false}
                          suffix="&nbsp;%/năm"
                          onValueChange={(v) => { onChange(v.value) }}
                          value={value}
                          error={!!errors['nonTermRate']}
                        />
                      )}
                    />
                  </Box>
                  <Box>
                    <FieldErrorAlert errors={errors} fieldName={'nonTermRate'}/>
                  </Box>
                </Box>

                {/* Thời gian trả lãi */}
                <Box>
                  <Controller
                    control={control}
                    name="interestPaid"
                    rules={{ required: FIELD_REQUIRED_MESSAGE }}
                    defaultValue={''}
                    render={({ field: { onChange, onBlur, value } }) => (
                      <FormControl fullWidth>
                        <InputLabel id="interest-paid-select-label">Thời gian trả lãi</InputLabel>
                        <Select
                          labelId="interest-paid-select-label"
                          id="interest-paid-select"
                          value={value}
                          label="Thời gian trả lãi"
                          onChange={onChange}
                          onBlur={onBlur}
                          error={!!errors['interestPaid']}
                          MenuProps={{
                            PaperProps: {
                              style: {
                                maxHeight: 250,
                                overflowY: 'auto'
                              }
                            }
                          }}
                        >
                          <MenuItem value={INTEREST_PAID.MATURITY}>Cuối kỳ</MenuItem>
                          <MenuItem value={INTEREST_PAID.UP_FRONT}>Đầu kỳ</MenuItem>
                          <MenuItem value={INTEREST_PAID.MONTHLY}>Hàng tháng</MenuItem>
                        </Select>
                      </FormControl>
                    )}
                  />
                  <FieldErrorAlert errors={errors} fieldName={'interestPaid'} />
                </Box>

                {/* Hành động khi đến hạn */}
                <Box>
                  <Controller
                    control={control}
                    name="termEnded"
                    rules={{ required: FIELD_REQUIRED_MESSAGE }}
                    defaultValue={''}
                    render={({ field: { onChange, onBlur, value } }) => (
                      <FormControl fullWidth>
                        <InputLabel id="interest-paid-select-label">Khi đến hạn</InputLabel>
                        <Select
                          labelId="interest-paid-select-label"
                          id="interest-paid-select"
                          value={value}
                          label="Khi đến hạn"
                          onChange={onChange}
                          onBlur={onBlur}
                          error={!!errors['termEnded']}
                          MenuProps={{
                            PaperProps: {
                              style: {
                                maxHeight: 250,
                                overflowY: 'auto'
                              }
                            }
                          }}
                        >
                          {interestPaid == INTEREST_PAID.MATURITY && <MenuItem value={TERM_ENDED.ROLL_OVER_PRINCIPAL_AND_INTEREST}>Tái tục gốc và lãi</MenuItem>}
                          <MenuItem value={TERM_ENDED.ROLL_OVER_PRINCIPAL}>Tái tục gốc</MenuItem>
                          <MenuItem value={TERM_ENDED.CLOSE_ACCOUNT}>Tất toán sổ</MenuItem>
                        </Select>
                      </FormControl>
                    )}
                  />
                  <FieldErrorAlert errors={errors} fieldName={'termEnded'} />
                </Box>

                {/* Tài khoản nhận lãi */}
                {(interestPaid == INTEREST_PAID.UP_FRONT || interestPaid == INTEREST_PAID.MONTHLY) &&
                  <Box>
                    <Box sx={{ width: '100%' }}>
                      <Controller
                        control={control}
                        rules={{ required: FIELD_REQUIRED_MESSAGE }}
                        name="interestPaidTargetId"
                        render={({ field: { onChange, onBlur, value } }) => (
                          <FormControl fullWidth>
                            <InputLabel id="money-from-select-label">Trả lãi vào tài khoản</InputLabel>
                            <Select
                              labelId="money-from-select-label"
                              id="money-from-select"
                              label="Trả lãi vào tài khoản"
                              value={value || ''}
                              onChange={onChange}
                              onBlur={onBlur}
                              error={!!errors['interestPaidTargetId']}
                              MenuProps={{
                                PaperProps: {
                                  style: {
                                    maxHeight: 250,
                                    overflowY: 'auto'
                                  }
                                }
                              }}
                              renderValue={(wallet) => {
                                const selectedWallet = accounts.find(w => w._id === wallet)
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
                              {accounts?.map((w, index) => (
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
                    <FieldErrorAlert errors={errors} fieldName={'interestPaidTargetId'}/>
                  </Box>
                }

                {/* Nguồn tiền */}
                <Box>
                  <Box sx={{ width: '100%' }}>
                    <Controller
                      control={control}
                      rules={{ required: FIELD_REQUIRED_MESSAGE }}
                      name="moneyFromId"
                      render={({ field: { onChange, onBlur, value } }) => (
                        <FormControl fullWidth>
                          <InputLabel id="money-from-select-label">Tiền được gửi từ tài khoản nào</InputLabel>
                          <Select
                            labelId="money-from-select-label"
                            id="money-from-select"
                            label="Tiền được gửi từ tài khoản nào"
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
                            renderValue={(wallet) => {
                              const selectedWallet = accounts.find(w => w._id === wallet)
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
                            {accounts?.map((w, index) => (
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
                  <FieldErrorAlert errors={errors} fieldName={'moneyFromId'}/>
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

export default CreateSaving
