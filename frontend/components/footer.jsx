import React, { useContext, useState, useMemo, useEffect} from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Link } from 'react-router-dom';
import {Firebase, db} from '../../config/firebase';
import AuthContext from '../../context/Context';
import {AiOutlineSearch} from 'react-icons/ai'
import logo from '../../public/web3careers-white.png'


export default function Footer() {
    const authContext = useContext(AuthContext);
    const [email, setEmail] = useState('');

  return (
        <div className = "footer">
            <div className = 'copyright'>© 2022 Web3Careers</div>
            
        </div>


  );
}