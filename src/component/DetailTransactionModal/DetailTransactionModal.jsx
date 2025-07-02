import { Box, Modal } from '@mui/material'
import React from 'react'
import ExpenseModal from './ExpenseModal'
import IncomeModal from './IncomeModal'
import LoanModal from './LoanModal'
import CollectionModal from './CollectionModal'
import BorrowingModal from './BorrowingModal'
import RepaymentModal from './RepaymentModal'
import TransferModal from './TransferModal'
import { TRANSACTION_TYPES } from '~/utils/constants'

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: { xs: '100%', sm: 900 },
  maxHeight: '80vh',
  overflowY: 'auto',
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4
}

function DetailTransactionModal({ transaction, open, onClose }) {
  const transactionType = transaction?.type
  const transactionId = transaction?._id

  return (
    <Modal
      open={open}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={modalStyle}>
        {transactionType == TRANSACTION_TYPES.EXPENSE && <ExpenseModal transactionId={transactionId} handleCancelModal={onClose}/>}
        {transactionType == TRANSACTION_TYPES.INCOME && <IncomeModal transactionId={transactionId} handleCancelModal={onClose}/>}
        {transactionType == TRANSACTION_TYPES.LOAN && <LoanModal transactionId={transactionId} handleCancelModal={onClose}/>}
        {transactionType == TRANSACTION_TYPES.COLLECT && <CollectionModal transactionId={transactionId} handleCancelModal={onClose}/>}
        {transactionType == TRANSACTION_TYPES.BORROWING && <BorrowingModal transactionId={transactionId} handleCancelModal={onClose}/>}
        {transactionType == TRANSACTION_TYPES.REPAYMENT && <RepaymentModal transactionId={transactionId} handleCancelModal={onClose}/>}
        {transactionType == TRANSACTION_TYPES.TRANSFER && <TransferModal transactionId={transactionId} handleCancelModal={onClose}/>}
      </Box>
    </Modal>
  )
}

export default React.memo(DetailTransactionModal)
