import { Box, Card, CardContent, CardMedia, Dialog, DialogContent, Divider, Fade, FadeProps, Grid, IconButton, Typography } from "@mui/material"
import { ReactElement, Ref, forwardRef, useEffect, useState } from "react"
import Icon from "src/@core/components/icon"
import { getInitials } from "src/@core/utils/get-initials"
import CustomAvatar from 'src/@core/components/mui/avatar'
import { isImage } from "src/utils/verificateImg"
import getConfig from 'src/configs/environment'
import { format } from "date-fns"
import CustomChip from 'src/@core/components/mui/chip'

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

const ViewLicence = ({ open, toggle, data }: Props) => {

  const [isImg, setIsImg] = useState<any>(false)
  const [isImgF, setIsImgF] = useState<any>(false)
  const [isImgB, setIsImgB] = useState<any>(false)
  useEffect(() => {
    if (data) {
      const image = async () => {
        const img = await isImage(`${getConfig().backendURI}${data.profile}`)
        const imgf = await isImage(`${getConfig().backendURI}${data.licenceId.licenceFront}`)
        const imgb = await isImage(`${getConfig().backendURI}${data.licenceId.licenceBack}`)
        setIsImg(img)
        setIsImgF(imgf)
        setIsImgB(imgb)
      }
      image()
    }
  }, [data])
  console.log(data)
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
          <Typography variant='h5' sx={{ mb: 0, lineHeight: '2rem' }}>Licencia de conducir</Typography>
        </Box>
        {data ?
          <Grid container spacing={6}>
            <Grid item xs={12}>
              <Card>
                <CardContent sx={{ pt: 15, display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
                  {isImg ? (
                    <CustomAvatar
                      src={`${getConfig().backendURI}${data.profile}`}
                      variant='rounded'
                      alt={data.name}
                      sx={{ width: 120, height: 120, fontWeight: 600, mb: 4, fontSize: '3rem' }}
                    />
                  ) : (
                    <CustomAvatar
                      skin='light'
                      variant='rounded'
                      color='info'
                      sx={{ width: 120, height: 120, fontWeight: 600, mb: 4, fontSize: '3rem' }}
                    >
                      {getInitials(`${data.name} ${data.lastName}`)}
                    </CustomAvatar>
                  )}
                  <Typography variant='h6' sx={{ mb: 2 }}>
                    {`${data.name} ${data.lastName}`}
                  </Typography>
                </CardContent>
                <CardContent>
                  <Box sx={{ display: 'flex', mb: 2.7 }}>
                    <Typography variant='subtitle2' sx={{ mr: 2, color: 'text.primary' }}>
                      Cédula de Identidad:
                    </Typography>
                    <Typography variant='body2'>{data.ci}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', mb: 2.7 }}>
                    <Typography variant='subtitle2' sx={{ mr: 2, color: 'text.primary' }}>
                      Correo Electrónico:
                    </Typography>
                    <Typography variant='body2'>{data.email}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', mb: 2.7 }}>
                    <Typography variant='subtitle2' sx={{ mr: 2, color: 'text.primary' }}>
                      Estado de conexión:
                    </Typography>
                    {data.status === 'disconnected' ?
                      data.lastConnect ? <Typography variant='body2'>{format(new Date(data.lastConnect), 'dd/MM/yyyy')}</Typography> :
                        <Typography variant="body2">Nunca</Typography> : <CustomChip
                        skin='light'
                        size='small'
                        label='en linea'
                        color='success'
                        sx={{ textTransform: 'capitalize', '& .MuiChip-label': { lineHeight: '18px' } }}
                      />}

                  </Box>
                  <Typography variant='h6'>Licencia de Conducir</Typography>
                  <Divider sx={{ mt: theme => `${theme.spacing(4)} !important` }} />
                  <Box sx={{ pt: 2, pb: 1 }}>
                    <Box sx={{ display: 'flex', mb: 2.7 }}>
                      <Typography variant='subtitle2' sx={{ mr: 2, color: 'text.primary' }}>
                        Fecha emición:
                      </Typography>
                      <Typography variant='body2'>{format(new Date(data.licenceId.dateEmition), 'dd/MM/yyyy')}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', mb: 2.7 }}>
                      <Typography variant='subtitle2' sx={{ mr: 2, color: 'text.primary' }}>
                        Fecha expiración:
                      </Typography>
                      <Typography variant='body2'>{format(new Date(data.licenceId.dateExpire), 'dd/MM/yyyy')}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', mb: 2.7 }}>
                      <Typography variant='subtitle2' sx={{ mr: 2, color: 'text.primary' }}>
                        Categoría:
                      </Typography>
                      <Typography variant='body2'>{data.licenceId.category}</Typography>
                    </Box>
                  </Box>
                  {isImgF ? 
                       <Box sx={{ display: 'flex', border: 'solid 1px #E0E0E0', borderRadius: 0.5, width:260 , mb:6}}>
                       <img src={`${getConfig().backendURI}${data.licenceId.licenceFront}`} height={150} width={255} style={{ borderRadius: 5 }}></img>
                     </Box> : ''}
                     {isImgB ? 
                       <Box sx={{ display: 'flex', border: 'solid 1px #E0E0E0', borderRadius: 0.5, width:260 }}>
                       <img src={`${getConfig().backendURI}${data.licenceId.licenceBack}`} height={150} width={255} style={{ borderRadius: 5 }}></img>
                     </Box> : ''}
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          : ''}
      </DialogContent>
    </Dialog>
  )
}
export default ViewLicence   