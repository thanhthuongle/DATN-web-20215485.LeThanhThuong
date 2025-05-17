import { createTheme } from '@mui/material/styles'

const APP_BAR_HEIGHT = '58px'
const BOARD_BAR_HEIGHT = '60px'
const BOARD_CONTENT_HEIGHT = `calc(100vh - ${APP_BAR_HEIGHT} - ${BOARD_BAR_HEIGHT})`
const COLUMN_HEADER_HEIGHT = '50px'
const COLUMN_FOOTER_HEIGHT = '56px'

// Create a theme instance.
const theme = createTheme({
  QLTC: {
    appBarHeight: APP_BAR_HEIGHT,
    boardBarHeight: BOARD_BAR_HEIGHT,
    boardContentHeight: BOARD_CONTENT_HEIGHT,
    columnHeaderHeight: COLUMN_HEADER_HEIGHT,
    columnFooterHeight: COLUMN_FOOTER_HEIGHT
  },
  colorSchemes: { light: true, dark: true },
  // eslint-disable-next-line no-dupe-keys
  colorSchemes: {
    light: {
      palette: {
        // primary: {
        // },
        // secondary: {
        // },
        // text: {
        // }
        // ...other tokens
      }
    },
    dark: true
  }
})

export default theme
