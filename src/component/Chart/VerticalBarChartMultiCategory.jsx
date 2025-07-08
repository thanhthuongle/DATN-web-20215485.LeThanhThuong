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
import { createSearchParams } from 'react-router-dom'
import { TRANSACTION_TYPES } from '~/utils/constants'
import { getIndividualCategoryAPI } from '~/apis'
import randomColor from 'randomcolor'
import { slugify } from '~/utils/formatters'
import ChartDataLabels from 'chartjs-plugin-datalabels'

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartDataLabels
)

const options = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: true
    },
    title: {
      display: false
    },
    tooltip: {
      callbacks: {
        label: function (context) {
          const value = context.raw
          const label = context.dataset.label
          const formatted = new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
          }).format(value)
          return `${label}: ${formatted}`
        }
      }
    },
    datalabels: {
      display: (context) => {
        // chỉ hiển thị khi là cột cuối cùng của chồng
        const datasetIndex = context.datasetIndex
        const datasets = context.chart.data.datasets
        return datasetIndex === datasets.length - 1
      },
      anchor: 'end',
      align: 'end',
      offset: -4,
      formatter: function (value, context) {
        const datasets = context.chart.data.datasets
        const dataIndex = context.dataIndex
        const total = datasets.reduce((acc, ds) => acc + (ds.data[dataIndex] || 0), 0)
        return total.toLocaleString('vi-VN')
      },
      color: '#000',
      font: { weight: 'bold' },
      clip: false
    }
  },
  scales: {
    x: {
      stacked: true
    },
    y: {
      stacked: true,
      ticks: {
        callback: function (value) {
          if (value >= 1_000_000_000) return value / 1_000_000_000 + 'B'
          if (value >= 1_000_000) return value / 1_000_000 + 'M'
          if (value >= 1_000) return value / 1_000 + 'K'
          return value
        }
      }
    }
  }
}

function generateMonthlyCategorySummary(startTime, endTime, transactions, categories = [], topN = 5) {
  const monthLabels = []
  const categoryMapByMonth = {}

  const current = startTime.clone().startOf('month')
  const end = endTime.clone().startOf('month')

  // Tạo map từ _id -> category object để tra nhanh
  const categoryById = {}
  categories.forEach(cat => {
    categoryById[cat._id] = {
      ...cat,
      _id: cat._id?.$oid || cat._id // normalize nếu dùng từ MongoDB raw
    }
  })

  while (current.isSameOrBefore(end)) {
    const monthKey = current.format('MM/YYYY')
    monthLabels.push(monthKey)
    categoryMapByMonth[monthKey] = {}

    const monthTransactions = transactions.filter(item => {
      if (!item.transactionTime) return false
      return moment(item.transactionTime).isSame(current, 'month')
    })

    monthTransactions.forEach(tx => {
      const categoryId = tx?.category?._id
      if (!categoryId) return

      // Tìm category tương ứng
      const category = categoryById[categoryId]
      if (!category) return

      // Nếu là hạng mục con thì lấy parent (nếu có), không thì chính nó
      const parentId = category.parentIds?.[0] || category._id
      const parentCategory = categoryById[parentId] || category

      if (!categoryMapByMonth[monthKey][parentId]) {
        categoryMapByMonth[monthKey][parentId] = {
          amount: 0,
          name: parentCategory.name,
          icon: parentCategory.icon
        }
      }

      categoryMapByMonth[monthKey][parentId].amount += tx.amount || 0
    })

    current.add(1, 'month')
  }

  // Tính tổng từng hạng mục
  const categoryTotalMap = {}
  for (const month of Object.values(categoryMapByMonth)) {
    for (const [catId, data] of Object.entries(month)) {
      if (!categoryTotalMap[catId]) {
        categoryTotalMap[catId] = {
          amount: 0,
          name: data.name,
          icon: data.icon
        }
      }
      categoryTotalMap[catId].amount += data.amount
    }
  }

  const allCategories = Object.entries(categoryTotalMap)
    .map(([catId, info]) => ({ catId, name: info.name, icon: info.icon }))

  const colorMap = {}
  allCategories.forEach(({ catId, name }) => {
    colorMap[catId] = randomColor({
      luminosity: 'bright',
      hue: 'random',
      seed: slugify(name + name)
    })
  })

  const datasets = allCategories.map(({ catId, name }) => ({
    label: name,
    backgroundColor: colorMap[catId],
    data: monthLabels.map(label => categoryMapByMonth[label]?.[catId]?.amount || 0)
  }))

  return {
    labels: monthLabels,
    datasets
  }
}

function VerticalBarChartMultiCategry({ startTime, endTime, transactions }) {
  const [processedData, setProcessedData] = useState(null)

  useEffect(() => {
    const getCategory = async () => {
      const searchCategoryPath = `?${createSearchParams({ 'q[type]': [TRANSACTION_TYPES.EXPENSE, TRANSACTION_TYPES.LOAN, TRANSACTION_TYPES.REPAYMENT] })}`
      const res = await getIndividualCategoryAPI(searchCategoryPath)
      if (startTime && endTime && transactions) {
        const result = generateMonthlyCategorySummary(startTime, endTime, transactions, res, 5)
        setProcessedData(result)
      }
    }
    getCategory()
  }, [endTime, startTime, transactions])

  // useEffect(() => {
  //   if (startTime && endTime && transactions) {
  //     const result = generateMonthlyCategorySummary(startTime, endTime, transactions, categories, 5)
  //     setProcessedData(result)
  //   }
  // }, [categories, endTime, startTime, transactions])

  const data = {
    labels: processedData?.labels || [],
    datasets: processedData?.datasets || []
  }

  if (!processedData) {
    return <PageLoadingSpinner sx={{ height: '100%' }} />
  }

  return (
    <Box width='100%' height={'450px'}>
      <Bar options={options} data={data} />
    </Box>
  )
}

export default VerticalBarChartMultiCategry
