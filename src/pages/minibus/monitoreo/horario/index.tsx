import { Box, Card, CardContent, CardHeader, Dialog, DialogContent, Fade, FadeProps, FormControl, Grid, IconButton, InputLabel, List, ListItem, ListItemText, TextField, Typography } from "@mui/material"
import { ReactElement, Ref, forwardRef, useEffect, useState } from "react"
import Icon from "src/@core/components/icon"
import { useService } from "src/hooks/useService"

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

  const [tarifa, setTarifa] = useState([])
  const [allTarifa, setAllTarifa] = useState<any[]>([])

  const { GetId } = useService()

  useEffect(() => {
    if (data) {
      setTarifa(data.tarifa)
    }
  }, [data])
  useEffect(() => {
    const allData = async () => {
      const tarifas = await Promise.all(tarifa.map(async (id) => {
        const response = await GetId('/tarifa', id)
        return response.data
      }))
      setAllTarifa(tarifas)
    }
    allData()
  }, [tarifa])
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
          <Typography variant='h5' sx={{ mb: 0, lineHeight: '2rem' }}>Lista de Tarifas</Typography>
        </Box>
        {allTarifa.map((alltarifas) => (
          <Grid container spacing={2}>
            <Grid item xs={allTarifa.length == 1? 12:6}>
              <Card>
                <Typography sx={{ display: 'flex', justifyContent: 'center', 
                backgroundColor:theme=>`${theme.palette.primary.main}`, 
                color:'#ffffff'}} variant="overline">{alltarifas.name}</Typography>
                <CardContent sx={{paddingTop:2}}>
                  {alltarifas.tarifas.map((tarifas: any) => (
                    <Typography variant="subtitle2">{`${tarifas.tipo}: ${tarifas.tarifa}`}</Typography>
                  ))}

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