import React, { useState } from 'react'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import { NumericFormat } from 'react-number-format'
import TextField from '@mui/material/TextField'
import moment from 'moment'
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker'
import FinanceItem1 from '~/component/FinanceItemDisplay/FinanceItem1'
import ImageUploader from './ImageUploader'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import Select from '@mui/material/Select'
import Avatar from '@mui/material/Avatar'
import RestaurantIcon from '@mui/icons-material/Restaurant'
import { toast } from 'react-toastify'

const wallets = Array.from({ length: 5 }, (_, i) => ({
  walletId: `${i}`,
  walletName: `Tên ví số ${i}`,
  amount: 1234576
}))

function CreateTransfer() {
  const [time, setTime] = React.useState(moment())
  const [sourceWallet, setSourceWallet] = useState(wallets?.[0]?.walletId ?? '')
  const [targetWallet, setTargetWallet] = useState('')
  const handleChangeSourceWallet = (event) => {
    setSourceWallet(event.target.value)
  }
  const handleChangeTargetWallet = (event) => {
    setTargetWallet(event.target.value)
  }

  const handleOnSubmit = () => {
    if (sourceWallet == targetWallet) toast.warning('Không thể chuyển khoản trong cùng 1 tài khoản')
  }

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
        <Button
          variant="outlined"
          sx={{ textTransform: 'none', minWidth: '300px', paddingY: 1 }}
        >Chuyển khoản</Button>
      </Box>

      {/* tài khoản nguồn */}
      <Box display={'flex'} alignItems={'center'}>
        <Typography sx={{ width: '100px', flexShrink: 0 }}>Nguồn tiền</Typography>
        <Box sx={{ width: '100%' }}>
          <FormControl fullWidth>
            <Select
              labelId="wallet-select-label"
              id="wallet-select"
              value={sourceWallet}
              onChange={handleChangeSourceWallet}
              renderValue={(wallet) => {
                const selectedWallet = wallets.find(w => w.walletId === wallet)
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
                <MenuItem disabled={w.walletId == targetWallet} value={w.walletId} key={index}>
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

      {/* Tài khoản đích */}
      <Box display={'flex'} alignItems={'center'}>
        <Typography sx={{ width: '100px', flexShrink: 0 }}>Nơi nhận</Typography>
        <Box sx={{ width: '100%' }}>
          <FormControl fullWidth>
            <Select
              labelId="wallet-select-label"
              id="wallet-select"
              value={targetWallet}
              onChange={handleChangeTargetWallet}
              renderValue={(wallet) => {
                const selectedWallet = wallets.find(w => w.walletId === wallet)
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
                <MenuItem disabled={w.walletId == sourceWallet} value={w.walletId} key={index}>
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

      {/* Thời gian */}
      <Box display={'flex'} alignItems={'center'}>
        <Typography sx={{ width: '100px', flexShrink: 0 }}>Thời gian</Typography>
        <DateTimePicker ampm={false} timeSteps={{ hours: 1, minutes: 1 }} defaultValue={moment()} value={time} onChange={(newTime) => setTime(newTime)} sx={{ minWidth: 300 }} />
      </Box>

      {/* Hình ảnh */}
      <Box display={'flex'}>
        <Typography sx={{ width: '100px', flexShrink: 0 }}>Hình ảnh</Typography>
        <ImageUploader />
      </Box>

      {/* submit create new expense */}
      <Box display={'flex'} justifyContent={'center'} marginTop={8}>
        <Button variant='contained' onClick={handleOnSubmit}>Tạo giao dịch</Button>
      </Box>
    </Box>
  )
}

export default CreateTransfer