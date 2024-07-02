import { Dispatch } from 'redux'
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { apiService } from 'src/store/services/apiService'
import { HttpStatus } from 'src/utils/HttpStatus'

interface Redux {
  dispatch: Dispatch<any>
}
interface Props{
  data: { [key: string]: any };
  id:string
  filtrs:any
}
export const fetchData = createAsyncThunk('appRoad/fetchRoad',
async (filtrs?: { [key: string]: any }) => {
  if(filtrs){
    const response = await apiService.Get('/road',filtrs)
    return response.data
  }
  const response = await apiService.Get('/road')
  return response.data
}
)

export const addRoad = createAsyncThunk('appRoad/addRoad',
    async (data: { [key: string]: any }, {dispatch }: Redux) => {
      const response = await apiService.Post('/road', data)
      if(response.status === HttpStatus.BAD_REQUEST){
        const res = {
          success:false,
          data:response.data.message
        }
        return res
      }
      if(response.status === HttpStatus.CREATED){
        const res = {
          success:true,
          data:response.data
        }
        dispatch(fetchData())
        return res
      }
      if(response === HttpStatus.INTERNAL_SERVER_ERROR){

      }
      return response
  }
)

export const deleteRoad = createAsyncThunk('appRoad/deleteRoad',
  async (id: number | string, {dispatch }: Redux) => {
    const response = await apiService.Delete('/road', id)
    dispatch(fetchData())
    return response.data
  }
)
export const updateRoad = createAsyncThunk('appRoad/updateRoad',
  async ({data,id, filtrs}:Props, {dispatch }: Redux) => {
    const response = await apiService.Update('/road', data,id)
    if(response.status === HttpStatus.BAD_REQUEST){
      const res = {
        success:false,
        data:response.data.message
      }
      return res
    }
    if(response.status === HttpStatus.OK){
      const res = {
        success:true,
        data:response.data
      }
      dispatch(fetchData(filtrs))
      return res
    }
    if(response === HttpStatus.INTERNAL_SERVER_ERROR){

    }
    return response
  }
)

export const appUsersSlice = createSlice({
  name: 'appRoad',
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
