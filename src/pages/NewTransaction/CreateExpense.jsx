import { Box, Button, Typography } from '@mui/material'
import React, { useState } from 'react'
import { NumericFormat } from 'react-number-format'
import TextField from '@mui/material/TextField'
import CategorySelector from './CategorySelector'
import moment from 'moment'
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker'
import FinanceItem1 from '~/component/FinanceItemDisplay/FinanceItem1'
import ImageUploader from './ImageUploader'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import Select from '@mui/material/Select'
import Avatar from '@mui/material/Avatar'
import RestaurantIcon from '@mui/icons-material/Restaurant'

const wallets = Array.from({ length: 5 }, (_, i) => ({
  walletId: `${i}`,
  walletName: `Tên ví số ${i}`,
  amount: 1234576
}))

function CreateExpense() {
  const [time, setTime] = React.useState(moment())
  const [wallet, setWallet] = useState(null)
  const handleChange = (event) => {
    setWallet(event.target.value)
  }

  console.log('🚀 ~ CreateExpense ~ time:', time)

  return (
    <Box display={'flex'} flexDirection={'column'} gap={2} marginTop={2}>
      {/* Số tiền */}
      <Box display={'flex'} alignItems={'center'}>
        <Typography sx={{ width: '100px', flexShrink: 0 }}>Số tiền</Typography>
        <NumericFormat
          fullWidth
          customInput={TextField}
          placeholder='Nhập số tiền'
          thousandSeparator="."
          decimalSeparator=","
          allowNegative={false}
          suffix="&nbsp;₫"
          InputProps={{ style: { color: '#e74c3c' } }}
        />
      </Box>

      {/* Mô tả */}
      <Box display={'flex'}>
        <Typography sx={{ width: '100px', flexShrink: 0 }}>Mô tả</Typography>
        <TextField
          // label="Mô tả"
          placeholder="Nhập mô tả"
          multiline
          minRows={3}
          variant="outlined"
          fullWidth
        />
      </Box>

      {/* Hạng mục */}
      <Box display={'flex'} alignItems={'center'}>
        <Typography sx={{ width: '100px', flexShrink: 0 }}>Hạng mục</Typography>
        <CategorySelector />
      </Box>

      {/* Thời gian */}
      <Box display={'flex'} alignItems={'center'}>
        <Typography sx={{ width: '100px', flexShrink: 0 }}>Thời gian</Typography>
        <DateTimePicker ampm={false} timeSteps={{ hours: 1, minutes: 1 }} defaultValue={moment()} value={time} onChange={(newTime) => setTime(newTime)} sx={{ minWidth: 300 }} />
      </Box>

      {/* Nguồn tiền */}
      <Box display={'flex'} alignItems={'center'}>
        <Typography sx={{ width: '100px', flexShrink: 0 }}>Nguồn tiền</Typography>
        <Box sx={{ width: '100%' }}>
          <FormControl fullWidth>
            <Select
              labelId="wallet-select-label"
              id="wallet-select"
              value={wallet}
              onChange={handleChange}
              renderValue={(selected) => {
                const selectedWallet = wallets.find(w => w.walletName === selected)
                return (
                  <Box display="flex" alignItems="center" gap={1}>
                    <Avatar
                      alt="Logo"
                      src=""
                      sx={{
                        bgcolor: 'yellow',
                        width: 40,
                        height: 40,
                        flexShrink: 0
                      }}
                    >
                      <RestaurantIcon />
                    </ Avatar>
                    <Typography noWrap>
                      {selectedWallet?.walletName}&nbsp;({selectedWallet?.amount?.toLocaleString()}&nbsp;₫)
                    </Typography>
                  </Box>
                )
              }}
            >
              {wallets?.map((w, index) => (
                <MenuItem value={w.walletName} key={index}>
                  <FinanceItem1
                    title={w.walletName}
                    amount={w.amount}
                  />
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </Box>

      {/* Hình ảnh */}
      <Box display={'flex'}>
        <Typography sx={{ width: '100px', flexShrink: 0 }}>Hình ảnh</Typography>
        <ImageUploader />
      </Box>

      {/* submit create new expense */}
      <Box display={'flex'} justifyContent={'center'} marginTop={8}>
        <Button variant='contained'>Tạo giao dịch</Button>
      </Box>
    </Box>
  )
}

export default CreateExpense