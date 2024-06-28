import { Box, Card, CardContent, Dialog, DialogContent, Divider, Fade, FadeProps, FormControl, Grid, IconButton, InputLabel, List, ListItem, ListItemText, TextField, Typography } from "@mui/material"
import { Fragment, ReactElement, Ref, forwardRef, useEffect, useState } from "react"
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

  const isMorning = (time:string):boolean=>{
    const [hours, minuts] = time.split(':').map(Number);
    if(hours<12){
      return true
    }
    return false
  }
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
        <Grid container spacing={2}>
        {horario.map((horarios:any) => (
            <Grid key={horarios.id} item xs={12}>
              <Card>
                <Typography sx={{ display: 'flex', justifyContent: 'center',
                backgroundColor:theme=>`${theme.palette.primary.main}`,
                color:'#ffffff'}} variant="overline">{horarios.name}</Typography>
                <CardContent sx={{paddingTop:2}}>
                <Grid container spacing={2}>
                  <Grid item xs={4}>
                    <Typography variant="body1">Día</Typography>
                  </Grid>
                  <Grid item xs={4}>
                    <Typography variant="body1">Horarios de operación</Typography>
                  </Grid>
                  <Grid item xs={4}>
                    <Typography variant="body1">frecuencia &#40;{horarios.time}&#41;</Typography>
                  </Grid>
                  <Grid item xs={12}><Divider/></Grid>

                  {horarios.days.map((dia: any) => (
                    <Fragment key={dia}>
                      <Grid item xs={4}>
                      <Typography key={dia}variant="subtitle2">{dia}</Typography>
                      </Grid>
                      <Grid item xs={4}>
                      <Typography key={dia}variant="subtitle2">{isMorning(horarios.firstOut)?`${horarios.firstOut} AM`: `${horarios.firstOut} `} -
                         {isMorning(horarios.lastOut)?` ${horarios.lastOut} AM`: ` ${horarios.lastOut} `}</Typography>
                      </Grid>
                      <Grid item xs={4}>
                      <Typography key={dia}variant="subtitle2">{horarios.frequency}</Typography>
                      </Grid>
                      <Grid item xs={12}>
                      <Divider/>
                      </Grid>
                    </Fragment>

                  ))}
                  </Grid>
                  {horarios.description &&<>
                  <Typography variant="subtitle1" sx={{mt:5}}>Descripción</Typography>
                  <Divider/>
                  <Typography variant="caption">{horarios.description}</Typography>
                  </>}
                </CardContent>
              </Card>
            </Grid>
        ))}
        </Grid>
      </DialogContent>
    </Dialog>
  )
}
export default ListHorario
