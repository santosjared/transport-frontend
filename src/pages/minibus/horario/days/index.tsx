import { Card, CardContent, Dialog, DialogContent, Divider, Fade, FadeProps,Grid, IconButton,Typography } from "@mui/material"
import { ReactElement, Ref, forwardRef} from "react"
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
                color:'#ffffff'}} variant="overline">Días</Typography>
                <CardContent sx={{paddingTop:2}}>
                  {data.days.map((dia: any) => (
                    <Typography key={dia}variant="subtitle2">{dia}</Typography>
                  ))}
                  {data.otherDay?<Typography variant="subtitle2">{data.otherDay}</Typography>:''}
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