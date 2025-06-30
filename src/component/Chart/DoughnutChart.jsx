import React from 'react'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
import { Doughnut } from 'react-chartjs-2'
import { Box, Grid, Typography } from '@mui/material'
import SquareIcon from '@mui/icons-material/Square'
import randomColor from 'randomcolor'
import { formatPercentage, slugify } from '~/utils/formatters'

ChartJS.register(ArcElement, Tooltip, Legend)

const options = {
  responsive: true,
  maintainAspectRatio: false,
  layout: {
    padding: 0
  },
  plugins: {
    legend: {
      display: false
      // position: 'right',
      // labels: {
      //   boxWidth: 10,
      //   boxHeight: 10
      // }
    }
  }
}
const processData = (data, topExpense = 7) => {
  const totalAmount = data.reduce((sum, item) => sum + item.amount, 0)

  // Sắp xếp theo amount giảm dần
  const sorted = [...data].sort((a, b) => b.amount - a.amount)

  const topCategories = sorted.slice(0, topExpense)

  const topTotal = topCategories.reduce((sum, item) => sum + item.amount, 0)
  const othersTotal = totalAmount - topTotal

  const finalData = [...topCategories]

  if (othersTotal > 0) {
    finalData.push({
      categoryId: 'Khac',
      categoryName: 'Loại khác',
      amount: othersTotal
    })
  }

  const categoryLists = finalData.map(item => {
    if (item.amount <= 0) return `${item.categoryName} (0%)`

    const percent = formatPercentage(2, 8, item?.amount, totalAmount)

    return `${item.categoryName} (${percent}%)`
  })

  const percentageLists = finalData.map(item => Number(item.amount))

  const colorLists = finalData.map(item => randomColor({ luminosity: 'bright', hue: 'random', seed: slugify(item.categoryName) }))

  return { categoryLists, percentageLists, colorLists }
}

function DoughnutChart({ dataProp }) {
  // console.log('🚀 ~ DoughnutChart ~ dataProp:', dataProp)
  const processedData = processData(dataProp)
  const data = {
    labels: processedData.categoryLists,
    datasets: [
      {
        label: '',
        data: processedData.percentageLists,
        backgroundColor: processedData.colorLists,
        borderWidth: 1
      }
    ]
  }
  return (
    <Grid container spacing={{ xs: 1, sm: 5 }} sx={{ justifyContent: 'center', alignItems: 'center' }}>
      <Box sx={{ height: '200px', width: '200px' }}>
        <Doughnut options={options} data={data} />
      </Box >
      <Box maxHeight='200px' overflow='auto' paddingX={2}>
        {data?.labels?.map((label, index) => (
          <Box
            color={data.datasets[0].backgroundColor[index]}
            key={index}
            display='flex'
            alignItems='center'
            gap={0.5}
          >
            <SquareIcon sx={{ width: '12px', height: '12px', color: 'inherit' }} />
            <Typography>{label}</Typography>
          </Box>
        ))}
      </Box>
    </Grid>
  )
}

export default DoughnutChart
