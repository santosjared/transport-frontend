import { Box, Card, CardContent, CardHeader, ChipProps, Divider, FormControl, Grid, InputLabel, MenuItem, Select, SelectChangeEvent, Typography } from "@mui/material"
import getConfig from 'src/configs/environment'
import CustomAvatar from 'src/@core/components/mui/avatar'
import { getInitials } from 'src/@core/utils/get-initials'
import CustomChip from 'src/@core/components/mui/chip'
import { useCallback, useEffect, useState } from "react"
import { useService } from "src/hooks/useService"
import Icon from "src/@core/components/icon"
import { DataGrid } from "@mui/x-data-grid"
import { useDispatch, useSelector } from "react-redux"
import { AppDispatch, RootState } from "src/store"
import { fetchData } from "src/store/apps/users"

interface UserRoleType {
    [key: string]: { icon: string; color: string }
}
const userRoleObj: UserRoleType = {
    administrador: { icon: 'mdi:laptop', color: 'error.main' },
    chofer: { icon: 'healthicons:truck-driver', color: 'success.main' },
    otro: { icon: 'mdi:account-outline', color: 'primary.main' }
}
interface TypeStatus {
    idUser: string
    status: [{
        connect: boolean,
        signal: boolean
        disconnect: boolean
    }]
    lastConnect: Date | null
}
interface TypeCell {
    row: TypeStatus
}
const RenderClient = ({ id }: { id: number | string }) => {
    const [user, setUser] = useState<any>()
    const { GetId } = useService()

    useEffect(() => {
        const fetchData = async () => {
            const fetch = await GetId('/users', id)
            setUser(fetch.data)
        }
        fetchData()
    }, [id])
    if (user.profile.length) {
        return <CustomAvatar src={user.profile} sx={{ mr: 3, width: 34, height: 34 }} />
    } else {
        return (
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <CustomAvatar
                    skin='light'
                    color='primary'
                    sx={{ mr: 3, width: 34, height: 34, fontSize: '1rem' }}
                >
                    {getInitials(user.name && user.lastName ? `${user.name} ${user.lastName}` : user.name ? user.name : 'Desconocido')}
                </CustomAvatar>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', flexDirection: 'column' }}>
                    <Typography sx={{ fontWeight: 600, fontSize: '1rem', color: theme => `${theme.palette.text.secondary}` }}>{`${user.name} ${user.lastName}`}</Typography>
                    <Typography noWrap variant='caption'>
                        {user.email}
                    </Typography>
                </Box>
            </Box>
        )
    }
}
const RenderCi = ({ id }: { id: number | string }) => {
    const [user, setUser] = useState<any>()
    const { GetId } = useService()

    useEffect(() => {
        const fetchData = async () => {
            const fetch = await GetId('/users', id)
            setUser(fetch.data)
        }
        fetchData()
    }, [id])
    return (<Typography noWrap variant='body2'>{user.ci}</Typography>)
}
const RenderRol = ({ id }: { id: number | string }) => {
    const [rol, setRol] = useState<any>()
    const { GetId } = useService()

    useEffect(() => {
        const fetchData = async () => {
            const fetch = await GetId('/users', id)
            setRol(fetch.data)
        }
        fetchData()
    }, [id])
    return (<Box sx={{ display: 'flex', alignItems: 'center', '& svg': { mr: 3, color: userRoleObj[rol.name].color } }}>
        <Icon icon={userRoleObj[rol.name].icon} fontSize={20} />
        <Typography noWrap sx={{ color: 'text.secondary', textTransform: 'capitalize' }}>
            {rol.name}
        </Typography>
    </Box>)
}
const getStatusColor = (row: TypeStatus): ChipProps['color'] => {
    let status: ChipProps['color'] = 'primary';
    row.status.forEach((val) => {
        if (val.connect) {
            status = 'success';
        }
        if (val.signal) {
            status = 'warning';
        }
        if (val.disconnect) {
            status = 'error';
        }
    });
    return status;
};

