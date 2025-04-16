import { Button } from '@mui/material'
import Stack from '@mui/material/Stack'
import AccessAlarmIcon from '@mui/icons-material/AccessAlarm'
import ThreeDRotation from '@mui/icons-material/ThreeDRotation'
import HomeIcon from '@mui/icons-material/Home'
import { pink } from '@mui/material/colors'
import Typography from '@mui/material/Typography'
import ModeSelect from '~/component/ModeSelect/ModeSelect'

function Homepage() {
  return (
    <>
      <ModeSelect />
      <hr />
      
      <div>Su gia hoa binh</div>
      <Stack spacing={2} direction="row">
        <Button variant="text">Text</Button>
        <Button variant="contained">Contained</Button>
        <Button variant="outlined">Outlined</Button>
      </Stack>
      <AccessAlarmIcon />
      <ThreeDRotation />
      <Stack direction="row" spacing={3}>
        <HomeIcon />
        <HomeIcon color="primary" />
        <HomeIcon color="secondary" />
        <HomeIcon color="success" />
        <HomeIcon color="action" />
        <HomeIcon color="disabled" />
        <HomeIcon sx={{ color: pink[500] }} />
      </Stack>

      <Typography variant='body2' color='text.secondary'>Test config theme</Typography>
    </>
  )
}

export default Homepage
