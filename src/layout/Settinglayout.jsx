import React from 'react'
import { Box, Container, Grid } from '@mui/material'
import AppBar from '~/component/AppBar/AppBar'
import SideBar from '~/component/SideBar/SideBar'
import { Outlet } from 'react-router-dom'

function Settinglayout(props) {
  return (
    <Container disableGutters maxWidth={false}>
      <AppBar workspace={props.workspace}/>
      <Box sx={{ paddingX: 2, my: 4 }}>
        <Grid container spacing={2}>
          <Outlet />
        </Grid>
      </Box>
    </Container>
  )
}

export default Settinglayout