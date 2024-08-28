import { Dispatch } from 'redux'
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
// import { useService } from 'src/hooks/useService'
import { HttpStatus } from 'src/utils/HttpStatus'
import { apiService } from 'src/store/services/apiService'

interface Redux {
  dispatch: Dispatch<any>
}
interface Props{
  data: { [key: string]: any };
  id:string
  filtrs:any
}
interface Prop{
  data: { [key: string]: any };
  filtrs:any
}

export const fetchData = createAsyncThunk('appHorario/fetchHorario',
async (filtrs?: { [key: string]: any }) => {
  if(filtrs){
    const response = await apiService.Get('/horario',filtrs)
    return response.data
  }
  const response = await apiService.Get('/horario')
  return response.data
}
)

export const addHorario = createAsyncThunk('appHorario/addHorario',
    async ({data,filtrs}:Prop, {dispatch }: Redux) => {
      const response = await apiService.Post('/horario', data)
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
        dispatch(fetchData(filtrs))
        return res
      }
      if(response === HttpStatus.INTERNAL_SERVER_ERROR){

      }
      return response
  }
)

export const deleteHorario = createAsyncThunk('appHorario/deleteHorario',
  async (props:{filters:any,id:string},{dispatch }: Redux) => {
    console.log(props)
    const response = await apiService.Delete('/horario', props.id)
    dispatch(fetchData(props.filters))
    return response.data
  }
)
export const updateHorario = createAsyncThunk('appHorario/updateHorario',
  async ({data,id, filtrs}:Props, {dispatch }: Redux) => {
    const response = await apiService.Update('/horario', data,id)
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
