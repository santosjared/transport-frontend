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
  filtrs?:any
}

export const fetchData = createAsyncThunk('appLinea/fetchLinea',
async (filtrs?: { [key: string]: any }) => {
  if(filtrs){
    const response = await apiService.Get('/linea',filtrs)
    return response.data
  }
  const response = await apiService.Get('/linea')
  return response.data
})

export const addLinea = createAsyncThunk('appLinea/addLinea',
  async (data: { [key: string]: any }, {dispatch }: Redux) => {
    const response = await apiService.Post('/linea', data)
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

export const deleteLinea = createAsyncThunk('appLinea/deleteLinea',
  async (id: number | string, {dispatch }: Redux) => {
    const response = await apiService.Delete('/linea', id)
    dispatch(fetchData())
    return response.data
  }
)

export const updateLinea = createAsyncThunk('appLinea/updateLinea',
  async ({data,id, filtrs}:Props, {dispatch }: Redux) => {
    const response = await apiService.Update('/linea', data,id)
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

export const desasignedRoad = createAsyncThunk('appLinea/desasignedRoad', async({data,id}:Props, {dispatch}:Redux)=>{
    const response = await apiService.Update('/linea/desasigned', data,id)
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
      dispatch(fetchData())
      return res
    }
    if(response === HttpStatus.INTERNAL_SERVER_ERROR){

    }
    return response
})

export const asignedRoad = createAsyncThunk('appLinea/asignedRoad',
async({data,id}:Props, {dispatch}:Redux)=>{
    const response = await apiService.Update('/linea/asigned', data,id)
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
      dispatch(fetchData())
      return res
    }
    if(response === HttpStatus.INTERNAL_SERVER_ERROR){

    }
    return response
})

export const desasignedHorario = createAsyncThunk('appLinea/desasignedHorario', async({data,id}:Props, {dispatch}:Redux)=>{
    const response = await apiService.Update('/linea/desasignedHorario', data,id)
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
      dispatch(fetchData())
      return res
    }
    if(response === HttpStatus.INTERNAL_SERVER_ERROR){

    }
    return response
})

export const desasignedTarifa = createAsyncThunk('appLinea/desasignedTarifa', async({data,id}:Props, {dispatch}:Redux)=>{
    const response = await apiService.Update('/linea/desasignedTarifa', data,id)
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
      dispatch(fetchData())
      return res
    }
    if(response === HttpStatus.INTERNAL_SERVER_ERROR){

    }
    return response
})

export const asignedHorario = createAsyncThunk('appLinea/asignedHorario', async({data,id}:Props, {dispatch}:Redux)=>{
    const response = await apiService.Update('/linea/asignedHorario', data,id)
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
      dispatch(fetchData())
      return res
    }
    if(response === HttpStatus.INTERNAL_SERVER_ERROR){

    }
    return response
})


export const asignedTarifa = createAsyncThunk('appLinea/asignedTarifa', async({data,id}:Props, {dispatch}:Redux)=>{
    const response = await apiService.Update('/linea/asignedTarifa', data,id)
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
      dispatch(fetchData())
      return res
    }
    if(response === HttpStatus.INTERNAL_SERVER_ERROR){

    }
    return response
})

export const desasignedBus = createAsyncThunk('appLinea/desasignedBus', async({data,id}:Props, {dispatch}:Redux)=>{
    const response = await apiService.Update('/linea/desasignedBus', data,id)
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
      dispatch(fetchData())
      return res
    }
    if(response === HttpStatus.INTERNAL_SERVER_ERROR){

    }
    return response
})

export const asignedBus = createAsyncThunk('appLinea/asignedBus', async({data,id}:Props, {dispatch}:Redux)=>{
    const response = await apiService.Update('/linea/asignedBus', data,id)
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
      dispatch(fetchData())
      return res
    }
    if(response === HttpStatus.INTERNAL_SERVER_ERROR){

    }
    return response
})

export const appUsersSlice = createSlice({
  name: 'appLinea',
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
