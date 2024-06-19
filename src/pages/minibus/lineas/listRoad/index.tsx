import { Box, Dialog, DialogContent, Fade, FadeProps, FormControl, IconButton, List, ListItem, ListItemText, TextField, Typography } from "@mui/material"
import { ReactElement, Ref, forwardRef, useEffect, useState } from "react"
import { useDispatch } from "react-redux"
import Icon from "src/@core/components/icon"
import { useService } from "src/hooks/useService"
import { AppDispatch } from "src/store"
import { asignedRoad } from "src/store/apps/linea"
import Swal from "sweetalert2"

interface Props {
    open:boolean,
    id:string
    toggle:()=>void
}
const Transition = forwardRef(function Transition(
    props: FadeProps & { children?: ReactElement<any, any> },
    ref: Ref<unknown>
  ) {
    return <Fade ref={ref} {...props} />
  })
const ListRoad = ({id,open,toggle}:Props)=>{
    const [data,setData] = useState<any[]>([])
    const {Get} = useService()
    const dispatch = useDispatch<AppDispatch>()
    
    useEffect(()=>{
        const fetch = async() =>{
            const response = await Get('/road')
            setData(response.data.result)
        }
        fetch()
    },[open])
    const handleSelectionRoad = (data:any) =>{
        dispatch(asignedRoad({data:{road:data._id},id:id})).then((result)=>{
          if(result.payload){
            if(result.payload.success){
              Swal.fire({ title: '¡Éxito!', text: 'Ruta asignada', icon: "success" });
              toggle()
            }else{
              Swal.fire({ title: '¡Error!', text: 'no se pudo asignar ruta', icon: "error" });
            }
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
              Lista de rutas
            </Typography>
          </Box>
          <FormControl fullWidth sx={{mb:6}}>
            <TextField 
            label='Buscar Lineas'
            />
          </FormControl>
          <Typography variant='h6'>{`${data?.length} rutas`}</Typography>
          <List dense sx={{ py: 4 }}>
            {data?.map((value:any) => {
              return (
                <ListItem
                  key={value.name}
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
                  onClick={()=>handleSelectionRoad(value)}
                >
                  <ListItemText
                    primary={value.name}
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
export default ListRoad