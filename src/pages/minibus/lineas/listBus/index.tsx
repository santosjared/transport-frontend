import { Box, Button, Card, CardContent, Checkbox, Dialog, DialogContent, Divider, Fade, FadeProps, FormControl, FormControlLabel, Grid, IconButton, InputLabel, List, ListItem, ListItemText, TextField, Typography, useMediaQuery, useTheme } from "@mui/material"
import { ReactElement, Ref, forwardRef, useEffect, useState } from "react"
import { useDispatch } from "react-redux"
import Icon from "src/@core/components/icon"
import { useService } from "src/hooks/useService"
import { AppDispatch } from "src/store"
import { asignedBus, desasignedBus,fetchData } from "src/store/apps/linea"
import { isImage } from "src/utils/verificateImg"
import getConfig from 'src/configs/environment'
import { DataGrid, GridSelectionModel } from "@mui/x-data-grid"
import FilterListIcon from '@mui/icons-material/FilterList';

interface Props {
  open: boolean,
  toggle: () => void
  data: any
}

type Bus = {
  id: string,
  trademark: string,
  model: number,
  type: string,
  plaque: string,
  cantidad: number,
  photo: string
}
interface TypeCell {
  row: Bus
}

const Transition = forwardRef(function Transition(
  props: FadeProps & { children?: ReactElement<any, any> },
  ref: Ref<unknown>
) {
  return <Fade ref={ref} {...props} />
})

const renderImg = (row: Bus) => {

  const [isImg, setIsImg] = useState<any>(false)
  useEffect(() => {
    const image = async () => {
      const img = await isImage(`${getConfig().backendURI}${row.photo}`)
      setIsImg(img)
    }
    image()
  }, [row.photo])
  if (isImg) {
    return (
      <Box sx={{ display: 'flex', border: 'solid 1px #E0E0E0', borderRadius: 0.5 }}>
        <img src={`${getConfig().backendURI}${row.photo}`} height={35} width={35} style={{ borderRadius: 5 }}></img>
      </Box>
    )
  } else {
    return ''
  }

}

const columns = [
  {
    flex: 0.2,
    minWidth: 200,
    field: 'trademark',
    headerName: 'Marca',
    renderCell: ({ row }: TypeCell) => {
      return (
        <Box sx={{ display: 'flex' }}>
          {renderImg(row)}
          <Box sx={{ display: 'flex', paddingTop: 2, paddingLeft: 1 }}>
            <Typography noWrap variant='body2'>
              {row.trademark}
            </Typography>
          </Box>
        </Box>
      )
    }
  },
  {
    flex: 0.2,
    minWidth: 90,
    field: 'model',
    sortable: false,
    headerName: 'Modelo',
    renderCell: ({ row }: TypeCell) => {
      return (
        <Typography noWrap variant='body2'>
          {row.model}
        </Typography>
      )
    }
  },
  {
    flex: 0.2,
    minWidth: 90,
    field: 'type',
    sortable: false,
    headerName: 'Tipo',
    renderCell: ({ row }: TypeCell) => {
      return (
        <Typography noWrap variant='body2'>
          {row.type}
        </Typography>
      )
    }
  },
  {
    flex: 0.2,
    minWidth: 90,
    field: 'plaque',
    sortable: false,
    headerName: 'Placa',
    renderCell: ({ row }: TypeCell) => {
      return (
        <Typography noWrap variant='body2'>
          {row.plaque}
        </Typography>
      )
    }
  },
  {
    flex: 0.2,
    minWidth: 20,
    field: 'cantidad',
    headerName: 'Asientos',
    renderCell: ({ row }: TypeCell) => {
      return (
        <Typography noWrap variant='body2'>
          {row.cantidad}
        </Typography>
      )
    }
  }
]

