import React, { useState } from 'react'
import Stack from '@mui/material/Stack'
import SettingCard from './SettingCard'
import EventIcon from '@mui/icons-material/Event'
import LanguageIcon from '@mui/icons-material/Language'
import CurrencyExchangeIcon from '@mui/icons-material/CurrencyExchange'
import AlarmIcon from '@mui/icons-material/Alarm'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Switch from '@mui/material/Switch'
import { TimePicker } from '@mui/x-date-pickers'
import moment from 'moment'
import { useDebounceFn } from '~/customHooks/useDebounceFn'
import { useDispatch, useSelector } from 'react-redux'
import { selectCurrentUser, updateUserAPI } from '~/redux/user/userSlice'
import { CURRENCIES, LANGUAGES } from '~/utils/constants'

const SettingCardType = {
  LANGUAGE: 'LANGUAGE',
  CURRENCY: 'CURRENCY',
  STARTWEEK: 'STARTWEEK',
  STARTMONTH: 'STARTMONTH'
}

function SettingTab() {
  const dispatch = useDispatch()
  const currentUser = useSelector(selectCurrentUser)
  const [alarmChecked, setAlarmChecked] = useState(true)

  // Cập nhật trạng thái nhắc nhở
  const updateRemindToInput = (newChecked) => {
    const remindToInput = newChecked
    if (remindToInput !== currentUser?.remindToInput) {
      const dataUpdate = { remindToInput }
      dispatch(updateUserAPI(dataUpdate))
    }
  }
  const debounceAlarmSwitch = useDebounceFn(updateRemindToInput, 1000)
  const handleChangeAlarm = (event) => {
    setAlarmChecked(event.target.checked)
    debounceAlarmSwitch(event.target.checked)
  }

  // call api cập nhật dữ liệu
  const updateStartDayOfWeek = (newDay) => {
    // console.log('🚀 ~ updateStartDayOfWeek ~ newDay:', newDay)
  }
  const updateLanguage = (newLanguage) => {
    // console.log('🚀 ~ updateLanguage ~ newLanguage:', newLanguage)
  }
  const updateCurrency = (newCurrency) => {
    // console.log('🚀 ~ updateCurrency ~ newCurrency:', newCurrency)
  }
  const updateStartDayOfMonth = (newDay) => {
    // console.log('🚀 ~ updateStartDayOfMonth ~ newDay:', newDay)
  }
  const onRemiderTimeChange = (value) => {
    const newTime = moment(value).toISOString()
    const dataUpdate = {
      remindTime: newTime
    }
    dispatch(updateUserAPI(dataUpdate))
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
        defaultOption={ LANGUAGES[currentUser?.language] ? LANGUAGES[currentUser?.language] : ''}
        updateInfo={updateLanguage}
      />

      {/* Thiết lập tiền tệ */}
      <SettingCard
        Icon={CurrencyExchangeIcon}
        title={'Thiết lập tiền tệ'}
        settingCardType={SettingCardType.CURRENCY}
        defaultOption={CURRENCIES[currentUser?.currency] ? CURRENCIES[currentUser?.currency] : ''}
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
                  defaultValue={currentUser?.remindTime ? moment(currentUser?.remindTime) : null}
                  timeSteps={{ minutes: 1 }}
                  onAccept={onRemiderTimeChange}
                  sx={{
                    width: '40%',
                    paddingX: '8px',
                    '& .MuiPickersOutlinedInput-notchedOutline': {
                      // border: 'none'
                    },
                    '& .MuiPickersInputBase-root': {
                      color: '#0984E3'
                    },
                    '& .MuiButtonBase-root': {
                      color: '#0984E3'
                    }
                    // '& .MuiPickersInputBase-root MuiPickersOutlinedInput-root MuiPickersInputBase-colorPrimary MuiPickersInputBase-adornedEnd css-yb1x71-MuiPickersInputBase-root-MuiPickersOutlinedInput-root': {
                    //   color: '#0984E3' // #0984E3
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

    </Stack>
  )
}

export default SettingTab
