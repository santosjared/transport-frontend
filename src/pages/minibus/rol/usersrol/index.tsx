import { Ref, useState, forwardRef, ReactElement, Fragment, useCallback, useEffect } from 'react'

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
import { AppDispatch} from 'src/store'
import { HttpStatus } from 'src/utils/HttpStatus'
import Swal from 'sweetalert2'
import { fetchData } from 'src/store/apps/rol'
import { apiService } from 'src/store/services/apiService'

interface Props{
    toggle:()=>void
    open:boolean
    data:any
}

const Transition = forwardRef(function Transition(
    props: FadeProps & { children?: ReactElement<any, any> },
    ref: Ref<unknown>
  ) {
    return <Fade ref={ref} {...props} />
  })
const UsersRol = ({open, toggle,data}:Props)=>{

  const [storeData, setStoreData] = useState<any>(null)
  const dispatch = useDispatch<AppDispatch>()

  useEffect(()=>{
    if(data){
      setStoreData(data.Users)
    }
  },[data])
    const handleFilter = (val: string) => {
      const filteredData = data?.Users
      ?.filter((value: any) =>
        value.name.toLowerCase().includes(val.toLowerCase())
      )
      if(filteredData.length !==0){
        return setStoreData(filteredData)
      }
        const filtereCi = data?.Users
      ?.filter((value: any) =>
        value.ci.toLowerCase().includes(val.toLowerCase())
      )
      return setStoreData(filtereCi)
    }
    // console.log(data)
    const handledesasignedUser = (userId:number | string)=>{
      apiService.Update('/users/desasignedrol', {idrol:data.id}, userId).then((respose)=>{
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
          {storeData?<Fragment>
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
          <Typography variant='h6'>{`${storeData.length} Usuarios de ${storeData.length}`}</Typography>
          <List dense sx={{ py: 4 }}>
            {storeData.map((user:any) => {
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
                  onClick={()=>handledesasignedUser(user.id)}
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
          </Fragment>
          :
          <Typography>Ningun usuario asignado</Typography>
          }
        </DialogContent>
      </Dialog>
    )
}
export default UsersRol
