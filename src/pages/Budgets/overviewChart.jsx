import React from 'react'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
import { Doughnut } from 'react-chartjs-2'
import { Box, Typography } from '@mui/material'
import { NumericFormat } from 'react-number-format'

ChartJS.register(ArcElement, Tooltip, Legend)

const options = {
  responsive: false,
  circumference: 180,
  rotation: -90,
  cutout: '94%',
  plugins: {
    legend: {
      display: false
    },
    datalabels: {
      display: false
    }
  }
}

function OverviewChart({ totalBudget, totalExpense, budgetTypeProp, sx }) {
  const budgetType = {
    APPLYING: 'Đang áp dụng',
    FINISHED: 'Đã kết thúc'
  }
  let labelText = ''
  let labelAmount = ''
  if (budgetTypeProp == budgetType.FINISHED) {
    labelText = 'Số tiền bạn đã chi'
    labelAmount = totalExpense
  } else if (Number(totalBudget) < Number(totalExpense)) {
    labelText = 'Bội chi'
    labelAmount = Number(totalBudget) - Number(totalExpense)
  } else {
    labelText = 'Số tiền bạn có thể chi'
    labelAmount = Number(totalBudget) - Number(totalExpense)
  }
  const data = {
    labels: ['Đã chi', 'Còn lại'],
    datasets: [
      {
        label: '',
        data: [Number(totalExpense), Math.max(Number(totalBudget) - Number(totalExpense), 0)],
        backgroundColor: [
          (Number(totalBudget) - Number(totalExpense)) < 0 ? '#e74c3c' : '#27ae60', // #27ae60
          '#d9d9d9' // #d9d9d9, #e74c3c
        ],
        borderWidth: 0
      }
    ]
  }
  return (
    <Box
      sx={{
        position: 'relative',
        width: 'auto',
        height: 'auto',
        ...sx
      }}
    >
      <Doughnut
        options={options}
        data={data}
      />
      <Box
        sx={{
          position: 'absolute',
          width: '100%',
          height: '50%',
          top: '45%',
          left: '0%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}
      >
        <Typography sx={{ color: Number(labelAmount) < 0 ? '#e74c3c' : '' }}>{labelText}</Typography>
        <NumericFormat
          displayType='text'
          thousandSeparator="."
          decimalSeparator=","
          allowNegative={false}
          suffix="&nbsp;₫"
          value={labelAmount}
          style={{ fontWeight: 'bold', maxWidth: '100%', color: Number(labelAmount) < 0 ? '#e74c3c' : '' }} // #e74c3c
        />
      </Box>
    </Box>
  )
}

export default OverviewChart
