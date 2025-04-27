import React from 'react'
import Box from '@mui/material/Box'
import { StyledBox } from '../Overview/Overview'
import Divider from '@mui/material/Divider'
import Typography from '@mui/material/Typography'
import Accordion from '@mui/material/Accordion'
import AccordionSummary from '@mui/material/AccordionSummary'
import AccordionDetails from '@mui/material/AccordionDetails'
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown'
import { NumericFormat } from 'react-number-format'
import MoneySourceItem1 from './MoneySourceItem/MoneySourceItem1'
import WalletMenu from './MoneySourceItem/WalletMenu'

function WalletCard() {
  return (
    <StyledBox
      width='100%'
      minHeight='45vh'
      maxHeight={{sm: '90vh'}}
      display={{ lg: 'flex' }}
      style={{ padding: 0 }}
      overflow= 'hidden'
    >
      {/* Tiêu đề: Ví tiền */}
      <Box width={{ lg: '10%' }} >
        <Typography
          variant='h6'
          fontWeight='bold'
          display='flex'
          height='100%'
          justifyContent='center'
          alignItems='center'
          bgcolor='#22cfcf'
        > VÍ TIỀN </Typography>
      </Box>

      {/* Nội dung tổng quan ví tiền */}
      <Box
        width={{ lg: '90%' }}
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
            <Typography>Tổng số: n ví</Typography>
          </Box>
          <Divider width='80%' sx={{ mx: 'auto', marginTop: 1 }}/>
        </Box>

        <Box>
          {/* Các ví đang sử dụng */}
          <Accordion >
            <AccordionSummary
              expandIcon={<ArrowDropDownIcon />}
              aria-controls="activeWallet-content"
              id="activeWallet-header"
              sx={{ bgcolor: (theme) => theme.palette.mode == 'dark' ? '#7cf5afb3' : '#7cf5af' }}
            >
              <Typography component="span" fontWeight='bold'>Đang sử dụng n1 ví
                <NumericFormat
                  displayType='text'
                  thousandSeparator="."
                  decimalSeparator=","
                  allowNegative={false}
                  prefix=' ('
                  suffix="&nbsp;₫)"
                  value={123456}
                  style={{ fontWeight: 'bold', maxWidth: '100%' }}
                />
              </Typography>
            </AccordionSummary>
            <AccordionDetails sx={{ padding: 0 }}>
              {/* Danh sách các ví đang sử dụng */}
              {Array.from({ length: 5 }).map((_, index) =>
                <MoneySourceItem1
                  title={`Tên ví số ${index}`}
                  amount={'12345678'}
                  // amountColor='' // Xét nếu amount < 0 thì truyền #e74c3c
                  key={index}
                  sx={{
                    borderTop: 1,
                    borderColor: (theme) => theme.palette.mode === 'light' ? '#ccc' : '#666'
                  }}
                  menuComponent={<WalletMenu isActive={true} sx={{ marginLeft: 2 }} />}
                />)}
            </AccordionDetails>
          </Accordion>

          {/* Các ví đã ngưng sử dụng */}
          <Accordion>
            <AccordionSummary
              expandIcon={<ArrowDropDownIcon />}
              aria-controls="inActiveWallet-content"
              id="inActiveWallet-header"
              sx={{ bgcolor: (theme) => theme.palette.mode == 'dark' ? '#FF6E4A' : '#FF3300' }}
            >
              <Typography component="span" fontWeight='bold'>Đã khóa n2 ví
                <NumericFormat
                  displayType='text'
                  thousandSeparator="."
                  decimalSeparator=","
                  allowNegative={false}
                  prefix=' ('
                  suffix="&nbsp;₫)"
                  value={123456}
                  style={{ fontWeight: 'bold', maxWidth: '100%' }}
                />
              </Typography>
            </AccordionSummary>
            <AccordionDetails sx={{ padding: 0 }}>
              {/* Danh sách các ví đã ngưng sử dụng */}
              {Array.from({ length: 5 }).map((_, index) =>
                <MoneySourceItem1
                  isActive={false}
                  title={`Tên ví số ${index}`}
                  amount={'1234567'}
                  // amountColor='' // Xét nếu amount < 0 thì truyền #e74c3c
                  key={index}
                  sx={{
                    borderTop: 1,
                    borderColor: (theme) => theme.palette.mode === 'light' ? '#ccc' : '#666'
                  }}
                  menuComponent={<WalletMenu isActive={false} sx={{ marginLeft: 2 }} />}
                />)}
            </AccordionDetails>
          </Accordion>
        </Box>
      </Box>
    </StyledBox>
  )
}

export default WalletCard