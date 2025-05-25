import { Box, Button, Divider, Modal, Typography } from '@mui/material'
import moment from 'moment'
import React, { useEffect, useState } from 'react'
import { NumericFormat } from 'react-number-format'
import { StyledBox } from '~/pages/Overview/Overview'
import PaymentPopup from './PaymentPopup'
import MoneySourceItem1 from '~/pages/MoneySources/MoneySourceItem/MoneySourceItem1'
import { TRANSACTION_TYPES } from '~/utils/constants'

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: { xs: '100%', sm: 800 },
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

function ContactDebtList({ contactDebtData, handleCancel, handleOnCollectOrRepay }) {
  // console.log('🚀 ~ ContactDebtList ~ contactDebtData:', contactDebtData)
  const [transactionProcessedDatas, setTransactionProcessedDatas] = useState(null)
  // console.log('🚀 ~ ContactDebtList ~ transactionProcessedDatas:', transactionProcessedDatas)
  const [openModal, setOpenModal] = useState(false)
  const [selectedTransaction, setSelectedTransaction] = useState(null)

  const handleOpenModal = (transaction) => {
    setSelectedTransaction(transaction)
    setOpenModal(true)
  }

  useEffect(() => {
    const processedData = processDataRaw(contactDebtData.transactions)
    setTransactionProcessedDatas(processedData)
  }, [contactDebtData])
  return (
    <Box>
      <Box display={'flex'} flexDirection={'column'} gap={2}>
        {/* Tên người vay */}
        <Box bgcolor={'#00aff0'} paddingY={2} display={'flex'} justifyContent={'center'}>
          <Typography fontWeight={'bold'}>{contactDebtData?.lender?.name}</Typography>
        </Box>

        {/* Thông tin cơ bản */}
        <StyledBox display={'flex'} justifyContent={'space-evenly'}>
          <Box display={'flex'} flexDirection={'column'} justifyContent={'center'} alignItems={'center'}>
            <Typography sx={{ fontWeight: 'bold' }}>Tổng đi vay</Typography>
            <NumericFormat
              displayType='text'
              thousandSeparator="."
              decimalSeparator=","
              allowNegative={false}
              suffix="&nbsp;₫"
              value={contactDebtData?.totalAmount}
              style={{ color: '#27ae60', fontWeight: 'bold' }} // #27ae60
            />
          </Box>
          <Divider orientation="vertical" variant="fullWidth" flexItem />
          <Box display={'flex'} flexDirection={'column'} justifyContent={'center'} alignItems={'center'}>
            <Typography sx={{ fontWeight: 'bold' }}>Đã trả</Typography>
            <NumericFormat
              displayType='text'
              thousandSeparator="."
              decimalSeparator=","
              allowNegative={false}
              suffix="&nbsp;₫"
              value={contactDebtData?.totalReturn}
              style={{ color: '#e74c3c', fontWeight: 'bold' }} // #e74c3c
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
                  const amountDescription1 = (transaction.detailInfo.repaymentTime) ? `Ngày trả dự kiến: ${moment(transaction.detailInfo.repaymentTime).format('DD/MM/YYYY')}\n` : ''
                  const amountDescription2 = transaction?.isFinish == true ? `Ngày trả thực tế: ${moment(transaction?.borrowingTransaction?.transactionTime).format('DD/MM/YYYY')}` : ''
                  return (
                    <Box
                      key={transaction._id}
                      // onClick={() => handleOpenModal(transaction)}
                    >
                      <MoneySourceItem1
                        // key={transaction._id}
                        title={transaction?.name}
                        description={transaction.description}
                        amount={transaction?.amount}
                        amountColor={(transaction?.type == TRANSACTION_TYPES.BORROWING) ? '#27ae60' : '#e74c3c'} // #27ae60, #e74c3c
                        amountDesc={`${amountDescription1}${amountDescription2}`}
                        menuComponent={transaction.type == TRANSACTION_TYPES.BORROWING && (
                          transaction.isFinish == true
                            ? (
                              <Box textAlign={'center'} sx={{ marginLeft: 2, border: 'solid 1px', borderRadius: 1, borderColor: '#359ff4', paddingY: 0.5, paddingX: 2 }}>
                                <Typography>Đã trả</Typography>
                                <NumericFormat
                                  displayType='text'
                                  thousandSeparator="."
                                  decimalSeparator=","
                                  allowNegative={false}
                                  suffix="&nbsp;₫"
                                  value={transaction?.borrowingTransaction?.amount}
                                  style={{ color: '#e74c3c', fontWeight: 'bold' }} // #e74c3c
                                />
                              </Box>
                            )
                            : <Button variant='contained' sx={{ marginLeft: 2 }} onClick={() => handleOpenModal(transaction)}>Trả nợ</Button>
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
          <PaymentPopup
            DebtTransaction={selectedTransaction}
            handleCancel={() => setOpenModal(false)}
            handleOnCollectOrRepay={handleOnCollectOrRepay}
          />
        </Box>
      </Modal>
    </Box>
  )
}

export default ContactDebtList
