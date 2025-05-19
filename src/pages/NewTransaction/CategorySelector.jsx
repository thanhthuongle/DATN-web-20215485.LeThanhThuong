import React, { useEffect, useState } from 'react'
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, List, ListItemButton, Collapse, ListItemText, Radio
} from '@mui/material'
import { ExpandLess, ExpandMore } from '@mui/icons-material'
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight'
import { getIndividualCategoryAPI } from '~/apis'
import { createSearchParams } from 'react-router-dom'

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

const CategorySelector = ({ transactionType, onChange, value, error, sx = {} }) => {
  const [categories, setCategories] = useState([])
  const treeData = buildTree(categories)


  const [open, setOpen] = useState(false)
  const [expanded, setExpanded] = useState({})
  const [selected, setSelected] = useState(null)
  const [selectedName, setSelectedName] = useState(null)

  const toggleExpand = (id) => {
    setExpanded(prev => ({ ...prev, [id]: !prev[id] }))
  }

  const handleSelect = (id) => {
    setSelected(id)
  }

  const renderCategory = (cat) => {
    const hasChildren = cat.children?.length > 0
    return (
      <React.Fragment key={cat._id}>
        <ListItemButton onClick={() => handleSelect(cat._id)}>
          <Radio
            checked={selected === cat._id}
            value={cat._id}
            onChange={() => handleSelect(cat._id)}
          />
          <ListItemText primary={cat.name} />
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
    const selectedCat = categories?.find(c => c._id === selected)
    setSelectedName(selectedCat?.name)
    onChange(selectedCat)
    // console.log('Bạn đã chọn:', selectedCat)
    setOpen(false)
  }

  const updateStateData = (res) => {
    setCategories(res || [])
  }

  useEffect(() => {
    const searchPath = `?${createSearchParams({ 'q[type]': transactionType })}`
    getIndividualCategoryAPI(searchPath).then(updateStateData)
    if (!value) {
      setSelected(null)
      setSelectedName(null)
    } else {
      setSelected(value._id)
      setSelectedName(value.name)
    }
  }, [transactionType, value])

  return (
    <>
      <Button
        variant="outlined"
        endIcon={<KeyboardArrowRightIcon />}
        sx={{ textTransform: 'none', minWidth: '300px', paddingY: 1, borderColor: error ? 'error.main' : undefined, ...sx }}
        onClick={() => setOpen(true)}
      >{selectedName ?? 'Chọn hạng mục...'}</Button>
      <Dialog
        open={open}
        fullWidth
        maxWidth="sm"
        onClose={() => setOpen(false)}
      >
        <DialogTitle>Chọn hạng mục</DialogTitle>
        <DialogContent dividers>
          <List>
            {treeData.map(cat => renderCategory(cat))}
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Hủy</Button>
          <Button onClick={handleConfirm} disabled={!selected} variant="contained">OK</Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default CategorySelector
