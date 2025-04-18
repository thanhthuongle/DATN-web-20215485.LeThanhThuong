import { Box, Button, Container, Grid } from '@mui/material'
import Stack from '@mui/material/Stack'
import AccessAlarmIcon from '@mui/icons-material/AccessAlarm'
import ThreeDRotation from '@mui/icons-material/ThreeDRotation'
import HomeIcon from '@mui/icons-material/Home'
import { pink } from '@mui/material/colors'
import Typography from '@mui/material/Typography'
import ModeSelect from '~/component/ModeSelect/ModeSelect'
import AppBar from '~/component/AppBar/AppBar'
import SideBar from '~/component/SideBar/SideBar'

function Homepage() {
  return (
    <Container disableGutters maxWidth={false}>
      <AppBar />
      <Box sx={{ paddingX: 2, my: 4 }}>
        <Grid container spacing={2}>
          <SideBar />

          <Grid size={{ xs: 12, sm: 9.5 }}>Nội dung chi tiết</Grid>
        </Grid>
      </Box>
    </Container>
  )
}

export default Homepage
