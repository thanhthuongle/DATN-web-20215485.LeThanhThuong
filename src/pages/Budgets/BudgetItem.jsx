import React from 'react'
import Avatar from '@mui/material/Avatar'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { NumericFormat } from 'react-number-format'
import { styled } from '@mui/material/styles'
import LinearProgress, { linearProgressClasses } from '@mui/material/LinearProgress'

const BorderLinearProgress = styled(LinearProgress, {
  shouldForwardProp: (prop) => prop !== 'backgroundColorLight' && prop !== 'backgroundColorDark'
})(({ theme, backgroundColorLight, backgroundColorDark }) => ({
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
    backgroundColor: backgroundColorLight,
    ...theme.applyStyles('dark', {
      backgroundColor: backgroundColorDark
    })
  }
}))

function BudgetItem({ logo, logoSize='40px', title, totalBudget, totalExpense, sx }) {
  return (
    <Box width={'100%'} display={'flex'} gap={1} sx={sx} paddingY={2}>
      <Box width={'40px'} display={'flex'} flexDirection={'column'} alignItems={'end'}>
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
      </Box>

      <Box
        flex="1 1 0%"
        minWidth={0}
        display='flex'
        flexDirection={'column'}
        gap={1}
        // overflow="hidden"
      >
        <Box width={'100%'} display={'flex'}>
          {title &&
            <Typography
              component={'div'}
              flex={1}
              sx={{
                wordWrap: 'break-word',
                overflow: 'hidden',
                display: '-webkit-box',
                WebkitBoxOrient: 'vertical',
                marginRight: 1
              }}
            >{title}</Typography>}
          {totalBudget &&
            <NumericFormat
              displayType='text'
              thousandSeparator="."
              decimalSeparator=","
              allowNegative={false}
              suffix="&nbsp;₫"
              value={totalBudget}
            />}
        </Box>

        {totalBudget != null && totalExpense != null && totalBudget != undefined && totalExpense != undefined &&
        <>
          {Number(totalBudget) >= Number(totalExpense) &&
            <Box marginBottom={0.25}>
              <BorderLinearProgress variant="determinate" backgroundColorLight='#27ae60' backgroundColorDark='#219150' value={Number(totalExpense/totalBudget*100)} />
            </Box>
          }
          {Number(totalBudget) < Number(totalExpense) &&
            <Box marginBottom={0.25}>
              <BorderLinearProgress variant="determinate" backgroundColorLight='#e74c3c' backgroundColorDark='#e74c3c' value={100} />
            </Box>
          }
          <Box width={'100%'} display={'flex'} justifyContent={'end'}>
            {Number(totalBudget) >= Number(totalExpense) &&
              <Typography
                component={'div'}
                sx={{ opacity: 0.6, color: 'text.primary' }}
              >còn lại
                <NumericFormat
                  displayType='text'
                  thousandSeparator="."
                  decimalSeparator=","
                  allowNegative={false}
                  prefix=':&nbsp;'
                  suffix="&nbsp;₫"
                  value={totalBudget - totalExpense}
                />
              </Typography>
            }
            {Number(totalBudget) < Number(totalExpense) &&
              <Typography
                component={'div'}
                sx={{ color: '#e74c3c' }}
              >bội chi
                <NumericFormat
                  displayType='text'
                  thousandSeparator="."
                  decimalSeparator=","
                  allowNegative={false}
                  prefix=':&nbsp;'
                  suffix="&nbsp;₫"
                  value={totalExpense - totalBudget}
                />
              </Typography>
            }
          </Box>
        </>
        }
      </Box>
    </Box>
  )
}

export default BudgetItem
