import React, { useCallback, useState, MouseEvent} from 'react'
import { Button, Card, CardHeader, Grid, IconButton} from '@mui/material'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import {styled} from '@mui/material/styles'
import { DataGrid} from '@mui/x-data-grid'
import TableHeader from 'src/views/apps/minibus/weeks/tableheader'
import Link from 'next/link'
import { useDispatch } from 'react-redux'
import Icon from 'src/@core/components/icon'

const columns = [
    {
        flex:0.2,
        minWidth:230,
        field:'Day',
        headerName:'Día'
    },
    {
        flex:0.2,
        minWidth:230,
        field:'Operation',
        headerName:'Horarios de Operación'
    },
    {
        flex:0.2,
        minWidth:230,
        field:'Frequency',
        headerName:'Frecuencia (min)'
    },
    {
        flex:0.2,
        minwidth:230,
        field:'route',
        headerName:'Rutas',
        renderCell:()=>{
            return(<Button href='/minibus/weeks' variant='outlined'>Ver rutas</Button>)
        }
    },
    {
        flex:0.2,
        minWidth:110,
        field:'horario',
        headerName:'Horario Diario',
        renderCell:()=>{
            return(<Button href='/minibus/days' variant='outlined'>Ver Horario</Button>)
        }
    }
]
const rows = [{
    id:1, Day:'Lunes',Operation:'08:00 - 22:00', Frequency:'15',route:'ver rutas', horario:'ver horario'
},
{
    id:2, Day:'Martes',Operation:'Sin servicio', Frequency:'',route:'', horario:''
},
]
const Weeks = ()=>{
    const [pageSize,setPageSize]=useState<number>(10)
    const [value, setValue] = useState<string>('')
    const [addUserOpen, setAddUserOpen] = useState<boolean>(false)
    const handleFilter = useCallback((val: string) => {
        setValue(val)
      }, [])
      const toggleAddUserDrawer = () => setAddUserOpen(!addUserOpen)
    return(
        <Grid container spacing={6}>
            <Grid item xs={12}>
                <Card>
                    <CardHeader title='Lista de Horario Semanal' sx={{pb:4, '& .MuiCardHeader-title':{letterSpacing:'.15px'}}}/>
                    <TableHeader value={value} handleFilter={handleFilter} toggle={toggleAddUserDrawer} />
                    <DataGrid
                    autoHeight
                    rows={rows}
                    columns={columns}
                    //checkboxSelection
                    pageSize={pageSize}
                    disableSelectionOnClick
                    rowsPerPageOptions={[10,25,50]}
                    sx={{ '& .MuiDataGrid-columnHeaders': { borderRadius: 0 } }}
                    onPageSizeChange={(newPageSize: number) => setPageSize(newPageSize)}
                    />
                </Card>
            </Grid>
        </Grid>
    )
}
export default Weeks