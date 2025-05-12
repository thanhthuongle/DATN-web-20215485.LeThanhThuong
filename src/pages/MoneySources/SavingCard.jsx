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
import MoneySourceItem1 from './MoneySourceItem/MoneySourceItem1'
import SavingMenu from './MoneySourceItem/SavingMenu'

function SavingCard() {
  return (
    <StyledBox
      width='100%'
      minHeight='45vh'
      maxHeight='90vh'
      display={{ lg: 'flex' }}
      style={{ padding: 0 }}
      overflow= 'hidden'
    >
      {/* TIêu đề: Sổ tiết kiệm */}
      <Box width={{ lg: '10%' }} >
        <Typography
          variant='h6'
          fontWeight='bold'
          display='flex'
          flexDirection="column"
          height='100%'
          justifyContent='center'
          alignItems='center'
          bgcolor='#2e8b57'
          textAlign="center"
        >SỔ<br/>TIẾT KIỆM ONLINE</Typography>
      </Box>

      {/* Nội dung tổng quan sổ tiết kiệm */}
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
            <Typography>Tổng tiền: 123456 đ</Typography>
            <Typography>Tổng số: n sổ</Typography>
          </Box>
          <Divider width='80%' sx={{ mx: 'auto', marginTop: 1 }}/>
        </Box>

        <Box>
          {/* Các khoản tiết kiệm đang theo dõi */}
          <Accordion >
            <AccordionSummary
              expandIcon={<ArrowDropDownIcon />}
              aria-controls="activeWallet-content"
              id="activeWallet-header"
              sx={{ bgcolor: (theme) => theme.palette.mode == 'dark' ? '#7cf5afb3' : '#7cf5af' }}
            >
              <Typography component="span" fontWeight='bold'>Tên ngân hàng gửi tiết kiệm
                <NumericFormat
                  displayType='text'
                  thousandSeparator="."
                  decimalSeparator=","
                  allowNegative={false}
                  prefix=' ('
                  suffix="&nbsp;₫)"
                  value={12345678}
                  style={{ fontWeight: 'bold', maxWidth: '100%' }}
                />
              </Typography>
            </AccordionSummary>
            <AccordionDetails sx={{ padding: 0 }}>
              {/* Danh sách các ví đang sử dụng */}
              {Array.from({ length: 2 }).map((_, index) =>
                <MoneySourceItem1
                  isActive={true}
                  title={`Tên khoản tiết kiệm số ${index}`}
                  description={'dd/mm/yy'}
                  amount={'12345678'}
                  interestRate={'7%'}
                  key={index}
                  sx={{
                    borderTop: 1,
                    borderColor: (theme) => theme.palette.mode === 'light' ? '#ccc' : '#666'
                  }}
                  menuComponent={<SavingMenu isClosed={false} sx={{ marginLeft: 2 }}/>}
                />)}
            </AccordionDetails>
          </Accordion>

          <Accordion >
            <AccordionSummary
              expandIcon={<ArrowDropDownIcon />}
              aria-controls="activeWallet-content"
              id="activeWallet-header"
              sx={{ bgcolor: (theme) => theme.palette.mode == 'dark' ? '#7cf5afb3' : '#7cf5af' }}
            >
              <Typography component="span" fontWeight='bold'>Tên ngân hàng gửi tiết kiệm
                <NumericFormat
                  displayType='text'
                  thousandSeparator="."
                  decimalSeparator=","
                  allowNegative={false}
                  prefix=' ('
                  suffix="&nbsp;₫)"
                  value={12345678}
                  style={{ fontWeight: 'bold', maxWidth: '100%' }}
                />
              </Typography>
            </AccordionSummary>
            <AccordionDetails sx={{ padding: 0 }}>
              {/* Danh sách các ví đang sử dụng */}
              {Array.from({ length: 5 }).map((_, index) =>
                <MoneySourceItem1
                  isActive={true}
                  title={`Tên khoản tiết kiệm số ${index}`}
                  description={'dd/mm/yy'}
                  amount={'12345678'}
                  interestRate={'6%'}
                  key={index}
                  sx={{
                    borderTop: 1,
                    borderColor: (theme) => theme.palette.mode === 'light' ? '#ccc' : '#666'
                  }}
                  menuComponent={<SavingMenu isClosed={false} sx={{ marginLeft: 2 }}/>}
                />)}
            </AccordionDetails>
          </Accordion>

          {/* Các khoản tiết kiệm đã tất toán */}
          <Accordion sx={{ width: '100%' }}>
            <AccordionSummary
              expandIcon={<ArrowDropDownIcon />}
              aria-controls="inActiveWallet-content"
              id="inActiveWallet-header"
              sx={{width: '100%', bgcolor: (theme) => theme.palette.mode == 'dark' ? '#FF6E4A' : '#FF3300' }}
            >
              <Typography component="span" fontWeight='bold'>Đã tất toán (n sổ)
              </Typography>
            </AccordionSummary>
            <AccordionDetails sx={{ padding: 0, width: '100%' }}>
              {/* Danh sách các ví đã ngưng sử dụng */}
              {Array.from({ length: 3 }).map((_, index) =>
                <MoneySourceItem1
                  key={index}
                  title={`Tên khoản tiết kiệm đã tất toán số ${index}`}
                  description={'dd/mm/yy'}
                  interestRate={'5%'}
                  sx={{
                    borderTop: 1,
                    borderColor: (theme) => theme.palette.mode === 'light' ? '#ccc' : '#666'
                  }}
                  menuComponent={<SavingMenu isClosed={true} sx={{ marginLeft: 2 }}/>}
                />)}
            </AccordionDetails>
          </Accordion>
        </Box>
      </Box>
    </StyledBox>
  )
}

export default SavingCard