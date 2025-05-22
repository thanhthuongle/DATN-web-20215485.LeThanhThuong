import React from 'react'
import Box from '@mui/material/Box'
import Avatar from '@mui/material/Avatar'
import RestaurantIcon from '@mui/icons-material/Restaurant'
import Typography from '@mui/material/Typography'
import { NumericFormat } from 'react-number-format'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import { Chip } from '@mui/material'

import { styled } from '@mui/material/styles'
import LinearProgress, { linearProgressClasses } from '@mui/material/LinearProgress'

const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
  height: 10,
  borderRadius: 5,
  [`&.${linearProgressClasses.colorPrimary}`]: {
    backgroundColor: theme.palette.grey[200],
    ...theme.applyStyles('dark', {
      backgroundColor: theme.palette.grey[800]
    })
  },
  [`& .${linearProgressClasses.bar}`]: {
    borderRadius: 5,
    backgroundColor: '#27ae60',
    ...theme.applyStyles('dark', {
      backgroundColor: '#219150'
    })
  }
}))

function MoneySourceItem2({ title, logo, logoSize='40px', targetAmount, accumulatedAmount, sx, menuComponent }) {
  return (
    <Box
      display='flex'
      width='100%'
      alignItems='center'
      padding={{ xs: 1, sm: 2 }}
      sx={sx}
      gap={1}
    >
      <Avatar
        component={'div'}
        alt="Logo"
        src={logo}
        sx={{
          bgcolor: 'yellow',
          width: logoSize,
          height: logoSize,
          flexShrink: 0
        }}
      >
        {' '}
      </ Avatar>

      <Box
        flex="1 1 0%"
        minWidth={0}
        alignSelf="center"
        maxWidth="100%"
        overflow="hidden"
      >
        <Box
          display='flex'
          justifyContent='space-between'
          alignItems='end'
          width='100%'
          marginBottom={0.5}
        >
          <Typography
            component={'div'}
            sx={{
              wordWrap: 'break-word',
              overflow: 'hidden',
              display: '-webkit-box',
              WebkitBoxOrient: 'vertical',
              marginRight: 1
            }}
          >
            {title}
            {(Number(accumulatedAmount) >= Number(targetAmount)) && <Chip variant="outlined" color="info" size="small" label="Hoàn thành"/>}
          </Typography>
          {targetAmount !== null && targetAmount !== undefined &&
          <NumericFormat
            displayType='text'
            thousandSeparator="."
            decimalSeparator=","
            allowNegative={false}
            suffix="&nbsp;₫"
            value={targetAmount}
            style={{ fontWeight: '', maxWidth: '100%' }}
          />}
        </Box>

        <Box marginBottom={0.25}>
          <BorderLinearProgress variant="determinate" value={Math.min(Number(accumulatedAmount/targetAmount*100), 100)} />
        </Box>

        <Box>
          {accumulatedAmount !== null && accumulatedAmount !== undefined &&
          <NumericFormat
            displayType='text'
            thousandSeparator="."
            decimalSeparator=","
            allowNegative={false}
            suffix="&nbsp;₫"
            value={accumulatedAmount}
            style={{ fontWeight: '', maxWidth: '100%', color: '#27AE60' }}
          />}
        </Box>
      </Box>

      {menuComponent}
    </ Box>
  )
}

export default MoneySourceItem2