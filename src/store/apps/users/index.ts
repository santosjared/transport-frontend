import { Dispatch } from 'redux'
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { apiService } from 'src/store/services/apiService'
import { HttpStatus } from 'src/utils/HttpStatus'

interface Redux {
  dispatch: Dispatch<any>
}
interface Props{
  userData: { [key: string]: any }
  licenceData?: { [key: string]: any }
  idUser: number | string
  idLicence?: number | string
  filtrs:any
}

export const fetchData = createAsyncThunk('appUser/fetchUser',
async (filtrs?: { [key: string]: any }) => {
  if(filtrs){
    const response = await apiService.Get('/users',filtrs)
    return response.data
  }
  const response = await apiService.Get('/users')
  return response.data
}
)


export const addUser = createAsyncThunk('appUsers/addUsers',
  async (data: { [key: string]: any }, {dispatch }: Redux) => {
    const response = await apiService.Post('/users', data.data)
    if(response.status === HttpStatus.BAD_REQUEST){
      return response
    }
    if(response.status === HttpStatus.CREATED){
      dispatch(fetchData(data.filtrs))
      return response.data
    }
    if(response.status === HttpStatus.INTERNAL_SERVER_ERROR){

    }
  }
)

export const deleteUser = createAsyncThunk('appUsers/deleteUsers',
  async (props:{filters:any,id:string}, {dispatch }: Redux) => {
    const {filters,id} = props
    const response = await apiService.Delete('/users', id)
    dispatch(fetchData(filters))
    return response.data
  }
)
export const findOneUser = createAsyncThunk('appUsers/deleteUsers',
  async (id: number | string, {dispatch }: Redux) => {
    const response = await apiService.GetId('/users', id)
    return response.data
  }
)
export const updateUser = createAsyncThunk(
  'appupdateUsers/updateUsers',
  async ({ userData,licenceData, idUser, idLicence, filtrs }: Props,{ dispatch }: any) => {
    if(licenceData && !idLicence){
      const createLicence = await apiService.Post('/licencia', licenceData)
      if(createLicence.status === HttpStatus.CREATED){
        userData.licenceId = createLicence.data._id
        const update = await apiService.Update('/users', userData,idUser)
        if(update.status === HttpStatus.OK){
          dispatch(fetchData(filtrs))
          return update
        }
        return update
    }
    return createLicence
  }
  if(licenceData && idLicence){
      const response = await apiService.Update('/licencia', licenceData, idLicence)
      if(response.status === HttpStatus.OK){
        const update = await apiService.Update('/users', userData,idUser)
        if(update.status === HttpStatus.OK){
          dispatch(fetchData(filtrs))
          return update
        }
        return update
      }
      return response
    }
    const response = await apiService.Update('/users', userData,idUser)
    if(response.status === HttpStatus.OK){
        dispatch(fetchData(filtrs))
        return response
      }
      return response
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
