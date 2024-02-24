import { Navbar, Nav, Button } from 'react-bootstrap';
import { Outlet  } from 'react-router-dom';
import {auth} from '../config/firebase';
import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { signOutUser } from '../redux/reducers/userReducer';


const MyNavbar = () => {
  // const [currentUser, setCurrentUser] = useState(null);
  const uselector=useSelector((state)=>state.user);
  const dispathSignout=useDispatch();


  // useEffect(() => {
  //   auth.onAuthStateChanged((user) => {
  //     setCurrentUser(user);
  //   });
  // }, []);

  const handlesignOutUser = () => {
    // auth.signOut()
    //   .then(() => {
    //     console.log('User signed out');
    //   })
    //   .catch((error) => {
    //     console.error('Error signing out: ', error);
    //   });
    dispathSignout(signOutUser({auth:auth}));
  };
    return (
      <>
      <Navbar bg="light" expand="lg">
        <Navbar.Brand href="#home">sellingstore</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ml-auto">
            <Link to="/">Home</Link>
            <Link to="/products">Sell</Link>
            
            <Link to="/">Profile</Link>
            {console.log("uselector",uselector)}
            {uselector.user.success && <Link onClick={handlesignOutUser}>Signout</Link>}
            <Link to="/cart">Cart</Link>
          </Nav>
          
        </Navbar.Collapse>
        
      </Navbar>
      {/* <nav>
      <ul>
        <li><Link to="/">Home</Link></li>
        <li><Link to="/home">Home</Link></li>
        <li><Link to="/cart">Cart</Link></li>
        <li><Link to="/products">Products</Link></li>
        {console.log('useselector',uselector)}
        {auth.currentUser && <li><Link onClick={handlesignOutUser}>Signout</Link></li>}
      </ul>
    </nav> */}
      <Outlet/>
      </>
    );
  };
  
  export default MyNavbar;