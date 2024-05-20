import { Dispatch } from 'redux'
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { useService } from 'src/hooks/useService'

interface Redux {
  dispatch: Dispatch<any>
}
export const fetchData = createAsyncThunk('appTarifa/fetchTarifa', async () => {
    const {Get} = useService()
    const response = await Get('/tarifa')
    return response.data
})

export const addTarifa = createAsyncThunk('appTarifa/addTarifa',
  async (data: { [key: string]: any }, {dispatch }: Redux) => {
    const {Post}= useService()
    const response = await Post('/tarifa', data) 
    dispatch(fetchData())
    return response.data
  }
)

export const deleteTarifa = createAsyncThunk('appTarifa/deleteTarifa',
  async (id: number | string, {dispatch }: Redux) => {
    const {Delete} = useService()
    const response = await Delete('/Tarifa', id)
    dispatch(fetchData())
    return response.data
  }
)
export const findOneTarifa = createAsyncThunk('appTarifa/deleteTarifa',
  async (id: number | string, {dispatch }: Redux) => {
    const {Delete} = useService()
    const response = await Delete('/tarifa', id)
    dispatch(fetchData())
    return response.data
  }
)
export const appUsersSlice = createSlice({
  name: 'appTarifa',
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
