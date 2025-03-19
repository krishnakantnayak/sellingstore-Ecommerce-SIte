import React from 'react';
import NewProdForm from '../components/product/NewProdForm';
import {  useDispatch, useSelector } from 'react-redux';
import ProductTile from '../components/product/productTile'
import SignupForm from '../components/authComps/signup';
import SigninForm from '../components/authComps/signin';
import {auth, fDB} from '../config/firebase';
import { useEffect, useState } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { productAction } from '../redux/reducers/productReducer';

export default function Products(){
    const prods=useSelector((state)=>state.product);
    const uselector=useSelector((state)=>state.user);
    const dispatchProds=useDispatch();
    const [prodList,setProdList]=useState(null);
    useEffect(()=>{
        if(auth.currentUser){

            const unsubscribeFunctions = [];

            const prodIdList=uselector.user.userInfo.productList;
            // dispatchProds(productAction.empty())
            // const unsubList=prodIdList.map((prodId)=>{
            //     const unsub=onSnapshot(doc(fDB,'products',prodId),(snapshot)=>{
            //         if(snapshot.exists){
            //             const snapshotVal=snapshot.data();
            //             console.log("snapshot",snapshotVal);
                        
            //             dispatchProds(productAction.add(snapshotVal))
            //         }
            //     })
            //     return unsub
            // })
            
            // return ()=>unsubList.forEach((unsub) => unsub());
            if(prodIdList){
                dispatchProds(productAction.empty())
                const unsubList=prodIdList.map((prodId)=>{
                    const unsub=onSnapshot(doc(fDB,'products',prodId),(snapshot)=>{
                        if(snapshot.exists){
                            const snapshotVal=snapshot.data();
                            console.log("snapshot",snapshotVal);
                            
                            dispatchProds(productAction.add(snapshotVal))
                        }
                    })
                    return unsub
                })
                
                return ()=>unsubList.forEach((unsub) => unsub());
            }
            
        }
    },[uselector.user.success,dispatchProds])

    if(uselector.user.success){
        return (
            <>
            {console.log('uselector in products',uselector)}
            {console.log('prodlist state in products',prods)}
           
            <h1>Products Page</h1>
                <NewProdForm/>
                <div className='d-flex flex-wrap justify-content-center'>
                    {prods && prods.products && prods.products.length && prods.products.map((prod)=>{
                        return(<ProductTile title={prod.name} content={prod.price}/>)
                    })}
                </div>
          
            </>
        )
    }else{
        return (
        <>
        {console.log('fb auth cu',auth.currentUser)}
            <SignupForm/>
            <SigninForm/>
        </>
        )
    }

    
}