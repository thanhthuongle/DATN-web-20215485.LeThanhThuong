import React, { useState } from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import { NumericFormat } from 'react-number-format'
import VisibilityIcon from '@mui/icons-material/Visibility'
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff'
import IconButton from '@mui/material/IconButton'
import LibraryAddIcon from '@mui/icons-material/LibraryAdd'
import Grid from '@mui/material/Grid'
import { Link, useLocation } from 'react-router-dom'
import { StyledBox } from './Overview'
import { replaceLastSegment } from '~/utils/pathUtils'

function FinanceOverview({ totalAmount, availableAmount }) {
  const [visibility, SetVisibility] = useState(true)
  const location = useLocation()

  return (
    <Grid container spacing={2} width='100%' justifyContent="space-between">
      <StyledBox
        sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
        // sx={{
        //   borderWidth: '1px',
        //   borderRadius: '8px',
        //   borderStyle: 'solid',
        //   paddingX: { xs: 1, sm: 2 },
        //   paddingY: { xs: 0.5, sm: 2 }
        // }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'end', width: { xs: '100%', sm: '500px' }, gap: 6 }}>
          <Typography variant="h6">Tình hình tài chính</Typography>
          <Box
            onClick={() => console.log('Popup Thông tin tài chính nè!!')}
            component={Button}
            sx={{
              textTransform: 'none',
              p: 0
            }}
          >
            <Typography variant="subtitle1">Xem chi tiết</Typography>
          </Box>
        </Box>

        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box>
            <Box display="flex" alignItems="center">
              <Box width={120}>Tổng số dư</Box>
              <NumericFormat
                displayType='text'
                thousandSeparator="."
                decimalSeparator=","
                allowNegative={false}
                prefix=': '
                suffix=" ₫"
                value={totalAmount}
                renderText={(value) => (visibility ? `${value}` : <Box display="flex" alignItems="center">: &#42;&#42;&#42;&#42;&#42;&#42;</Box>)}
              />
            </Box>
            <Box display="flex" alignItems="center">
              <Box width={120}>Số dư khả dụng</Box>
              <NumericFormat
                displayType='text'
                thousandSeparator="."
                decimalSeparator=","
                allowNegative={false}
                prefix=': '
                suffix=" ₫"
                value={availableAmount}
                renderText={(value) => (visibility ? `${value}` : <Box display="flex" alignItems="center">: &#42;&#42;&#42;&#42;&#42;&#42;</Box>)}
              />
            </Box>
          </Box>
          <Box width="86px" display="flex" justifyContent="center">
            {visibility ? (
              <IconButton onClick={() => SetVisibility(!visibility)}>
                <VisibilityIcon />
              </IconButton>
            ) : (
              <IconButton onClick={() => SetVisibility(!visibility)}>
                <VisibilityOffIcon />
              </IconButton>
            )}
          </Box>
        </Box>
      </StyledBox>

      <Box>
        <Button
          component={Link}
          to={replaceLastSegment(location?.pathname, 'new-transaction')}
          variant="outlined"
          startIcon={<LibraryAddIcon />}
          sx={{ paddingY: '12px' }}
        >
          Tạo giao dịch
        </Button>
      </Box>
    </Grid>
  )
}

export default FinanceOverview