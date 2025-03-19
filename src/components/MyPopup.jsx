// MyPopup.js
import React from 'react';
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css'; // Import the default styles
import SigninForm from './authComps/signin';
import SignupForm from './authComps/signup';

const MyPopup = () => {
  return (
    <Popup
      trigger={<button>Add to cart</button>}
      modal
      closeOnDocumentClick
    >
      {(close) => (
        <div className="">
          <button className="popup-close-btn" onClick={close}>
            Close
          </button>
          <div className="popup-content">
            <SigninForm popopClose={close}/>
            <SignupForm/>
          </div>
        </div>
      )}
    </Popup>
  );
};

export default MyPopup;
