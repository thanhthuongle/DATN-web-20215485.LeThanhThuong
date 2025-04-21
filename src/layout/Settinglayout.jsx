import React from 'react'
import { Box, Container, Grid } from '@mui/material'
import AppBar from '~/component/AppBar/AppBar'
import SideBar from '~/component/SideBar/SideBar'
import { Outlet } from 'react-router-dom'

function Settinglayout(props) {
  return (
    <Container disableGutters maxWidth={false}>
      <AppBar workspace={props.workspace}/>
      <Outlet />
    </Container>
  )
}

export default Settinglayout