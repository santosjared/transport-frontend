import { Ref, useState, forwardRef, ReactElement, Fragment, useEffect, useCallback } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import List from '@mui/material/List'
import Avatar from '@mui/material/Avatar'
import Dialog from '@mui/material/Dialog';
import ListItem from '@mui/material/ListItem'
import TextField from '@mui/material/TextField'
import IconButton from '@mui/material/IconButton'
import InputLabel from '@mui/material/InputLabel'
import Typography from '@mui/material/Typography'
import Fade, { FadeProps } from '@mui/material/Fade'
import ListItemText from '@mui/material/ListItemText'
import DialogContent from '@mui/material/DialogContent'
import ListItemAvatar from '@mui/material/ListItemAvatar'
import Icon from 'src/@core/components/icon'
import { Divider, FormControl } from '@mui/material'
import getConfig from 'src/configs/environment'
import { useDispatch } from 'react-redux'
import { AppDispatch,} from 'src/store'
import { fetchDataUser } from 'src/store/apps/bus/fectchUsers'
import { HttpStatus } from 'src/utils/HttpStatus'
import Swal from 'sweetalert2'
import { fetchData } from 'src/store/apps/rol'
import { apiService } from 'src/store/services/apiService'


interface Props{
    toggle:()=>void
    open:boolean
    id:string | number
}

const Transition = forwardRef(function Transition(
    props: FadeProps & { children?: ReactElement<any, any> },
    ref: Ref<unknown>
  ) {
    return <Fade ref={ref} {...props} />
  })
const UsersNotRol = ({open, toggle,id}:Props)=>{
  const dispatch = useDispatch<AppDispatch>()
  const [users,setUsers] = useState<any[]>([])
  const [value, setValue] = useState<string>('')
    useEffect(()=>{
      const fetch = async()=>{
        const res = await apiService.Get('/users/notroles', {name:value})
        setUsers(res.data)
      }
      fetch()
    },[open, value])

    const handleAddIdUser = (userId:number | string)=>{
      apiService.Update('/users/asignedrol', {idrol:id}, userId).then((respose)=>{
        if(respose.status==HttpStatus.OK){
          dispatch(fetchData())
          toggle()
        }else{
          toggle()
          Swal.fire({ title: '¡Error!', text: 'ha ocurrido un error al momento de asignar usuario', icon: "error" });
        }
      })
    }
    return(
        <Dialog
        fullWidth
        open={open}
        maxWidth='sm'
        scroll='body'
        onClose={toggle}
        TransitionComponent={Transition}
      >
        <DialogContent sx={{ px: { xs: 8, sm: 15 }, py: { xs: 8, sm: 12.5 }, position: 'relative' }}>
          <IconButton
            size='small'
            onClick={toggle}
            sx={{ position: 'absolute', right: '1rem', top: '1rem' }}
          >
            <Icon icon='mdi:close' />
          </IconButton>
          <Box sx={{ mb: 4, textAlign: 'center' }}>
            <Typography variant='h5' sx={{ mb: 3, lineHeight: '2rem' }}>
              Lista de usuarios
            </Typography>
          </Box>
          <InputLabel
            htmlFor='add-members'
            sx={{
              mb: 1.5,
              fontWeight: 500,
              lineHeight: '2rem',
              display: 'inline-flex',
              fontSize: ['1.125rem', '1.25rem']
            }}
          >
            Busqueda de usuarios
          </InputLabel>
          <FormControl fullWidth sx={{mb:6}}>
            <TextField
            label='Bucar usuarios'
            onChange={e=>setValue(e.target.value)}
            />
          </FormControl>
          <Typography variant='h6'>{`${users.length} Usuarios de ${users.length}`}</Typography>
          <List dense sx={{ py: 4 }} key={id}>
            {users.map((user:any, index) => {
              return (
                <Fragment key={user.id}><ListItem
                  key={user.id}
                  sx={{
                    pb: 2,
                    pt:0,
                    pl:0,
                    pr:0,
                    display: 'flex',
                    flexWrap: 'wrap',
                    '.MuiListItem-container:not(:last-child) &': { mb: 4 },
                    '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.08)'},
                    cursor:'pointer'
                  }}
                  onClick={()=>handleAddIdUser(user._id)}
                >
                  <ListItemAvatar>
                    <Avatar src={`${getConfig().backendURI}${user.profile}`} alt={user.name} />
                  </ListItemAvatar>
                  <ListItemText
                    primary={`${user.name} ${user.lastName}`}
                    secondary={`CI: ${user.ci}`}
                    sx={{ m: 0, '& .MuiListItemText-primary, & .MuiListItemText-secondary': { lineHeight: '1.25rem' } }}
                  />
                </ListItem>
                <Divider variant="inset" component="li" /></Fragment>
              )
            })}
          </List>
        </DialogContent>
      </Dialog>
    )
}
export default UsersNotRol
