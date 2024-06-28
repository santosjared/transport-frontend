import { Box, Card, CardContent, CardHeader, Dialog, DialogContent, Divider, Fade, FadeProps, FormControl, Grid, IconButton, InputLabel, List, ListItem, ListItemText, TextField, Typography } from "@mui/material"
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

const ListRutas = ({ open, toggle, data }: Props) => {
  const [ruta, setRuta] = useState([])
  useEffect(() => {
    if (data) {
      setRuta(data.road)
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
          <Typography variant='h5' sx={{ mb: 0, lineHeight: '2rem' }}>Lista de Rutas</Typography>
        </Box>
        <Grid container spacing={2}>
          {ruta.map((rutas: any) => (
            <Grid key={rutas.id} item xs={ruta.length == 1 ? 12 : 6}>
              <Card sx={{ mb: 3 }}>
                <Typography sx={{
                  display: 'flex', justifyContent: 'center',
                  backgroundColor: theme => `${theme.palette.primary.main}`,
                  color: '#ffffff'
                }} variant="overline">{rutas.name}</Typography>
                <CardContent sx={{ paddingTop: 2 }}>
                  {rutas.routes.map((street: any) => (
                    <Fragment key={street}>
                      <Typography variant='body2'> {street}</Typography>
                      <Divider />
                    </Fragment>
                  ))}

                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </DialogContent>
    </Dialog>
  )
}
export default ListRutas
