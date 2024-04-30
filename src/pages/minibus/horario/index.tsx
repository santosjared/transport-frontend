import { Box, Button, Card, CardHeader, Grid, Typography } from "@mui/material"
import { DataGrid } from "@mui/x-data-grid"
import { useCallback, useState } from "react"
import { useQuery } from "react-query"
import AddDraw from "src/components/addDraw"
import TableHeader from "src/components/tableHeader"
import { useService } from "src/hooks/useService"
import RegisterHorario from "./register"
import CustomChip from 'src/@core/components/mui/chip'

interface horarioData {
    name: string;
    horarioIda: [{
        place: string,
        firstOut: string,
        lastOut: string,
        days: [],
        description: string
    }],
    horarioVuelta: [{
        place: string,
        firstOut: string,
        lastOut: string,
        days: [],
        description: string
    }],
    status: boolean
}
interface TypeCell {
    row: horarioData
}


const columns = [
    {
        flex: 0.2,
        field: 'name',
        headerName: 'Nombre de horario',
        renderCell: ({ row }: TypeCell) => {
            return (
                <Typography noWrap variant='body2'>
                    {row.name}
                </Typography>
            )
        }
    },
    {
        flex: 0.2,
        field: 'horarioIda',
        headerName: 'Horario de Ida',
        renderCell: ({ row }: TypeCell) => {
            return (
                <>{row.horarioIda.map((horario, i) => (
                    <Box sx={{display:'block', justifyContent:'space-between'}}>
                        <Box >
                            <Typography noWrap variant='body2'>
                                {horario.place}
                            </Typography>
                        </Box>
                        <Box >
                            <Typography noWrap variant='body2'>
                                {horario.firstOut} - {horario.lastOut}
                            </Typography>
                        </Box>
                    </Box>
                ))}
                </>
            )
        }
    },
    {
        flex: 0.2,
        field: 'horarioVuelta',
        headerName: 'Horario de vuelta',
        renderCell: ({ row }: TypeCell) => {
            return (
                <>{row.horarioVuelta.map((horario, i) => (
                    <Box sx={{display:'block', justifyContent:'center'}}>
                        <Box >
                            <Typography noWrap variant='body2'>
                                {horario.place}
                            </Typography>
                        </Box>
                        <Box >
                            <Typography noWrap variant='body2'>
                                {horario.firstOut} - {horario.lastOut}
                            </Typography>
                        </Box>
                    </Box>
                ))}
                </>
            )
        }
    },
    {
        flex: 0.2,
        field: 'details',
        headerName: 'Detalles',
        renderCell: () => {
            return (
                <Typography noWrap variant="body2" >
                    <Button variant="text" sx={{ textTransform: 'lowercase' }}>ver detalle</Button>
                </Typography>
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
                    label={row.status ? 'Activo' : 'Inactivo'}
                    color={row.status ? 'success' : 'secondary'}
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
const Horario = () => {
    const [pageSize, setPageSize] = useState<number>(10)
    const [value, setValue] = useState<string>('')
    const [draw, setDraw] = useState<boolean>(false)

    const { Get } = useService()
    const { data, isLoading, isError } = useQuery('horario', () => Get('/horario'))
    const handleFilter = useCallback((val: string) => {
        setValue(val)
    }, [])
    const toggleDrawer = () => setDraw(!draw)
    
    return (
        <Grid container spacing={6} >
            <Grid item xs={12}>
                <Card>
                    <CardHeader title='Registro de horario' sx={{ pb: 0, '& .MuiCardHeader-title': { letterSpacing: '.15px' } }} />
                    <TableHeader
                        value={value}
                        handleFilter={handleFilter}
                        toggle={toggleDrawer}
                        placeholder='Busquedad de horarios'
                        title='Nuevo horario'
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
            <AddDraw open={draw} toggle={toggleDrawer} title='Registro de Horarios'>
                <RegisterHorario toggle={toggleDrawer} />
            </AddDraw>
        </Grid>
    )
}
export default Horario