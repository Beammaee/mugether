import React, { useState, useEffect } from 'react'
import Header from './components/layout/Header'
import './App.css'
import NavType from './components/layout/NavType'
import Listitem from './components/muplace/Listitem'
import { Muplace_Context } from './context/MuContext'
import axios from 'axios'
import { Route, Routes, useLocation } from 'react-router-dom'
import ShopV2 from './components/Shop/ShopV2'
import Mudetail from './components/muplace/Mudetail'
import Login from './components/user/Login'
import Register from './components/user/Register'
import Regguide from './components/Guide/Reg_guide'
import Shopdetail from './components/Shop/Shopdetail'
import Regis_shop from './components/user/Regis_shop'
import Swal from 'sweetalert2';
import Add_Shop from './components/Shop/Add_shop'
import Forgottenpassword from './components/user/ForgottenPassword'
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';


const Checktimeout=(timeout,onLogout)=>{
    let idleTime = null;

    const resetTime=()=>{
        clearTimeout(idleTime);
        idleTime = setTimeout(() => {
          localStorage.removeItem('token');
          let token = localStorage.getItem('token');
          if(!token)
          {
            onLogout();
          }
           
        },timeout)
    }

    useEffect(() => {
      window.addEventListener('mousemove', resetTime);
      window.addEventListener('mousemove', resetTime);
      window.addEventListener('keydown', resetTime);

      resetTime();
      
    return () => {
      clearTimeout(idleTime);
      window.removeEventListener('mousemove', resetTime);
      window.removeEventListener('keydown', resetTime);
    };
    })
}



export default function App() {
  const SERVER_URL = import.meta.env.VITE_SERVER_URL || 'http://192.168.15.227:5353' || 'https://192.168.15.227:5353'
  const location = useLocation();
  const [global_muplace, Setmuplace] = useState([]);
  const [global_shop, Setshop] = useState([]);
  const [selectedMuType, Setselectedmutype] = useState('')
  const [selectedMuplace, SetSelecttedMuplace] = useState('');
  const [showguide,Setshowguide] = useState(false);
  const [logoutAlertShown, setLogoutAlertShown] = useState(false);
  const [favoriteStatus,setfavoritestatus] = useState(false);
const [listshop,Setlistshop] = useState([]);
  const guideStatus = JSON.parse(localStorage.getItem('guide'));
  const shopStatus = JSON.parse(localStorage.getItem('shop'));


  Checktimeout(1800000,() => {
    if (!logoutAlertShown) {
      Swal.fire({
        text: 'User logged out due to inactivity',
      });
      localStorage.removeItem('usr');
      localStorage.removeItem('token')
      localStorage.removeItem('usr_id')
      localStorage.removeItem('shop_id');
      localStorage.removeItem('shop_item_id');
      localStorage.removeItem('shop');
      localStorage.removeItem('guide');
      localStorage.removeItem('fav');
  
      setLogoutAlertShown(true); // Ensure the alert is only shown once
    }
  });


  //fetch global MUPLACE 
  useEffect(() => {
  
    axios.get(`${SERVER_URL}/muplace/mudata`)
      .then(res => {
        Setmuplace(res.data.filter(e => e.name !== "วัดดาวดึงษาราม"))
      })
      .catch(err => alert(err))

    axios.get(`${SERVER_URL}/shop/shop_item`)
    .then(res => Setlistshop(res.data))
    .catch(err => alert(err))  
      
  }, [])

  
  const data_context = {
     muplace:global_muplace,
     per_muplace:selectedMuplace,
     guideStatus:guideStatus,
     shopStatus:shopStatus,
     shopList:listshop,
     SERVER_URL:SERVER_URL
  }

  
  const Handlefav=(fav)=>{
    setfavoritestatus(fav); 
  }
 


  const SelectedTypeMu = (type) => {
    console.log(type);
    Setselectedmutype(type)
  }

  const SelectedMuplace = (muplace) => {
    SetSelecttedMuplace(muplace)
  }

  const show_guide = (showed) =>{
       Setshowguide(showed);
  }

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);



  return (
    <Muplace_Context.Provider value={data_context} >
      <Header showguide={show_guide} handleFav={Handlefav}/>
      <br />
      <br />
      <br />
      <br />
      <br />

      {location.pathname !== '/shop' &&location.pathname !== '/login'&& location.pathname !== '/register' && location.pathname !== '/logout' &&<NavType show_guide={show_guide} SelectedTypeMu={SelectedTypeMu} handleFav={Handlefav} />}
      <br />
      <br />
   
 
      <Routes>
        <Route path='/' element={<Listitem favstatus={favoriteStatus} SelectedMuplace={SelectedMuplace} SelectedMuType={SelectedTypeMu} />} />
        <Route path='/shop' element={<ShopV2  />} />
        <Route path='/mudetail' element={<Mudetail showguide={showguide} />} />
        <Route path='/login' element={<Login />}  />
        <Route path='/register' element={<Register />}  />
        <Route path='/reg-guide' element={<Regguide />}  />
        <Route path='/shopdetail' element={<Shopdetail  />}  />
        <Route path='/reg-shop' element={<Regis_shop/>}/>
        <Route path='/add-shop' element={<Add_Shop/>} />
        <Route path='/Forgottenpassword' element={<Forgottenpassword/>} />
      </Routes>
      <div>

      </div>


    </Muplace_Context.Provider>
  )
}