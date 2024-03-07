import Drawer from "@mui/material/Drawer"
import { styled } from '@mui/material/styles'
import Box, {BoxProps} from '@mui/material/Box'
import Typography from "@mui/material/Typography"
import IconButton from "@mui/material/IconButton"
import Icon from "src/@core/components/icon"
import { Children, ReactNode } from "react"
import { Card, CardContent, CardHeader } from "@mui/material"

interface SidebarAddUserType {
    toggle: () => void
    title:string
    children?:ReactNode
  }

  const Header = styled(Box)<BoxProps>(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(3, 4),
    justifyContent: 'space-between',
    backgroundColor: theme.palette.background.default
  }))
  const AddDrawMap = (props:SidebarAddUserType) =>{
    const {toggle, title, children} = props

    const handleClose = () => {
      toggle()
    }
    return(
        <Card>
        <Header>
            <Typography variant='h6'>{title}</Typography>
            <IconButton size='small' onClick={handleClose} sx={{ color: 'text.primary' }}>
              <Icon icon='mdi:close' fontSize={20} />
              </IconButton>
          </Header>
          {children}
        </Card>
    )
  }
  export default AddDrawMap