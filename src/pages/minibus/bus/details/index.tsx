import { Box, Button, Card, CardContent, CardMedia, Dialog, DialogContent, Divider, Fade, FadeProps, Grid, IconButton, Typography } from "@mui/material"
import { Fragment, ReactElement, Ref, forwardRef, useEffect, useState } from "react"
import Icon from "src/@core/components/icon"
import { getInitials } from "src/@core/utils/get-initials"
import CustomAvatar from 'src/@core/components/mui/avatar'
import { isImage } from "src/utils/verificateImg"
import getConfig from 'src/configs/environment'
import { format } from "date-fns"
import CustomChip from 'src/@core/components/mui/chip'
import Swal from "sweetalert2"
import Dialogconfirme from "src/components/dialog/dialogconfirme"
import { useService } from "src/hooks/useService"
import { HttpStatus } from "src/utils/HttpStatus"
import { useDispatch } from "react-redux"
import { AppDispatch } from "src/store"
import { fetchData } from "src/store/apps/bus"
import DialogAlert from "src/views/apps/dialog/alert2"
import SnackbarConsecutive from "src/views/apps/dialog/alert1"

interface Props {
  open: boolean,
  toggle: () => void
  data: any
  busId:string
  page:number
  pageSize:number
}
const Transition = forwardRef(function Transition(
  props: FadeProps & { children?: ReactElement<any, any> },
  ref: Ref<unknown>
) {
  return <Fade ref={ref} {...props} />
})

const Details = ({ open, toggle, data , busId, page, pageSize}: Props) => {

  const [isImg, setIsImg] = useState<any>(false)
  const [isImgF, setIsImgF] = useState<any>(false)
  const [isImgB, setIsImgB] = useState<any>(false)
  const [suspendDialogOpen, setSuspendDialogOpen] = useState<boolean>(false)
  const [openFail, setOpenFail] = useState<boolean>(false)
  const [isConfirmed, setIsConfirmed] = useState(false)

  const dispatch = useDispatch<AppDispatch>()
  const {Update} = useService()
  useEffect(() => {
    if (data) {
      const image = async () => {
        const img = await isImage(`${getConfig().backendURI}${data.profile}`)
        if(data.licenceId){
            const imgf = await isImage(`${getConfig().backendURI}${data.licenceId.licenceFront}`)
        const imgb = await isImage(`${getConfig().backendURI}${data.licenceId.licenceBack}`)
        setIsImgF(imgf)
        setIsImgB(imgb)
        }
        setIsImg(img)
      }
      image()
    }
  }, [data])

  useEffect(()=>{
    if(isConfirmed){
      Update('/bus/designed',{},busId).then((response)=>{
        if(response.status === HttpStatus.OK){
          toggle()
          dispatch(fetchData({ filter: '', skip: page * pageSize, limit: pageSize }))
          Swal.fire({
            title: '¡Éxito!',
            text: 'Usuario desasigando',
            icon: "success"
          });
        }else{
          setOpenFail(true)
        }
      })
        setSuspendDialogOpen(false)
        setIsConfirmed(false)
    }
  },[isConfirmed])
  return (
    <>
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
          <Typography variant='h5' sx={{ mb: 0, lineHeight: '2rem' }}>Detalles</Typography>
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
                  <Box sx={{ display: 'flex', mb: 2.7 }}>
                    <Button variant="outlined" onClick={() => setSuspendDialogOpen(true)}>desasignar chofer</Button>
                  </Box>
                  {data.licenceId?<Fragment>
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
                     </Fragment>:''}
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          : ''}
      </DialogContent>
    </Dialog>
    <Dialogconfirme open={suspendDialogOpen}
    setOpen={setSuspendDialogOpen}
    setConfirme={setIsConfirmed} title={'¿Estas seguro en desasignar el chofer?'}
    icon={"warning"}
    buttoConfirmed="Si, desasignar chofer"
    buttonCancel="cancelar"
    />
     <Dialogconfirme open={openFail}
    setOpen={setOpenFail}
    title={'Error'}
    message="No hemos podido desasignar chofer, bus no encontrado"
    icon={"error"}
    buttonCancel="Aceptar"
    variantCancel="contained"
    />
    </>
  )
}
export default Details
