import React from 'react'
import Box from '@mui/material/Box'
import Avatar from '@mui/material/Avatar'
import RestaurantIcon from '@mui/icons-material/Restaurant'
import { Typography } from '@mui/material'
import { NumericFormat } from 'react-number-format'

function FinanceItem1({ title, description, logo, logoSize=40, amount, amountDesc, amountColor, sx }) {// TODO: Hoàn thiện logo khi hoàn thiện danh sách danh mục thu chi
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
            bgcolor: logo ? '' : 'yellow',
            width: logoSize,
            height: logoSize,
            flexShrink: 0
          }}
        >
          {' '}
          {/* <RestaurantIcon /> */}
        </ Avatar>

        <Box sx={{ minWidth: 0 }}>
          {title &&
          <Typography
            sx={{
              display: '-webkit-box',
              WebkitLineClamp: 3,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              textOverflow: 'ellipsis'
            }}
          >
            {title}
          </Typography>
          }
          {description &&
            <Typography
              variant='body2'
              sx={{
                opacity: 0.6,
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }}
            >{description}
            </Typography>
          }
        </Box>
      </Box>

      <Box
        display='flex'
        flexDirection='column'
        alignItems='end'
        maxWidth={'70%'}
      >
        {amount !== null && amount !== undefined && (
          <NumericFormat
            displayType="text"
            thousandSeparator="."
            decimalSeparator=","
            allowNegative={true}
            suffix=" ₫"
            value={amount}
            style={{ fontWeight: '', color: amountColor, maxWidth: '100%' }}
          />
        )}
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
    </Box>
  )
}

export default FinanceItem1