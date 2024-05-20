import { Box, Dialog, DialogContent, Fade, FadeProps, FormControl, IconButton, InputLabel, List, ListItem, ListItemText, TextField, Typography } from "@mui/material"
import { ReactElement, Ref, forwardRef } from "react"
import Icon from "src/@core/components/icon"

interface Props {
    open:boolean,
    toggle:()=>void
    data:any
    handleSelectionLine:(id:string)=>void
}
const Transition = forwardRef(function Transition(
    props: FadeProps & { children?: ReactElement<any, any> },
    ref: Ref<unknown>
  ) {
    return <Fade ref={ref} {...props} />
  })
const ListLinea = ({open,toggle,data,handleSelectionLine}:Props)=>{
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
              Lista de lineas
            </Typography>
          </Box>
          <FormControl fullWidth sx={{mb:6}}>
            <TextField 
            label='Buscar Lineas'
            />
          </FormControl>
          <Typography variant='h6'>{`${data?.length} Lineas`}</Typography>
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
                  onClick={()=>handleSelectionLine(value.id)}
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
export default ListLinea