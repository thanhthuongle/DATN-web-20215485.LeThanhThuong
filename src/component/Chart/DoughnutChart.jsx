import React from 'react'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
import { Doughnut } from 'react-chartjs-2'
import { Box, Grid, Typography } from '@mui/material'
import SquareIcon from '@mui/icons-material/Square'
import randomColor from 'randomcolor'
import { slugify } from '~/utils/formatters'

ChartJS.register(ArcElement, Tooltip, Legend)

const options = {
  responsive: true,
  maintainAspectRatio: false,
  layout: {
    padding: 0
  },
  plugins: {
    legend: {
      display: false,
      // position: 'right',
      // labels: {
      //   boxWidth: 10,
      //   boxHeight: 10
      // }
    }
  }
}
const processData = (data, topExpense = 7) => {
  const totalAmount = data.reduce((sum, item) => sum + item.info.amount, 0)

  // Sắp xếp theo amount giảm dần
  const sorted = [...data].sort((a, b) => b.info.amount - a.info.amount)

  const topCategories = sorted.slice(0, topExpense)

  const topTotal = topCategories.reduce((sum, item) => sum + item.info.amount, 0)
  const othersTotal = totalAmount - topTotal

  const finalData = [...topCategories]

  if (othersTotal > 0) {
    finalData.push({
      categoryId: 'Khac',
      info: {
        categoryName: 'Khác',
        amount: othersTotal
      }
    })
  }

  const categoryLists = finalData.map(item => {
    const percent = ((item.info.amount / totalAmount) * 100).toFixed(1)
    return `${item.info.categoryName} (${percent}%)`
  })

  const percentageLists = finalData.map(item => Number(item.info.amount))

  const colorLists = finalData.map(item => randomColor({ luminosity: 'bright', hue: 'random', seed: slugify(item.info.categoryName) }))

  return { categoryLists, percentageLists, colorLists }
}

function DoughnutChart({ dataProp }) {
  const processedData =processData(dataProp)
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
