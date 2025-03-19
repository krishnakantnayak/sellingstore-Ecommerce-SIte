import React, { useEffect, useState } from 'react';
import SigninForm from '../components/authComps/signin';
import SignupForm from '../components/authComps/signup';
import { useDispatch, useSelector } from 'react-redux';
import { auth } from '../config/firebase';
import { fDB } from '../config/firebase';
import { doc, onSnapshot, getDoc, collection } from 'firebase/firestore';
import CartTile from '../components/order/CartTile';
import { productAction } from '../redux/reducers/productReducer';


export default function Cart(){
    const uselector=useSelector((state)=>state.user);
    const prodSelector=useSelector((state)=>state.product)
    const cartDis=useDispatch();
    const [cartList,setCartList]=useState([]);
    async function queryCart(cartList){
        for(let i of cartList){
            const docref=doc(collection(fDB,"products"),i);
            const docSnap = await getDoc(docref);
            const data=docSnap.data();
            setCartList((prevdata)=>[...prevdata,data])
            cartDis(productAction.addCart(cartList))
        }
    }
    useEffect(()=>{
        if(auth.currentUser){
            // console.log(auth.currentUser.uid);
            const unsub=onSnapshot(doc(fDB,'users',auth.currentUser.uid),(snapshot)=>{
                if(snapshot.exists){
                    const snapshotVal=snapshot.data();
                    console.log("cart page",snapshotVal);
                    const cList=snapshotVal.cartList;
                    queryCart(cList);

                    // async (cList)=>{
                    //     for(let i of cList){
                    //         const docref=doc(collection(fDB,"products"),i);
                    //         const docSnap = await getDoc(docref);
                    //         const data=docSnap.data();
                    //         setCartList((prevdata)=>[...prevdata,data])
                    //         cartDis(productAction.addCart(cartList))
                    //     }
                    // }
                    
                }
            })
            return unsub;
        }
    },[])


    if(uselector.user.success){
        return(
            <>
            <h1>Cart Page</h1>
            {console.log('cart page products',prodSelector)}
            <div className='d-flex flex-wrap justify-content-center'>
                    {cartList.length && cartList.map((prod)=>{
                        return(<CartTile key={prod.id} data={prod} title={prod.name} content={prod.price} />)
                    })}
                </div>
            </>
        )
    }
    else{
        return(
            <>
            <SigninForm/>
            <SignupForm/>
            </>
        )
    }
    
}