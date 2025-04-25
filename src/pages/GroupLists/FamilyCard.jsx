import React from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import ArrowRightIcon from '@mui/icons-material/ArrowRight'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import { Link } from 'react-router-dom'
import { CardMedia } from '@mui/material'
import randomColor from 'randomcolor'

function FamilyCard({ familyId, familyName, numberOfMember, description, imageCover }) {
  return (
    <Card sx={{ width: '330px', mx: 'auto' }}>
      {imageCover && <CardMedia component="img" height="75px" image={imageCover} />}
      {!imageCover && <Box sx={{ height: '75px', backgroundColor: randomColor() }}></Box>}

      <CardContent sx={{ p: 1.5, '&:last-child': { p: 1.5 } }}>
        <Typography gutterBottom variant="h6" component="div">
          {familyName}
        </Typography>
        <Typography gutterBottom variant="body1" component="div">
          {numberOfMember} thành viên
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            textOverflow: 'ellipsis'
          }}>
          {description}
        </Typography>
        <Box
          component={Link}
          to={`/groups/${familyId}/overview`}
          sx={{
            mt: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            textDecoration: 'none',
            color: 'primary.main',
            '&:hover': { color: 'primary.light' }
          }}>
          Go to family <ArrowRightIcon fontSize="small" />
        </Box>
      </CardContent>
    </Card>
  )
}

export default FamilyCard