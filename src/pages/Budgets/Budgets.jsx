import React, { useEffect, useState } from 'react'
import Box from '@mui/material/Box'
import OverviewChart from './overviewChart'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import Select from '@mui/material/Select'
import InputLabel from '@mui/material/InputLabel'
import { StyledBox } from '../Overview/Overview'
import Grid from '@mui/material/Grid'
import Divider from '@mui/material/Divider'
import { Modal, Typography } from '@mui/material'
import { NumericFormat } from 'react-number-format'
import BudgetItem from './BudgetItem'
import { getIndividualBudgetAPI } from '~/apis'
import _ from 'lodash'
import moment from 'moment'
import PageLoadingSpinner from '~/component/Loading/PageLoadingSpinner'
import { createSearchParams } from 'react-router-dom'
import Create from './Create'
import BudgetPopup from './BudgetPopup'

function transformCategories(categories) {
  const categoryMap = new Map()
  const result = []

  // B1: Tạo Map từ categoryId → category
  categories.forEach(cat => {
    categoryMap.set(cat.categoryId.toString(), { ...cat }) // clone tránh ảnh hưởng gốc
  })

  const processed = new Set()

  // B2: Duyệt tất cả categories
  for (const cat of categories) {
    // Nếu là parent
    if (cat.childrenIds && cat.childrenIds.length > 0) {
      const subCategories = []

      for (const childId of cat.childrenIds) {
        if (categoryMap.has(childId.toString())) {
          subCategories.push(categoryMap.get(childId.toString()))
          processed.add(childId.toString()) // đánh dấu đã xử lý (xoá khỏi root sau)
        }
      }

      const newCat = {
        ...cat,
        subCategories
      }

      // Xoá fields không cần
      delete newCat.childrenIds
      delete newCat.parentIds

      result.push(newCat)
      processed.add(cat.categoryId.toString())
    } else if (!processed.has(cat.categoryId.toString())) {
      // Nếu không là con & chưa bị xử lý thì giữ lại
      const newCat = { ...cat }
      delete newCat.childrenIds
      delete newCat.parentIds
      result.push(newCat)
    }
  }

  return result
}

const budgetType = {
  APPLYING: 'Đang áp dụng',
  FINISHED: 'Đã kết thúc'
}

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: { xs: '100%', sm: 700 },
  maxHeight: '80vh',
  overflowY: 'auto',
  bgcolor: 'background.paper',
  // border: '2px solid #000',
  boxShadow: 24,
  p: 2
}

