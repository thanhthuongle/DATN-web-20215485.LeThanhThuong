import React from 'react'
import Box from '@mui/material/Box'
import Avatar from '@mui/material/Avatar'
import RestaurantIcon from '@mui/icons-material/Restaurant'
import Typography from '@mui/material/Typography'
import { NumericFormat } from 'react-number-format'
import Chip from '@mui/material/Chip'

function MoneySourceItem1({ title, description, logo, logoSize='40px', amount, amountColor='text.primary', amountDesc, interestRate, sx, menuComponent }) {
  return (
    <Box
      display='flex'
      alignItems='center'
      width='100%'
      justifyContent='space-between'
      padding={{ xs: 1, sm: 2 }}
      sx={sx}
    >
      <Box
        display='flex'
        alignItems='center'
        gap={1}
        flex={1}
      >
        <Avatar
          alt="Logo"
          src={logo}
          sx={{
            bgcolor: 'yellow',
            width: logoSize,
            height: logoSize,
            flexShrink: 0
          }}
        >
          <RestaurantIcon /> {/* TODO: hoàn thiện logo mặc định */}
        </ Avatar>

        <Box sx={{ minWidth: 0, flex: 1, marginRight: 2 }}>
          {title &&
          <Typography
            component={'div'}
          >
            {title}
            {interestRate && <Chip variant="outlined" color="info" size="small" sx={{ height: 1, marginLeft: '4px' }} label={interestRate} />}
          </Typography>
          }
          {description && <Typography variant='body2' sx={{ opacity: 0.6 }}>{description}</Typography>}
        </Box>
      </Box>

      <Box
        display='flex'
        flexDirection='column'
        alignItems='end'
        maxWidth='40%'
      >
        {amount &&
        <NumericFormat
          displayType='text'
          thousandSeparator="."
          decimalSeparator=","
          allowNegative={false}
          suffix="&nbsp;₫"
          value={amount}
          style={{ fontWeight: '', color: amountColor, maxWidth: '100%' }}
        />
        }
        {amountDesc &&
          <Typography
            noWrap
            variant='body2'
            sx={{
              opacity: 0.6,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              maxWidth: '100%'
            }}
          >{amountDesc}</Typography>}
      </Box>

      {menuComponent}
    </ Box>
  )
}

export default MoneySourceItem1