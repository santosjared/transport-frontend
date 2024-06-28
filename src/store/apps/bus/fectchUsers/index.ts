import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { useService } from "src/hooks/useService"

export const fetchDataUser = createAsyncThunk('appBus/fetchBusUser',
async (filtrs?: { [key: string]: any }) => {
  const {Get} = useService()
  if(filtrs){
    const {filter, skip,limit}=filtrs
    if(filter){
      const response = await Get(`/users/asignedUsers?filter=${filter}`)
      return response.data
    }
    if(skip&&limit){
      const response = await Get(`/users/asignedUsers?skip=${skip}&limit=${limit}`)
      return response.data
    }
    const response = await Get('/users/asignedUsers')
    return response.data
  }
  const response = await Get('/users/asignedUsers')
  return response.data
}
)

export const appUsersSlice = createSlice({
    name: 'appBusUser',
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
      .addCase(fetchDataUser.pending,(state)=>{
          state.isLoading = true;
          state.isSuccess = false;
          state.isError = false;
      })
      .addCase(fetchDataUser.fulfilled, (state, action) => {
          state.isLoading = false;
          state.isSuccess = true;
          state.isError = false;
          state.data = action.payload.result;
          state.total = action.payload.total
      })
      .addCase(fetchDataUser.rejected, (state) => {
          state.isLoading = false;
          state.isSuccess = false;
          state.isError = true;
        })
    }
  })
  export default appUsersSlice.reducer
