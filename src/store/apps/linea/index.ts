import { Dispatch } from 'redux'
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { useService } from 'src/hooks/useService'

interface Redux {
  dispatch: Dispatch<any>
}
export const fetchData = createAsyncThunk('appLinea/fetchLinea', async () => {
    const {Get} = useService()
    const response = await Get('/linea')
    return response.data
})

export const addLinea = createAsyncThunk('appLinea/addLinea',
  async (data: { [key: string]: any }, {dispatch }: Redux) => {
    const {Post}= useService()
    const response = await Post('/linea', data) 
    dispatch(fetchData())
    return response.data
  }
)

export const deleteLinea = createAsyncThunk('appLinea/deleteLinea',
  async (id: number | string, {dispatch }: Redux) => {
    const {Delete} = useService()
    const response = await Delete('/linea', id)
    dispatch(fetchData())
    return response.data
  }
)
export const findOneLinea = createAsyncThunk('appLinnea/deleteLinea',
  async (id: number | string, {dispatch }: Redux) => {
    const {Delete} = useService()
    const response = await Delete('/linea', id)
    dispatch(fetchData())
    return response.data
  }
)
export const appUsersSlice = createSlice({
  name: 'appLinea',
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
