
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { useService } from 'src/hooks/useService'

export const fetchData = createAsyncThunk('appMonitoreo/fetchMonitoreo', async (id?: string) => {
    const {Get, GetId} = useService()
    if(id){
        const response = await GetId('/linea',id)
        return response.data
    }
    const response = await Get('/linea')
    return response.data
})


export const appUsersSlice = createSlice({
  name: 'appMonitoreo',
  initialState: {
    data: [],
  },
  reducers: {},
  extraReducers: builder => {
    builder
    .addCase(fetchData.fulfilled, (state, action) => {
        state.data = action.payload; 
    })
  }
})

export default appUsersSlice.reducer
