import React, { useRef, useState } from 'react'
import {
  Card,
  CardMedia,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Dialog,
  DialogContent,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText
} from '@mui/material'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import UploadIcon from '@mui/icons-material/CloudUpload'
import ZoomInIcon from '@mui/icons-material/ZoomIn'
import { toast } from 'react-toastify'
import moment from 'moment'
import HomeFilledIcon from '@mui/icons-material/HomeFilled'
import EventIcon from '@mui/icons-material/Event'
import PersonIcon from '@mui/icons-material/Person'
import AttachMoneyIcon from '@mui/icons-material/AttachMoney'
import PeopleIcon from '@mui/icons-material/People'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Paper from '@mui/material/Paper'
import Avatar from '@mui/material/Avatar'
import MemberMenu from './MemberMenu'
import Button from '@mui/material/Button'
import LibraryAddIcon from '@mui/icons-material/LibraryAdd'
import DeleteIcon from '@mui/icons-material/Delete'
import ExitToAppIcon from '@mui/icons-material/ExitToApp'

const familyInfomation = {
  familyId: '1234657873',
  familyName: 'Tên của gia đình',
  backgroundImage: 'https://cdn-imgix.headout.com/tour/7064/TOUR-IMAGE/b2c74200-8da7-439a-95b6-9cad1aa18742-4445-dubai-img-worlds-of-adventure-tickets-02.jpeg?auto=format&w=828&h=619.1999999999999&q=90&ar=3%3A4&crop=faces%2Ccenter&fit=crop',
  owner: {
    ownerId: '123',
    ownerName: 'Tên người thành lập gia đình'
  },
  totalAmount: '53475127',
  managers: [
    {
      managerId: '123',
      managerName: 'Tên người thành lập gia đình',
      joinedAt: moment().subtract(86, 'days').toISOString(),
      totalContribute: '7568456'
    }
  ],
  members: Array.from({ length: 8 }, (_, i) => ({
    memberId: `memberId-${i}`,
    memberName: `Tên thành viên ${i}`,
    joinedAt: moment().subtract(i%4 + 1, 'days').toISOString(),
    totalContribute: '42356'
  })),
  createdAt: moment().subtract(86, 'days').toISOString()
}

