import { useDispatch, useSelector } from 'react-redux';
import MyPopup from '../MyPopup';
import { auth } from '../../config/firebase';
import { addToCart } from '../../redux/reducers/productReducer';

const HomeProdTile=({ data,title, content })=>{
    const uselector=useSelector((state)=>state.user);
    const cartDispatch=useDispatch();
    const handleAddToCart=()=>{
        if(uselector.user.success){
            console.log('add to cart',data.id);
            console.log('add to cart',auth.currentUser.uid);
            cartDispatch(addToCart({uid:auth.currentUser.uid,pid:data.id}));
        }
        
    }
    return (<>
        <div className="tile m-4">
            <h2 className="title">{title}</h2>
            <p className="content">{content}</p>
            {/* <button onClick={handleAddToCart}>Add to cart</button> */}
            {uselector.user.success && <button onClick={handleAddToCart}>Add to cart</button>}
            {!uselector.user.success && <MyPopup/>}
            
        </div>
        
    </>)
}

export default HomeProdTile;