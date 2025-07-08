import React, { useEffect, useState } from 'react'
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
import moment from 'moment'
import PageLoadingSpinner from '../Loading/PageLoadingSpinner'

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
  plugins: {
    legend: {
      display: false
    },
    title: {
      display: false
    },
    datalabels: {
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

function generateMonthlySummary(startTime, endTime, transactions) {
  const labelData = []
  const totalAmountData = []

  const current = startTime.clone().startOf('month')
  const end = endTime.clone().startOf('month')

  while (current.isSameOrBefore(end)) {
    const monthLabel = current.format('MM/YYYY')
    labelData.push(monthLabel)

    const total = transactions
      .filter(item => {
        if (!item.transactionTime) return false
        const transTime = moment(item.transactionTime)
        return transTime.isSame(current, 'month')
      })
      .reduce((sum, item) => sum + item.amount, 0)

    totalAmountData.push(total)
    current.add(1, 'month')
  }

  return { labelData, totalAmountData }
}


function VerticalBarChart({ startTime, endTime, transactions }) {
  const [processedData, setProcessedData] = useState(null)
  const data = {
    labels: processedData?.labelData || [],
    datasets: [
      {
        label: 'Chi',
        data: processedData?.totalAmountData || [],
        backgroundColor: '#00aff0', // #00aff0
        barPercentage: 0.9,
        maxBarThickness: 40
      }
    ]
  }

  useEffect(() => {
    if (startTime && endTime && transactions) {
      const result = generateMonthlySummary(startTime, endTime, transactions)
      setProcessedData(result)
    }
  }, [endTime, startTime, transactions])

  if (!processedData) {
    return <PageLoadingSpinner sx={{ height: '100%' }} />
  }

  return (
    <Box width='100%' height={'450px'}>
      <Bar options={options} data={data} />
    </Box>
  )
}

export default VerticalBarChart
