import React, { useEffect, useState } from 'react'
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, List, ListItemButton, Collapse, ListItemText, Radio
} from '@mui/material'
import { ExpandLess, ExpandMore } from '@mui/icons-material'
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight'
import { getIndividualCategoryAPI } from '~/apis'
import { createSearchParams } from 'react-router-dom'
import FinanceItem1 from '~/component/FinanceItemDisplay/FinanceItem1'

const buildTree = (categories) => {
  const map = {}
  const roots = []

  categories?.forEach(cat => map[cat._id] = { ...cat, children: [] })
  categories?.forEach(cat => {
    if (cat.parentIds[0]) {
      map[cat.parentIds[0]]?.children.push(map[cat._id])
    } else {
      roots.push(map[cat._id])
    }
  })

  return roots
}

const CategorySelector = ({ transactionType, onChange, value, error, viewOnly = false, sx = {} }) => {
  const [categories, setCategories] = useState([])
  const treeData = buildTree(categories)

  const [open, setOpen] = useState(false)
  const [expanded, setExpanded] = useState({})
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [selectedTempCategory, setSelectedTempCategory] = useState(null)
  // const [selected, setSelected] = useState(null)
  // const [selectedName, setSelectedName] = useState(null)

  const toggleExpand = (id) => {
    setExpanded(prev => ({ ...prev, [id]: !prev[id] }))
  }

  const handleSelect = (category) => {
    setSelectedTempCategory(category)
  }

  const renderCategory = (cat) => {
    const hasChildren = cat.children?.length > 0
    return (
      <React.Fragment key={cat._id}>
        <ListItemButton onClick={() => handleSelect(cat)}>
          <Radio
            checked={selectedTempCategory?._id === cat._id}
            value={cat._id}
            onChange={() => handleSelect(cat)}
          />
          <ListItemText >
            <FinanceItem1
              key={cat?._id}
              logo={cat?.icon}
              title={cat?.name}
              sx={{ padding: 0 }}
            />
          </ListItemText>
          {hasChildren ? (
            <Button
              size="small"
              onClick={(e) => {
                e.stopPropagation()
                toggleExpand(cat._id)
              }}
            >
              {expanded[cat._id] ? <ExpandLess /> : <ExpandMore />}
            </Button>
          ) : null}
        </ListItemButton>

        {hasChildren && (
          <Collapse in={expanded[cat._id]} timeout="auto" unmountOnExit>
            <List component="div" disablePadding sx={{ pl: 4 }}>
              {cat.children.map(child => renderCategory(child))}
            </List>
          </Collapse>
        )}
      </React.Fragment>
    )
  }

  const handleConfirm = () => {
    setSelectedCategory(selectedTempCategory)
    onChange(selectedTempCategory) // Thay đổi giá trị trong react hook form
    // console.log('Bạn đã chọn:', selectedCat)
    setOpen(false)
  }

  const updateStateData = (res) => {
    setCategories(res || [])
  }

  useEffect(() => {
    if (!viewOnly) {
      const searchPath = `?${createSearchParams({ 'q[type]': transactionType })}`
      getIndividualCategoryAPI(searchPath).then(updateStateData)
    }
    if (!value) {
      setSelectedTempCategory(null)
      setSelectedCategory(null)
    } else {
      setSelectedTempCategory(value)
      setSelectedCategory(value)
    }
  }, [transactionType, value, viewOnly])

  return (
    <>
      <Button
        variant="outlined"
        endIcon={viewOnly ? '' : <KeyboardArrowRightIcon />}
        sx={{
          textTransform: 'none',
          minWidth: { xs: 'auto', sm: '300px' },
          paddingY: 1,
          borderColor: error ? 'error.main' : undefined,
          ...sx
        }}
        onClick={() => {
          if (!viewOnly) setOpen(true)
        }}
      >
        {/* {selectedCategory?.name ?? 'Chọn hạng mục...'} */}
        {selectedCategory
          ? <FinanceItem1
            key={selectedCategory?._id}
            logo={selectedCategory?.icon}
            title={selectedCategory?.name}
            sx={{ padding: 0 }}
          />
          : 'Chọn hạng mục...'}
      </Button>
      <Dialog
        open={open}
        fullWidth
        maxWidth="sm"
        // onClose={() => setOpen(false)}
      >
        <DialogTitle>Chọn hạng mục</DialogTitle>
        <DialogContent dividers>
          <List>
            {treeData.map(cat => renderCategory(cat))}
          </List>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setSelectedTempCategory(selectedCategory)
              setOpen(false)
            }}
          >Hủy</Button>
          <Button onClick={handleConfirm} disabled={!selectedTempCategory} variant="contained">OK</Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default CategorySelector
