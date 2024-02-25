// ** MUI Imports
import Box from '@mui/material/Box'
import Link from '@mui/material/Link'
import { Theme } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import useMediaQuery from '@mui/material/useMediaQuery'

const FooterContent = () => {
  // ** Var
  const hidden = useMediaQuery((theme: Theme) => theme.breakpoints.down('md'))

  return (
    <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
      <Typography sx={{ mr: 2 }}>
        {`© ${new Date().getFullYear()}, Desarrollador Santos Machaca Lopez`}
        <Box component='span' sx={{ color: 'error.main' }}>
          ❤️
        </Box>
        {` Email `}
        <Link target='_blank' href='#'>
          santosjared221234@gmail.com
        </Link>
      </Typography>
    </Box>
  )
}

export default FooterContent
