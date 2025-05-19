// import * as React from 'react'
// import { Stack, Typography } from '@mui/material'
// import { DatePicker } from '@mui/x-date-pickers/DatePicker'
// import moment from 'moment';

// export default function MonthRangePicker() {
//   const [startMonth, setStartMonth] = React.useState(moment());
//   const [endMonth, setEndMonth] = React.useState(moment());

//   return (
//     <Stack spacing={2} direction="row" alignItems="center">
//       <Typography>Từ:</Typography>
//       <DatePicker
//         views={['year', 'month']}
//         label="Tháng bắt đầu"
//         value={startMonth}
//         onChange={(newValue) => setStartMonth(newValue)}
//       />
//       <Typography>Đến:</Typography>
//       <DatePicker
//         views={['year', 'month']}
//         label="Tháng kết thúc"
//         value={endMonth}
//         onChange={(newValue) => setEndMonth(newValue)}
//       />
//     </Stack>
//   );
// }

// MonthRangePicker.jsx
import React from 'react'
import { Box, TextField, Typography } from '@mui/material'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'

const MonthRangePicker = ({ start, end, onChange, label }) => {
  return (
    <Box display="flex" flexDirection="column" gap={1}>
      {label && <Typography variant="subtitle2">{label}</Typography>}
      <Box display="flex" gap={2}>
        <DatePicker
          views={['year', 'month']}
          label="Từ tháng"
          value={start}
          onChange={(newValue) => {
            onChange({ start: newValue, end })
          }}
          // renderInput={(params) => <TextField {...params} />}
        />
        <DatePicker
          views={['year', 'month']}
          label="Đến tháng"
          value={end}
          onChange={(newValue) => {
            onChange({ start, end: newValue })
          }}
          // renderInput={(params) => <TextField {...params} />}
        />
      </Box>
    </Box>
  )
}

export default MonthRangePicker


