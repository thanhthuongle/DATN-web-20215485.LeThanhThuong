// Kiểm tra người dùng đã đăng nhập chưa

import { Navigate, Outlet, useLocation } from 'react-router-dom'

// TODO: Có thể kiểm tra thêm quyền truy cập route
const ProtectedRoute = () => {
  // const currentUser = useSelector(selectCurrentUser)
  const currentUser = { name: 'sghb' }
  const location = useLocation()

  if (!currentUser || Object.keys(currentUser).length === 0) return <Navigate to='/login' replace={true} state={{ from: location }} />

  return <Outlet />
}

export default ProtectedRoute