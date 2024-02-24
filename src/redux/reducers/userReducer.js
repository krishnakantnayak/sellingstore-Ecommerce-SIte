import { createSlice } from '@reduxjs/toolkit'
import { createAsyncThunk } from '@reduxjs/toolkit';
import { createUserWithEmailAndPassword,signInWithEmailAndPassword , updateProfile} from "firebase/auth";
import {fDB} from '../../config/firebase'
import {  doc, setDoc,getDoc ,collection} from "firebase/firestore";

//i need to create a signout asuncthunk and update store state for the sake of flux and also this needs to happen when i willl create custom user modal

export const registerUser = createAsyncThunk(
  'auth/register',
  async ({ auth,name,phone, email, password }, { rejectWithValue }) => {
    

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      if(userCredential){
        const token = await userCredential.user.getIdToken();
        const { uid, displayName, eMail, photoURL } = userCredential.user;
        console.log("here is the user from signup",userCredential);

        // const docref=doc(collection(fDB,"Blogs"));
        // await setDoc(docref,{title: "formData.title",content:"formData.content",createdOn: new Date()})
        // console.log("docref",docref);

        const docref=doc(fDB, "users", uid);
        await setDoc(docref,{
          name: name,
          uid:uid,
          createdOn: new Date(),
          email:email,
          phone:phone

        })
        console.log("docref",docref);
        
        return { user: { uid, displayName, eMail, photoURL }, token };
      }
    } catch (error) {
      console.log("error in u",error)
      return rejectWithValue(error.message);
    }

  }
)

export const loginUser=createAsyncThunk(
  'auth/login',
  async ({ auth, email, password },{rejectWithValue})=>{
    // signInWithEmailAndPassword(auth, email, password)
    // .then((userCredential) => {
    //     // Signed in
    //     // const user = userCredential.user;
    //     console.log("here is the user",userCredential)
    //     return {userCredential}
    //     // ...
    // })
    // .catch((error) => {
    //     // const errorCode = error.code;
    //     // const errorMessage = error.message;
    //     console.log("here is the user error",error)
    //     // ..
    // });
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const token = await userCredential.user.getIdToken();
      // Extract only the necessary user data
      const { uid, displayName, eMail, photoURL } = userCredential.user;
      console.log("here is the user",userCredential);
      return { user: { uid, displayName, eMail, photoURL }, token };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
)

export const signOutUser=createAsyncThunk(
  'auth/signout',
  async ({auth},{rejectWithValue})=>{
    try{
      await auth.signOut()
      console.log('sign out triggered')
      return true;
    }
    catch(error){
      return rejectWithValue(error.message);
    }
  }
)

const initialState = {
    user:{
      loading: false,
      userInfo: null,
      userToken: null,
      error: null,
      success: false,
    }
  }
  


  const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
      builder
        .addCase(registerUser.pending, (state) => {
          return {user:{ loading : true, userInfo:'', userToken:'', success:false, error:null}}
        })
        .addCase(registerUser.fulfilled, (state, { payload }) => {
          return {user:{ loading : false, userInfo:payload, userToken:payload, success:true, error:null}}
        })
        .addCase(registerUser.rejected, (state, { payload }) => {
          return {user:{ loading : false, userInfo:'', userToken:'', success:false, error:payload}}
        })
        .addCase(loginUser.pending, (state) => {
          return {user:{ loading : true, userInfo:'', userToken:'', success:false, error:null}}
        })
        .addCase(loginUser.fulfilled, (state, { payload }) => {
          return {user:{ loading : false, userInfo:payload, userToken:payload, success:true, error:null}}
        })
        .addCase(loginUser.rejected, (state, { payload }) => {
          return {user:{ loading : false, userInfo:'', userToken:'', success:false, error:payload}}
        })
        .addCase(signOutUser.pending, (state) => {
          state.user.loading = true;
          state.user.error = null;
        })
        .addCase(signOutUser.fulfilled, (state, { payload }) => {
          return {user:{loading : false, userInfo:null, userToken:null, success:false, error:null}}
        })
        .addCase(signOutUser.rejected, (state, { payload }) => {
          state.user.loading = false;
          state.user.error = payload;
        });
        // Add other cases...
    },
  });
  
  export const userReducer=authSlice.reducer;
