// import { lazy } from 'react'
import { RouterProvider } from 'react-router-dom'
import routes from './routes/routes'
import { Suspense } from 'react'
import PageLoadingSpinner from './component/Loading/PageLoadingSpinner'

// const DefaultLayout = lazy(() => import('~/layout/DefaultLayout'))

function App() {
  return (
    <>
      {/* <DefaultLayout /> */}
      <Suspense fallback={<PageLoadingSpinner caption={'Đang tải...'} />}>
        <RouterProvider router={routes} />
      </Suspense>
    </>
  )
}

export default App
