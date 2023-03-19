import React, { useEffect } from 'react';
import './App.css';
import 'antd/dist/antd.min.css';
import SignIn from './components/SignIn';
import { useSelector } from 'react-redux'
import { Route, Routes } from 'react-router-dom';
import Register from './components/Register';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import MyFiles from './components/MyFiles';
import axios from 'axios';
import Requests from './components/Requests';


//This is core component that is being render out by the DOM element(parent of all other components)
function App() {
  const user = useSelector((state)=> state.userReducer)
  console.log(user);

  return (
    <div>   
      <Header />
      
    <Routes>
      <Route path="/" element={<SignIn />} />
      <Route path='/dashboard' element={user.isLoggedIn ? <Dashboard /> : <SignIn />}/>
      <Route path='/myfiles' element={user.isLoggedIn ? <MyFiles /> : <SignIn />}/>
      <Route path='/requests' element={user.isLoggedIn ? <Requests /> : <SignIn />}/>
      <Route path="/register"  element={<Register />} />
    </Routes>
    </div>
  );
}

export default App;
