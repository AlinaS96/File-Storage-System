import { createSlice } from "@reduxjs/toolkit";


//Redux is a robust state management library
//these are the actions that our application will need to run through out its life-cycle
export const user = createSlice({
    name: "users",
    initialState: {
      id: "",
      username: "",
      isLoggedIn:false,
      isWebLoggedin:false
    },
    reducers: {
      USER_DATA: (state, action) => {
        state.id = action.payload.user_id;
        state.username = action.payload.username;
        state.isLoggedIn = action.payload.isLoggedIn;
      },
      LOGOUT_USER: (state) => {
        state.id="";
        state.username = "";
        state.isLoggedIn = false;
      },
    USER_TOKEN:(state, action) => {
      state.isWebLoggedin = action.payload
    }
    },
  });
  
  // Action creators are generated for each case reducer function
  export const { USER_DATA, LOGOUT_USER, USER_TOKEN } = user.actions;
  
  export const userReducer = user.reducer;