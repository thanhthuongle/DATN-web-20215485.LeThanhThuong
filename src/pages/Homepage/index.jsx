import { Button, Container } from '@mui/material'
import Stack from '@mui/material/Stack'
import AccessAlarmIcon from '@mui/icons-material/AccessAlarm'
import ThreeDRotation from '@mui/icons-material/ThreeDRotation'
import HomeIcon from '@mui/icons-material/Home'
import { pink } from '@mui/material/colors'
import Typography from '@mui/material/Typography'
import ModeSelect from '~/component/ModeSelect/ModeSelect'
import AppBar from '~/component/AppBar/AppBar'

function Homepage() {
  return (
    <Container disableGutters maxWidth={false}>
      <AppBar />
    </Container>
  )
}

export default Homepage
