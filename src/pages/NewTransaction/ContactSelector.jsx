import React, { useState } from 'react'
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, TextField, List, ListItem, ListItemAvatar, Avatar,
  ListItemText, Typography,
  ListItemButton
} from '@mui/material'
import { toast } from 'react-toastify'
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight'

const initialContacts = [
  { id: 1, name: 'Nguyễn Văn A' },
  { id: 2, name: 'Trần Thị B' },
  { id: 3, name: 'Lê Văn C' }
]

function ContactSelector() {
  const [open, setOpen] = useState(false)
  const [contacts, setContacts] = useState(initialContacts)
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState(null)

  const handleSelect = (contact) => {
    setSelected(contact)
    setSearch(contact.name)
  }

  const handleOk = () => {
    const trimmed = search.trim()
    if (!trimmed) {
      toast.warn('Vui lòng nhập hoặc chọn liên hệ')
      return
    }

    const existing = contacts.find(c => c.name.toLowerCase() === trimmed.toLowerCase())

    if (existing) {
      setSelected(existing)
      setOpen(false)
      console.log('Liên hệ đã chọn:', existing.name)
    } else {
      const newContact = {
        id: Date.now(),
        name: trimmed
      }
      setContacts(prev => [...prev, newContact])
      setSelected(newContact)
      setOpen(false)
      console.log('Liên hệ mới:', newContact.name)
    }
  }

  const filteredContacts = contacts.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <>
      <Button
        variant="outlined"
        endIcon={<KeyboardArrowRightIcon />}
        onClick={() => setOpen(true)}
        sx={{ textTransform: 'none', minWidth: '300px', paddingY: 1 }}
      >{selected?.name ?? 'Chọn liên hệ'}</Button>

      <Dialog
        open={open}
        onClose={() => {}}
        disableEscapeKeyDown
      >
        <DialogTitle>Danh bạ</DialogTitle>
        <DialogContent sx={{ width: 400 }}>
          <TextField
            fullWidth
            placeholder="Chọn hoặc nhập liên hệ"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value)
              setSelected(null)
            }}
            sx={{ mb: 2 }}
          />
          <List>
            {filteredContacts.map(contact => (
              <ListItem
                key={contact.id}
                selected={selected?.id === contact.id}
                onClick={() => handleSelect(contact)}
                disablePadding
              >
                <ListItemButton>
                  <ListItemAvatar>
                    <Avatar>{contact.name.charAt(0)}</Avatar>
                  </ListItemAvatar>
                  <ListItemText primary={contact.name} />
                </ListItemButton>
              </ListItem>
            ))}
            {filteredContacts.length === 0 && (
              <Typography variant="body2" sx={{ p: 2, color: 'gray' }}>
                Không tìm thấy liên hệ. Bạn có thể tạo mới bằng cách nhấn OK.
              </Typography>
            )}
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)} color="inherit">Hủy</Button>
          <Button onClick={handleOk} variant="contained">OK</Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default ContactSelector
