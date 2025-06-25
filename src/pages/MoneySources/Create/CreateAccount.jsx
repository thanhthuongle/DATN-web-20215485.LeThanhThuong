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
import { ACCOUNT_TYPES } from '~/utils/constants'
import { createIndividualAccountAPI, getBanks } from '~/apis'
import { toast } from 'react-toastify'

function CreateAccount({ afterCreateNewAccount }) {
  const { register, control, handleSubmit, reset, watch, formState: { errors } } = useForm()
  const type = watch('type')
  const [open, setOpen] = React.useState(false)
  const [banks, setBanks] = React.useState([])

  const handleOpen = () => setOpen(true)
  const handleClose = () => {
    setOpen(false)
    reset()
  }
  const submitCreateNewAccount = (data) => {
    const { type, accountName, initBalance } = data
    const newAccount = {
      type,
      accountName,
      initBalance
    }
    if (data.description) newAccount.description = data.description
    if (data.bankId) newAccount.bankId = data.bankId

    toast.promise(
      createIndividualAccountAPI(newAccount),
      { pending: 'Đang tạo tài khoản...' }
    ).then((res) => {
      if (!res.error) {
        toast.success('Tạo tài khoản thành công!')
        handleClose()
        afterCreateNewAccount()
      }
    })
  }

  React.useEffect(() => {
    const fetchBanks = async () => {
      const banks = await getBanks()
      setBanks(banks)
    }

    fetchBanks()
  }, [])

  return (
    <>
      <Box>
        <Button
          onClick={handleOpen}
          variant="outlined"
          startIcon={<LibraryAddIcon />}
          sx={{ paddingY: '12px' }}
        >
          Thêm tài khoản
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
            <Typography variant="h6" component="h2">Tạo Tài khoản mới</Typography>
          </Box>

          <Box id="modal-modal-description" sx={{ my: 2 }}>
            <form onSubmit={handleSubmit(submitCreateNewAccount)}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                {/* Loại tài khoản */}
                <Box>
                  <Controller
                    control={control}
                    name="type"
                    rules={{ required: FIELD_REQUIRED_MESSAGE }}
                    defaultValue={ACCOUNT_TYPES.WALLET}
                    render={({ field: { onChange, onBlur, value } }) => (
                      <FormControl fullWidth>
                        <InputLabel id="account-type-select-label">Loại tài khoản</InputLabel>
                        <Select
                          labelId="account-type-select-label"
                          id="account-type-select"
                          value={value}
                          label="Loại tài khoản"
                          onChange={onChange}
                          onBlur={onBlur}
                          error={!!errors['type']}
                        >
                          <MenuItem value={ACCOUNT_TYPES.WALLET}>Ví tiền mặt</MenuItem>
                          <MenuItem value={ACCOUNT_TYPES.BANK}>Tài khoản ngân hàng</MenuItem>
                          <MenuItem value={ACCOUNT_TYPES.OTHER}>Khác</MenuItem>
                        </Select>
                      </FormControl>
                    )}
                  />
                  <FieldErrorAlert errors={errors} fieldName={'type'} />
                </Box>

                {/* Tên tài khoản */}
                <Box>
                  <TextField
                    fullWidth
                    label="Tên tài khoản"
                    type="text"
                    variant="outlined"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <AbcIcon fontSize="small" />
                        </InputAdornment>
                      )
                    }}
                    {...register('accountName', {
                      required: FIELD_REQUIRED_MESSAGE,
                      minLength: { value: 3, message: 'Min Length is 3 characters' },
                      maxLength: { value: 256, message: 'Max Length is 256 characters' }
                    })}
                    error={!!errors['accountName']}
                  />
                  <FieldErrorAlert errors={errors} fieldName={'accountName'} />
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

                {/* Ngân hàng */}
                {type == ACCOUNT_TYPES.BANK && (
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
                                  <Avatar src={bank.logo} sx={{ width: 24, height: 24 }} />
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
                )}

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

export default CreateAccount
