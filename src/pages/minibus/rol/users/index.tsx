import { Ref, useState, forwardRef, ReactElement, MouseEvent, Fragment, useEffect, useCallback } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import List from '@mui/material/List'
import Menu from '@mui/material/Menu'
import Avatar from '@mui/material/Avatar'
import Dialog from '@mui/material/Dialog';
import Button from '@mui/material/Button'
import { Theme } from '@mui/material/styles'
import ListItem from '@mui/material/ListItem'
import MenuItem from '@mui/material/MenuItem'
import TextField from '@mui/material/TextField'
import IconButton from '@mui/material/IconButton'
import InputLabel from '@mui/material/InputLabel'
import Typography from '@mui/material/Typography'
import Fade, { FadeProps } from '@mui/material/Fade'
import ListItemText from '@mui/material/ListItemText'
import Autocomplete from '@mui/material/Autocomplete'
import useMediaQuery from '@mui/material/useMediaQuery'
import DialogContent from '@mui/material/DialogContent'
import ListItemAvatar from '@mui/material/ListItemAvatar'
import ListItemSecondaryAction from '@mui/material/ListItemSecondaryAction'
import Icon from 'src/@core/components/icon'
import { Divider, FormControl } from '@mui/material'
import { useService } from 'src/hooks/useService'
import { useQuery } from 'react-query'
import getConfig from 'src/configs/environment'
import { useDispatch } from 'react-redux'
import { AppDispatch, RootState } from 'src/store'
import { useSelector } from 'react-redux'
import { fetchData } from 'src/store/apps/bus'
import { fetchDataUser } from 'src/store/apps/bus/fectchUsers'
import { HttpStatus } from 'src/utils/HttpStatus'
import Swal from 'sweetalert2'


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
    const {Update}=useService()
    const handleFilter = useCallback((val: string) => {
      dispatch(fetchDataUser({filter:val}))
      setValue(val)
    }, [])
    const{Get} = useService()
    useEffect(()=>{
      const fetch = async()=>{
        const res = await Get('/users/notroles')
        setUsers(res.data)
      }
      fetch()
    },[open])

    const handleAddIdUser = (userId:number | string)=>{
      Update('/users/asignedrol', {idrol:id}, userId).then((respose)=>{
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
            onChange={e=>handleFilter(e.target.value)}
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
