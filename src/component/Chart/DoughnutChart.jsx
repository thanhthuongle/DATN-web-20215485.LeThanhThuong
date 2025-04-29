import React from 'react'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
import { Doughnut } from 'react-chartjs-2'
import { Box, Grid, Typography } from '@mui/material'
import SquareIcon from '@mui/icons-material/Square'

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

function DoughnutChart({ categoryLists, percentageLists, colorLists }) {
  const data = {
    labels: categoryLists,
    datasets: [
      {
        label: '',
        data: percentageLists,
        backgroundColor: colorLists,
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
