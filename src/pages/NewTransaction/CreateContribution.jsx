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

const wallets = Array.from({ length: 5 }, (_, i) => ({
  walletId: `${i}`,
  walletName: `Tên ví số ${i}`,
  amount: 1234576
}))

const falmilies = Array.from({ length: 5 }, (_, i) => ({
  familyId: `${i}`,
  familyName: `Tên gia đình số ${i}`,
  contributions: Array.from({ length: 4 }, (_, j) => ({
    contributionId: `${j}`,
    contributionName: `Tên khoản đóng góp ${j} của gđ ${i}`,
    contributionAmount: 765832
    // requestedMemberIds: [] //Danh sách id các thành viên được yêu cầu nộp khoản đóng góp
  })),
  wallets: Array.from({ length: 5 }, (_, k) => ({
    walletId: `${k}`,
    walletName: `Tên ví số ${k} của gđ ${i}`,
    amount: 1234576
  }))
}))

function CreateContribution() {
  const [time, setTime] = React.useState(moment())
  const [wallet, setWallet] = useState(wallets?.[0]?.walletId ?? '')
  const [targetFamily, setTargetFamily] = useState(falmilies?.[0]?.familyId ?? '')
  const [targetFamilyWallet, setTargetFamilyWallet] = useState('')
  const [targetFamilyContribution, setTargetFamilyContribution] = useState('')
  const handleChange = (event) => {
    setWallet(event.target.value)
  }
  const handleChangeTargetFamily = (event) => {
    setTargetFamily(event.target.value)
    setTargetFamilyContribution('')
    setTargetFamilyWallet('')
  }
  const handleChangeTargetFamilyWallet = (event) => {
    setTargetFamilyWallet(event.target.value)
  }
  const handleChangeTargetFamilyContribution = (event) => {
    setTargetFamilyContribution(event.target.value)
  }

  return (
    <Box display={'flex'} flexDirection={'column'} gap={2} marginTop={2}>
      {/* Số tiền */}
      <Box display={'flex'} alignItems={'center'}>
        <Typography sx={{ width: '110px', flexShrink: 0 }}>Số tiền</Typography>
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
        <Typography sx={{ width: '110px', flexShrink: 0 }}>Mô tả</Typography>
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
        <Typography sx={{ width: '110px', flexShrink: 0 }}>Hạng mục</Typography>
        <Button
          variant="outlined"
          sx={{ textTransform: 'none', minWidth: '300px', paddingY: 1 }}
        >Đóng góp</Button>
      </Box>

      {/* Gia đình nhận */}
      <Box display={'flex'} alignItems={'center'}>
        <Typography sx={{ width: '110px', flexShrink: 0 }}>Gia đình nhận</Typography>
        <Box sx={{ width: '100%' }}>
          <FormControl fullWidth>
            <Select
              labelId="target-family-select-label"
              id="target-family-select"
              value={targetFamily}
              onChange={handleChangeTargetFamily}
              renderValue={(targetFamily) => {
                const selectedFamily = falmilies.find(f => f.familyId === targetFamily)
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
                      {selectedFamily?.familyName}
                    </Typography>
                  </Box>
                )
              }}
            >
              {falmilies?.map((f, index) => (
                <MenuItem value={f.familyId} key={index}>
                  <FinanceItem1
                    title={f.familyName}
                  />
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </Box>

      {/* Khoản đóng góp */}
      {targetFamily &&
        <Box display={'flex'} alignItems={'center'}>
          <Typography sx={{ width: '110px', flexShrink: 0 }}>Khoản đóng góp</Typography>
          <Box sx={{ width: '100%' }}>
            <FormControl fullWidth>
              <Select
                labelId="contribution-select-label"
                id="contribution-select"
                value={targetFamilyContribution}
                onChange={handleChangeTargetFamilyContribution}
                renderValue={(targetFamilyContribution) => {
                  const selectedFamily = falmilies.find(f => f.familyId === targetFamily)
                  const selectedContribution = selectedFamily?.contributions.find(c => c.contributionId === targetFamilyContribution)
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
                        {selectedContribution?.contributionName}&nbsp;({selectedContribution?.contributionAmount?.toLocaleString()}&nbsp;₫)
                      </Typography>
                    </Box>
                  )
                }}
              >
                {falmilies.find(f => f.familyId === targetFamily)?.contributions?.map((c, index) => (
                  <MenuItem value={c.contributionId} key={index}>
                    <FinanceItem1
                      title={c.contributionName}
                      amount={c.contributionAmount}
                    />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </Box>
      }

      {/* Nơi nhận */}
      <Box display={'flex'} alignItems={'center'}>
        <Typography sx={{ width: '110px', flexShrink: 0 }}>Nơi nhận</Typography>
        <Box sx={{ width: '100%' }}>
          <FormControl fullWidth>
            <Select
              labelId="wallet-select-label"
              id="wallet-select"
              value={targetFamilyWallet}
              onChange={handleChangeTargetFamilyWallet}
              renderValue={(targetFamilyWallet) => {
                const selectedFamily = falmilies.find(f => f.familyId === targetFamily)
                const selectedWallet = selectedFamily?.wallets.find(w => w.walletId === targetFamilyWallet)
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
              {falmilies.find(f => f.familyId === targetFamily)?.wallets?.map((w, index) => (
                <MenuItem value={w.walletId} key={index}>
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
        <Typography sx={{ width: '110px', flexShrink: 0 }}>Thời gian</Typography>
        <DateTimePicker ampm={false} timeSteps={{ hours: 1, minutes: 1 }} defaultValue={moment()} value={time} onChange={(newTime) => setTime(newTime)} sx={{ minWidth: 300 }} />
      </Box>

      {/* Nguồn tiền */}
      <Box display={'flex'} alignItems={'center'}>
        <Typography sx={{ width: '110px', flexShrink: 0 }}>Nguồn tiền</Typography>
        <Box sx={{ width: '100%' }}>
          <FormControl fullWidth>
            <Select
              labelId="wallet-select-label"
              id="wallet-select"
              value={wallet}
              onChange={handleChange}
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
                <MenuItem value={w.walletId} key={index}>
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
        <Typography sx={{ width: '110px', flexShrink: 0 }}>Hình ảnh</Typography>
        <ImageUploader />
      </Box>

      {/* submit create new expense */}
      <Box display={'flex'} justifyContent={'center'} marginTop={8}>
        <Button variant='contained'>Tạo giao dịch</Button>
      </Box>
    </Box>
  )
}

export default CreateContribution