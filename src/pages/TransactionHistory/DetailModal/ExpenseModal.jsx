import React, { useEffect, useState } from 'react'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import { NumericFormat } from 'react-number-format'
import TextField from '@mui/material/TextField'
import CategorySelector from '~/pages/NewTransaction/CategorySelector'
import moment from 'moment'
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker'
import ImageUploader from '~/pages/NewTransaction/ImageUploader'
import Avatar from '@mui/material/Avatar'
import { MONEY_SOURCE_TYPE, TRANSACTION_TYPES } from '~/utils/constants'
import { Paper } from '@mui/material'
import PageLoadingSpinner from '~/component/Loading/PageLoadingSpinner'
import { getDetailIndividualTransaction } from '~/apis'


function ExpenseModal({ transactionId, handleCancelModal }) {
  const [transaction, setTransaction] = useState(null)
  const handleCancel = () => {
    handleCancelModal()
  }

  useEffect(() => {
    const fetchDetailTransaction = async () => {
      const detailTransaction = await getDetailIndividualTransaction(transactionId)
      detailTransaction.detailInfo.images = detailTransaction.detailInfo.images?.map(url => ({ url: url }))
      setTransaction(detailTransaction)
    }

    fetchDetailTransaction()
  }, [transactionId])

  if (!transaction) {
    return (
      <Box>
        <Box bgcolor={'#00aff0'} display={'flex'} alignItems={'center'} justifyContent={'center'} paddingY={2} sx={{ fontWeight: 'bold' }}>Giao dịch chi tiền</Box>
        <PageLoadingSpinner caption={'Đang tải dữ liệu...'} sx={{ height: '100%', paddingY: 5 }} />
      </Box>
    )
  }

  return (
    <>
      <Box bgcolor={'#00aff0'} display={'flex'} alignItems={'center'} justifyContent={'center'} paddingY={2} sx={{ fontWeight: 'bold' }}>Giao dịch chi tiền</Box>
      <Box display={'flex'} flexDirection={'column'} gap={2} marginTop={2}>
        {/* Số tiền */}
        <Box display={{ xs: 'block', sm: 'flex' }} alignItems={'center'}>
          <Typography sx={{ width: '100px', flexShrink: 0 }}>Số tiền</Typography>
          <NumericFormat
            fullWidth
            customInput={TextField}
            placeholder='Số tiền'
            thousandSeparator="."
            decimalSeparator=","
            allowNegative={false}
            decimalScale={0}
            allowLeadingZeros={false}
            suffix="&nbsp;₫"
            InputProps={{
              readOnly: true,
              style: { color: '#e74c3c' }
            }}
            value={transaction?.amount ? transaction?.amount : ''}
          />
        </Box>

        {/* Mô tả */}
        <Box display={{ xs: 'block', sm: 'flex' }}>
          <Typography sx={{ width: '100px', flexShrink: 0 }}>Mô tả</Typography>
          <TextField
            // label="Mô tả"
            placeholder="Mô tả"
            multiline
            minRows={3}
            variant="outlined"
            fullWidth
            readOnly={true}
            value={transaction?.description ? transaction?.description : ''}
          />
        </Box>

        {/* Hạng mục */}
        <Box display={{ xs: 'block', sm: 'flex' }} alignItems={'center'}>
          <Typography sx={{ width: '100px', flexShrink: 0 }}>Hạng mục</Typography>
          <CategorySelector
            transactionType={TRANSACTION_TYPES.EXPENSE}
            value={transaction?.category ? transaction?.category: null}
            viewOnly={true}
          />
        </Box>

        {/* Thời gian */}
        <Box display={{ xs: 'block', sm: 'flex' }} alignItems={'center'}>
          <Typography sx={{ width: '100px', flexShrink: 0 }}>Thời gian</Typography>
          <DateTimePicker
            ampm={false}
            timeSteps={{ hours: 1, minutes: 1 }}
            value={transaction?.transactionTime ? moment(transaction?.transactionTime) : null}
            disableOpenPicker
          />
        </Box>

        {/* Nguồn tiền */}
        <Box display={{ xs: 'block', sm: 'flex' }} alignItems={'center'}>
          <Typography sx={{ width: '100px', flexShrink: 0 }}>Nguồn tiền</Typography>
          <Box sx={{ width: '100%' }}>
            <Paper
              variant="outlined"
              sx={{
                p: 1.5,
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                width: '100%',
                cursor: 'default'
              }}
            >
              <Box display="flex" alignItems="center" gap={1}>
                <Avatar
                  alt="Logo"
                  src= {transaction?.detailInfo?.moneyFrom?.icon ? transaction?.detailInfo?.moneyFrom?.icon : ''}
                  sx={{
                    bgcolor: 'yellow',
                    width: 40,
                    height: 40,
                    flexShrink: 0,
                    border: (theme) => theme.palette.mode == 'light' ? 'solid 0.5px yellow' : ''
                  }}
                >
                  {' '}
                </ Avatar>
                <Box>
                  {transaction?.detailInfo?.moneyFromType == MONEY_SOURCE_TYPE.ACCOUNT &&
                    <Typography> {transaction?.detailInfo?.moneyFrom?.accountName}&nbsp;({transaction?.detailInfo?.moneyFrom?.balance?.toLocaleString()}&nbsp;₫) </Typography>
                  }
                  {transaction?.detailInfo?.moneyFromType == MONEY_SOURCE_TYPE.ACCUMULATION &&
                    <Typography> {transaction?.detailInfo?.moneyFrom?.accumulationName}&nbsp;({transaction?.detailInfo?.moneyFrom?.balance?.toLocaleString()}&nbsp;₫) </Typography>
                  }
                  {transaction?.detailInfo?.moneyFromType == MONEY_SOURCE_TYPE.SAVINGS_ACCOUNT &&
                    <Typography> {transaction?.detailInfo?.moneyFrom?.savingsAccountName}&nbsp;({transaction?.detailInfo?.moneyFrom?.balance?.toLocaleString()}&nbsp;₫) </Typography>
                  }
                </Box>
              </Box>
            </Paper>
          </Box>
        </Box>

        {/* Hình ảnh */}
        <Box display={{ xs: 'block', sm: 'flex' }}>
          <Typography sx={{ width: '100px', flexShrink: 0 }}>Hình ảnh</Typography>
          <ImageUploader
            value={transaction?.detailInfo?.images}
            viewOnly={true}
          />
        </Box>

        {/* submit create new expense */}
        <Box display={'flex'} justifyContent={'center'} marginTop={2} gap={2}>
          <Button variant='outlined' onClick={handleCancel}>Đóng</Button>
        </Box>
      </Box>
    </>
  )
}

export default ExpenseModal
