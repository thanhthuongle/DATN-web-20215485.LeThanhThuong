import { Box, Typography } from '@mui/material'
import React from 'react'

function Footer() {
  return (
    <Box
      display={'flex'}
      alignItems={'center'}
      justifyContent={'center'}
      sx={{
        paddingX: 2,
        paddingY: 2,
        bgcolor: (theme) => theme.palette.mode == 'light' ? '#f5f5f5' : '#1c1c1c'
      }}
    >
      <Typography variant="body2" color="textSecondary">
        © 2025 HeyMoney. All rights reserved. Developed by{' '}
        <Box component="span" sx={{ color: '#03a678', fontWeight: 500 }}>
          Lê Thanh Thương 20215485
        </Box>
      </Typography>
    </Box>
  )
}

export default Footer
