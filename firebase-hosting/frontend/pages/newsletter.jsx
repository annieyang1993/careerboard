import React, { useContext, useState, useMemo, useEffect} from 'react';
import ReactDOM from 'react-dom';
import Header from '../components/header'
import logo from '../../public/web3careers-rainbow.png'
import {Firebase, db} from '../../config/firebase';
import {BsCheckLg} from 'react-icons/bs'
import {AiOutlineArrowRight} from 'react-icons/ai'
import { BrowserRouter as Router, Link } from 'react-router-dom';
import AuthContext from '../../context/Context';
import Footer from '../components/footer'

//import {Firebase, db} from '../config/firebase';

export default function Newsletter() {
    const authContext = useContext(AuthContext);
    const [email, setEmail] = useState('');
    const [subscribed, setSubscribed] = useState(false);
    const [subscribeError, setSubscribeError] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSubscribe = async ()=>{
        if (subscribed === false){
            setLoading(true);
            if (email.includes('@')===false || email.includes('.')===false){
              setSubscribeError(true);
              setLoading(false);
            } else{
              setSubscribeError(false);
              var newSubscription = new Object();
              newSubscription[email] = true;
              const data = await Firebase.firestore().collection('emails').doc('emails').set(newSubscription, {merge: true})
              await new Promise((resolve)=>setTimeout(resolve, 300));
              setLoading(false);
              setSubscribed(true);
            }
            
            // var emailsArray = emails.emails;
            // emailsArray.push(email);

        }
    }

  return (
    <div className = "content">
      <div className = 'content-inner'>
        <img className = 'news-logo' src={logo}/>
        <div className = 'news-name'>CryptoCareerBoard</div>
        <div className = 'news-line1'>Build the future of the internet.</div>
        <div className = 'news-line2'>All skillsets and experience levels are welcome.</div>
        <div className = 'news-line3'>Browse postings from software engineering to human resources, product design, operations, and more.</div>
        
        {subscribeError ? 
        <div className = 'newsletter-header-input-page' style={{border: '1px solid red'}}>
          <input type="email" value = {email} placeholder = 'Enter email to receive job updates weekly' onChange = {(e)=>{setEmail(e.target.value)}} className = 'newsletter-input-inner-page'/>
          <div className = 'subscribe-newsletter-page' onClick={()=>{handleSubscribe()}}> {subscribed ? <div>Subscribed <BsCheckLg/></div>: loading ? <div>Loading...</div> : <div>Subscribe</div>}</div>
        </div>
        :<div className = 'newsletter-header-input-page'>
          <input type="email" value = {email} placeholder = 'Enter email to receive job updates weekly' onChange = {(e)=>{setEmail(e.target.value)}} className = 'newsletter-input-inner-page'/>
          <div className = 'subscribe-newsletter-page' onClick={()=>{handleSubscribe()}}> {subscribed ? <div>Subscribed <BsCheckLg/></div>: loading ? <div>Loading...</div> : <div>Subscribe</div>}</div>
        </div>}

        <Link to='/' onClick={()=>authContext.setFilteringBool(true) } className = 'news-line4'>Browse jobs</Link> <br/>
        {/* <div className = 'news-line5'>Browse Jobs</div> */}

      </div>
      <Footer/>
    </div>
  );
}