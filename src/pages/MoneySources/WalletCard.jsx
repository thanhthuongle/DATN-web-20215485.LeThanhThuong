import React, { useEffect, useState } from 'react'
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
import { getBankInfo } from '~/apis'

function WalletCard({ data }) {
  // console.log('🚀 ~ WalletCard ~ data:', data)
  const [walletData, setWalletData] = useState(data)

  // Tách tài khoản bị khóa và chưa bị khóa
  const activeWallets = walletData.filter(w => !w.isBlock)
  const blockedWallets = walletData.filter(w => w.isBlock)

  // Tổng hợp tiền và số lượng
  const totalAmount = walletData.reduce((sum, w) => sum + w.balance, 0)
  const totalCount = walletData.length

  const activeAmount = activeWallets.reduce((sum, w) => sum + w.balance, 0)
  const blockedAmount = blockedWallets.reduce((sum, w) => sum + w.balance, 0)

  useEffect(() => {
    const fetchData = async () => {
      if (data && Array.isArray(data) && data.length > 0) {
        const updatedDatas = await Promise.all(
          data.map(async (d) => {
            if (d.bankId) {
              try {
                const bankInfo = await getBankInfo(d.bankId)
                return { ...d, bankInfo }
              } catch (error) {
                // eslint-disable-next-line no-console
                console.error(`Lỗi khi lấy thông tin bank ${d.bankId}`, error)
                return d
              }
            } else {
              return d
            }
          })
        )

        // Cập nhật state thay vì gán trực tiếp cho `data`
        setWalletData(updatedDatas)
      }
    }

    fetchData()
  }, [data])
  return (
    <StyledBox
      width='100%'
      minHeight='45vh'
      maxHeight={{ sm: '90vh' }}
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
        > TÀI KHOẢN </Typography>
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
            <Typography>Tổng số: {totalCount} tài khoản</Typography>
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
              <Typography component="span" fontWeight='bold'>Đang sử dụng {activeWallets.length} ví
                <NumericFormat
                  displayType='text'
                  thousandSeparator="."
                  decimalSeparator=","
                  allowNegative={true}
                  prefix=' ('
                  suffix="&nbsp;₫)"
                  value={activeAmount}
                  style={{ fontWeight: 'bold', maxWidth: '100%', color: totalAmount < 0 ? 'red' : 'inherit' }}
                />
              </Typography>
            </AccordionSummary>
            <AccordionDetails sx={{ padding: 0 }}>
              {/* Danh sách các ví đang sử dụng */}
              {activeWallets.length == 0 && (
                <Typography display={'flex'} justifyContent={'center'} alignItems={'center'} marginY={2}>Không có ví nào đang sử dụng!</Typography>
              )}
              {activeWallets.map((activeWallet, index) =>
                <MoneySourceItem1
                  title={activeWallet.accountName}
                  amount={activeWallet.balance}
                  amountColor= {activeWallet.balance < 0 ? 'red' : 'inherit'} // Xét nếu amount < 0 thì truyền #e74c3c
                  logo={activeWallet.bankInfo ? activeWallet.bankInfo.logo : ''}
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
              <Typography component="span" fontWeight='bold'>Đã khóa {blockedWallets.length} ví
                <NumericFormat
                  displayType='text'
                  thousandSeparator="."
                  decimalSeparator=","
                  allowNegative={false}
                  prefix=' ('
                  suffix="&nbsp;₫)"
                  value={blockedAmount}
                  style={{ fontWeight: 'bold', maxWidth: '100%', color: totalAmount < 0 ? 'red' : 'inherit' }}
                />
              </Typography>
            </AccordionSummary>
            <AccordionDetails sx={{ padding: 0 }}>
              {/* Danh sách các ví đã ngưng sử dụng */}
              {blockedWallets.length == 0 && (
                <Typography display={'flex'} justifyContent={'center'} alignItems={'center'} marginY={2}>Không có ví nào đã khóa!</Typography>
              )}
              {blockedWallets.map((blockedWallet, index) =>
                <MoneySourceItem1
                  isActive={false}
                  title={blockedWallet.accountName}
                  amount= {blockedWallet.balance}
                  amountColor= {blockedWallet.balance < 0 ? 'red' : 'inherit'} // Xét nếu amount < 0 thì truyền #e74c3c
                  logo={blockedWallet.bankInfo ? blockedWallet.bankInfo.logo : ''}
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