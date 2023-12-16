import { createSlice } from '@reduxjs/toolkit'


const initialState = {
    currentUser:null,
    error:null,
    loading:false,
}


const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers:{

        //sign in 
        signInStart:(state)=>{
            console.log('sign started');
            state.loading = true;
        },

        signInSuccess:(state,action)=>{
            console.log('sign successful');
            state.currentUser = action.payload
            state.loading = false
            state.error = null
        },

        signInFailure:(state,action)=>{
            state.error = action.payload
            state.loading = false
        },

        //update profile
        updateStart:(state)=>{
            state.loading = true;
        },

        updateUserSuccess:(state,action)=>{
            state.currentUser = action.payload
            state.loading = false
            state.error = null
        },

        updateFailure:(state,action)=>{
            state.error = action.payload
            state.loading = false
        },

       //delete profile
        deleteUserStart:(state)=>{
            state.loading = true;
        },

        deleteUserSuccess:(state)=>{
            state.currentUser = null
            state.loading = false
            state.error = null
        },

        deleteUserFailure:(state,action)=>{
            state.error = action.payload
            state.loading = false;
        },  

        //logout
        signOutStart:(state)=>{
            state.loading = true;
        },

        signOutSuccess:(state)=>{
            state.currentUser = null
            state.loading = false
            state.error = null
        },

        signOutFailure:(state,action)=>{
            state.error = action.payload
            state.loading = false;
        },
    }
});


export const {
    signInStart, 
    signInSuccess, 
    signInFailure, 
    updateStart,
    updateUserSuccess,
    updateFailure,
    deleteUserStart,
    deleteUserSuccess,
    deleteUserFailure,
    signOutStart,
    signOutFailure,
    signOutSuccess

} = userSlice.actions

export default userSlice.reducer;
