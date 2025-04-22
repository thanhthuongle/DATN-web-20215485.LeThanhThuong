import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import InputAdornment from '@mui/material/InputAdornment'
import Button from '@mui/material/Button'
import PasswordIcon from '@mui/icons-material/Password'
import LockResetIcon from '@mui/icons-material/LockReset'
import LockIcon from '@mui/icons-material/Lock'
import LogoutIcon from '@mui/icons-material/Logout'
import IconButton from '@mui/material/IconButton'
import VisibilityIcon from '@mui/icons-material/Visibility'
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff'

import { FIELD_REQUIRED_MESSAGE, PASSWORD_RULE, PASSWORD_RULE_MESSAGE } from '~/utils/validators'
import FieldErrorAlert from '~/component/Form/FieldErrorAlert'
import { useForm } from 'react-hook-form'
import { useConfirm } from 'material-ui-confirm'
import { toast } from 'react-toastify'
import { useState } from 'react'

function SecurityTab() {
  const [showPasswords, setShowPasswords] = useState({
    old: false,
    new: false,
    confirm: false
  })
  const togglePassword = (key) => {
    setShowPasswords((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  const { register, handleSubmit, watch, formState: { errors } } = useForm()

  const confirmChangePassword = useConfirm()
  const submitChangePassword = (data) => {
    confirmChangePassword({
      title: <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <LogoutIcon sx={{ color: 'warning.dark' }} /> Change Password
      </Box>,
      description: 'You have to login again after successfully changing your password. Continue?',
      confirmationText: 'Confirm',
      cancellationText: 'Cancel'
    }).then(() => {
      const { current_password, new_password, new_password_confirmation } = data
      console.log('current_password: ', current_password)
      console.log('new_password: ', new_password)
      console.log('new_password_confirmation: ', new_password_confirmation)

      // Gọi API...
    }).catch(() => {})
  }

  return (
    <Box sx={{
      width: '100%',
      height: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <Box sx={{
        maxWidth: '1200px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 3
      }}>
        <Box>
          <Typography variant="h5">Security Dashboard</Typography>
        </Box>
        <form onSubmit={handleSubmit(submitChangePassword)}>
          <Box sx={{
            width: '400px',
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
            '@media (max-width: 600px)': {
              width: '100%'
            }
          }}>
            <Box>
              <TextField
                autoComplete="true"
                fullWidth
                label="Current Password"
                type={showPasswords.old ? 'text' : 'password'}
                variant="outlined"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PasswordIcon fontSize="small" />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={() => togglePassword('old')}
                      >
                        {showPasswords.old ? <VisibilityIcon /> : <VisibilityOffIcon />}
                      </IconButton>
                    </InputAdornment>
                  )
                }}
                {...register('current_password', {
                  required: FIELD_REQUIRED_MESSAGE,
                  pattern: {
                    value: PASSWORD_RULE,
                    message: PASSWORD_RULE_MESSAGE
                  }
                })}
                error={!!errors['current_password']}
              />
              <FieldErrorAlert errors={errors} fieldName={'current_password'} />
            </Box>

            <Box>
              <TextField
                autoComplete="true"
                fullWidth
                label="New Password"
                type={showPasswords.new ? 'text' : 'password'}
                variant="outlined"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockIcon fontSize="small" />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={() => togglePassword('new')}
                      >
                        {showPasswords.new ? <VisibilityIcon /> : <VisibilityOffIcon />}
                      </IconButton>
                    </InputAdornment>
                  )
                }}
                {...register('new_password', {
                  required: FIELD_REQUIRED_MESSAGE,
                  pattern: {
                    value: PASSWORD_RULE,
                    message: PASSWORD_RULE_MESSAGE
                  }
                })}
                error={!!errors['new_password']}
              />
              <FieldErrorAlert errors={errors} fieldName={'new_password'} />
            </Box>

            <Box>
              <TextField
                autoComplete="true"
                fullWidth
                label="New Password Confirmation"
                type={showPasswords.confirm ? 'text' : 'password'}
                variant="outlined"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockResetIcon fontSize="small" />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={() => togglePassword('confirm')}
                      >
                        {showPasswords.confirm ? <VisibilityIcon /> : <VisibilityOffIcon />}
                      </IconButton>
                    </InputAdornment>
                  )
                }}
                {...register('new_password_confirmation', {
                  validate: (value) => {
                    if (value === watch('new_password')) return true
                    return 'Password confirmation does not match.'
                  }
                })}
                error={!!errors['new_password_confirmation']}
              />
              <FieldErrorAlert errors={errors} fieldName={'new_password_confirmation'} />
            </Box>

            <Box>
              <Button
                className="interceptor-loading"
                type="submit"
                variant="contained"
                color="primary"
                fullWidth>
                Change
              </Button>
            </Box>
          </Box>
        </form>
      </Box>
    </Box>
  )
}

export default SecurityTab
