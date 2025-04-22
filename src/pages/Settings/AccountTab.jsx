import { styled } from '@mui/material/styles'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Avatar from '@mui/material/Avatar'
import Tooltip from '@mui/material/Tooltip'
import TextField from '@mui/material/TextField'
import InputAdornment from '@mui/material/InputAdornment'
import Button from '@mui/material/Button'
import CloudUploadIcon from '@mui/icons-material/CloudUpload'
import MailIcon from '@mui/icons-material/Mail'
import AccountBoxIcon from '@mui/icons-material/AccountBox'
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd'
import VisuallyHiddenInput from '~/component/Form/VisuallyHiddenInput'

import { FIELD_REQUIRED_MESSAGE, singleFileValidator } from '~/utils/validators'
import FieldErrorAlert from '~/component/Form/FieldErrorAlert'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'

function AccountTab() {
  const currentUser = { // Lấy data từ redux
    email: 'Thuong.LT215485@sis.hust.edu.vn',
    username: 'Thuong.LT215485',
    displayName: 'Thuong.LT215485'
  }

  // Những thông tin của user để init vào form
  const initialGeneralForm = {
    displayName: currentUser?.displayName
  }
  // Set giá trị mặc định cho các field cần thiết
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: initialGeneralForm
  })

  const submitChangeGeneralInformation = (data) => {
    const { displayName } = data
    console.log('displayName: ', displayName)

    if (displayName === currentUser?.displayName) return

    // Gọi API update thoog tin...
  }

  const uploadAvatar = (e) => {
    console.log('e.target?.files[0]: ', e.target?.files[0])
    const error = singleFileValidator(e.target?.files[0])
    if (error) {
      toast.error(error)
      return
    }

    let reqData = new FormData()
    reqData.append('avatar', e.target?.files[0])
    // Cách để log được dữ liệu thông qua FormData
    console.log('reqData: ', reqData)
    for (const value of reqData.values()) {
      console.log('reqData Value: ', value)
    }

    // Gọi API update avatar...
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
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box>
            <Avatar
              sx={{ width: 84, height: 84, mb: 1 }}
              alt={currentUser?.username}
              src={currentUser?.avatar}
            />
            <Tooltip title="Upload a new image to update your avatar immediately.">
              <Button
                component="label"
                variant="contained"
                size="small"
                sx={{ textTransform: 'none' }}
                startIcon={<CloudUploadIcon />}>
                Upload
                <VisuallyHiddenInput type="file" onChange={uploadAvatar} />
              </Button>
            </Tooltip>
          </Box>
          <Box>
            <Typography variant="h6">{currentUser?.displayName}</Typography>
            <Typography sx={{ color: 'grey' }}>@{currentUser?.username}</Typography>
          </Box>
        </Box>

        <form onSubmit={handleSubmit(submitChangeGeneralInformation)}>
          <Box sx={{
            width: '400px',
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
            '@media (max-width: 600px)': {
              width: '330px'
            }
          }}>
            <Box>
              <TextField
                disabled
                defaultValue={currentUser?.email}
                fullWidth
                label="Your Email"
                type="text"
                variant="filled"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <MailIcon fontSize="small" />
                    </InputAdornment>
                  )
                }}
              />
            </Box>

            <Box>
              <TextField
                disabled
                defaultValue={currentUser?.username}
                fullWidth
                label="Your Username"
                type="text"
                variant="filled"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <AccountBoxIcon fontSize="small" />
                    </InputAdornment>
                  )
                }}
              />
            </Box>

            <Box>
              <TextField
                fullWidth
                label="Your Display Name"
                type="text"
                variant="outlined"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <AssignmentIndIcon fontSize="small" />
                    </InputAdornment>
                  )
                }}
                {...register('displayName', {
                  required: FIELD_REQUIRED_MESSAGE
                })}
                error={!!errors['displayName']}
              />
              <FieldErrorAlert errors={errors} fieldName={'displayName'} />
            </Box>

            <Box>
              <Button
                sx={{ textTransform: 'none' }}
                className="interceptor-loading"
                type="submit"
                variant="contained"
                color="primary"
                fullWidth>
                Update
              </Button>
            </Box>
          </Box>
        </form>
      </Box>
    </Box>
  )
}

export default AccountTab
