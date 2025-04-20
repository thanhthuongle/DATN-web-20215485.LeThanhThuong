import React from 'react'
import { Box, Container, Grid } from '@mui/material'
import AppBar from '~/component/AppBar/AppBar'
import GroupSideBar from '~/component/SideBar/GroupSideBar'
import { Outlet } from 'react-router-dom'

function GroupLayout(props) {
  return (
    <Container disableGutters maxWidth={false}>
      <AppBar workspace={props.workspace}/>
      <Box sx={{ paddingX: 2, my: 4 }}>
        <Grid container spacing={2}>
          <GroupSideBar />

          <Grid size={{ xs: 12, sm: 9.5 }}>
            <Outlet />
          </Grid>
        </Grid>
      </Box>
    </Container>
  )
}

export default GroupLayout