import { Dispatch } from 'redux'
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { useService } from 'src/hooks/useService'
import { HttpStatus } from 'src/utils/HttpStatus'
import axios from 'axios'

interface Redux {
  dispatch: Dispatch<any>
}
interface Props{
  data: { [key: string]: any };
  id:string
}
export const fetchData = createAsyncThunk('appHorario/fetchHorario',
    async (filtrs?: { [key: string]: any }) => {
      const {Get} = useService()
      if(filtrs){
        const {filter, skip,limit}=filtrs
        if(filter){
          const response = await Get(`/horario?filter=${filter}`)
          return response.data
        }
        if(skip&&limit){
          const response = await Get(`/horario?skip=${skip}&limit=${limit}`)
          return response.data
        }
      }
      const response = await Get('/horario')
      return response.data
})

export const addHorario = createAsyncThunk('appHorario/addHorario',
    async (data: { [key: string]: any }, {dispatch }: Redux) => {
      const {Post}= useService()
      const response = await Post('/horario', data) 
      if(response.status === HttpStatus.BAD_REQUEST){
        const res = {
          success:false,
          data:response.data
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

export const deleteHorario = createAsyncThunk('appHorario/deleteHorario',
  async (id: number | string, {dispatch }: Redux) => {
    const {Delete} = useService()
    const response = await Delete('/horario', id)
    dispatch(fetchData())
    return response.data
  }
)
export const updateHorario = createAsyncThunk('appHorario/updateHorario',
  async ({data,id}:Props, {dispatch }: Redux) => {
    const {Update}= useService()
    const response = await Update('/horario', data,id) 
    if(response.status === HttpStatus.BAD_REQUEST){
      const res = {
        success:false,
        data:response.data
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
  }
)

export const appUsersSlice = createSlice({
  name: 'appHorario',
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
