import * as React from 'react'
import PropTypes from 'prop-types'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Dialog from '@mui/material/Dialog'
import RadioGroup from '@mui/material/RadioGroup'
import Radio from '@mui/material/Radio'
import FormControlLabel from '@mui/material/FormControlLabel'

import { Stack, Typography } from '@mui/material'
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'
import { startDayOfWeekOptions, startDayOfMonthOptions, LANGUAGES, CURRENCIES } from '~/utils/constants'

const SettingCardType = {
  LANGUAGE: 'LANGUAGE',
  CURRENCY: 'CURRENCY',
  STARTWEEK: 'STARTWEEK',
  STARTMONTH: 'STARTMONTH'
}

const getOptions = (settingCardType) => {
  switch (settingCardType) {
  case SettingCardType.LANGUAGE: return Object.values(LANGUAGES)
  case SettingCardType.CURRENCY: return Object.values(CURRENCIES)
  case SettingCardType.STARTWEEK: return startDayOfWeekOptions
  case SettingCardType.STARTMONTH: return startDayOfMonthOptions
  default: return []
  }
}

const SettingCardRaw = React.memo(function SettingCardRaw(props) {
  const { onClose, value: valueProp, open, settingCardType, ...other } = props
  const options = getOptions(settingCardType)
  const [value, setValue] = React.useState(valueProp)
  const radioGroupRef = React.useRef(null)

  React.useEffect(() => {
    if (!open) {
      setValue(valueProp)
    }
  }, [valueProp, open])

  const handleEntering = () => {
    if (radioGroupRef.current != null) {
      radioGroupRef.current.focus()
    }
  }

  const handleCancel = () => {
    onClose()
  }

  const handleOk = () => {
    // console.log('🚀 ~ handleOk ~ value:', value)
    onClose(value)
  }

  const handleChange = (event) => {
    setValue(event.target.value)
  }

  return (
    <Dialog
      sx={{ '& .MuiDialog-paper': { width: '80%', maxHeight: 435 } }}
      maxWidth="xs"
      TransitionProps={{ onEntering: handleEntering }}
      open={open}
      {...other}
    >
      {props.title && <DialogTitle>{props.title}</DialogTitle>}
      <DialogContent dividers>
        <RadioGroup
          ref={radioGroupRef}
          aria-label={settingCardType}
          name={settingCardType}
          value={value}
          onChange={handleChange}
        >
          {options.map((option) => (
            <FormControlLabel
              value={option}
              key={option}
              control={<Radio />}
              label={option}
            />
          ))}
        </RadioGroup>
      </DialogContent>
      <DialogActions>
        <Button autoFocus onClick={handleCancel}>
          Cancel
        </Button>
        <Button onClick={handleOk}>Ok</Button>
      </DialogActions>
    </Dialog>
  )
})

SettingCardRaw.propTypes = {
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  value: PropTypes.string.isRequired
}

const SettingCard = ({ settingCardType, Icon, title, defaultOption, updateInfo }) => {
  const [open, setOpen] = React.useState(false)
  const [value, setValue] = React.useState(defaultOption)

  const handleClickListItem = () => {
    setOpen(true)
  }

  const handleClose = (newValue) => {
    setOpen(false)

    if (newValue) {
      setValue(newValue)
      updateInfo(newValue)
    }
  }

  return (
    <Box sx={{
      width: '100%',
      height: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <Button
        variant="outlined"
        onClick={handleClickListItem}
        sx={{
          width: '500px',
          textTransform: 'none',
          paddingY: '12px',
          borderColor: (theme) => theme.palette.mode === 'light' ? '#ccc' : '#666',
          color: (theme) => theme.palette.text.primary,
          '&:hover': {
            borderColor: (theme) => theme.palette.mode === 'light' ? '#000' : '#fff'
          }
        }}
      >
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ width: '100%' }}>

          {/* Bên trái: icon + tiêu đề */}
          <Stack direction="row" alignItems="center" spacing={1}>
            {Icon && <Icon fontSize="small" />}
            {title && <Typography variant="body1">{title}</Typography>}
          </Stack>

          {/* Bên phải: value */}
          <Stack direction="row" alignItems="center" spacing={0.75} sx={{ color: '#0984E3' }}>
            <Typography variant="body1" fontWeight="bold">
              {value}
            </Typography>
            <ArrowForwardIosIcon sx={{ fontSize: 16 }} />
          </Stack>
        </Stack>
      </Button>
      <SettingCardRaw
        id={`${settingCardType}-menu`}
        keepMounted
        open={open}
        onClose={handleClose}
        value={value}
        settingCardType={settingCardType}
        title={title}
      />
    </Box>
  )
}

export default SettingCard
