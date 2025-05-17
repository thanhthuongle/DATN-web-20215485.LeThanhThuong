import React, { useEffect, useState } from 'react'
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
import { getBankInfo } from '~/apis'
import { cloneDeep } from 'lodash'
import moment from 'moment'

function SavingCard({ data = [] }) {
  // const [savingData, setSavingData] = useState(data)
  const savingData = cloneDeep(data)
  const [groupeActivedSavings, setGroupedActiveSavings] = useState([])
  const [blockedDataSavings, setBlockedDataSavings] = useState([])

  const blockedSavings = savingData.filter(s => s.isClosed)
  const activeSavings = savingData.filter(s => !s.isClosed)

  // Tổng hợp tiền và số lượng
  const totalAmount = savingData.reduce((sum, s) => sum + s.balance, 0)
  const totalCount = savingData.length

  const fetchBankInfo = async (dataProp) => {
    const updatedDatas = await Promise.all(
      dataProp.map(async (item) => {
        if (item.bankId) {
          try {
            const bankInfo = await getBankInfo(item.bankId)
            return { ...item, bankInfo }
          } catch (error) {
            // eslint-disable-next-line no-console
            console.error(`Lỗi khi lấy thông tin bank ${item.bankId}`, error)
            return item
          }
        } else {
          return item
        }
      })
    )
    return updatedDatas
  }

  useEffect(() => {
    const grouped = Object.entries(
      activeSavings.reduce((acc, item) => {
        const bankId = item.bankId
        if (!acc[bankId]) {
          acc[bankId] = []
        }
        acc[bankId].push(item)
        return acc
      }, {})
    ).map(([bankId, savings_accounts]) => {
      const totalBalance = savings_accounts.reduce((sum, item) => sum + item.balance, 0)
      return {
        bankId,
        savings_accounts,
        totalBalance
      }
    })

    const fetchData = async () => {
      const groupedActiveSavingsData = await fetchBankInfo(grouped)
      const blockedDataSavingsData = await fetchBankInfo(blockedSavings)
      setGroupedActiveSavings(groupedActiveSavingsData)
      setBlockedDataSavings(blockedDataSavingsData)
    }


    fetchData()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data])

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
            <Typography>Tổng số: {totalCount} sổ</Typography>
          </Box>
          <Divider width='80%' sx={{ mx: 'auto', marginTop: 1 }}/>
        </Box>

        <Box>
          {/* Các khoản tiết kiệm đang theo dõi */}
          {groupeActivedSavings && Array.isArray(groupeActivedSavings) && groupeActivedSavings.length > 0 &&(
            groupeActivedSavings.map((groupeActivedSaving) =>
              <Accordion key={groupeActivedSaving.bankId}>
                <AccordionSummary
                  expandIcon={<ArrowDropDownIcon />}
                  aria-controls="activeWallet-content"
                  id="activeWallet-header"
                  sx={{ bgcolor: (theme) => theme.palette.mode == 'dark' ? '#7cf5afb3' : '#7cf5af' }}
                >
                  <Typography component="span" fontWeight='bold'>{groupeActivedSaving.bankInfo.name}
                    <NumericFormat
                      displayType='text'
                      thousandSeparator="."
                      decimalSeparator=","
                      allowNegative={false}
                      prefix=' ('
                      suffix="&nbsp;₫)"
                      value={groupeActivedSaving.totalBalance}
                      style={{ fontWeight: 'bold', maxWidth: '100%' }}
                    />
                  </Typography>
                </AccordionSummary>
                <AccordionDetails sx={{ padding: 0 }}>
                  {/* Danh sách các ví đang sử dụng */}
                  {groupeActivedSaving.savings_accounts.map((saving) =>
                    <MoneySourceItem1
                      logo={groupeActivedSaving.bankInfo.logo ? groupeActivedSaving.bankInfo.logo : '' }
                      title={saving.savingsAccountName}
                      description={moment(saving.startDate).format('DD/MM/YYYY')}
                      amount={saving.balance}
                      interestRate={`${saving.rate}%`}
                      key={saving._id}
                      sx={{
                        borderTop: 1,
                        borderColor: (theme) => theme.palette.mode === 'light' ? '#ccc' : '#666'
                      }}
                      menuComponent={<SavingMenu isClosed={false} sx={{ marginLeft: 2 }}/>}
                    />
                  )}
                </AccordionDetails>
              </Accordion>
            )
          )}

          {/* Các khoản tiết kiệm đã tất toán */}
          <Accordion sx={{ width: '100%' }}>
            <AccordionSummary
              expandIcon={<ArrowDropDownIcon />}
              aria-controls="inActiveWallet-content"
              id="inActiveWallet-header"
              sx={{ width: '100%', bgcolor: (theme) => theme.palette.mode == 'dark' ? '#FF6E4A' : '#FF3300' }}
            >
              <Typography component="span" fontWeight='bold'>Đã tất toán ({blockedDataSavings.length} sổ)
              </Typography>
            </AccordionSummary>
            <AccordionDetails sx={{ padding: 0, width: '100%' }}>
              {/* Danh sách các ví đã ngưng sử dụng */}
              {blockedDataSavings.length == 0 && (
                <Typography display={'flex'} justifyContent={'center'} alignItems={'center'} marginY={2}>Chưa có sổ tiết kiệm đã tất toán!</Typography>
              )}
              {blockedDataSavings.map((saving) =>
                <MoneySourceItem1
                  logo={saving.bankInfo.logo ? saving.bankInfo.logo : '' }
                  key={saving._id}
                  title={saving.savingsAccountName}
                  description={moment(saving.startDate).format('DD/MM/YYYY')}
                  interestRate={`${saving.rate}%`}
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