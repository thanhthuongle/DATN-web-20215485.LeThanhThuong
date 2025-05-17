import React from 'react'
import { StyledBox } from '../Overview/Overview'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Divider from '@mui/material/Divider'
import Accordion from '@mui/material/Accordion'
import AccordionSummary from '@mui/material/AccordionSummary'
import AccordionDetails from '@mui/material/AccordionDetails'
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown'
import { NumericFormat } from 'react-number-format'
import MoneySourceItem2 from './MoneySourceItem/MoneySourceItem2'
import AccumulateMenu from './MoneySourceItem/Accumulatemenu'

function AccumulateCard({ data }) {
  // console.log('🚀 ~ AccumulateCard ~ data:', data)
  const accumulateData = data

  const activeAccumulateData = accumulateData.filter(item => !item.isFinished)
  const finishedAccumulateData = accumulateData.filter(item => item.isFinished)

  const totalAmount = accumulateData.reduce((sum, item) => sum + item.balance, 0)
  const totalCount = accumulateData.length

  const activeAmount = activeAccumulateData.reduce((sum, item) => sum + item.balance, 0)
  const finishedAmount = finishedAccumulateData.reduce((sum, item) => sum + item.balance, 0)
  return (
    <StyledBox
      width='100%'
      minHeight='45vh'
      maxHeight='90vh'
      display={{ lg: 'flex' }}
      style={{ padding: 0 }}
      overflow= 'hidden'
    >
      {/* TIêu đề: Tích lũy */}
      <Box width={{ lg: '10%' }} >
        <Typography
          variant='h6'
          fontWeight='bold'
          display='flex'
          flexDirection="column"
          height='100%'
          justifyContent='center'
          alignItems='center'
          bgcolor='#ea008c'
          textAlign="center"
        >TÍCH LŨY</Typography>
      </Box>

      {/* Nội dung tổng quan Tích lũy */}
      <Box
        width={{ xs: '100%', lg: '90%' }}
        maxHeight='100%'
        overflow= 'auto'
        display='flex'
        flexDirection='column'
        paddingX={{ md: 2 }}
        paddingY={2}
        gap={2}
      >
        <Box>
          <Box display='flex' justifyContent='space-around'>
            <Typography>Tổng tiền:&nbsp;(&nbsp;
              <NumericFormat
                displayType='text'
                thousandSeparator="."
                decimalSeparator=","
                allowNegative={true}
                suffix="&nbsp;₫"
                value={totalAmount}
                style={{ fontWeight: 'bold', maxWidth: '100%', color: totalAmount < 0 ? 'red' : 'inherit' }}
              />&nbsp;)
            </Typography>
            <Typography>Tổng số: {totalCount} tích lũy</Typography>
          </Box>
          <Divider width='80%' sx={{ mx: 'auto', marginTop: 1 }}/>
        </Box>

        <Box>
          {/* Các tích lũy đang theo dõi */}
          <Accordion >
            <AccordionSummary
              expandIcon={<ArrowDropDownIcon />}
              aria-controls="activeWallet-content"
              id="activeWallet-header"
              sx={{ bgcolor: (theme) => theme.palette.mode == 'dark' ? '#7cf5afb3' : '#7cf5af' }}
            >
              <Typography component="span" fontWeight='bold'>Đang theo dõi
                <NumericFormat
                  displayType='text'
                  thousandSeparator="."
                  decimalSeparator=","
                  allowNegative={false}
                  prefix=' ('
                  suffix="&nbsp;₫)"
                  value={activeAmount}
                  style={{ fontWeight: 'bold', maxWidth: '100%' }}
                />
              </Typography>
            </AccordionSummary>
            <AccordionDetails sx={{ padding: 0 }}>
              {/* Danh sách các tích lũy đang theo dõi */}
              {activeAccumulateData?.length == 0 && (
                <Typography display={'flex'} justifyContent={'center'} alignItems={'center'} marginY={2}>Không có khoản tích lũy nào đang the dõi!</Typography>
              )}
              {activeAccumulateData.map((accummulation) =>
                <MoneySourceItem2
                  key={accummulation._id}
                  title={accummulation.accumulationName}
                  targetAmount={accummulation.targetBalance}
                  accumulatedAmount={accummulation.balance}
                  menuComponent={<AccumulateMenu isFinished={false} />}
                  sx={{
                    borderTop: 1,
                    borderColor: (theme) => theme.palette.mode === 'light' ? '#ccc' : '#666'
                  }}
                />
              )}
            </AccordionDetails>
          </Accordion>

          {/* Các tích lũy đã kết thúc */}
          <Accordion sx={{ width: '100%' }}>
            <AccordionSummary
              expandIcon={<ArrowDropDownIcon />}
              aria-controls="inActiveWallet-content"
              id="inActiveWallet-header"
              sx={{ width: '100%', bgcolor: (theme) => theme.palette.mode == 'dark' ? '#FF6E4A' : '#FF3300' }}
            >
              <Typography component="span" fontWeight='bold'>Đã kết thúc
                <NumericFormat
                  displayType='text'
                  thousandSeparator="."
                  decimalSeparator=","
                  allowNegative={false}
                  prefix=' ('
                  suffix="&nbsp;₫)"
                  value={finishedAmount}
                  style={{ fontWeight: 'bold', maxWidth: '100%' }}
                />
              </Typography>
            </AccordionSummary>
            <AccordionDetails sx={{ padding: 0, width: '100%' }}>
              {/* Danh sách các tích lũy đã kết thúc */}
              {finishedAccumulateData?.length == 0 && (
                <Typography display={'flex'} justifyContent={'center'} alignItems={'center'} marginY={2}>Chưa có khoản tích lũy nào kết thúc!</Typography>
              )}
              {finishedAccumulateData.map((accumulation) =>
                <MoneySourceItem2
                  key={accumulation._id}
                  title={accumulation.accummulationName}
                  targetAmount={accumulation.targetBalance}
                  accumulatedAmount={accumulation.balance}
                  menuComponent={<AccumulateMenu isFinished={true} />}
                  sx={{
                    borderTop: 1,
                    borderColor: (theme) => theme.palette.mode === 'light' ? '#ccc' : '#666',
                    opacity: '50%'
                  }}
                />)}
            </AccordionDetails>
          </Accordion>
        </Box>
      </Box>
    </StyledBox>
  )
}

export default AccumulateCard