import React from 'react'
import Box from '@mui/material/Box'
import Avatar from '@mui/material/Avatar'
import Typography from '@mui/material/Typography'
import { NumericFormat } from 'react-number-format'
import Chip from '@mui/material/Chip'

function MoneySourceItem1({ title, description, logo, logoSize='40px', amount, amountColor='text.primary', amountDesc, interestRate, sx, menuComponent }) {
  return (
    <Box
      display='flex'
      alignItems='center'
      width='100%'
      maxWidth={'100%'}
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
            bgcolor: '#f5f5f5',
            width: logoSize,
            height: logoSize,
            flexShrink: 0
          }}
        >
          {' '}
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
          {description &&
            <Typography
              variant='body2'
              sx={{
                opacity: 0.6,
                whiteSpace: 'normal',
                wordBreak: 'break-word'
              }}
            >
              {description}
            </Typography>
          }
        </Box>
      </Box>

      <Box
        display='flex'
        flexDirection='column'
        alignItems='end'
        maxWidth='30%'
      >
        {amount !== null && amount !== undefined &&
        <Typography variant='body1'>
          <NumericFormat
            displayType='text'
            thousandSeparator="."
            decimalSeparator=","
            allowNegative={true}
            suffix="&nbsp;₫"
            value={amount}
            style={{ fontWeight: '500', color: amountColor, maxWidth: '100%' }}
          />
        </Typography>
        }
        {amountDesc &&
          <Typography
            noWrap
            variant='body2'
            sx={{
              opacity: 0.6,
              whiteSpace: 'pre-line',
              wordBreak: 'break-word',
              textAlign: 'right'
            }}
          >{amountDesc}</Typography>}
      </Box>

      <Box>
        {menuComponent}
      </Box>
    </ Box>
  )
}

export default MoneySourceItem1
