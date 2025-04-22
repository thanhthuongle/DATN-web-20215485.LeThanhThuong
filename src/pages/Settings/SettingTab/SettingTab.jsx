/* eslint-disable no-console */
import React, { useState } from 'react'
import Stack from '@mui/material/Stack'
import SettingCard from './SettingCard'
import EventIcon from '@mui/icons-material/Event'
import LanguageIcon from '@mui/icons-material/Language'
import CurrencyExchangeIcon from '@mui/icons-material/CurrencyExchange'
import AlarmIcon from '@mui/icons-material/Alarm'
import SyncIcon from '@mui/icons-material/Sync'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Switch from '@mui/material/Switch'
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'
import { formatVND } from '~/utils/formatCurrency'
import TextField from '@mui/material/TextField'
import { NumericFormat } from 'react-number-format'
import { Button } from '@mui/material'
import { TimePicker } from '@mui/x-date-pickers'
import moment from 'moment'

const SettingCardType = {
  LANGUAGE: 'LANGUAGE',
  CURRENCY: 'CURRENCY',
  STARTWEEK: 'STARTWEEK',
  STARTMONTH: 'STARTMONTH'
}

function SettingTab() {
  const [alarmChecked, setAlarmChecked] = React.useState(true)
  const handleChangeAlarm = (event) => {
    setAlarmChecked(event.target.checked)
  }
  const [syncChecked, setSyncChecked] = React.useState(true)
  const handleChangeSync = (event) => {
    setSyncChecked(event.target.checked)
  }

  // call api cập nhật dữ liệu
  const updateStartDayOfWeek = (newDay) => {
    console.log('🚀 ~ updateStartDayOfWeek ~ newDay:', newDay)
  }
  const updateLanguage = (newLanguage) => {
    console.log('🚀 ~ updateLanguage ~ newLanguage:', newLanguage)
  }
  const updateCurrency = (newCurrency) => {
    console.log('🚀 ~ updateCurrency ~ newCurrency:', newCurrency)
  }
  const updateStartDayOfMonth = (newDay) => {
    console.log('🚀 ~ updateStartDayOfMonth ~ newDay:', newDay)
  }
  const updateMinAmountToSync = () => {
    console.log('🚀 ~ updateMinAmountToSync ~ newMinAmount:')
  }

  return (
    <Stack
      spacing={3}
      alignItems='center'
    >
      <Box>
        <Typography variant="h5">Cài đặt chung</Typography>
      </Box>

      {/* Ngôn ngữ */}
      <SettingCard
        Icon={LanguageIcon}
        title={'Ngôn ngữ'}
        settingCardType={SettingCardType.LANGUAGE}
        defaultOption={'Tiếng Việt'}
        updateInfo={updateLanguage}
      />

      {/* Thiết lập tiền tệ */}
      <SettingCard
        Icon={CurrencyExchangeIcon}
        title={'Thiết lập tiền tệ'}
        settingCardType={SettingCardType.CURRENCY}
        defaultOption={'VND'}
        updateInfo={updateCurrency}
      />

      {/* Nhắc nhập liệu */}
      <Box sx={{
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <Box
          sx={{
            width: '500px',
            textTransform: 'none',
            paddingX: '15px',
            paddingY: '12px',
            borderRadius: '4px',
            borderWidth: '1px',
            borderStyle: 'solid',
            borderColor: (theme) => theme.palette.mode === 'light' ? '#ccc' : '#666',
            color: (theme) => theme.palette.text.primary,
            '&:hover': {
              borderColor: (theme) => theme.palette.mode === 'light' ? '#000' : '#fff'
            }
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <AlarmIcon fontSize='small' />
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, width:'100%' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant='body1'>Nhắc nhập liệu</Typography>
                <Switch
                  checked={alarmChecked}
                  onChange={handleChangeAlarm}
                />
              </Box>
              {alarmChecked &&
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant='body1' >Thời gian nhắc nhập liệu</Typography>
                <TimePicker
                  ampm={false}
                  defaultValue={moment('2025-01-29T15:30')}
                  timeSteps={{ minutes: 1 }}
                  // onAccept={}
                  sx={{
                    width: '40%',
                    paddingX: '8px',
                    '& .MuiPickersOutlinedInput-notchedOutline': {
                      // border: 'none'
                    },
                    '& .MuiPickersInputBase-root': {
                      color: '#0984E3',
                    },
                    '& .MuiButtonBase-root': {
                      color: '#0984E3'
                    },
                    // '& .MuiPickersInputBase-root MuiPickersOutlinedInput-root MuiPickersInputBase-colorPrimary MuiPickersInputBase-adornedEnd css-yb1x71-MuiPickersInputBase-root-MuiPickersOutlinedInput-root': {
                    //   color: '#0984E3'
                    // }
                  }}
                />
              </Box>
              }
            </Box>
          </Box>
        </Box>
      </Box>

      {/* Ngày bắt đầu của tuần */}
      <SettingCard
        Icon={EventIcon}
        title={'Ngày bắt đầu của tuần'}
        settingCardType={SettingCardType.STARTWEEK}
        defaultOption={'Thứ 2'}
        updateInfo={updateStartDayOfWeek}
      />

      {/* Ngày bắt đầu của tháng */}
      <SettingCard
        Icon={EventIcon}
        title={'Ngày bắt đầu của tháng'}
        settingCardType={SettingCardType.STARTMONTH}
        defaultOption={1}
        updateInfo={updateStartDayOfMonth}
      />

      {/* Đồng bộ âm nợ từ nguồn tiền */}
      <Box sx={{
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <Box
          sx={{
            width: '500px',
            textTransform: 'none',
            paddingX: '15px',
            paddingY: '12px',
            borderRadius: '4px',
            borderWidth: '1px',
            borderStyle: 'solid',
            borderColor: (theme) => theme.palette.mode === 'light' ? '#ccc' : '#666',
            color: (theme) => theme.palette.text.primary,
            '&:hover': {
              borderColor: (theme) => theme.palette.mode === 'light' ? '#000' : '#fff'
            }
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <SyncIcon fontSize='small' />
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, width:'100%' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant='body1'>Đồng bộ âm nợ từ nguồn tiền</Typography>
                <Switch
                  checked={syncChecked}
                  onChange={handleChangeSync}
                />
              </Box>
              {syncChecked &&
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', gap: 5 }}>
                <NumericFormat
                  customInput={TextField}
                  label="Số tiền tối thiểu để đồng bộ"
                  thousandSeparator="."
                  decimalSeparator=","
                  allowNegative={false}
                  // isNumericString
                  suffix=" ₫"
                  fullWidth
                  defaultValue={0}
                />
                <Button
                  onClick={updateMinAmountToSync}
                  variant="contained"
                  sx={{ height: '100%' }}
                >OK</Button>
              </Box>
              }
            </Box>
          </Box>
        </Box>
      </Box>

    </Stack>
  )
}

export default SettingTab