const ViewBus = ({ open, toggle, data }: Props) => {

  const [dataDB, setDataDB] = useState<any[]>([])
  const [bus, setBus] = useState<any[]>([])
  const [pageSize, setPageSize] = useState<number>(10)
  const [openfilters, setOpenFilters] = useState(false)
  const [openfilters2, setOpenFilters2] = useState(false)
  const [selectedIds, setSelectedIds] = useState<GridSelectionModel>([]);
  const [selectedIds2, setSelectedIds2] = useState<GridSelectionModel>([]);

  const toggleFilter = () => setOpenFilters(!openfilters)
  const toggleFilter2 = () => setOpenFilters2(!openfilters2)
  const {Get } = useService()
  useEffect(() => {
    if (data.length !== 0) {
      const fetch = async () => {
        const response = await Get('/linea/allBusNotAsigned')
        setDataDB(response.data.result)
      }
      fetch();
      setBus(data.buses)
    }
  }, [data])
  const dispatch = useDispatch<AppDispatch>()
  const handleSelectionChange = (newSelection:GridSelectionModel) => {
    const selectedIDs = newSelection as number[];
    const selectedData = selectedIDs.map((id) => bus.find((row) => row.id === id)!);
    const selectedIdsOnly = selectedData.map((row) => row._id);
    setSelectedIds(selectedIdsOnly);
  };
  const handleSelectionChange2 = (newSelection:GridSelectionModel) => {
    const selectedIDs = newSelection as number[];
    const selectedData = selectedIDs.map((id) => dataDB.find((row) => row.id === id)!);
    const selectedIdsOnly = selectedData.map((row) => row._id);
    setSelectedIds2(selectedIdsOnly);
  };
  const handleDesasigned = async () => {
    try {
      const response = await dispatch(desasignedBus({ data: { buses:selectedIds  }, id: data.id }))
      if (response.payload.success) {
        dispatch(fetchData())
        setBus(response.payload.data.buses)

        const res = await Get('/linea/allBusNotAsigned')
        setDataDB(res.data.result)
      }
    } catch (error) { } finally {
      handleReset()
    }
  }
  const handleAsigned = async () => {
    try {
      const response = await dispatch(asignedBus({ data: { buses:selectedIds2  }, id: data.id }))
      if (response.payload.success) {
        dispatch(fetchData())
        setBus(response.payload.data.buses)

        const res = await Get('/linea/allBusNotAsigned')
        setDataDB(res.data.result)
      }
    } catch (error) { } finally {
      handleReset()
    }

  }
  const handleReset = () => {
  
  }
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Dialog
      fullWidth
      open={open}
      maxWidth='xl'
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
        {data.length !== 0 ? <><Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
          <Typography variant="h5">linea {data.name}</Typography>
        </Box>
          <Divider />
          <Grid container spacing={2}>
            <Grid item xs={6} sx={{ borderRight: `1px solid #E0E0E0`, pr: 2 }}>
              <Box sx={{ mb: 4, textAlign: 'center' }}>
                <Typography variant='h5' sx={{ mb: 0, lineHeight: '2rem' }}>Lista de buses asignados </Typography>
              </Box>
              <Box sx={{ pt: 5, pl: 5, pr: 5, pb: 3, display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between' }}>
                <Button variant="contained" sx={{ height: 43, mb:{xs:3, sm:3, lg:0} }} onClick={toggleFilter}>
                  {openfilters ? 'Cerrar filtrado' : 'Filtrar por columnas'}
                </Button>
                <Button variant="contained" sx={{ height: 43 }} onClick={handleDesasigned}>desasignar buses</Button>
              </Box>
              {openfilters ? <Box sx={{ pt: 0, pl: 5, pr: 5, pb: 3 }}>
                <Card sx={{ p: 2 }}>
                  <Grid container spacing={2}>
                    <Grid item xs={2.4}>
                      <FormControl fullWidth sx={{ mb: 1 }}>
                        <TextField label='Marca'
                          variant='standard'
                          fullWidth
                          autoComplete='off'
                          InputProps={{
                            startAdornment: <FilterListIcon />,
                          }}
                        />
                      </FormControl>
                    </Grid>
                    <Grid item xs={2.4}>
                      <FormControl fullWidth sx={{ mb: 1 }}>
                        <TextField label='Modelo'
                          variant='standard'
                          fullWidth
                          type="number"
                          autoComplete='off'
                          InputProps={{
                            startAdornment: <FilterListIcon />,
                          }}
                        />
                      </FormControl>
                    </Grid>
                    <Grid item xs={2.4}>
                      <FormControl fullWidth sx={{ mb: 1 }}>
                        <TextField label='Tipo'
                          variant='standard'
                          fullWidth
                          autoComplete='off'
                          InputProps={{
                            startAdornment: <FilterListIcon />,
                          }}
                        />
                      </FormControl>
                    </Grid>
                    <Grid item xs={2.4}>
                      <FormControl fullWidth sx={{ mb: 1 }}>
                        <TextField label='Placa'
                          variant='standard'
                          fullWidth
                          autoComplete='off'
                          InputProps={{
                            startAdornment: <FilterListIcon />,
                          }}
                        />
                      </FormControl>
                    </Grid>
                    <Grid item xs={2.4}>
                      <FormControl fullWidth sx={{ mb: 1 }}>
                        <TextField label='Asientos'
                          variant='standard'
                          fullWidth
                          type="number"
                          autoComplete='off'
                          InputProps={{
                            startAdornment: <FilterListIcon />,
                          }}
                        />
                      </FormControl>
                    </Grid>
                    <Grid item xs={12}>
                      <Box>
                        <Button variant="contained" sx={{ mr: 3, mb:{xs:3,sm:0} }}>Filtrar</Button>
                        <Button variant="outlined">Restablecer</Button>
                      </Box>
                    </Grid>
                  </Grid>
                </Card>
              </Box> : ''}
              <DataGrid
                autoHeight
                rows={bus}
                columns={columns}
                pageSize={pageSize}
                // rowCount={store.total}
                checkboxSelection
                rowsPerPageOptions={[10, 25, 50]}
                sx={{
                  '& .MuiDataGrid-columnHeaders': { borderRadius: 0.5 },
                  '& .MuiDataGrid-columnHeader': { backgroundColor: '#B0F2C2' }
                }}
                // onPageChange={(newPageNumber) => setPageNumber(newPageNumber)}
                onPageSizeChange={(newPageSize: number) => setPageSize(newPageSize)}
                pagination
                onSelectionModelChange={handleSelectionChange}
              />
            </Grid>
            <Grid item xs={6}>
              <Box sx={{ mb: 4, textAlign: 'center' }}>
                <Typography variant='h5' sx={{ mb: 0, lineHeight: '2rem' }}>Lista de buses no asignados </Typography>
              </Box>
              <Box sx={{ pt: 5, pl: 5, pr: 5, pb: 3, display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between' }}>
                <Button variant="contained" sx={{ height: 43, mb:{xs:3, sm:3, lg:0} }}  onClick={toggleFilter2}>
                  {openfilters2 ? 'Cerrar filtrado' : 'Filtrar por columnas'}
                </Button>
                <Button variant="contained" sx={{ height: 43 }} onClick={handleAsigned}>asignar buses</Button>
              </Box>
              {openfilters2 ? <Box sx={{ pt: 0, pl: 5, pr: 5, pb: 3 }}>
                <Card sx={{ p: 2 }}>
                  <Grid container spacing={2}>
                    <Grid item xs={2.4}>
                      <FormControl fullWidth sx={{ mb: 1 }}>
                        <TextField label='Marca'
                          variant='standard'
                          fullWidth
                          autoComplete='off'
                          InputProps={{
                            startAdornment: <FilterListIcon />,
                          }}
                        />
                      </FormControl>
                    </Grid>
                    <Grid item xs={2.4}>
                      <FormControl fullWidth sx={{ mb: 1 }}>
                        <TextField label='Modelo'
                          variant='standard'
                          fullWidth
                          type="number"
                          autoComplete='off'
                          InputProps={{
                            startAdornment: <FilterListIcon />,
                          }}
                        />
                      </FormControl>
                    </Grid>
                    <Grid item xs={2.4}>
                      <FormControl fullWidth sx={{ mb: 1 }}>
                        <TextField label='Tipo'
                          variant='standard'
                          fullWidth
                          autoComplete='off'
                          InputProps={{
                            startAdornment: <FilterListIcon />,
                          }}
                        />
                      </FormControl>
                    </Grid>
                    <Grid item xs={2.4}>
                      <FormControl fullWidth sx={{ mb: 1 }}>
                        <TextField label='Placa'
                          variant='standard'
                          fullWidth
                          autoComplete='off'
                          InputProps={{
                            startAdornment: <FilterListIcon />,
                          }}
                        />
                      </FormControl>
                    </Grid>
                    <Grid item xs={2.4}>
                      <FormControl fullWidth sx={{ mb: 1 }}>
                        <TextField label='Asientos'
                          variant='standard'
                          fullWidth
                          type="number"
                          autoComplete='off'
                          InputProps={{
                            startAdornment: <FilterListIcon />,
                          }}
                        />
                      </FormControl>
                    </Grid>
                    <Grid item xs={12}>
                      <Box>
                        <Button variant="contained" sx={{ mr: 3, mb:{xs:3,sm:0} }}>Filtrar</Button>
                        <Button variant="outlined">Restablecer</Button>
                      </Box>
                    </Grid>
                  </Grid>
                </Card>
              </Box> : ''}
              <DataGrid
                autoHeight
                rows={dataDB}
                columns={columns}
                pageSize={pageSize}
                // rowCount={store.total}
                checkboxSelection
                rowsPerPageOptions={[10, 25, 50]}
                sx={{
                  '& .MuiDataGrid-columnHeaders': { borderRadius: 0.5 },
                  '& .MuiDataGrid-columnHeader': { backgroundColor: '#EF9A9A' }
                }}
                // onPageChange={(newPageNumber) => setPageNumber(newPageNumber)}
                onPageSizeChange={(newPageSize: number) => setPageSize(newPageSize)}
                pagination
                onSelectionModelChange={handleSelectionChange2}
              />
            </Grid>
          </Grid>
        </> : ''}
      </DialogContent>
    </Dialog>
  )
}
export default ViewBus