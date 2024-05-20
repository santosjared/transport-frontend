import { Dispatch } from 'redux'
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axiosInstance from '../../instancesAxios'
import { useService } from 'src/hooks/useService'

interface Redux {
  dispatch: Dispatch<any>
}
export const fetchData = createAsyncThunk('appDevice/fetchDevice', async () => {
    const {Get} = useService()
    const response = await Get('/divice')
    return response.data
})

export const addDevice = createAsyncThunk('appDevice/addDevice',
  async (data: { [key: string]: any }, {dispatch }: Redux) => {
    const {Post}= useService()
    const response = await Post('/divice', data) 
    dispatch(fetchData())
    return response.data
  }
)

export const deleteDevice = createAsyncThunk('appDevice/deleteDevice',
  async (id: number | string, {dispatch }: Redux) => {
    const {Delete} = useService()
    const response = await Delete('/divice', id)
    dispatch(fetchData())
    return response.data
  }
)
export const assignUser = createAsyncThunk('appassignUser/assignUser',
    async (data: { [key: string]: any }, {dispatch}:Redux)=>{
        const {Update} = useService()
        const response = Update('/divice/user', data, data.id)
        dispatch(fetchData())
        return response
    }
)
export const appUsersSlice = createSlice({
  name: 'appDevice',
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
