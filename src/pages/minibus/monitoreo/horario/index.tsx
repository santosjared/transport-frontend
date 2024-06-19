import { Box, Card, CardContent, Dialog, DialogContent, Divider, Fade, FadeProps, FormControl, Grid, IconButton, InputLabel, List, ListItem, ListItemText, TextField, Typography } from "@mui/material"
import { ReactElement, Ref, forwardRef, useEffect, useState } from "react"
import Icon from "src/@core/components/icon"

interface Props {
  open: boolean,
  toggle: () => void
  data: any
}
const Transition = forwardRef(function Transition(
  props: FadeProps & { children?: ReactElement<any, any> },
  ref: Ref<unknown>
) {
  return <Fade ref={ref} {...props} />
})

const ListHorario = ({ open, toggle, data }: Props) => {

  const [horario, setHorario] = useState([])

  useEffect(() => {
    if (data) {
      setHorario(data.horario)
    }
  }, [data])
  return (
    <Dialog
      fullWidth
      open={open}
      maxWidth='sm'
      scroll='body'
      onClose={toggle}
      TransitionComponent={Transition}
    >
      <DialogContent sx={{ px: { xs: 8, sm: 5 }, py: { xs: 8, sm: 12.5 }, position: 'relative' }}>
        <IconButton
          size='small'
          onClick={toggle}
          sx={{ position: 'absolute', right: '1rem', top: '1rem' }}
        ><Icon icon='mdi:close' /></IconButton>

        <Box sx={{ mb: 4, textAlign: 'center' }}>
          <Typography variant='h5' sx={{ mb: 0, lineHeight: '2rem' }}>Lista de horario</Typography>
        </Box>
        {horario.map((horarios:any) => (
          <Grid key={horarios.id } container spacing={2}>
            <Grid item xs={horario.length == 1? 12:6}>
              <Card>
                <Typography sx={{ display: 'flex', justifyContent: 'center', 
                backgroundColor:theme=>`${theme.palette.primary.main}`, 
                color:'#ffffff'}} variant="overline">{horarios.name}</Typography>
                <CardContent sx={{paddingTop:2}}>
                <Typography sx={{textAlign:'center'}}>Lugar de Salida: {horarios.place}</Typography>
                  <Typography>Primera Salida: {horarios.firstOut}</Typography>
                  <Typography>Última Salida: {horarios.lastOut}</Typography>
                  <Divider/>
                  <Grid key={horarios.id}container spacing={2}>
                  <Grid item xs={12}>
                  <Typography sx={{mt:1, display:'flex', justifyContent:'center'}}>Días</Typography>
                  </Grid>
                  {horarios.days.map((day: any) => (
                    <Grid key={day}item xs={horario.length == 1? 4:6} sm={horario.length == 1? 3:4}>
                    <Typography noWrap variant="subtitle2">{day}</Typography></Grid>
                  ))}
                  {horarios.otherDay?
                  <Grid item xs={horario.length == 1? 4:6} sm={horario.length == 1? 3:4}><Typography  variant="subtitle2">{horarios.otherDay}</Typography></Grid>:''
                  }
                   </Grid>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        ))}
      </DialogContent>
    </Dialog>
  )
}
export default ListHorario    