function GroupInfo() {
  const fileInputRef = useRef()
  const [anchorEl, setAnchorEl] = useState(null)
  const [previewImage, setPreviewImage] = useState(null) // ảnh mới được chọn
  const [dialogOpen, setDialogOpen] = useState(false) // xem ảnh
  const open = Boolean(anchorEl)

  const handleClickMenu = (event) => {
    setAnchorEl(event.currentTarget)
  }
  const handleCloseMenu = () => {
    setAnchorEl(null)
  }

  const handleUploadClick = () => {
    fileInputRef.current.click()
    handleCloseMenu()
  }

  const handleFileChange = (event) => {
    const file = event.target.files[0]
    if (file) {
      // console.log('🚀 ~ handleFileChange ~ file:', file)
      // Tạo preview
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreviewImage(reader.result)
        // TODO: call API update background upload 'file'
        toast.success('tải ảnh lên thành công')
      }
      reader.readAsDataURL(file)
    }
  }

  const handleViewImage = () => {
    setDialogOpen(true)
    handleCloseMenu()
  }

  const handleDialogClose = () => {
    setDialogOpen(false)
  }
  return (
    <Box
      width={'100%'}
      display={'flex'}
      flexDirection={'column'}
      alignItems={'center'}
    >
      <Box
        width={'100%'}
        display={'flex'}
        flexDirection={'column'}
        maxWidth={1400}
        gap={2}
      >
        {/* background */}
        <Box>
          {/* Background */}
          <Card sx={{ width: '100%', position: 'relative' }}>
            <Box sx={{ position: 'relative' }}>
              <CardMedia
                sx={{ height: '45vh', bgcolor: 'lightblue' }}
                image={previewImage || familyInfomation?.backgroundImage}
                title="group background"
              />
              <IconButton
                onClick={handleClickMenu}
                sx={{
                  position: 'absolute',
                  bottom: 8,
                  right: 8,
                  bgcolor: 'rgba(255,255,255,0.8)',
                  '&:hover': {
                    bgcolor: 'rgba(255,255,255,1)'
                  }
                }}
              >
                <MoreVertIcon />
              </IconButton>

              <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={handleCloseMenu}
                anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
                transformOrigin={{ vertical: 'bottom', horizontal: 'right' }}
              >
                <MenuItem onClick={handleUploadClick}>
                  <UploadIcon fontSize="small" sx={{ mr: 1 }} />
                  Tải ảnh lên
                </MenuItem>
                { (previewImage || familyInfomation?.backgroundImage) &&
                  <MenuItem onClick={handleViewImage}>
                    <ZoomInIcon fontSize="small" sx={{ mr: 1 }} />
                    Xem ảnh
                  </MenuItem>}
              </Menu>

              {/* Hidden file input */}
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                style={{ display: 'none' }}
                onChange={handleFileChange}
              />
            </Box>
          </Card>

          {/* Dialog xem ảnh */}
          <Dialog open={dialogOpen} onClose={handleDialogClose} maxWidth="md" fullWidth>
            <DialogContent>
              <img
                src={previewImage || familyInfomation?.backgroundImage}
                alt="Preview"
                style={{ width: '100%', height: 'auto', borderRadius: 8 }}
              />
            </DialogContent>
          </Dialog>
        </ Box>

        {/* Tên gia đình */}
        <Typography
          component={'div'}
          variant='h6'
          alignItems={'center'}
          display={'flex'}
          sx={{ fontWeight: 'bold' }}
        >
          <HomeFilledIcon sx={{ mr: 1 }} />{familyInfomation?.familyName}
        </Typography>

        {/* Thông tin gia đình */}
        <List sx={{ width: '100%' }} disablePadding>
          {/* Thời gian thành lập */}
          <ListItem sx={{ pl: 0 }}>
            <ListItemIcon sx={{ minWidth: 'auto', mr: 1 }}>
              <EventIcon />
            </ListItemIcon>
            <ListItemText primary={`Thời gian thành lập: ${moment(familyInfomation?.createdAt).format('LL')}`} />
          </ListItem>
          {/* Người thành lập */}
          <ListItem sx={{ pl: 0 }}>
            <ListItemIcon sx={{ minWidth: 'auto', mr: 1 }}>
              <PersonIcon />
            </ListItemIcon>
            <ListItemText primary={`Người thành lập: ${familyInfomation?.owner?.ownerName}`} />
          </ListItem>
          {/* Tổng tiền htai */}
          <ListItem sx={{ pl: 0 }}>
            <ListItemIcon sx={{ minWidth: 'auto', mr: 1 }}>
              <AttachMoneyIcon />
            </ListItemIcon>
            <ListItemText primary={`Tổng tiền hiện tại: ${familyInfomation?.totalAmount} ₫`} />
          </ListItem>
          {/* Số thành viên */}
          <ListItem sx={{ pl: 0 }}>
            <ListItemIcon sx={{ minWidth: 'auto', mr: 1 }}>
              <PeopleIcon />
            </ListItemIcon>
            <ListItemText primary={`Thành viên: ${familyInfomation?.members.length + familyInfomation?.managers.length}`} />
          </ListItem>
        </List>

        {/* Danh sách chi tiết thành viên */}
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold' }}>Thành viên</TableCell>
                <TableCell align="right" sx={{ fontWeight: 'bold' }}>Vai trò</TableCell>
                <TableCell align="right" sx={{ fontWeight: 'bold' }}>Thời gian tham gia</TableCell>
                <TableCell align="right" sx={{ fontWeight: 'bold' }}>Tổng đóng góp</TableCell>
                <TableCell align="right" sx={{ fontWeight: 'bold' }}></TableCell> {/* Chỉ hiện khi userId == ownerId thì mới xem được tùy chọn của thành viên */}
              </TableRow>
            </TableHead>
            <TableBody>
              {familyInfomation?.managers.map((manager) => (
                <TableRow
                  key={manager.managerId}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell component="th" scope="row" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Avatar
                      sx={{ width: 32, height: 32 }}
                      alt='Username'
                      src=''
                    />
                    {manager?.managerName}
                  </TableCell>
                  <TableCell align="right">Quản lý</TableCell>
                  <TableCell align="right">{moment(manager?.joinedAt).format('L')}</TableCell>
                  <TableCell align="right">{manager?.totalContribute}&nbsp;₫</TableCell>
                  <TableCell align="right">{<MemberMenu isManager={true} />}</TableCell>
                </TableRow>
              ))}
              {familyInfomation?.members.map((member) => (
                <TableRow
                  key={member.memberId}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell component="th" scope="row" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Avatar
                      sx={{ width: 32, height: 32 }}
                      alt='Username'
                      src=''
                    />
                    {member.memberName}
                  </TableCell>
                  <TableCell align="right">Thành viên</TableCell>
                  <TableCell align="right">{moment(member?.joinedAt).format('L')}</TableCell>
                  <TableCell align="right">{member?.totalContribute}&nbsp;₫</TableCell>
                  <TableCell align="right">{<MemberMenu isManager={false} />}</TableCell> {/* Chỉ hiện khi userId == ownerId thì mới xem được tùy chọn của thành viên */}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Buttons tùy chọn */}
        <Box display={'flex'} flexDirection={'column'} gap={2} alignItems={'end'} marginY={3}>
          <Box>
            <Button
              variant="outlined"
              startIcon={<LibraryAddIcon />}
              sx={{ paddingY: '12px' }}
            >
              Mời thành viên
            </Button>
          </Box>
          <Box>
            <Button
              variant="outlined"
              startIcon={<ExitToAppIcon />}
              sx={{ paddingY: '12px', color: 'red', borderColor: 'red' }}
            >
              Rời gia đình
            </Button>
          </Box>
          <Box>
            <Button
              variant="outlined"
              startIcon={<DeleteIcon />}
              sx={{ paddingY: '12px', color: 'red', borderColor: 'red' }}
            >
              Xóa gia đình
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  )
}

export default GroupInfo