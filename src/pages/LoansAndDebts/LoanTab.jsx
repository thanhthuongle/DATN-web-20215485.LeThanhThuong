import React from 'react'
import Box from '@mui/material/Box'
import { Button, Typography } from '@mui/material'
import { StyledBox } from '../Overview/Overview'
import { NumericFormat } from 'react-number-format'
import { styled } from '@mui/material/styles'
import LinearProgress, { linearProgressClasses } from '@mui/material/LinearProgress'
import Accordion from '@mui/material/Accordion'
import AccordionSummary from '@mui/material/AccordionSummary'
import AccordionDetails from '@mui/material/AccordionDetails'
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown'
import MoneySourceItem1 from '../MoneySources/MoneySourceItem/MoneySourceItem1'
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight'

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

function LoanTab({ totalLoan, collected, transactiosGrouped }) {
  return (
    <Box
      width={'100%'}
      display={'flex'}
      flexDirection={'column'}
      justifyContent={'center'}
      gap={2}
    >

      {/* Tổng quan */}
      <StyledBox display={'flex'} flexDirection={'column'} gap={1}>
        <Typography
          component={'div'}
        > Cần thu:
          <NumericFormat
            displayType='text'
            thousandSeparator="."
            decimalSeparator=","
            allowNegative={false}
            prefix="&nbsp;"
            suffix="&nbsp;₫"
            value={Math.max(Number(totalLoan) - Number(collected), 0)}
            // value={123456}
            style={{ color: '#e74c3c' }}
          />
        </Typography>
        <Box width={'100%'} display={'flex'} justifyContent={'space-between'}>
          <Typography
            component={'div'}
          > Đã thu <br />
            <NumericFormat
              displayType='text'
              thousandSeparator="."
              decimalSeparator=","
              allowNegative={false}
              suffix="&nbsp;₫"
              value={Number(collected)}
              // value={123456}
              style={{ color: '#05bb51' }}
            />
          </Typography>
          <Typography
            component={'div'}
            display={'flex'}
            flexDirection={'column'}
            alignItems={'end'}
          > Tổng cho vay <br />
            <NumericFormat
              displayType='text'
              thousandSeparator="."
              decimalSeparator=","
              allowNegative={false}
              suffix="&nbsp;₫"
              value={Number(totalLoan)}
              // value={6324243}
            />
          </Typography>
        </Box>
        <Box marginBottom={0.25}>
          <BorderLinearProgress variant="determinate" value={collected/totalLoan*100} />
        </Box>
      </StyledBox>

      <Box>
        {/* Đang theo dõi */}
        <Accordion sx={{ mb: 1 }}>
          <AccordionSummary
            expandIcon={<ArrowDropDownIcon />}
            aria-controls="followingLoan-content"
            id="followingLoan-header"
            sx={{ bgcolor: (theme) => theme.palette.mode == 'dark' ? '#7cf5afb3' : '#7cf5af' }}
          >
            <Typography component="span" fontWeight='bold'>Đang theo dõi</Typography>
          </AccordionSummary>
          <AccordionDetails sx={{ padding: 0 }}>
            {/* Danh sách các liên hệ đang theo dõi*/}
            {(transactiosGrouped.some(item => Number(item.totalAmount) > 0))
              ? (
                transactiosGrouped.filter(item => Number(item.totalAmount) > 0).map((item) =>
                  <MoneySourceItem1
                    key={item.borrowerId}
                    title={item.transactions[0].detailInfo.borrower.name}
                    amount={item.totalAmount}
                    amountColor='#e74c3c'
                    sx={{
                      borderTop: 1,
                      borderColor: (theme) => theme.palette.mode === 'light' ? '#ccc' : '#666'
                    }}
                    menuComponent={<Button variant='contained' sx={{ marginLeft: 2 }}>Thu nợ</Button>}
                  />
                )
              )
              : (
                <Box display={'flex'} justifyContent={'center'} alignItems={'center'} paddingY={3}>
                  <Typography>Không có khoản cho vay đang theo dõi!</Typography>
                </Box>
              )
            }
          </AccordionDetails>
        </Accordion>

        {/* Đã hoàn thành */}
        <Accordion>
          <AccordionSummary
            expandIcon={<ArrowDropDownIcon />}
            aria-controls="finishedLoan-content"
            id="finishedLoan-header"
            sx={{ bgcolor: (theme) => theme.palette.mode == 'dark' ? '#FF6E4A' : '#FF3300' }}
          >
            <Typography component="span" fontWeight='bold'>Đã hoàn thành</Typography>
          </AccordionSummary>
          <AccordionDetails sx={{ padding: 0 }}>
            {/* Danh sách các liên hệ đã hoàn thành */}
            {(transactiosGrouped.some(item => Number(item.totalAmount) == 0))
              ? (
                transactiosGrouped.filter(item => Number(item.totalAmount) == 0).map((item) =>
                  <MoneySourceItem1
                    key={item.borrowerId}
                    title={item.transactions[0].detailInfo.borrower.name}
                    sx={{
                      borderTop: 1,
                      borderColor: (theme) => theme.palette.mode === 'light' ? '#ccc' : '#666'
                    }}
                    menuComponent={<KeyboardArrowRightIcon />}
                  />
                )
              )
              : (
                <Box display={'flex'} justifyContent={'center'} alignItems={'center'} paddingY={3}>
                  <Typography>Không có khoản cho vay đã hoàn thành!</Typography>
                </Box>
              )
            }
          </AccordionDetails>
        </Accordion>
      </Box>

    </Box>
  )
}

export default LoanTab