import React, { useEffect, useState } from 'react';
import { collection, doc, getDocs, onSnapshot } from 'firebase/firestore';
import { auth, fDB } from '../config/firebase';
import HomeProdTile from '../components/product/HomeProdTile';
import { useSelector } from 'react-redux';
export default function Home(){
    const [data,setData]=useState([]);
    const uselector=useSelector((state)=>state.user);
    useEffect(()=>{
        const fetchAllProds=async ()=>{
            const querySnapshot = await getDocs(collection(fDB, 'products'));
            const data = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
            setData(data)
            console.log('all products',data);
        };
        fetchAllProds();
    },[])
    if(data.length===0){
        return(<>
        <h1>Home loading</h1>
        </>)
    }
    return(
        <>
        
        <h1>Home Page</h1>
       
        <div className='d-flex flex-wrap justify-content-center'>
                    {data.length && data.map((prod)=>{
                        return(<HomeProdTile key={prod.id} data={prod} title={prod.name} content={prod.price} />)
                    })}
                </div>
        

        </>
    )
}