import { Box, Button, Card, CardHeader, FormControl, Grid, IconButton, Menu, MenuItem, Select, SelectChangeEvent, TextField, Typography } from "@mui/material"
import { DataGrid } from "@mui/x-data-grid"
import { useCallback, useEffect, useState, MouseEvent, ChangeEvent } from "react"
import { useQuery } from "react-query"
import AddDraw from "src/components/addDraw"
import TableHeader from "src/components/tableHeader"
import { useService } from "src/hooks/useService"
import AddLinea from "./register"
import { useDispatch } from "react-redux"
import { AppDispatch, RootState } from "src/store"
import { useSelector } from "react-redux"
import { deleteLinea, fetchData } from "src/store/apps/linea"
import ViewMap from "./ruta"
import ListRoad from "./listRoad"
import ViewHorario from "./ListHorario"
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import ViewTarifa from "./listTarifa"
import ViewBus from "./listBus"
import Icon from "src/@core/components/icon"
import Swal from "sweetalert2"
import EditLinea from "./edit"
import FilterListIcon from '@mui/icons-material/FilterList';

interface LineaData {
    id: string;
    name: string;
    road: any;
    horario: [];
    rate: [];
    buses: [];
    status: boolean;
}

const defaultFilter = {
    name: '',
    road: '',
    horario: '',
    rate: '',
    buses: '',
    status: ''
}

interface TypeCell {
    row: LineaData
}

