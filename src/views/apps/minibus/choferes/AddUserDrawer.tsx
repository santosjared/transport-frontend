import Drawer from "@mui/material/Drawer"
import { styled } from '@mui/material/styles'
import { useForm } from "react-hook-form"
import Box, {BoxProps} from '@mui/material/Box'
import Typography from "@mui/material/Typography"
import IconButton from "@mui/material/IconButton"
import Icon from "src/@core/components/icon"
import StepperAlternativeLabel from "../../forms/choferes"

interface SidebarAddUserType {
    open: boolean
    toggle: () => void
  }

  const Header = styled(Box)<BoxProps>(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(3, 4),
    justifyContent: 'space-between',
    backgroundColor: theme.palette.background.default
  }))
  const SidebarAddUser = (props:SidebarAddUserType) =>{
    const {open, toggle} = props

    const handleClose = () => {
      toggle()
    }
    return(
        <Drawer
        open={open}
        anchor='right'
        variant='temporary'
        onClose={handleClose}
        ModalProps={{ keepMounted: true }}
        sx={{ '& .MuiDrawer-paper': { width: { xs: 300, sm: 600 } } }}
        >
          <Header>
            <Typography variant='h6'>Registrar Chofer</Typography>
            <IconButton size='small' onClick={handleClose} sx={{ color: 'text.primary' }}>
              <Icon icon='mdi:close' fontSize={20} />
              </IconButton>
          </Header>
          <Box sx={{ p: 5 }}>
          <StepperAlternativeLabel close={handleClose}/>
          </Box>
        </Drawer>
    )
  }
  export default SidebarAddUser
