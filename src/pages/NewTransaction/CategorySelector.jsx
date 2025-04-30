import React, { useState } from 'react'
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, List, ListItemButton, Collapse, ListItemText, Radio
} from '@mui/material'
import { ExpandLess, ExpandMore } from '@mui/icons-material'
import { categoryExpenseDefault } from '~/utils/constants'
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight'

const buildTree = (categories) => {
  const map = {}
  const roots = []

  categories.forEach(cat => map[cat.categoryId] = { ...cat, children: [] })
  categories.forEach(cat => {
    if (cat.parentId) {
      map[cat.parentId]?.children.push(map[cat.categoryId])
    } else {
      roots.push(map[cat.categoryId])
    }
  })

  return roots
}

const CategorySelector = () => {
  const [open, setOpen] = useState(false)
  const [expanded, setExpanded] = useState({})
  const [selected, setSelected] = useState(null)
  const [selectedName, setSelectedName] = useState(null)

  const treeData = buildTree(categoryExpenseDefault)

  const toggleExpand = (id) => {
    setExpanded(prev => ({ ...prev, [id]: !prev[id] }))
  }

  const handleSelect = (id) => {
    setSelected(id)
  }

  const renderCategory = (cat) => {
    const hasChildren = cat.children?.length > 0
    return (
      <React.Fragment key={cat.categoryId}>
        <ListItemButton onClick={() => handleSelect(cat.categoryId)}>
          <Radio
            checked={selected === cat.categoryId}
            value={cat.categoryId}
            onChange={() => handleSelect(cat.categoryId)}
          />
          <ListItemText primary={cat.categoryName} />
          {hasChildren ? (
            <Button
              size="small"
              onClick={(e) => {
                e.stopPropagation()
                toggleExpand(cat.categoryId)
              }}
            >
              {expanded[cat.categoryId] ? <ExpandLess /> : <ExpandMore />}
            </Button>
          ) : null}
        </ListItemButton>

        {hasChildren && (
          <Collapse in={expanded[cat.categoryId]} timeout="auto" unmountOnExit>
            <List component="div" disablePadding sx={{ pl: 4 }}>
              {cat.children.map(child => renderCategory(child))}
            </List>
          </Collapse>
        )}
      </React.Fragment>
    )
  }

  const handleConfirm = () => {
    const selectedCat = categoryExpenseDefault.find(c => c.categoryId === selected)
    setSelectedName(selectedCat?.categoryName)
    // console.log('Bạn đã chọn:', selectedCat)
    setOpen(false)
  }

  return (
    <>
      <Button
        variant="outlined"
        endIcon={<KeyboardArrowRightIcon />}
        sx={{ textTransform: 'none', minWidth: '300px', paddingY: 1 }}
        onClick={() => setOpen(true)}
      >{selectedName ?? 'Chọn hạng mục...'}</Button>
      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
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
