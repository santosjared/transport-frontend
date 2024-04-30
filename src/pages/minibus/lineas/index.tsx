import { Box, Card, CardHeader, Grid, Typography } from "@mui/material"
import { DataGrid } from "@mui/x-data-grid"
import { useCallback, useEffect, useState } from "react"
import { useQuery } from "react-query"
import AddDraw from "src/components/addDraw"
import TableHeader from "src/components/tableHeader"
import { useService } from "src/hooks/useService"
import AddLinea from "./register"
import CustomChip from 'src/@core/components/mui/chip'

interface LineaData {
    id: string;
    name: string;
    route: string;
    horario: [];
    tarifa: [];
    buses: [];
    status: boolean;
}
interface TypeCell {
    row: LineaData
}
const RenderHorario = ({ horario }: { horario: [] }) => {

    const [names, setNames] = useState<any[]>([]);

    const { GetId } = useService();

    useEffect(() => {
        const fetchNames = async () => {
            const name = await Promise.all(horario.map(async (id) => {
                const response = await GetId('/horario', id);
                return response.data.name;
            }));
            setNames(name)
        };

        fetchNames();
    }, [horario]);
    return (<Typography>{names.map((names) => (
        <Typography noWrap variant="body2">{names}</Typography>
    ))}</Typography>)
}

const RenderTarifa = ({ tarifa }: { tarifa: [] }) => {

    const [names, setNames] = useState<any[]>([]);

    const { GetId } = useService();

    useEffect(() => {
        const fetchNames = async () => {
            const name = await Promise.all(tarifa.map(async (id) => {
                const response = await GetId('/tarifa', id);
                return response.data.name;
            }));
            setNames(name)
        };

        fetchNames();
    }, [tarifa]);
    return (<Typography>{names.map((names) => (
        <Typography noWrap variant="body2">{names}</Typography>
    ))}</Typography>)
}

const RenderBuses = ({ buses }: { buses: [] }) => {

    const [names, setNames] = useState<any[]>([]);

    const { GetId } = useService();

    useEffect(() => {
        const fetchNames = async () => {
            const name = await Promise.all(buses.map(async (id) => {
                const response = await GetId('/bus', id);
                return {
                    trademark:response.data.trademark,
                    plaque:response.data.plaque
                };
            }));
            setNames(name)
        };

        fetchNames();
    }, [buses]);
    return (<Typography>{names.map((names) => (
        <Typography noWrap variant="body2">{names.trademark} - {names.plaque}</Typography>
    ))}</Typography>)
}

const RenderRoute = ({ id }: { id: number | string }) => {

    const [data, setData] = useState<{ name: string }>({ name: '' })

    const { GetId } = useService()

    useEffect(() => {
        const fetchData = async () => {
            const fetch = await GetId('/road', id)
            setData(fetch.data)
        }
        fetchData()
    }, [id])
    return (<Typography noWrap variant="body2">
        {data.name}
    </Typography>)
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
                <RenderRoute id={row.route} />
            )
        }
    },
    {
        flex: 0.2,
        field: 'horario',
        headerName: 'Horarios',
        renderCell: ({ row }: TypeCell) => {
            return (
                <RenderHorario horario={row.horario} />
            )
        }
    },
    {
        flex: 0.2,
        field: 'tarifa',
        headerName: 'Tarifas',
        renderCell: ({ row }: TypeCell) => {
            return (
                <RenderTarifa tarifa={row.tarifa} />
            )
        }
    },
    {
        flex: 0.2,
        field: 'buses',
        headerName: 'Buses',
        renderCell: ({ row }: TypeCell) => {
            return (
                <RenderBuses buses={row.buses} />
            )
        }
    },
    {
        flex: 0.2,
        field: 'status',
        headerName: 'Estados',
        renderCell: ({ row }: TypeCell) => {
            return (
              <CustomChip
                skin='light'
                size='small'
                label={row.status? 'Activo':'Inactivo'}
                color={row.status? 'success':'secondary'}
                sx={{ textTransform: 'capitalize', '& .MuiChip-label': { lineHeight: '18px' } }}
              />
            )
          }
    },
    {
        flex: 0.2,
        field: 'actions',
        headerName: 'Acciones'
    }
]
const Lineas = () => {
    const [pageSize, setPageSize] = useState<number>(10)
    const [value, setValue] = useState<string>('')
    const [openAdd, setOpenAdd] = useState<boolean>(false)
    const { Get } = useService()
    const { data, isLoading, isError } = useQuery('linea', () => Get('/linea'))
    const handleFilter = useCallback((val: string) => {
        setValue(val)
    }, [])
    const toggleDrawer = () => setOpenAdd(!openAdd)
    return (
        <Grid container spacing={6} >
            <Grid item xs={12}>
                <Card>
                    <CardHeader title='Registro de lineas' sx={{ pb: 0, '& .MuiCardHeader-title': { letterSpacing: '.15px' } }} />
                    <TableHeader
                        value={value}
                        handleFilter={handleFilter}
                        toggle={toggleDrawer}
                        placeholder='Busquedad de lineas'
                        title='Nueva linea'
                        disable={isError || isLoading}
                    />
                    {isLoading ? <Box sx={{ textAlign: 'center' }}>Cargando datos...</Box> : !isError ?
                        <DataGrid
                            autoHeight
                            rows={data?.data}
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
        </Grid>
    )
}
export default Lineas