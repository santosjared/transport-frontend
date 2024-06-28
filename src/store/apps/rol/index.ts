import { Dispatch } from 'redux'
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { useService } from 'src/hooks/useService'
import axiosInstance from 'src/store/instancesAxios'
import { HttpStatus } from 'src/utils/HttpStatus'

interface Redux {
  dispatch: Dispatch<any>
}
export const fetchData = createAsyncThunk('appRol/fetchRol',
async (filtrs?: { [key: string]: any }) => {
    const {Get} = useService()
    if(filtrs){
      const response = await Get(`/roles?filter=${filtrs.filter}`)
      return response.data
    }
    const response = await Get('/roles')
    return response.data
})

export const addRol = createAsyncThunk('appRol/addRol',
  async (data: { [key: string]: any }, {dispatch }: Redux) => {
  const {Post}= useService()
  const response = await Post('/roles', data)
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

export const deleteRol = createAsyncThunk('appRol/deleteRol',
  async (id: number | string, {dispatch }: Redux) => {
    const {Delete} = useService()
    const response = await Delete('/roles', id)
    dispatch(fetchData())
    return response.data
  }
)
export const findOneRol = createAsyncThunk('appRol/deleteRol',
  async (id: number | string, {dispatch }: Redux) => {
    const {Delete} = useService()
    const response = await Delete('/roles', id)
    return response.data
  }
)
export const findFilters = createAsyncThunk('appRol/deleteRol',
  async (id: number | string, {dispatch }: Redux) => {
    const {Delete} = useService()
    const response = await axiosInstance.get(`/roles`, {
      params: {
        filter: id,
      },
    })
    return response.data
  }
)
export const appUsersSlice = createSlice({
  name: 'appRol',
  initialState: {
    data: [],
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
        state.data = action.payload;
    })
    .addCase(fetchData.rejected, (state) => {
        state.isLoading = false;
        state.isSuccess = false;
        state.isError = true;
      })
  }
})

export default appUsersSlice.reducer
