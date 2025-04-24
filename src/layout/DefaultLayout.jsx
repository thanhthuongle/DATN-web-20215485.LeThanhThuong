import React from 'react'
import { Box, Container, Grid } from '@mui/material'
import AppBar from '~/component/AppBar/AppBar'
import SideBar from '~/component/SideBar/SideBar'
import { Outlet } from 'react-router-dom'

function DefaultLayout(props) {
  return (
    <Container disableGutters maxWidth={false}>
      <Box sx={{ position: 'sticky', top: 0, zIndex: 1000 }}>
        <AppBar workspace={props.workspace} />
      </Box>
      <Box sx={{ paddingX: 2, my: 4 }}>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, sm: 2.5 }}>
            <Box sx={{ position: 'sticky', top: 90 }} width='100%'>
              <SideBar />
            </Box>
          </Grid>

          <Grid size={{ xs: 12, sm: 9.5 }}>
            <Outlet />
          </Grid>
        </Grid>
      </Box>
    </Container>
  )
}

export default DefaultLayout
