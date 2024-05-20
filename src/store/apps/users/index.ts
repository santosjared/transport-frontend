import { Dispatch } from 'redux'
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { useService } from 'src/hooks/useService'
import { HttpStatus } from 'src/utils/HttpStatus'
import { da } from 'date-fns/locale'

interface Redux {
  dispatch: Dispatch<any>
}
interface Props{ 
  userData: { [key: string]: any }
  licenceData?: { [key: string]: any } 
  idUser: number | string 
  idLicence?: number | string
}

export const fetchData = createAsyncThunk('appUser/fetchUser',
async (filtrs?: { [key: string]: any }) => {
  const {Get} = useService()
  if(filtrs){
    const {filter, skip,limit}=filtrs
    if(filter){
      const response = await Get(`/users?filter=${filter}`)
      return response.data
    }
    if(skip&&limit){
      const response = await Get(`/users?skip=${skip}&limit=${limit}`)
      return response.data
    }
    const response = await Get('/users')
    return response.data
  }
  const response = await Get('/users')
  return response.data
}
)

export const addUser = createAsyncThunk('appUsers/addUsers',
  async (data: { [key: string]: any }, {dispatch }: Redux) => {
    const {Post}= useService()
    const response = await Post('/users', data) 
    if(response.status === HttpStatus.BAD_REQUEST){
      return response
    }
    if(response.status === HttpStatus.CREATED){
      dispatch(fetchData())
      return response.data
    }
    if(response.status === HttpStatus.INTERNAL_SERVER_ERROR){
      
    }
  }
)

export const deleteUser = createAsyncThunk('appUsers/deleteUsers',
  async (id: number | string, {dispatch }: Redux) => {
    const {Delete} = useService()
    const response = await Delete('/users', id)
    dispatch(fetchData())
    return response.data
  }
)
export const findOneUser = createAsyncThunk('appUsers/deleteUsers',
  async (id: number | string, {dispatch }: Redux) => {
    const {GetId} = useService()
    const response = await GetId('/users', id)
    return response.data
  }
)
export const updateUser = createAsyncThunk(
  'appupdateUsers/updateUsers',
  async ({ userData,licenceData, idUser, idLicence }: Props,{ dispatch }: any) => {
    const { Update ,Post} = useService();
    if(licenceData && !idLicence){
      const createLicence = await Post('/licencia', licenceData)
      if(createLicence.status === HttpStatus.CREATED){
        userData.licenceId=createLicence.data._id
        const update = await Update('/users', userData,idUser)
        if(update.status === HttpStatus.OK){
          dispatch(fetchData())
          return update.data
        }
        return update.data
    }
    return createLicence.data
  }
  if(licenceData && idLicence){
      const response = await Update('/licencia', licenceData, idLicence)
      if(response.status === HttpStatus.OK){
        const update = await Update('/users', userData,idUser)
        if(update.status === HttpStatus.OK){
          dispatch(fetchData())
          return update.data
        }
        return update.data
      }
      return response.data
    }
    const response = await Update('/users', userData,idUser)
    if(response.status=== HttpStatus.OK){
        dispatch(fetchData())
        return response.data
      }
      return response.data
    }
);

export const appUsersSlice = createSlice({
  name: 'appUser',
  initialState: {
    data: [],
    total:0,
    isLoading:false,
    isSuccess:false,
    isError:false
  },
  reducers: {},
  extraReducers: builder => {
    builder
    .addCase(fetchData.pending,(state)=>{
        state.isLoading = true;
        state.isSuccess = false;
        state.isError = false;
    })
    .addCase(fetchData.fulfilled, (state, action) => {
        state.isLoading = false; 
        state.isSuccess = true;  
        state.isError = false;   
        state.data = action.payload.result; 
        state.total = action.payload.total
    })
    .addCase(fetchData.rejected, (state) => {
        state.isLoading = false;
        state.isSuccess = false;
        state.isError = true;
      })
  }
})

export default appUsersSlice.reducer
