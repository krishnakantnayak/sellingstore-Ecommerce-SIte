import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { fDB } from "../../config/firebase";
import {  doc, setDoc,getDoc, updateDoc ,collection, arrayUnion} from "firebase/firestore";


export const addProduct=createAsyncThunk(
    'prod/add',
    async ({user,product},{ rejectWithValue,dispatch })=>{
        try{
            const docref=doc(collection(fDB,"products"));
            await setDoc(docref,{"prodSellerId":user.userInfo.user.uid, ...product});
            console.log("docref",docref.id);
            // await updateDoc(user.userInfo.user.uid, {
            //     productIdList: arrayUnion(docref.id),
            //   });
            const userdocref=doc(collection(fDB,"users"),user.userInfo.user.uid);
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

            console.log("user document",docSnap.data());

            
            
        }
        catch (error) {
            console.log("error in u",error)
            return rejectWithValue(error.message);
          }
    }
)

export const getProds=createAsyncThunk(
    'prod/get',
    async({uid},{rejectWithValue}){
        try{
            const userdocref=doc(collection(fDB,"users"),user.userInfo.user.uid);
            const docSnap = await getDoc(userdocref);
            const udata=docSnap.data();
            if(udata.productList){
                
            }
        }
        catch (error) {
            console.log("error in u",error)
            return rejectWithValue(error.message);
          }
    }
)

const initialState={
    products:[
        {name:"Vape", quantity: 10, pickUpLoc:"Delhi",sellerName:"MetroGuy",sellerId:"sellerId101",price:1000},
        {name:"Cola", quantity: 10, pickUpLoc:"Delhi",sellerName:"MetroGirl",sellerId:"sellerId102",price:100},
    ]
}


const productSlice = createSlice({
    name:'product',
    initialState:initialState,
    reducers:{
        // this is add action
        add:(state, action)=>{
                state.products.push(action.payload)
        },
        remove:(state, action)=>{
            state.products.filter((prod, i)=>{
                return i!==action.payload
            })
        }
    }
});

export const productReducer=productSlice.reducer;

export const productAction=productSlice.actions;
