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
  maintainAspectRatio: false,
  elements: {
    bar: {
      // borderRadius: 4,
    }
  },
  plugins: {
    legend: {
      display: false
    },
    title: {
      display: false
    }
  },
  scales: {
    x: {
      ticks: { display: false }, // 👈 Ẩn số trục X
      grid: { display: false }, // 👈 Ẩn lưới ngang trục X
      border: { display: false }
    },
    y: {
      ticks: { display: false }, // 👈 Ẩn số trục Y
      grid: { display: false }, // 👈 Ẩn lưới ngang trục Y
      border: { display: false }
    }
  }
}

const labels = ['Tình hình thu chi']

function BarChart({ income, expense }) {
  const data = {
    labels,
    datasets: [
      {
        label: 'Thu',
        data: [income],
        backgroundColor: '#27ae60',
        categoryPercentage: 1,
        barPercentage: 0.7
      },
      {
        label: 'Chi',
        data: [expense],
        backgroundColor: '#e74c3c',
        categoryPercentage: 1,
        barPercentage: 0.7
      }
    ]
  }
  return (
    <Box sx={{ minHeight: '200px' }}>
      <Bar options={options} data={data} />
    </Box>
  )
}

export default BarChart
