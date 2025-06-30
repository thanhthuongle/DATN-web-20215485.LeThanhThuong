import { Box, Button, Divider, Modal, Typography } from '@mui/material'
import moment from 'moment'
import React, { useEffect, useState } from 'react'
import { NumericFormat } from 'react-number-format'
import MoneySourceItem1 from '~/pages/MoneySources/MoneySourceItem/MoneySourceItem1'
import { StyledBox } from '~/pages/Overview/Overview'
import { TRANSACTION_TYPES } from '~/utils/constants'
import CollectionPopup from './CollectionPopup'

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: { xs: '100%', sm: 900 },
  maxHeight: '80vh',
  overflowY: 'auto',
  bgcolor: 'background.paper',
  // border: '2px solid #000',
  boxShadow: 24,
  p: 2
}

function processDataRaw(transactions) {
  const result = {
    byDate: {}
  }

  transactions.forEach((transaction) => {
    const dateKey = moment(transaction.transactionTime).format('YYYY-MM-DD')
    if (!result.byDate[dateKey]) { result.byDate[dateKey] = [] }
    result.byDate[dateKey].push(transaction)

  })

  const groupedByDate = Object.entries(result.byDate).map(([date, transactions]) => ({
    transactionTime: moment(date).toISOString(),
    transactions
  }))


  return {
    groupedByDate
  }
}

function ContactLoanList({ contactLoanData, handleCancel, handleOnCollect }) {
  // console.log('🚀 ~ ContactLoanList ~ contactLoanData:', contactLoanData)
  const [transactionProcessedDatas, setTransactionProcessedDatas] = useState(null)
  const [openModal, setOpenModal] = useState(false)
  const [selectedTransaction, setSelectedTransaction] = useState(null)

  const handleOpenModal = (transaction) => {
    setSelectedTransaction(transaction)
    setOpenModal(true)
  }

  useEffect(() => {
    const processedData = processDataRaw(contactLoanData.transactions)
    setTransactionProcessedDatas(processedData)
  }, [contactLoanData])
  return (
    <Box>
      <Box display={'flex'} flexDirection={'column'} gap={2}>
        {/* Tên người vay */}
        <Box bgcolor={'#00aff0'} paddingY={2} display={'flex'} justifyContent={'center'}>
          <Typography fontWeight={'bold'}>{contactLoanData?.borrower?.name}</Typography>
        </Box>

        {/* Thông tin cơ bản */}
        <StyledBox display={'flex'} justifyContent={'space-evenly'}>
          <Box display={'flex'} flexDirection={'column'} justifyContent={'center'} alignItems={'center'}>
            <Typography sx={{ fontWeight: 'bold' }}>Tổng cho vay</Typography>
            <NumericFormat
              displayType='text'
              thousandSeparator="."
              decimalSeparator=","
              allowNegative={false}
              suffix="&nbsp;₫"
              value={contactLoanData?.totalAmount}
              style={{ color: '#e74c3c', fontWeight: 'bold' }} // #e74c3c
            />
          </Box>
          <Divider orientation="vertical" variant="fullWidth" flexItem />
          <Box display={'flex'} flexDirection={'column'} justifyContent={'center'} alignItems={'center'}>
            <Typography sx={{ fontWeight: 'bold' }}>Đã thu</Typography>
            <NumericFormat
              displayType='text'
              thousandSeparator="."
              decimalSeparator=","
              allowNegative={false}
              suffix="&nbsp;₫"
              value={contactLoanData?.totalReturn}
              style={{ color: '#27ae60', fontWeight: 'bold' }} // #27ae60
            />
          </Box>
        </StyledBox>

        {/* Lịch sử giao dịch */}
        <Box>
          <Typography variant='h6' sx={{ marginY: 1, fontWeight: 'bold' }}>Lịch sử giao dịch</Typography>
          <Box display={'flex'} flexDirection={'column'} gap={1}>
            {transactionProcessedDatas?.groupedByDate?.map((transactionData, index) => (
              <StyledBox key={index}>
                <Typography fontWeight={'bold'}>{moment(transactionData?.transactionTime).format('dddd, LL')}</Typography>
                {transactionData?.transactions?.map((transaction) => {
                  const amountDescription1 = (transaction.detailInfo.collectTime) ? `Ngày thu dự kiến: ${moment(transaction.detailInfo.collectTime).format('DD/MM/YYYY')}\n` : ''
                  const amountDescription2 = transaction?.isFinish == true ? `Ngày thu thực tế: ${moment(transaction?.collectionTransaction?.transactionTime).format('DD/MM/YYYY')}` : ''
                  return (
                    <Box
                      key={transaction._id}
                      // onClick={() => handleOpenModal(transaction)}
                    >
                      <MoneySourceItem1
                        // key={transaction._id}
                        logo={transaction?.category?.icon}
                        title={transaction?.name}
                        description={transaction.description}
                        amount={transaction?.amount}
                        interestRate={(transaction?.detailInfo?.rate != null && transaction?.detailInfo?.rate != undefined) ? `${transaction?.detailInfo?.rate}%` : ''}
                        amountColor={(transaction?.type == TRANSACTION_TYPES.LOAN) ? '#e74c3c' : '#27ae60'} // #27ae60, #e74c3c
                        amountDesc={`${amountDescription1}${amountDescription2}`}
                        menuComponent={transaction.type == TRANSACTION_TYPES.LOAN &&(
                          transaction?.isFinish == true
                            ? (
                              <Box textAlign={'center'} sx={{ marginLeft: 2, border: 'solid 1px', borderRadius: 1, borderColor: '#359ff4', paddingY: 0.5, paddingX: 2 }}>
                                <Typography>Đã thu</Typography>
                                <NumericFormat
                                  displayType='text'
                                  thousandSeparator="."
                                  decimalSeparator=","
                                  allowNegative={false}
                                  suffix="&nbsp;₫"
                                  value={transaction?.collectionTransaction?.amount}
                                  style={{ color: '#27ae60', fontWeight: 'bold' }} // '#27ae60'
                                />
                              </Box>
                            )
                            : <Button variant='contained' sx={{ marginLeft: 2 }} onClick={() => handleOpenModal(transaction)}>Thu nợ</Button>
                        )}
                        sx={{
                          borderTop: 1,
                          borderColor: (theme) => theme.palette.mode === 'light' ? '#ccc' : '#666'
                        }}
                      />
                    </Box>
                  )})}
              </StyledBox>
            ))}
          </Box>
        </Box>

        <Box display={'flex'} justifyContent={'center'} marginTop={2} gap={2}>
          <Button variant='outlined' onClick={handleCancel}>Đóng</Button>
        </Box>
      </Box>

      <Modal
        open={openModal}
        // onClose={() => setOpenModal(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <CollectionPopup LoanTransaction={selectedTransaction} handleCancel={() => setOpenModal(false)} handleOnCollect={handleOnCollect}/>
        </Box>
      </Modal>
    </Box>
  )
}

export default ContactLoanList
