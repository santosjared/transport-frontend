
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { apiService } from 'src/store/services/apiService'

export const fetchData = createAsyncThunk('appMonitoreo/fetchMonitoreo', async (id?: string) => {
    if(id){
        const response = await apiService.GetId('/linea',id)
        return response.data
    }
    const response = await apiService.Get('/linea')
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
