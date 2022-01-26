import React, { useContext, useState, useMemo, useEffect} from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Link } from 'react-router-dom';
import {Firebase, db} from '../../config/firebase';
import AuthContext from '../../context/Context';
import {AiOutlineSearch} from 'react-icons/ai'
import logo from '../../public/web3careers-rainbow.png'
import {useLocation, withRouter, useHistory} from 'react-router-dom';
import {BsCheckLg} from 'react-icons/bs'


export default function Header() {
    const authContext = useContext(AuthContext);
    const [email, setEmail] = useState('');
    const [subscribed, setSubscribed] = useState(false);
    const [subscribeError, setSubscribeError] = useState(false);
    const [loading, setLoading] = useState(false);
    const  history = useHistory();
    const location = useLocation();

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
      <div className = 'header-wrapper'>
        <div className = "header">

            <Link  to="/" onClick={()=>
                {location.pathname === '/' ? null : authContext.setFilteringBool(true); authContext.setPage(1)}
                }>
                <img className = 'logo-header' src={logo}/>
            </Link>
            <div className = "home">
                {/* <div className = "home-content">
                    Web3Careers
                </div> */}
                {/* <div className = 'description-jobs'> <div className = 'web3'>WEB3CAREERS</div> <div className = 'web3-description'>: build the future of the decentralized internet. </div></div> */}
                <div className = 'header-entry-wrapper'>
                <div className = 'search-input'>
                    <AiOutlineSearch className = 'search-icon' color='gray'/>
                        <input type="search" value = {authContext.search} placeholder = 'Search jobs' onChange = {(e)=>{authContext.setSearch(e.target.value)}} onKeyPress = {async (e)=>{
                            if (e.key === 'Enter') {
                            authContext.setFilteringBool(true); 
                            if (location.pathname!=='/' && location.pathname!=='/jobdetails'){
                                history.push('/');
                            }
                            await new Promise((resolve)=> setTimeout(resolve, 300)); 
                            authContext.setPage(1); 
                            authContext.setSearchFinal(e.target.value); 
                            e.preventDefault();
                            authContext.setFilteringBool(false)}}} className = 'search-input-inner'/>
                </div>

                <div className = 'newsletter-header-input'>
                    <form>
                        <input type="email" value = {email} placeholder = 'Enter email to receive job updates weekly' onChange = {(e)=>{setEmail(e.target.value)}} className = 'newsletter-input-inner'/>
                    </form>
                    <div className = 'subscribe-newsletter' onClick={()=>{handleSubscribe()}}> {subscribed ? <div>Subscribed</div>: loading ? <div>Loading...</div> : <div>Subscribe</div>}</div>
                </div>
                </div>


                
            </div>
            <div className = "tabs">
                <div className = "post-job">
                        <Link to="/postjob" className = "tab-content">Post Job</Link>              
                </div>
                <div className = "tab">
                        <Link to="/newsletter" className = "tab-content">Newsletter</Link>              
                </div>

                <div className = "tab">
                        <Link to="/" onClick={()=>
                {location.pathname === '/' ? null : authContext.setFilteringBool(true); authContext.setPage(1)}
                } className = "tab-content">Jobs</Link>              
                </div>


            </div> 

        </div>

        {/* <div className = 'header-line'></div> */}
    </div>

  );
}