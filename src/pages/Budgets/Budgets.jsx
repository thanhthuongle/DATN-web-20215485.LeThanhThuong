import React, { useEffect, useState } from 'react'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import OverviewChart from './overviewChart'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import Select from '@mui/material/Select'
import InputLabel from '@mui/material/InputLabel'
import { StyledBox } from '../Overview/Overview'
import Grid from '@mui/material/Grid'
import Divider from '@mui/material/Divider'
import { Typography } from '@mui/material'
import { NumericFormat } from 'react-number-format'
import BudgetItem from './BudgetItem'

const totalExpense='500000'
const totalBudget='1500000'

const budgetDatas = [
  { '02/04/2025-13/04/2025': [
    {
      categoryName: 'Tên hạng mục số 1',
      totalBudget: 400000,
      totalExpense: 37020,
      subCatergory: Array.from({ length: 3 }, (_, i) => ({
        categoryName: `Tên hạng mục số ${i}.1`,
        totalBudget: 123456,
        totalExpense: 12340
      }))
    },
    {
      categoryName: 'Tên hạng mục số 2',
      totalBudget: 347669,
      totalExpense: 34567
    }
  ] },
  { '01/03/2025-30/03/2025': Array.from({ length: 5 }, (_, i) => ({
    categoryName: `Tên hạng mục số ${i}`,
    totalBudget: 123456,
    totalExpense: 1234
  })) },
  { '02/02/2025-17/02/2025': Array.from({ length: 5 }, (_, i) => ({
    categoryName: `Tên hạng mục số ${i}`,
    totalBudget: 34562,
    totalExpense: 24531
  })) },
  { '05/01/2025-27/01/2025': [{
    categoryName: 'Tên hạng mục số 1',
    totalBudget: 1234,
    totalExpense: 34567
  }] }
]

