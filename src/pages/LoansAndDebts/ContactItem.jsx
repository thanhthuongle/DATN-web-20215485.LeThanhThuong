import React from 'react'
import Box from '@mui/material/Box'
import Avatar from '@mui/material/Avatar'
import Typography from '@mui/material/Typography'
import { NumericFormat } from 'react-number-format'

const getInitials = (name = '') => {
  const words = name.trim().split(' ')
  if (words.length === 1) return words[0].charAt(0).toUpperCase()
  return (words[0][0] + words[words.length - 1][0]).toUpperCase()
}

function ContactItem({ contactName, amount, amountColor='text.primary', sx, menuComponent }) {
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
          alt="contactName"
          sx={{
            width: '40px',
            height: '40px',
            flexShrink: 0
          }}
        >
          {getInitials(contactName)}
        </ Avatar>

        <Box sx={{ minWidth: 0, flex: 1, marginRight: 2 }}>
          {contactName &&
          <Typography
            component={'div'}
          >
            {contactName}
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
        <NumericFormat
          displayType='text'
          thousandSeparator="."
          decimalSeparator=","
          allowNegative={true}
          suffix="&nbsp;₫"
          value={amount}
          style={{ fontWeight: '', color: amountColor, maxWidth: '100%' }}
        />
        }
      </Box>

      <Box>
        {menuComponent}
      </Box>
    </ Box>
  )
}

export default ContactItem
