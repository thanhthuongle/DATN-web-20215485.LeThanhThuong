import { Navigate, Outlet, useParams } from 'react-router-dom'

const GroupProtectedRoute = () => {
  const { groupId } = useParams()
  console.log('🚀 ~ GroupProtectedRoute ~ groupId:', groupId)
  // const currentUser = useSelector(selectCurrentUser)
  // const currentUser = {
  //   userId: '123',
  //   name: 'sghb',
  //   groups: ['12356557', '12345678']
  // }
  // const userGroups = currentUser?.groups || []
  // console.log('🚀 ~ GroupProtectedRoute ~ userGroups:', userGroups)

  // const isMember = userGroups?.includes(groupId)

  // if (!isMember) return <Navigate to='/groups' replace={true} /> // TODDO: có thể kèm theo thông báo không được truy cập

  return <Outlet />
}

export default GroupProtectedRoute