function Budgets() {
  const [selectedBudgetApplying, setSelectedBudgetApplying] = useState('')
  const [selectedBudgetType, setSelectedBudgetType] = useState('')
  const budgetApplyings = [
    'Tuần này',
    'Tháng này',
    'Quý này',
    'Năm này',
    '12/5-07/6'
  ]
  const budgetType = {
    APPLYING: 'Đang áp dụng',
    FINISHED: 'Đã kết thúc'
  }
  useEffect(() => {
    if (budgetApplyings?.length > 0) setSelectedBudgetApplying(budgetApplyings[0])
    setSelectedBudgetType(budgetType.APPLYING)
  }, [])
  const handleSelectBudgetApplying = (event) => {
    const value = event.target.value
    setSelectedBudgetApplying(value)
    console.log('Bạn chọn ngân sách:', value)
  }
  const handleSelectBudgetType = (event) => {
    const value = event.target.value
    setSelectedBudgetType(value)
    console.log('Bạn chọn:', value)
  }
  return (
    <Box
      width='100%'
      display='flex'
      flexDirection='column'
      alignItems='center'
      gap={2}
    >
      {/* overview */}
      <StyledBox width='100%'>
        <Grid container width='100%' display='flex'>
          <Grid size={{ xs: 12, md: 3.5 }}>
            <Box width='100%' display='flex' flexDirection='column' gap={3} alignItems='center' marginBottom={2} >
              <FormControl variant="outlined" sx={{ width: 150, borderRadius: '4px' }}>
                <InputLabel id="budget-type-label">Loại ngân sách</InputLabel>
                <Select
                  labelId="budget-type-label"
                  id="budget-type"
                  label="Loại ngân sách"
                  onChange={handleSelectBudgetType}
                  value={selectedBudgetType}
                  defaultValue={budgetType.APPLYING}
                >
                  <MenuItem value={budgetType.APPLYING}>{budgetType.APPLYING}</MenuItem>
                  <MenuItem value={budgetType.FINISHED}>{budgetType.FINISHED}</MenuItem>
                </Select>
              </FormControl>
              <FormControl variant="outlined" sx={{ width: 150, borderRadius: '4px' }}>
                <InputLabel id="budget-label">Ngân sách</InputLabel>
                <Select
                  labelId="budget-label"
                  id="budget"
                  label="Ngân sách"
                  onChange={handleSelectBudgetApplying}
                  value={selectedBudgetApplying}
                >
                  {budgetApplyings?.map((budget, index) => {
                    return <MenuItem key={index} value={budget}>{budget}</MenuItem>
                  })}
                </Select>
              </FormControl>
            </Box>
          </Grid>
          <Grid size={{ xs: 12, md: 8.5 }}>
            <Box flex={1} display='flex' flexDirection='column' alignItems='center' justifyContent='center' gap={1}>
              <OverviewChart
                totalExpense={totalExpense}
                totalBudget={totalBudget}
                budgetTypeProp={selectedBudgetType}
              />
              <Box
                sx={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  bgcolor: 'background.paper',
                  gap: 2,
                  '& svg': {
                    m: 1
                  }
                }}
              >
                <Box display='flex' flexDirection='column' justifyContent='center' alignItems='center'>
                  <NumericFormat
                    displayType='text'
                    thousandSeparator="."
                    decimalSeparator=","
                    allowNegative={false}
                    suffix="&nbsp;₫"
                    value={totalBudget}
                  />
                  <Typography>Tổng ngân sách</Typography>
                </Box>
                <Divider orientation="vertical" variant="middle" flexItem />
                {selectedBudgetType == budgetType.APPLYING &&
                <Box display='flex' flexDirection='column' justifyContent='center' alignItems='center'>
                  <NumericFormat
                    displayType='text'
                    thousandSeparator="."
                    decimalSeparator=","
                    allowNegative={false}
                    suffix="&nbsp;₫"
                    value={totalExpense}
                  />
                  <Typography>Tổng đã chi</Typography>
                </Box>}
                {selectedBudgetType == budgetType.FINISHED &&
                <Box display='flex' flexDirection='column' justifyContent='center' alignItems='center'>
                  <NumericFormat
                    displayType='text'
                    thousandSeparator="."
                    decimalSeparator=","
                    allowNegative={false}
                    suffix="&nbsp;₫"
                    value={totalBudget - totalExpense}
                  />
                  <Typography>Còn lại</Typography>
                </Box>}
                <Divider orientation="vertical" variant="middle" flexItem />
                {selectedBudgetType == budgetType.APPLYING &&
                <Box display='flex' flexDirection='column' justifyContent='center' alignItems='center'>
                  <Typography>n</Typography> {/*//TODO: Tính toán thòi gian */}
                  <Typography>Ngày còn lại</Typography>
                </Box>}
                {selectedBudgetType == budgetType.FINISHED &&
                <Box display='flex' flexDirection='column' justifyContent='center' alignItems='center'>
                  <Typography>k</Typography> {/*//TODO: Tính toán thòi gian */}
                  <Typography>Ngày</Typography>
                </Box>}
              </Box>
            </Box>
          </Grid>
        </Grid>
      </StyledBox>

      {/* Tạo ngân sách */}
      <Button variant='contained'>tạo ngân sách</Button>

      {/* Danh sách hạng mục được lập ngân sách */}
      {budgetDatas?.length > 0 &&
        <Box width={'100%'}>
          {budgetDatas?.map((budgetData, index) => {
            const [dateRange, budgets] = Object.entries(budgetData)[0]
            return (
              <StyledBox key={index} marginBottom={2}>
                <Typography fontWeight={'bold'}>{dateRange}</Typography>
                {budgets?.map((budget, subIndex) => (
                  <Box key={subIndex}>
                    <BudgetItem
                      title={budget.categoryName}
                      totalBudget={budget.totalBudget}
                      totalExpense={budget.totalExpense}
                      sx={{
                        borderTop: 1,
                        borderColor: (theme) => theme.palette.mode === 'light' ? '#ccc' : '#666'
                      }}
                    />
                    {budget?.subCatergory?.map((subBudget, subBudgetIndex) => {

                      return (
                        <BudgetItem
                          key={subBudgetIndex}
                          title={subBudget.categoryName}
                          totalBudget={subBudget.totalBudget}
                          totalExpense={subBudget.totalExpense}
                          logoSize='32px'
                          sx={{
                            borderColor: (theme) => theme.palette.mode === 'light' ? '#eee' : '#555',
                            borderTopStyle: 'dotted'
                          }}
                        />
                      )
                    })}
                  </ Box>
                ))}
              </StyledBox>
            )
          })}
        </Box>
      }
    </ Box>
  )
}

export default Budgets