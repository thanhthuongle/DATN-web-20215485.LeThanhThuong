import { Link } from 'react-router-dom'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Avatar from '@mui/material/Avatar'
import LockIcon from '@mui/icons-material/Lock'
import Typography from '@mui/material/Typography'
import { IconButton, Card as MuiCard, Tooltip } from '@mui/material'
import CardActions from '@mui/material/CardActions'
import TextField from '@mui/material/TextField'
import Zoom from '@mui/material/Zoom'
import Alert from '@mui/material/Alert'
import { useForm } from 'react-hook-form'
import {
  EMAIL_RULE,
  PASSWORD_RULE,
  EMAIL_RULE_MESSAGE,
  PASSWORD_RULE_MESSAGE,
  FIELD_REQUIRED_MESSAGE
} from '~/utils/validators'
import FieldErrorAlert from '~/component/Form/FieldErrorAlert'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { useDispatch } from 'react-redux'
import { loginUserAPI } from '~/redux/user/userSlice'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import { useState } from 'react'
import DoneAllIcon from '@mui/icons-material/DoneAll'
import LoginIcon from '@mui/icons-material/Login'

function LoginForm() {
  const dispath = useDispatch()
  const navigate = useNavigate()
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm()
  let [searchParams] = useSearchParams()
  const registeredEmail = searchParams.get('registeredEmail')
  const verifiedEmail = searchParams.get('verifiedEmail')

  const [copiedEmail, setCopiedEmail] = useState(false)
  const [copiedPass, setCopiedPass] = useState(false)

  const submitLogIn = (data) => {
    const { email, password } = data
    toast.promise(
      dispath(loginUserAPI({ email, password })),
      { pending: 'Login in...' }
    ).then(res => {
      // Kiểm tra login thành công mới điều hướng đến '/'
      if (!res.error) navigate('/overview')
    })
    // toast.promise(
    //   dispath(loginUserAPI({ email, password })).then((loginResponse) => {
    //     if (loginResponse.error) {
    //       throw new Error('Login failed')
    //     }

    //     return dispath(getIndividualCategoryAPI())
    //   }),
    //   {
    //     pending: 'Logging in...',
    //     success: 'Login successful!',
    //     error: 'Login failed'
    //   }
    // ).then(res => { if (!res.error) { navigate('/overview') }
    // // eslint-disable-next-line no-console
    // }).catch(error => { console.error(error) })
  }

  const quickLogin = () => {
    const demoAccount = {
      email: 'demo@gmail.com',
      password: '12345678a'
    }

    submitLogIn(demoAccount)
  }
  const handleCopy = (text, type) => {
    if (type === 'email') {
      navigator.clipboard.writeText(text)
      setCopiedEmail(true)
      setTimeout(() => setCopiedEmail(false), 2000)
    } else {
      navigator.clipboard.writeText('12345678a')
      setCopiedPass(true)
      setTimeout(() => setCopiedPass(false), 2000)
    }
  }

  return (
    <form onSubmit={handleSubmit(submitLogIn)}>
      <Zoom in={true} style={{ transitionDelay: '200ms' }}>
        <MuiCard sx={{ minWidth: 380, maxWidth: 380, marginTop: '6em' }}>
          {/* <Box sx={{ marginTop: '1em', display: 'flex', justifyContent: 'center', color: theme => theme.palette.grey[500] }}>
            Author: LeThanhThuong - 20215485
          </Box> */}
          <Box sx={{
            margin: '1em',
            display: 'flex',
            justifyContent: 'center',
            gap: 1
          }}>
            <Avatar sx={{ bgcolor: 'primary.main' }}><LockIcon /></Avatar>
            {/* <Avatar sx={{ bgcolor: 'primary.main' }}> LOGO WEB </Avatar> */}
          </Box>
          {!verifiedEmail && !registeredEmail && (
            <Box sx={{
              marginTop: '1.5em',
              marginX: '1em',
              display: 'flex',
              flexDirection: 'column',
              padding: '1em',
              border: '1px dashed #ccc',
              borderRadius: '8px',
              backgroundColor: '#f9f9f9'
            }}>
              <Typography variant="subtitle1" color='#000000' fontWeight={'bold'} sx={{ alignSelf: 'center', mb: 1 }}>
                TÀI KHOẢN DEMO
              </Typography>

              {/* Hàng Email */}
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 0.5 }}>
                <Typography variant="body2" sx={{ display: 'flex', color: 'grey.600' }}>
                  Email: &nbsp;<Typography component="span" fontWeight="500" color='#000000'>demo@gmail.com</Typography>
                </Typography>
                <Tooltip title={copiedEmail ? 'Đã sao chép!' : 'Sao chép Email'}>
                  <IconButton size="small" onClick={() => handleCopy('demo@gmail.com', 'email')}>
                    {copiedEmail ? (
                      <DoneAllIcon fontSize="small" sx={{ color: 'green' }} />
                    ) : (
                      <ContentCopyIcon fontSize="small" />
                    )}
                  </IconButton>
                </Tooltip>
              </Box>

              {/* Hàng Password */}
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="body2" sx={{ display: 'flex', color: 'grey.600' }}>
                  Pass: &nbsp;<Typography component="span" fontWeight="500" color='#000000'>******</Typography>
                </Typography>
                <Tooltip title={copiedPass ? 'Đã sao chép!' : 'Sao chép Mật khẩu'}>
                  <IconButton size="small" onClick={() => handleCopy('12345678a', 'pass')}>
                    {copiedPass ? (
                      <DoneAllIcon fontSize="small" sx={{ color: 'green' }} />
                    ) : (
                      <ContentCopyIcon fontSize="small" />
                    )}
                  </IconButton>
                </Tooltip>
              </Box>

              {/* Nút Đăng nhập nhanh */}
              <Button
                className='interceptor-loading'
                variant="contained"
                size="small"
                startIcon={<LoginIcon />}
                onClick={() => quickLogin()}
                sx={{
                  textTransform: 'none',
                  backgroundColor: '#1976d2',
                  '&:hover': { backgroundColor: '#115293' },
                  paddingY: 1
                }}
              >
                Đăng nhập nhanh (demo)
              </Button>
            </Box>
          )}

          <Box sx={{ marginTop: '1em', display: 'flex', justifyContent: 'center', flexDirection: 'column', padding: '0 1em' }}>
            {verifiedEmail &&
              <Alert severity="success" sx={{ '.MuiAlert-message': { overflow: 'hidden' } }}>
                Email&nbsp;
                <Typography variant="span" sx={{ fontWeight: 'bold', '&:hover': { color: '#fdba26' } }}>{verifiedEmail}</Typography>
                &nbsp;của bạn đã được xác thực.<br />Bây giờ bạn có thể đăng nhập và sử dụng dịch vụ của website!
              </Alert>
            }
            {registeredEmail &&
              <Alert severity="info" sx={{ '.MuiAlert-message': { overflow: 'hidden' } }}>
                Một email đã được gửi đến&nbsp;
                <Typography variant="span" sx={{ fontWeight: 'bold', '&:hover': { color: '#fdba26' } }}>{registeredEmail}</Typography>
                <br />Vui lòng kiểm tra và xác nhận tài khoản trước khi đăng nhập!
              </Alert>
            }
          </Box>
          <Box sx={{ padding: '0 1em 1em 1em' }}>
            <Box sx={{ marginTop: '1em' }}>
              <TextField
                autoFocus
                fullWidth
                label="Enter Email..."
                type="text"
                variant="outlined"
                error={!!errors['email']}
                {...register('email', {
                  required: FIELD_REQUIRED_MESSAGE,
                  pattern: {
                    value: EMAIL_RULE,
                    message: EMAIL_RULE_MESSAGE
                  }
                })}
              />
              <FieldErrorAlert errors={errors} fieldName={'email'} />
            </Box>
            <Box sx={{ marginTop: '1em' }}>
              <TextField
                fullWidth
                label="Enter Password..."
                type="password"
                variant="outlined"
                error={!!errors['password']}
                {...register('password', {
                  required: FIELD_REQUIRED_MESSAGE,
                  pattern: {
                    value: PASSWORD_RULE,
                    message: PASSWORD_RULE_MESSAGE
                  }
                })}
              />
              <FieldErrorAlert errors={errors} fieldName={'password'} />
            </Box>
          </Box>
          <CardActions sx={{ padding: '0 1em 1em 1em' }}>
            <Button
              className='interceptor-loading'
              type="submit"
              variant="contained"
              color="primary"
              size="large"
              fullWidth
            >
              Login
            </Button>
          </CardActions>
          <Box sx={{ padding: '0 1em 1em 1em', textAlign: 'center' }}>
            <Typography>Don&apos;t have an account?</Typography>
            <Link to="/register" style={{ textDecoration: 'none' }}>
              <Typography sx={{ color: 'primary.main', '&:hover': { color: '#ffbb39' } }}>Create account!</Typography>
            </Link>
          </Box>
        </MuiCard>
      </Zoom>
    </form >
  )
}

export default LoginForm
