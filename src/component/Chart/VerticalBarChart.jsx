import React from 'react'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js'
import { Bar } from 'react-chartjs-2'
import { Box } from '@mui/material'

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
)

const options = {
  responsive: true,
  plugins: {
    legend: {
      display: false
    },
    title: {
      display: false
    }
  },
  scales: {
    y: {
      ticks: {
        callback: function(value) {
          if (value >= 1_000_000_000) return (value / 1_000_000_000) + 'B'
          if (value >= 1_000_000) return (value / 1_000_000) + 'M'
          if (value >= 1_000) return (value / 1_000) + 'K'
          return value
        }
      }
    }
  }
}

const labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'January', 'February', 'March', 'April', 'May', 'June', 'July']

const data = {
  labels,
  datasets: [
    {
      label: 'Chi',
      data: [123421, 543644, 543657, 1234245, 254236, 576867, 1767600, 123421, 543644, 543657, 1234245, 254236, 576867, 1767600],
      backgroundColor: '#00aff0',
      barPercentage: 0.9
    }
  ]
}


function VerticalBarChart({ months, spendingAmounts}) {
  return (
    <Box width='100%'>
      <Bar options={options} data={data} />
    </Box>
)
}

export default VerticalBarChart
