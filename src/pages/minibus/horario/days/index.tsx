import { Card, CardContent, Dialog, DialogContent, Divider, Fade, FadeProps,Grid, IconButton,Typography } from "@mui/material"
import { Fragment, ReactElement, Ref, forwardRef} from "react"
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

const ListDays = ({ open, toggle, data }: Props) => {
  const isMorning = (time:string):boolean=>{
    const [hours, minuts] = time.split(':').map(Number);
    if(hours<12){
      return true
    }
    return false
  }
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
        {data?
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Card>
                <Typography sx={{ display: 'flex', justifyContent: 'center',
                backgroundColor:theme=>`${theme.palette.primary.main}`,
                color:'#ffffff'}} variant="overline">operacion regular desde {isMorning(data.firstOut)?`${data.firstOut} de la mañana`: `${data.firstOut} `}
                a {isMorning(data.lastOut)?`${data.lastOut} de la mañana`: `${data.lastOut} `}</Typography>
                <CardContent sx={{paddingTop:2}}>
                <Grid container spacing={2}>
                  <Grid item xs={4}>
                    <Typography variant="body1">Día</Typography>
                  </Grid>
                  <Grid item xs={4}>
                    <Typography variant="body1">Horarios de operación</Typography>
                  </Grid>
                  <Grid item xs={4}>
                    <Typography variant="body1">frecuencia &#40;{data.time}&#41;</Typography>
                  </Grid>
                  <Grid item xs={12}><Divider/></Grid>

                  {data.days.map((dia: any) => (
                    <Fragment key={dia}>
                      <Grid item xs={4}>
                      <Typography key={dia}variant="subtitle2">{dia}</Typography>
                      </Grid>
                      <Grid item xs={4}>
                      <Typography key={dia}variant="subtitle2">{data.firstOut} - {data.lastOut}</Typography>
                      </Grid>
                      <Grid item xs={4}>
                      <Typography key={dia}variant="subtitle2">{data.frequency}</Typography>
                      </Grid>
                      <Grid item xs={12}>
                      <Divider/>
                      </Grid>
                    </Fragment>

                  ))}
                  </Grid>
                  {data.description?<>
                  <Typography variant="subtitle1" sx={{mt:5}}>Descripción</Typography>
                  <Divider/>
                  <Typography variant="caption">{data.description}</Typography>
                  </>:''}
                </CardContent>
              </Card>
            </Grid>
          </Grid>
                 :''}
      </DialogContent>
    </Dialog>
  )
}
export default ListDays
