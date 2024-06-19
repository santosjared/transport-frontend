import { CheckBox } from "@mui/icons-material"
import { Box, Button, Card, CardContent, Checkbox, Dialog, DialogContent, Divider, Fade, FadeProps, FormControl, FormControlLabel, Grid, IconButton, InputLabel, List, ListItem, ListItemText, TextField, Typography, useMediaQuery, useTheme } from "@mui/material"
import { ReactElement, Ref, forwardRef, useEffect, useState } from "react"
import { useDispatch } from "react-redux"
import Icon from "src/@core/components/icon"
import { useService } from "src/hooks/useService"
import { AppDispatch } from "src/store"
import { asignedHorario, desasignedHorario, fetchData } from "src/store/apps/linea"

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

const ViewHorario = ({ open, toggle, data}: Props) => {

  const [checkedItems, setCheckedItems] = useState<{ [key: number]: boolean }>({});
  const [checkedItems2, setCheckedItems2] = useState<{ [key: number]: boolean }>({});
  const [selectAll, setSelectAll] = useState(false);
  const [selectAll2, setSelectAll2] = useState(false);
  const [dataDB,setDataDB] = useState<any[]>([])
  const [desasignedId,setDesasignedId] = useState<string[]>([])
  const [asignedId,setAsignedId] = useState<string[]>([])
  const [horario,setHorario] = useState<any[]>([])
  const{GetId} = useService()
  useEffect(()=>{
   if(data.length !==0){
    const fetch = async() =>{
      const response = await GetId('/linea/horarios', data.id)
      setDataDB(response.data)
    }
    fetch();
    setHorario(data.horario)
   }
  },[data])
  const dispatch = useDispatch<AppDispatch>()
  const handleToggle = (index:number,id:string) => {
    const newCheckedItems = { ...checkedItems, [index]: !checkedItems[index] };
    setCheckedItems(newCheckedItems);
    if(!checkedItems[index]){
      setDesasignedId([...desasignedId,id])
    }else{
      setDesasignedId(desasignedId.filter((newId) => newId !== id));
    }
    const allChecked = Object.values(newCheckedItems).every(item => item);
    setSelectAll(allChecked);
    
  };
  const handleSelectAll = () => {
    const newCheckedItems: { [key: number]: boolean } = {}; 
    let newIds:string[]=[]
    const newValue = !selectAll;
    horario.forEach((horario: any, index:number) => {
      newIds=[...newIds, horario._id]
      newCheckedItems[index] = newValue;
    });
    if(newValue){
      setDesasignedId(newIds)
    }else{
      setDesasignedId([])
    }
    setCheckedItems(newCheckedItems);
    setSelectAll(newValue);
  };
  const handleToggle2 = (index:number,id:string) => {
    const newCheckedItems = { ...checkedItems2, [index]: !checkedItems2[index] };
    setCheckedItems2(newCheckedItems);

    if(!checkedItems2[index]){
      setAsignedId([...asignedId,id])
    }else{
      setAsignedId(asignedId.filter((newId) => newId !== id));
    }
    const allChecked = Object.values(newCheckedItems).every(item => item);
    setSelectAll2(allChecked);
  };
  const handleSelectAll2 = () => {
    const newCheckedItems: { [key: number]: boolean } = {}; 
    let newIds:string[]=[];
    const newValue = !selectAll2;
    dataDB.forEach((horario: any, index:number) => {
      newIds=[...newIds, horario._id]
      newCheckedItems[index] = newValue;
    });
    if(newValue){
      setAsignedId(newIds)
    }else{
      setAsignedId([])
    }
    setCheckedItems2(newCheckedItems);
    setSelectAll2(newValue);
  };
  const handleDesasigned = async () =>{
    try{
      const response = await dispatch(desasignedHorario({data:{horario:desasignedId},id:data.id}))
      if (response.payload.success){
        dispatch(fetchData())
        setHorario(response.payload.data.horario)
        
        const res = await GetId('/linea/horarios', data.id)
      setDataDB(res.data)
      }
    }catch(error){}finally{
      handleReset()
    }
  }
  const handleAsigned = async () =>{
    try{
      const response = await dispatch(asignedHorario({data:{horario:asignedId},id:data.id}))
      if (response.payload.success){
        dispatch(fetchData())
        setHorario(response.payload.data.horario)
        
        const res = await GetId('/linea/horarios', data.id)
      setDataDB(res.data)
      }
    }catch(error){}finally{
      handleReset()
    }
    
  }
  const handleReset = () =>{
    setSelectAll(false)
    setSelectAll2(false)
    setCheckedItems({})
    setCheckedItems2({})
    setDesasignedId([])
    setAsignedId([])
  }
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
  
  return (
    <Dialog
      fullWidth
      open={open}
      maxWidth='md'
      scroll='body'
      onClose={toggle}
      TransitionComponent={Transition}
      fullScreen={fullScreen}
    >
      <DialogContent sx={{ px: { xs: 4, sm: 5 }, py: { xs: 12, sm: 12.5 }, position: 'relative' }}>
        <IconButton
          size='small'
          onClick={toggle}
          sx={{ position: 'absolute', right: '1rem', top: '1rem' }}
        ><Icon icon='mdi:close' /></IconButton>
        {data.length !==0?<><Box sx={{display:'flex', justifyContent:'center', mb:2}}>
          <Typography variant="h5">linea {data.name}</Typography>
          </Box>
          <Divider />
        <Grid container spacing={2}>
          <Grid item xs={6} sx={{ borderRight: `1px solid #E0E0E0`, pr: 2 }}>
            <Box sx={{ mb: 4, textAlign: 'center' }}>
              <Typography variant='h5' sx={{ mb: 0, lineHeight: '2rem' }}>Lista de horarios asignados </Typography>
            </Box>
            <Card sx={{ display: { xs: 'block', sm: 'flex' }, 
            justifyContent: 'space-between', 
            border: '1px solid #E0E0E0', padding: 1, mb: 3, 
            backgroundColor:'#B0F2C2'
            }}>
              <FormControlLabel
                control={<Checkbox checked={selectAll} onChange={handleSelectAll}  value={'all'} />} label={selectAll?'desmarcar todo':
                'marcar todo'} />
              <Button sx={{ height:{sm:35}, top:{sm:4}, p:{sm:2} }} 
              disabled={selectAll && desasignedId.length !==0?false:true} variant="contained" onClick={handleDesasigned}>Desasignar horarios&gt;</Button>
            </Card>

            {horario.map((horarios: any, index: any) => (
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Card sx={{mb:3}}>
                    <Box sx={{pl:2, height:30, pb:9, backgroundColor:'#B0F2C2'}}>
                      <FormControlLabel sx={{width:'100%'}}
                        control={<Checkbox checked={checkedItems[index] || false} onChange={() => handleToggle(index, horarios._id)} value={horarios.id} />}
                        label={<Typography variant="overline" sx={{color:'#707070'}}>{horarios.name}</Typography>} />
                    </Box>
                    <CardContent sx={{ paddingTop: 2 }}>
                      <Typography sx={{ textAlign: 'center' }}>Lugar de Salida: {horarios.place}</Typography>
                      <Typography>Primera Salida: {horarios.firstOut}</Typography>
                      <Typography>Última Salida: {horarios.lastOut}</Typography>
                      <Divider ><Typography sx={{ mt: 1, display: 'flex', justifyContent: 'center' }}>Días</Typography></Divider>
                      <Grid container spacing={2}>
                        {horarios.days.map((day: any) => (
                          <Grid item xs={6} sm={3}>
                            <Typography noWrap variant="subtitle2">{day}</Typography></Grid>
                        ))}
                        {horarios.otherDay ?
                          <Grid item xs={4} sm={3}><Typography variant="subtitle2">{horarios.otherDay}</Typography></Grid> : ''
                        }
                      </Grid>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            ))}
          </Grid>
          <Grid item xs={6}>
            <Box sx={{ mb: 4, textAlign: 'center' }}>
              <Typography variant='h5' sx={{ mb: 0, lineHeight: '2rem' }}>Lista de horarios no asignados </Typography>
            </Box>
            <Card sx={{ display: { xs: 'block', sm: 'flex' }, 
            justifyContent: 'space-between', border: '1px solid #E0E0E0', padding: 1, mb: 3, 
            backgroundColor: '#EF9A9A'
            }}>
              <FormControlLabel
                control={<Checkbox checked={selectAll2} onChange={handleSelectAll2}  value={'all2'} />} label={selectAll2?'desmarcar todo':
                  'marcar todo'} />
              <Button sx={{ height:{sm:35}, top:{sm:4}, p:{sm:2} }} 
              disabled={selectAll2 && asignedId.length !== 0? false:true} 
              variant="contained"
              onClick={handleAsigned}
              >&lt;asignar horarios</Button>
            </Card>

            {dataDB.map((horarios: any, index:number) => (
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Card sx={{mb:3}}>
                    <Box sx={{pl:2, pb:9, height:30, backgroundColor:'#EF9A9A'}}>
                      <FormControlLabel
                        control={<Checkbox checked={checkedItems2[index] || false} onChange={() => handleToggle2(index,horarios._id)} value={horarios._id} />}
                        label={<Typography variant="overline" sx={{color:'#707070'}}>{horarios.name}</Typography>} />
                    </Box>
                    <CardContent sx={{ paddingTop: 2 }}>
                      <Typography sx={{ textAlign: 'center' }}>Lugar de Salida: {horarios.place}</Typography>
                      <Typography>Primera Salida: {horarios.firstOut}</Typography>
                      <Typography>Última Salida: {horarios.lastOut}</Typography>
                      <Divider ><Typography sx={{ mt: 1, display: 'flex', justifyContent: 'center' }}>Días</Typography></Divider>
                      <Grid container spacing={2}>
                        {horarios.days.map((day: any) => (
                          <Grid item xs={6} sm={3}>
                            <Typography noWrap variant="subtitle2">{day}</Typography></Grid>
                        ))}
                        {horarios.otherDay ?
                          <Grid item xs={4} sm={3}><Typography variant="subtitle2">{horarios.otherDay}</Typography></Grid> : ''
                        }
                      </Grid>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            ))}
          </Grid>
        </Grid>
        </>:''}
      </DialogContent>
    </Dialog>
  )
}
export default ViewHorario