function Budgets() {
  const [openModal, setOpenModal] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [selectedCategoryBudget, setSelectedCategoryBudget] = useState(null)
  const [selectedBudgetType, setSelectedBudgetType] = useState(budgetType.APPLYING)
  const [selectedBudgetApplying, setSelectedBudgetApplying] = useState(null)
  const [data, setData] = useState(null)

  const handleOpenModal = async (categoryBudget) => {
    setSelectedCategoryBudget(categoryBudget)
    setOpenModal(true)
  }

  const handleSelectBudgetApplying = (event) => {
    const value = event.target.value
    setSelectedBudgetApplying(value)
    // console.log('Bạn chọn ngân sách:', value)
  }
  const handleSelectBudgetType = async (event) => {
    const value = event.target.value
    setSelectedBudgetType(value)
    // console.log('Bạn chọn:', value)
    if (value == budgetType.APPLYING) await getData(false)
    else await getData(true)
  }

  const updateStateData = (res) => {
    if (res.length > 0) {
      const transformedBudgets = _.map(res, (budget) => ({
        ...budget,
        totalAmount: budget.categories.reduce((acc, category) => acc + Number(category.amount), 0),
        totalSpent: budget.categories.reduce((acc, category) => acc + Number(category.spent), 0),
        budgetName: `${moment(budget.startTime).format('DD/MM/YYYY')} - ${moment(budget.endTime).format('DD/MM/YYYY')}`,
        categories: transformCategories(budget.categories)
      }))
      const sorted = _.orderBy(transformedBudgets, ['startTime', 'endTime', 'totalAmount'], ['asc', 'asc', 'desc'])
      if (sorted && Array.isArray(sorted) && sorted.length > 0) setSelectedBudgetApplying(sorted[0])
      setData(sorted)
    } else {
      setSelectedBudgetApplying({})
      setData([])
    }
  }

  const getData = async (isFinish) => {
    setIsLoading(true)
    getIndividualBudgetAPI(`?${createSearchParams({ 'q[isFinish]': isFinish })}`)
      .then(updateStateData)
      .finally(() => {
        setIsLoading(false)
      })
  }

  const afterCreateNew = async () => {
    if (selectedBudgetType == budgetType.APPLYING) await getData(false)
    else await getData(true)
  }

  useEffect(() => {
    setIsLoading(true)
    const fetchData = async () => {
      getIndividualBudgetAPI()
        .then(updateStateData)
        .finally(() => {
          setIsLoading(false)
        })
    }

    fetchData()
  }, [])

  // if (!data) {
  //   return <PageLoadingSpinner caption={'Loading data...'} />
  // }
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
          <Grid size={{ xs: 12, md: _.isEmpty(data) && !isLoading ? 12 : 3.5 }}>
            <Box width='100%' display='flex' flexDirection='column' gap={3} alignItems='center' marginBottom={2} >

              {/* Loại ngân sách */}
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

              {/* Danh sách ngân sách */}
              {_.isEmpty(data) ? (<></>) : (
                <FormControl variant="outlined" sx={{ borderRadius: '4px' }}>
                  <InputLabel id="budget-label">Ngân sách</InputLabel>
                  <Select
                    labelId="budget-label"
                    id="budget"
                    label="Ngân sách"
                    onChange={handleSelectBudgetApplying}
                    value={selectedBudgetApplying}
                    MenuProps={{
                      PaperProps: {
                        style: {
                          maxHeight: 250,
                          overflowY: 'auto'
                        }
                      }
                    }}
                    disabled= {(isLoading && !data) ? true : false}
                  >
                    {data?.map((budget) => {
                      return <MenuItem key={budget._id} value={budget}>{budget.budgetName}</MenuItem>
                    })}
                  </Select>
                </FormControl>
              )}
            </Box>
          </Grid>

          {/* Biểu đồ */}
          {(isLoading && !data)
            ?
            <Grid size={{ xs: 12, md: 8.5 }} display={'flex'} alignItems={'center'} justifyContent={'center'}>
              <PageLoadingSpinner sx={{ height: '' }} />
            </Grid>
            :
            <>
              {_.isEmpty(data) ? ( <></> ) : (
                <Grid size={{ xs: 12, md: 8.5 }}>
                  <Box flex={1} display='flex' flexDirection='column' alignItems='center' justifyContent='center' gap={1}>
                    <OverviewChart
                      totalExpense={selectedBudgetApplying.totalSpent}
                      totalBudget={selectedBudgetApplying.totalAmount}
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
                          value={selectedBudgetApplying.totalAmount}
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
                          value={selectedBudgetApplying.totalSpent}
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
                          value={selectedBudgetApplying.totalAmount - selectedBudgetApplying.totalSpent}
                        />
                        <Typography>Còn lại</Typography>
                      </Box>}
                      <Divider orientation="vertical" variant="middle" flexItem />
                      {selectedBudgetType == budgetType.APPLYING &&
                      <Box display='flex' flexDirection='column' justifyContent='center' alignItems='center'>
                        <Typography>{moment(selectedBudgetApplying.endTime).diff(moment(), 'days')}</Typography>
                        <Typography>Ngày còn lại</Typography>
                      </Box>}
                      {selectedBudgetType == budgetType.FINISHED &&
                      <Box display='flex' flexDirection='column' justifyContent='center' alignItems='center'>
                        <Typography>{moment(selectedBudgetApplying.endTime).diff(moment(selectedBudgetApplying.startTime), 'days')}</Typography>
                        <Typography>Ngày</Typography>
                      </Box>}
                    </Box>
                  </Box>
                </Grid>
              )}
            </>
          }
        </Grid>
      </StyledBox>

      {/* Tạo ngân sách */}
      {/* <Button variant='contained'>tạo ngân sách</Button> */}
      <Create afterCreateNew={afterCreateNew} isLoading={isLoading} />

      {_.isEmpty(data) && !isLoading &&
        <Box display={'flex'} height={'20vh'} alignItems={'center'}>
          <Typography>Bạn chưa có ngân sách nào {selectedBudgetType}</Typography>
        </ Box>
      }

      {/* Danh sách hạng mục được lập ngân sách */}
      {(!isLoading || data) &&
      <>
        {selectedBudgetApplying?.categories?.length > 0 &&
          <Box width={'100%'}>
            <StyledBox marginBottom={2}>
              <Typography fontWeight={'bold'}>{selectedBudgetApplying.budgetName}</Typography>
              {selectedBudgetApplying.categories?.map((category) => (
                <Box key={category.categoryId} display={'flex'} flexDirection={'column'} gap={2}>
                  <Box
                    onClick={() => handleOpenModal(category)}
                  >
                    <BudgetItem
                      logo={category?.icon}
                      title={category.categoryName}
                      totalBudget={category.amount}
                      totalExpense={category.spent}
                      sx={{
                        cursor: 'pointer',
                        '&:hover': {
                          backgroundColor: 'action.hover'
                        },
                        borderTop: 1,
                        borderColor: (theme) => theme.palette.mode === 'light' ? '#ccc' : '#666'
                      }}
                    />
                  </ Box>
                  {category?.subCategories?.map((subCategory) => (
                    <Box
                      key={subCategory.categoryId}
                      onClick={() => handleOpenModal(category)}
                    >
                      <BudgetItem
                        // key={subCategory.categoryId}
                        title={subCategory.categoryName}
                        totalBudget={subCategory.amount}
                        totalExpense={subCategory.spent}
                        logoSize='32px'
                        sx={{
                          cursor: 'pointer',
                          '&:hover': {
                            backgroundColor: 'action.hover'
                          },
                          borderColor: (theme) => theme.palette.mode === 'light' ? '#eee' : '#555',
                          borderTopStyle: 'dotted'
                        }}
                      />
                    </ Box>
                  )
                  )}
                </ Box>
              ))}
            </StyledBox>
          </Box>
        }
      </>
      }
      {(isLoading && !data) &&
        <PageLoadingSpinner caption={'Đang tải dữ liệu...'} sx={{ height: '', paddingTop: '10%' }} />
      }

      <Modal
        open={openModal}
        onClose={() => setOpenModal(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <BudgetPopup commonData={selectedBudgetApplying} budget={selectedCategoryBudget} handleCancel={() => setOpenModal(false)} />
        </Box>
      </Modal>
    </ Box>
  )
}

export default Budgets