const Lineas = () => {
    const RowOptions = ({ id, linea }: { id: string, linea?: any }) => {
        const dispatch = useDispatch<AppDispatch>()
        const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
        const rowOptionsOpen = Boolean(anchorEl)

        const handleRowOptionsClick = (event: MouseEvent<HTMLElement>) => {
            setAnchorEl(event.currentTarget)
        }
        const handleRowOptionsClose = () => {
            setAnchorEl(null)
        }
        const handleDelete = async () => {
            handleRowOptionsClose()
            const confirme = await Swal.fire({
                title: '¿Estas seguro de eliminar?',
                icon: "warning",
                showCancelButton: true,
                cancelButtonColor: "#3085d6",
                cancelButtonText: 'Cancelar',
                confirmButtonColor: '#ff4040',
                confirmButtonText: 'Eliminar',
            }).then(async (result) => { return await result.isConfirmed });
            if (confirme) {
                dispatch(deleteLinea(id)).then((result) => {
                    if (result.payload) {
                        Swal.fire({
                            title: '¡Éxito!',
                            text: 'Los datos fueron eliminados',
                            icon: "success"
                        });
                    }
                })
            }
        }

        return (
            <>
                <IconButton size='small' onClick={handleRowOptionsClick}>
                    <Icon icon='mdi:dots-vertical' />
                </IconButton>
                <Menu
                    keepMounted
                    anchorEl={anchorEl}
                    open={rowOptionsOpen}
                    onClose={handleRowOptionsClose}
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'right'
                    }}
                    transformOrigin={{
                        vertical: 'top',
                        horizontal: 'right'
                    }}
                    PaperProps={{ style: { minWidth: '8rem' } }}
                >
                    <MenuItem onClick={() => { handleRowOptionsClose(); handleEdit(linea) }} sx={{ '& svg': { mr: 2 } }}>
                        <Icon icon='mdi:pencil-outline' fontSize={20} color='#00a0f4' />
                        Editar
                    </MenuItem>
                    <MenuItem sx={{ '& svg': { mr: 2 } }} onClick={handleDelete}>
                        <Icon icon='ic:outline-delete' fontSize={20} color='#ff4040' />
                        Eliminar
                    </MenuItem>
                </Menu>
            </>
        )
    }
    const columns = [
        {
            flex: 0.2,
            field: 'name',
            headerName: 'Nombre de la linea',
            renderCell: ({ row }: TypeCell) => {
                return (
                    <Typography noWrap variant="body2">
                        {row.name}
                    </Typography>
                )
            }
        },
        {
            flex: 0.2,
            field: 'route',
            headerName: 'Rutas y paradas',
            renderCell: ({ row }: TypeCell) => {
                return (
                    <>{row.road ? <><OpenInNewIcon sx={{ color: `#A0A0A0`, cursor: 'pointer' }} onClick={() => viewRoad(row.id, row.road)} />
                        <Typography noWrap variant="body2" onClick={() => viewRoad(row.id, row.road)} sx={{ cursor: 'pointer' }}>
                            {row.road.name}</Typography></> :
                        <Button variant="outlined" sx={{ height: 20 }} onClick={() => handleAsignedRoad(row.id)}>asignar</Button>}</>
                )
            }
        },
        {
            flex: 0.2,
            field: 'horario',
            headerName: 'Horarios',
            renderCell: ({ row }: TypeCell) => {
                return (
                    <>
                        <OpenInNewIcon sx={{ color: '#A0A0A0', cursor: 'pointer' }} onClick={() => handleHorario(row)} />
                        <Typography noWrap variant="body2" onClick={() => handleHorario(row)} sx={{ cursor: 'pointer' }}> ver horario</Typography>
                    </>
                )
            }
        },
        {
            flex: 0.2,
            field: 'tarifa',
            headerName: 'Tarifas',
            renderCell: ({ row }: TypeCell) => {
                return (
                    <>
                        <OpenInNewIcon sx={{ color: '#A0A0A0', cursor: 'pointer' }} onClick={() => handleTarifa(row)} />
                        <Typography noWrap variant="body2" sx={{ cursor: 'pointer' }} onClick={() => handleTarifa(row)}> ver tarifas</Typography>
                    </>
                )
            }
        },
        {
            flex: 0.2,
            field: 'buses',
            headerName: 'Buses',
            renderCell: ({ row }: TypeCell) => {
                return (
                    <>
                        <OpenInNewIcon sx={{ color: '#A0A0A0', cursor: 'pointer' }} onClick={() => handleBus(row)} />
                        <Typography noWrap variant="body2" sx={{ cursor: 'pointer' }} onClick={() => handleBus(row)}> ver buses</Typography>
                    </>
                )
            }
        },
        {
            flex: 0.2,
            minWidth: 80,
            field: 'actions',
            sortable: false,
            headerName: 'Acciones',
            renderCell: ({ row }: TypeCell) => {
                return (<RowOptions id={row.id} linea={row} />)
            }
        }
    ]

    const [pageSize, setPageSize] = useState<number>(10)
    const [openAdd, setOpenAdd] = useState<boolean>(false)
    const [openRoad, setOpenRoad] = useState(false)
    const [idLinea, setIdLinea] = useState('')
    const [openListRoad, setOpenListRoad] = useState(false)
    const [lineaData, setLinea] = useState<any[]>([])
    const [dataHorario, setDataHorario] = useState<any[]>([])
    const [openHorario, setOpenHorario] = useState(false)
    const [dataTarifa, setDataTarifa] = useState<any[]>([])
    const [openTarifa, setOpenTarifa] = useState(false)
    const [openBus, setOpenBus] = useState(false)
    const [openEdit, setOpenEdit] = useState(false)
    const [dataBus, setDataBus] = useState<any[]>([])
    const [openfilters, setOpenFilters] = useState(false)
    const [filters, setFilters] = useState(defaultFilter)

    const dispatch = useDispatch<AppDispatch>()
    const store = useSelector((state: RootState) => state.linea)

    const toggleRoad = () => setOpenRoad(!openRoad)
    const toggleDrawer = () => setOpenAdd(!openAdd)
    const toggleListRoad = () => setOpenListRoad(!openListRoad)
    const toggleHorario = () => setOpenHorario(!openHorario)
    const toggleTarifa = () => setOpenTarifa(!openTarifa)
    const toggleBus = () => setOpenBus(!openBus)
    const toggleEdit = () => setOpenEdit(!openEdit)
    const toggleFilter = () => setOpenFilters(!openfilters)

    useEffect(() => {
        dispatch(fetchData())
    }, [dispatch])
    const handleEdit = (linea: any) => {
        setLinea(linea)
        toggleEdit()
    }
    const viewRoad = (id: string, data: any) => {
        setLinea(data)
        setIdLinea(id)
        toggleRoad()
    }
    const handleAsignedRoad = (id: string) => {
        setIdLinea(id)
        toggleListRoad()
    }
    const handleHorario = (dta: any) => {
        setDataHorario(dta)
        toggleHorario()
    }
    const handleTarifa = (dta: any) => {
        setDataTarifa(dta)
        toggleTarifa()
    }
    const handleBus = (dta: any) => {
        setDataBus(dta)
        toggleBus()
    }
    const handleChangeFields = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setFilters({
            ...filters,
            [name]: value
        })
    }
    const handleChangeSelects = (e: SelectChangeEvent) => {
        const { name, value } = e.target
        setFilters({
            ...filters,
            [name]: value
        })
    }
    const handleFilters = () => {

    }
    const handleReset = () => {

    }
    if (openRoad) {
        return (
            <ViewMap data={lineaData} onClose={toggleRoad} id={idLinea} />
        )
    } else {
        return (
            <Grid container spacing={6} >
                <Grid item xs={12}>
                    <Card>
                        <CardHeader title='Registro de lineas' sx={{ pb: 0, '& .MuiCardHeader-title': { letterSpacing: '.15px' } }} />
                        <Box sx={{ p: 5, pb: 3, display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between' }}>
                            <Button variant="contained" sx={{ height: 43 }} onClick={toggleFilter}>
                                {openfilters ? 'Cerrar filtrado' : 'Filtrar por columnas'}
                            </Button>
                            <Button sx={{ mb: 2, mt: { xs: 3, sm: 0 } }} onClick={toggleDrawer} variant='contained'>
                                Nuevo linea
                            </Button>
                        </Box>
                        {openfilters ? <Box sx={{ pt: 0, pl: 5, pr: 5, pb: 3 }}>
                            <Card sx={{ p: 2 }}>
                                <Grid container spacing={2}>
                                    <Grid item xs={2.4}>
                                        <FormControl fullWidth sx={{ mb: 1 }}>
                                            <TextField label='Nombre de la linea'
                                                variant='standard'
                                                name="name"
                                                fullWidth
                                                autoComplete='off'
                                                value={filters.name}
                                                onChange={handleChangeFields}
                                                InputProps={{
                                                    startAdornment: <FilterListIcon />,
                                                }}
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs={2.4}>
                                        <FormControl fullWidth sx={{ mb: 1 }}>
                                            <TextField label='Rutas y paradas'
                                                variant='standard'
                                                name="road"
                                                fullWidth
                                                value={filters.road}
                                                onChange={handleChangeFields}
                                                autoComplete='off'
                                                InputProps={{
                                                    startAdornment: <FilterListIcon />,
                                                }}
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs={2.4}>
                                        <FormControl fullWidth sx={{ mb: 1 }}>
                                            <TextField label='Horario'
                                                variant='standard'
                                                fullWidth
                                                name="horario"
                                                value={filters.horario}
                                                onChange={handleChangeFields}
                                                autoComplete='off'
                                                InputProps={{
                                                    startAdornment: <FilterListIcon />,
                                                }}
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs={2.4}>
                                        <FormControl fullWidth sx={{ mb: 1 }}>
                                            <TextField label='Tarifa'
                                                variant='standard'
                                                fullWidth
                                                name="rate"
                                                value={filters.rate}
                                                onChange={handleChangeFields}
                                                autoComplete='off'
                                                InputProps={{
                                                    startAdornment: <FilterListIcon />,
                                                }}
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs={2.4}>
                                        <FormControl fullWidth sx={{ mb: 1 }}>
                                            <TextField label='buses'
                                                variant='standard'
                                                fullWidth
                                                name="buses"
                                                value={filters.buses}
                                                onChange={handleChangeFields}
                                                autoComplete='off'
                                                InputProps={{
                                                    startAdornment: <FilterListIcon />,
                                                }}
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Box>
                                            <Button variant="contained" sx={{ mr: 3 }} onClick={handleFilters}>Filtrar</Button>
                                            <Button variant="outlined" onClick={handleReset}>Restablecer</Button>
                                        </Box>
                                    </Grid>
                                </Grid>
                            </Card>
                        </Box> : ''}
                        {store.isLoading ? <Box sx={{ textAlign: 'center' }}>Cargando datos...</Box> : !store.isError ?
                            <DataGrid
                                autoHeight
                                rows={store.data}
                                columns={columns}
                                pageSize={pageSize}
                                disableSelectionOnClick
                                rowsPerPageOptions={[10, 25, 50]}
                                sx={{ '& .MuiDataGrid-columnHeaders': { borderRadius: 0 } }}
                                onPageSizeChange={(newPageSize: number) => setPageSize(newPageSize)}
                            /> : ''
                        }
                    </Card>
                </Grid>
                <AddDraw open={openAdd} toggle={toggleDrawer} title='Registro de la linea'>
                    <AddLinea toggle={toggleDrawer} />
                </AddDraw>
                <AddDraw open={openEdit} toggle={toggleEdit} title="Editar linea">
                    <EditLinea toggle={toggleEdit} dataEdit={lineaData} />
                </AddDraw>
                <ListRoad open={openListRoad} toggle={toggleListRoad} id={idLinea} />
                <ViewHorario open={openHorario} toggle={toggleHorario} data={dataHorario} />
                <ViewTarifa open={openTarifa} toggle={toggleTarifa} data={dataTarifa} />
                <ViewBus open={openBus} toggle={toggleBus} data={dataBus} />
            </Grid>
        )
    }
}
export default Lineas