import { Ref, useState, forwardRef, ReactElement, MouseEvent, Fragment, useEffect } from 'react'

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
import CardContent from '@mui/material/CardContent'
import Fade, { FadeProps } from '@mui/material/Fade'
import ListItemText from '@mui/material/ListItemText'
import Autocomplete from '@mui/material/Autocomplete'
import useMediaQuery from '@mui/material/useMediaQuery'
import DialogContent from '@mui/material/DialogContent'
import ListItemAvatar from '@mui/material/ListItemAvatar'
import ListItemSecondaryAction from '@mui/material/ListItemSecondaryAction'
import Icon from 'src/@core/components/icon'
import { FormControl } from '@mui/material'
import { useService } from 'src/hooks/useService'
import { useQuery } from 'react-query'
import getConfig from 'src/configs/environment'

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
const DialogUsers = ({open, toggle,id}:Props)=>{
    
    const {Get,GetId, Update}=useService()
    const {data, isLoading, isError} = useQuery('choferes',()=>Get('/choferes'))
    const [users, setUsers] = useState<any[]>([])
    useEffect(()=>{
      const fetchData = async () => {
        const usersData = await Promise.all(data?.data.map(async (chofer: any) => {
          const userData = await GetId('/users', chofer.userId);
          return userData.data;
        }));
        setUsers(usersData);
      };
      if(!isLoading){
          fetchData()
      }
    },[data?.data, isLoading])

    const handleAddIdUser = (userId:number | string)=>{ 
      const data ={
        id:id,
        userId:userId
      }
      Update('/bus/user', data, id)
      toggle()
    }
    return(
        <Dialog
        fullWidth
        open={open}
        maxWidth='md'
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
              Lista de choferes
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
            Buscar chofer específico
          </InputLabel>
          <FormControl fullWidth sx={{mb:6}}>
            <TextField 
            label='Bucar Choferes'
            />
          </FormControl>
          <Typography variant='h6'>{`${data?.data.length} Choferes`}</Typography>
          <List dense sx={{ py: 4 }}>
            {users.map((user:any) => {
              return (
                <ListItem
                  key={user.name}
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
                  onClick={()=>handleAddIdUser(user.id)}
                >
                  <ListItemAvatar>
                    <Avatar src={`${getConfig().backendURI}${user.profile}`} alt={user.name} />
                  </ListItemAvatar>
                  <ListItemText
                    primary={user.name}
                    secondary={user.lastName}
                    sx={{ m: 0, '& .MuiListItemText-primary, & .MuiListItemText-secondary': { lineHeight: '1.25rem' } }}
                  />
                </ListItem>
              )
            })}
          </List>
        </DialogContent>
      </Dialog>
    )
}
export default DialogUsers