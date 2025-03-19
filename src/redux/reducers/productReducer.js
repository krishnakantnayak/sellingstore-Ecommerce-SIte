import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { fDB } from "../../config/firebase";
import {  doc, setDoc,getDoc, updateDoc ,collection, arrayUnion, onSnapshot} from "firebase/firestore";
import { fetchUserDeteils } from "./userReducer";


export const addProduct=createAsyncThunk(
    'prod/add',
    async ({user,product},{ rejectWithValue,dispatch })=>{
        try{
            const docref=doc(collection(fDB,"products"));
            const newProd=await setDoc(docref,{"prodSellerId":user.uid, ...product});
            console.log("docref",docref.id);
            const userdocref=doc(collection(fDB,"users"),user.uid);
            const docSnap = await getDoc(userdocref);
            const udata=docSnap.data();
            if(docSnap.exists()){
                if(udata.productList){
                    await updateDoc(userdocref,{
                        productList:[...udata.productList, docref.id]
                    })
                }else{
                    await updateDoc(userdocref,{
                        productList:[docref.id]
                    })
                }
            }
            const proddocref=doc(collection(fDB,"products"),docref.id);
            const prodSnap=await getDoc(proddocref)
            console.log("new prof docref",prodSnap.data());
            // return prodSnap.data()
            // dispatch(fetchUserDeteils(user.uid))

            
            
        }
        catch (error) {
            console.log("error in u",error)
            return rejectWithValue(error.message);
          }
    }
)

export const addToCart=createAsyncThunk(
    'cart/add',
    async({uid,pid},{rejectWithValue})=>{
        try{
            const userdocref=doc(collection(fDB,"users"),uid);
            const docSnap = await getDoc(userdocref);
            const udata=docSnap.data();
            if(docSnap.exists()){
                if(udata.cartList){
                    await updateDoc(userdocref,{
                        cartList:[...udata.cartList, pid]
                    })
                }else{
                    await updateDoc(userdocref,{
                        cartList:[pid]
                    })
                }
            }
        }
        catch (error) {
            alert(error.message)
          return rejectWithValue(error.message);
        }
    }
    )

const initialState={
    cart:[],
    loading:false,
    products:[
        // {name:"Vape", quantity: 10, pickUpLoc:"Delhi",sellerName:"MetroGuy",sellerId:"sellerId101",price:1000},
        // {name:"Cola", quantity: 10, pickUpLoc:"Delhi",sellerName:"MetroGirl",sellerId:"sellerId102",price:100},
    ]
}


const productSlice = createSlice({
    name:'product',
    initialState:initialState,
    reducers:{
        // this is add action
        empty:(state,payload)=>{
            state.products=[]
        },
        add:(state, action)=>{
                state.products.push(action.payload);
                state.loading=false;
        },
        remove:(state, action)=>{
            state.products.filter((prod, i)=>{
                return i!==action.payload
            })
        },
        addCart:(state,action)=>{
            return {...state,cart:action.payload}
        }
    },
    extraReducers:(builder)=>{
        // builder
        //   .addCase(addProduct.pending, (state) => {
        //     state.loading=true;
        //   })
        //   .addCase(addProduct.fulfilled, (state, { payload }) => {
        //     state.products=[...state.products,payload];
        //     state.loading=false;
        //   })
        //   .addCase(addProduct.rejected, (state, { payload }) => {
            
        //   })
    }
});

export const productReducer=productSlice.reducer;

export const productAction=productSlice.actions;
