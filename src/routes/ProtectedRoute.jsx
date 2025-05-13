import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { selectCurrentUser } from '~/redux/user/userSlice'

const ProtectedRoute = () => {
  const currentUser = useSelector(selectCurrentUser)
  const location = useLocation()

  if (!currentUser || Object.keys(currentUser).length === 0) return <Navigate to='/login' replace={true} state={{ from: location }} />

  return <Outlet />
}

export default ProtectedRoute