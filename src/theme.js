import { createTheme } from '@mui/material/styles'
import { red } from '@mui/material/colors'

// Create a theme instance.
const theme = createTheme({
  colorSchemes: { light: true, dark: true },
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
      },
    },
    dark: true 
  }
})

export default theme