const RenderStatus = (row: TypeStatus) => {
    return (
        <>
            {row.status.map((val) => {
                if (val.connect) {
                    return (<Typography variant='body2'>en linea</Typography>)
                }
                if (val.signal) {
                    return (<Typography variant='body2'>baja señal</Typography>)
                }
                if (val.disconnect) {
                    return (
                        <>
                            <Typography variant='body2'>Desconectado</Typography>
                            <Typography variant='body2'>{`última conexion ${row.lastConnect ? row.lastConnect : 'nunca'}`}</Typography>
                        </>
                    )
                }
            })}
        </>
    )
}
const columns = [
    {
        flex: 0.2,
        minWidth: 230,
        field: 'user',
        headerName: 'Usuarios',
        renderCell: ({ row }: TypeCell) => {
            return (
                <RenderClient id={row.idUser} />
            )
        }
    },
    {
        flex: 0.2,
        minWidth: 230,
        field: 'ci',
        headerName: 'Ci',
        renderCell: ({ row }: TypeCell) => {
            return (
                <RenderCi id={row.idUser} />
            )
        }
    },
    {
        flex: 0.15,
        field: 'role',
        minWidth: 150,
        headerName: 'Rol',
        renderCell: ({ row }: TypeCell) => {
            return (
                <RenderRol id={row.idUser} />
            )
        }
    },
    {
        flex: 0.1,
        minWidth: 110,
        field: 'status',
        headerName: 'Estado de conexion',
        renderCell: ({ row }: TypeCell) => {
            return (
                <CustomChip
                    skin='light'
                    size='small'
                    label={RenderStatus(row)}
                    color={getStatusColor(row)}
                    sx={{ textTransform: 'capitalize', '& .MuiChip-label': { lineHeight: '18px' } }}
                />
            )
        }
    },
]

const ListStatusConnect = () =>{

    const [role, setRole] = useState<string>('')
    const [plan, setPlan] = useState<string>('')
    const [value, setValue] = useState<string>('')
    const [status, setStatus] = useState<string>('')
    const [pageSize, setPageSize] = useState<number>(10)
    const [addUserOpen, setAddUserOpen] = useState<boolean>(false)
  
    const dispatch = useDispatch<AppDispatch>()
    const store = useSelector((state: RootState) => state.users)
  
    useEffect(() => {
      dispatch(
        fetchData()
      )
    }, [dispatch, plan, role, status, value])
  
    const handleFilter = useCallback((val: string) => {
      setValue(val)
    }, [])
  
    const handleRoleChange = useCallback((e: SelectChangeEvent) => {
      setRole(e.target.value)
    }, [])
  
    const handlePlanChange = useCallback((e: SelectChangeEvent) => {
      setPlan(e.target.value)
    }, [])
  
    const handleStatusChange = useCallback((e: SelectChangeEvent) => {
      setStatus(e.target.value)
    }, [])
  
    const toggleAddUserDrawer = () => setAddUserOpen(!addUserOpen)
  
    return (
          <Box>
            <CardContent>
              <Grid container spacing={6}>
                <Grid item sm={4} xs={12}>
                  <FormControl fullWidth>
                    <InputLabel id='role-select'>Select Role</InputLabel>
                    <Select
                      fullWidth
                      value={role}
                      id='select-role'
                      label='Select Role'
                      labelId='role-select'
                      onChange={handleRoleChange}
                      inputProps={{ placeholder: 'Select Role' }}
                    >
                      <MenuItem value=''>Select Role</MenuItem>
                      <MenuItem value='admin'>Admin</MenuItem>
                      <MenuItem value='author'>Author</MenuItem>
                      <MenuItem value='editor'>Editor</MenuItem>
                      <MenuItem value='maintainer'>Maintainer</MenuItem>
                      <MenuItem value='subscriber'>Subscriber</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item sm={4} xs={12}>
                  <FormControl fullWidth>
                    <InputLabel id='plan-select'>Select Plan</InputLabel>
                    <Select
                      fullWidth
                      value={plan}
                      id='select-plan'
                      label='Select Plan'
                      labelId='plan-select'
                      onChange={handlePlanChange}
                      inputProps={{ placeholder: 'Select Plan' }}
                    >
                      <MenuItem value=''>Select Plan</MenuItem>
                      <MenuItem value='basic'>Basic</MenuItem>
                      <MenuItem value='company'>Company</MenuItem>
                      <MenuItem value='enterprise'>Enterprise</MenuItem>
                      <MenuItem value='team'>Team</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item sm={4} xs={12}>
                  <FormControl fullWidth>
                    <InputLabel id='status-select'>Select Status</InputLabel>
                    <Select
                      fullWidth
                      value={status}
                      id='select-status'
                      label='Select Status'
                      labelId='status-select'
                      onChange={handleStatusChange}
                      inputProps={{ placeholder: 'Select Role' }}
                    >
                      <MenuItem value=''>Select Role</MenuItem>
                      <MenuItem value='pending'>Pending</MenuItem>
                      <MenuItem value='active'>Active</MenuItem>
                      <MenuItem value='inactive'>Inactive</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            </CardContent>
            <DataGrid
              autoHeight
              rows={store.data}
              columns={columns}
              pageSize={pageSize}
              disableSelectionOnClick
              rowsPerPageOptions={[10, 25, 50]}
              sx={{ '& .MuiDataGrid-columnHeaders': { borderRadius: 0 } }}
              onPageSizeChange={(newPageSize: number) => setPageSize(newPageSize)}
            />
          </Box>
    )
  }
export default ListStatusConnect