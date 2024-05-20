import { Dispatch } from 'redux'
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { useService } from 'src/hooks/useService'

interface Redux {
  dispatch: Dispatch<any>
}
export const fetchData = createAsyncThunk('appBus/fetchBus',
async (filtrs?: { [key: string]: any }) => {
  const {Get} = useService()
  if(filtrs){
    const {filter, skip,limit}=filtrs
    if(filter){
      const response = await Get(`/bus?filter=${filter}`)
      return response.data
    }
    if(skip&&limit){
      const response = await Get(`/bus?skip=${skip}&limit=${limit}`)
      return response.data
    }
    const response = await Get('/bus')
    return response.data
  }
  const response = await Get('/bus')
  return response.data
}
)

export const addBus = createAsyncThunk('appBus/addBus',
  async (data: { [key: string]: any }, {dispatch }: Redux) => {
    const {Post}= useService()
    const response = await Post('/bus', data) 
    dispatch(fetchData())
    return response.data
  }
)

export const deleteBus = createAsyncThunk('appBus/deleteBus',
  async (id: number | string, {dispatch }: Redux) => {
    const {Delete} = useService()
    const response = await Delete('/bus', id)
    dispatch(fetchData())
    return response.data
  }
)
export const findOneBus = createAsyncThunk('appBus/deleteBus',
  async (id: number | string, {dispatch }: Redux) => {
    const {Delete} = useService()
    const response = await Delete('/bus', id)
    dispatch(fetchData())
    return response.data
  }
)
export const appUsersSlice = createSlice({
  name: 'appBus',
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
