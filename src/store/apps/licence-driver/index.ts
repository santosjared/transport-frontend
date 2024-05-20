import { Dispatch } from 'redux'
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { useService } from 'src/hooks/useService'
import { HttpStatus } from 'src/utils/HttpStatus'

interface Redux {
  dispatch: Dispatch<any>
}
export const fetchData = createAsyncThunk('appLicenceDriver/fetchLicenceDriver', async () => {
    const {Get} = useService()
    const response = await Get('/licencia')
    return response.data
})

export const addLicenceDriver = createAsyncThunk('appLicenDriver/addLicenceDriver',
  async (data: { [key: string]: any }, {dispatch }: Redux) => {
    const {Post}= useService()
    const response = await Post('/licencia', data) 
    dispatch(fetchData())
    return response.data
  }
)

export const deleteLicenceDriver = createAsyncThunk('appLicenceDriver/deleteLicenceDriver',
  async (id: number | string, {dispatch }: Redux) => {
    const {Delete} = useService()
    const response = await Delete('/licencia', id)
    dispatch(fetchData())
    return response.data
  }
)
export const findOneLicenceDriver = createAsyncThunk('appLicenceDriver/findOneLicenceDriver',
  async (id: number | string, {dispatch }: Redux) => {
    const {GetId} = useService()
    const response = await GetId('/licencia', id)
    return response.data
  }
)
export const updateLicence = createAsyncThunk(
  'appupdateLicence/updateLicence',
  async ({ data, id }: { data: { [key: string]: any }, id: number | string },{ dispatch }: any) => {
    const { Update } = useService();
    const response = await Update('/licencia', data, id);
    console.log(response.status)
    if (response.status === HttpStatus.BAD_REQUEST) {
      return response;
    }
    if (response.status === HttpStatus.OK) {
      dispatch(fetchData());
      return response.data;
    }
    if (response.status === HttpStatus.INTERNAL_SERVER_ERROR) {
      // Handle internal server error
    }
  }
);
export const appUsersSlice = createSlice({
  name: 'appLicenceDriver',
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
