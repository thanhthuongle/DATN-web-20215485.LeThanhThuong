import React, { useEffect, useState } from 'react'
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, TextField, List, ListItem, ListItemAvatar, Avatar,
  ListItemText, Typography,
  ListItemButton
} from '@mui/material'
import { toast } from 'react-toastify'
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight'
import { createIndividualContactAPI, getIndividualContactAPI } from '~/apis'

function ContactSelector({ onChange, value }) {
  const [open, setOpen] = useState(false)
  const [contacts, setContacts] = useState([])
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState(null)

  const handleSelect = (contact) => {
    setSelected(contact)
    setSearch(contact.name)
  }

  const handleOk = async() => {
    const trimmed = search.trim()
    if (!trimmed) {
      toast.warn('Vui lòng nhập hoặc chọn liên hệ')
      return
    }

    const existing = contacts.find(c => c.name.toLowerCase() === trimmed.toLowerCase())

    if (existing) {
      setSelected(existing)
      onChange(existing)
      setOpen(false)
      // console.log('Liên hệ đã chọn:', existing)
    } else {
      const newContactData = {
        name: trimmed
      }
      const newContact = await createIndividualContactAPI(newContactData)
      setContacts(prev => [...prev, newContact])
      setSelected(newContact)
      onChange(newContact)
      setOpen(false)
      // console.log('Liên hệ mới:', newContact)
    }
  }

  const filteredContacts = contacts.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase())
  )

  const updateStateData = (res) => {
    setContacts(res || [])
  }

  useEffect(() => {
    getIndividualContactAPI().then(updateStateData)
    if (!value) setSelected(null)
    else setSelected(value)
  }, [value])

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
                key={contact._id}
                selected={selected?._id === contact._id}
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
