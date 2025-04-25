import { useState, useEffect } from 'react'
import PageLoadingSpinner from '~/component/Loading/PageLoadingSpinner'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Grid'
import Pagination from '@mui/material/Pagination'
import PaginationItem from '@mui/material/PaginationItem'
import { Link, useLocation } from 'react-router-dom'
import FamilyCard from './FamilyCard'
import CreateFamily from './Create'

const familyLists = Array.from({ length: 20 }, (_, i) => ({
  familyId: '12345678',
  familyName: `Tên gia đình ${i}`,
  numberOfMember: '5',
  description: `Mô tả của gia đình ${i}`,
  imageCover: ((i+1)%3 ==0) ? 'https://iotcdn.oss-ap-southeast-1.aliyuncs.com/2020-11/Family-Silhouette-3.jpg' : ''
}))
// const familyLists = []

function GroupLists() {
  const familyCardMax = 10
  const [families, setFamilies] = useState(null)
  const [totalFamilies, setTotalFamilies] = useState(null)

  const location = useLocation()
  const query = new URLSearchParams(location.search)
  const page = parseInt(query.get('page') || '1', 10)

  useEffect(() => {
    setFamilies(familyLists)
    setTotalFamilies(families?.length)

    // Gọi API lấy danh sách families...
    // ...
  }, [])

  if (!families) {
    return <PageLoadingSpinner caption="Loading data..." />
  }

  return (
    <Box
      width={{ xs: '100%', sm: '75%' }}
      mx='auto'
      display='flex'
      flexDirection='column'
      alignItems='center'
    >
      <Grid container spacing={2} width='100%' justifyContent="space-between" marginY={3}>
        <Typography variant='h4' sx={{ fontWeight: 'bold' }}>Danh sách gia đình của bạn:</Typography>
        <CreateFamily />
      </Grid>

      {/* Trường hợp gọi API nhưng không tồn tại cái familiy nào trong Database trả về */}
      {families?.length === 0 &&
        <Typography variant="span" sx={{ fontWeight: 'bold', mb: 3 }}>Bạn chưa có gia đình nào!</Typography>
      }

      {/* Trường hợp gọi API và có families trong Database trả về thì render danh sách families */}
      {families?.length > 0 &&
        <Grid container spacing={2} justifyContent='center'>
          {families.map((family, index) =>
            <Grid size={{ sm: 8, md: 6, lg: 4, xl: 3 }} key={index}>
              <FamilyCard
                familyId={family?.familyId}
                familyName={family?.familyName}
                numberOfMember={family?.numberOfMember}
                description={family?.description}
                imageCover={family?.imageCover}
              />
            </Grid>
          )}
        </Grid>
      }

      {/* Trường hợp gọi API và có totalBoards trong Database trả về thì render khu vực phân trang  */}
      {(totalFamilies > 0) &&
        <Box sx={{ my: 3, pr: 5, display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
          <Pagination
            size="large"
            color="secondary"
            showFirstButton
            showLastButton
            count={Math.ceil(totalFamilies / familyCardMax)}
            // Giá trị của page hiện tại đang đứng
            page={page}
            renderItem={(item) => (
              <PaginationItem
                component={Link}
                to={`/groups${item.page === 1 ? '' : `?page=${item.page}`}`}
                {...item}
              />
            )}
          />
        </Box>
      }
    </Box>
  )
}

export default GroupLists
