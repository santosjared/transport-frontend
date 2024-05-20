import { Dispatch } from 'redux'
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { useService } from 'src/hooks/useService'

interface Redux {
  dispatch: Dispatch<any>
}
export const fetchData = createAsyncThunk('appRoad/fetchRoad', async () => {
    const {Get} = useService()
    const response = await Get('/road')
    return response.data
})

export const addRoad = createAsyncThunk('appRoad/addRoad',
  async (data: { [key: string]: any }, {dispatch }: Redux) => {
    const {Post}= useService()
    const response = await Post('/road', data) 
    dispatch(fetchData())
    return response.data
  }
)

export const deleteRoad = createAsyncThunk('appRoad/deleteRoad',
  async (id: number | string, {dispatch }: Redux) => {
    const {Delete} = useService()
    const response = await Delete('/road', id)
    dispatch(fetchData())
    return response.data
  }
)
export const findOneRoad = createAsyncThunk('appRoad/deleteRoad',
  async (id: number | string, {dispatch }: Redux) => {
    const {GetId} = useService()
    const response = await GetId('/road', id)
    return response.data
  }
)
export const appUsersSlice = createSlice({
  name: 'appRoad',
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
