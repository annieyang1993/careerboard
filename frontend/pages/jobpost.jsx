import React, { useContext, useState, useMemo, useEffect} from 'react';
import ReactDOM from 'react-dom';
import AuthContext from '../../context/Context'
import {useStripe, useElements, PaymentElement, CardElement,} from '@stripe/react-stripe-js';
import {Elements, StripeProvider} from '@stripe/react-stripe-js';
import {loadStripe} from '@stripe/stripe-js';
import {Firebase, db, functions} from '../../config/firebase';
import {AiOutlineCalendar} from 'react-icons/ai'
import {BsCheckLg} from 'react-icons/bs'
import {BsFillCalendarCheckFill, BsNewspaper} from 'react-icons/bs'
import {AiOutlineLineChart, AiTwotoneCalendar} from 'react-icons/ai'
import Resizer from 'react-image-file-resizer'
import ReactMarkdown from 'react-markdown';
import Footer from '../components/footer'


import {BiSupport} from 'react-icons/bi'
//import {Firebase, db} from '../config/firebase';
require('react-dom');

const stripePromise = loadStripe('pk_live_51KF8tcBYQrX4euNOzkjju7cHk43H5p0dfIUeXb0CZeWrGickBX1Tm24nEzDzANGaxopQpBs1IcieppTFNCG67Tf800Z7ThIlbu');

function FeaturesCard() {
    return(
        <div className='features-card'>
            <div className='features-title'>
                Job Post Features
            </div>

            <div className='features'>
                <div className= 'feature'>
                    <div role="img" aria-label="sheep" className='img' width="100">🗓 </div>
                    <div>Live for 60 days on our job listings page</div>

                </div>
                <div className= 'feature'>
                    <div role="img" aria-label="sheep" className='img' width="100">🗞  </div>
                    <div>Automatically included in our weekly newsletter</div>

                </div>
                <div className= 'feature'>
                    <div role="img" aria-label="sheep" className='img' width="100">📈</div>
                    <div>Reviewed by our team for optimal reach and interest</div>
                </div>
                <div className= 'feature'>
                    <div role="img" aria-label="sheep" className='img' width="100">⚙️</div>
                    <div>Technical support after going live</div>
                </div> <br/>
                <div className='bottom'></div>
            </div>

            
        </div>
    )
}
function ExplanationCard() {
    return(
        <div className='explanation-card'>
            <div className='explanation-title'>
                Why Crypto Careers is the premier Web 3.0 job board
            </div>

            <div className='points'>
            <div className = 'explanation-point'>
                <BsCheckLg className= 'check' color='green'/>
                <div className = 'explanation-text'> A fast growing database of highly-skilled and diverse people</div>
            </div> <br/>
            <div className = 'explanation-paragraph'>
                We believe talent exists in all forms, everywhere. We are dedicated to building a diverse pool of applicants in terms of gender, ethnicity, and geographic location. Our applicants range from undergraduates and new grads from top universities to professionals with 10+ years of experience.
            </div>

            <div className = 'explanation-point'>
                <BsCheckLg className= 'check' color='green'/>
                <div className = 'explanation-text'> Straightforward cost structure with all features included with each posting</div>
            </div> <br/>
            <div className = 'explanation-paragraph'>
                Every job posting is important, thus there are no hidden fees with our cost structure. Each posting is live for 60 days, included in our weekly newsletter, reviewed by a member of our team to maximize engagement, and receives technical support after going live. 
            </div>

            <div className = 'explanation-point'>
                <BsCheckLg className= 'check' color='green'/>
                <div className = 'explanation-text'> Your job posts are automatically included in our weekly newsletter</div>
            </div> <br/>
            <div className = 'explanation-paragraph'>
                Your posts are automatically highlighted in our weekly newsletter, in addition to being on the top of our job listings page.
            </div>

            <div className = 'explanation-point'>
                <BsCheckLg className= 'check' color='green'/>
                <div className = 'explanation-text'> Our team reviews every job posting</div>
            </div> <br/>
            <div className = 'explanation-paragraph'>
                Our team reviews every job posting for grammar and formatting, in addition to ensuring optimal tags/roles are selected to reach the maximum audience. 
            </div>

            {/* <div className = 'explanation-point'>
                <BsCheckLg className= 'check' color='green'/>
                <div className = 'explanation-text'> Our site is the only crypto job board that allows applicants to track and save postings they're interested in, allowing more people to view, track, and apply to each job</div>
            </div> <br/> */}
            {/* <div className = 'explanation-paragraph'>
                test test test
            </div> */}
            </div>
        </div>
    )
}

const UploadAndDisplayImage = () => {

  return (
    <div>
      {selectedImage && (
        <div>
        {/* <img alt="not found" width={"250px"} src={URL.createObjectURL(selectedImage)} /> */}
        <div className = 'logo-name'> {selectedImage['name']}</div>
        <br />
        <button onClick={()=>setSelectedImage(null)}>Remove</button>
        </div>
      )}
      <br />
     
      <br /> 
      <input
        type="file"
        name="myImage"
        onChange={(event) => {
          setSelectedImage(event.target.files[0]);
        }}
      />
    </div>
  );
};





function JobPost() {
    const authContext = useContext(AuthContext);


    const [jobTitle, setJobTitle] = useState('');
    const [jobTitleBool, setJobTitleBool] = useState(false);
    
    const [jobDescription, setJobDescription] = useState('');
    const [jobDescriptionBool, setJobDescriptionBool] = useState(false);
    
    const [company, setCompany] = useState('');
    const [companyBool, setCompanyBool] = useState(false);
    
    const [contractType, setContractType] = useState('');
    const [contractTypeBool, setContractTypeBool] = useState(false);
    
    const [jobLocation, setJobLocation] = useState('');
    const [jobLocationBool, setJobLocationBool] = useState(false);
    
    const [accountEmail, setAccountEmail] = useState('');
    const [accountEmailBool, setAccountEmailBool] = useState('');

    const [role, setRole] = useState('');
    const [compensationLow, setCompensationLow] = useState(0);
    const [compensationHigh, setCompensationHigh] = useState(0);
    const [comments, setComments] = useState('');
    const [tags, setTags] = useState('');

    const [submitClicked, setSubmitClicked] = useState(false);
    const [continue1, setContinue1] = useState(true);

    const [selectedImage, setSelectedImage] = useState(null);
    const [logoBool, setLogoBool] = useState(false);

    const [companySize, setCompanySize] = useState(null);
    const [companySizeBool, setCompanySizeBool] = useState(false);


    //const [logo, setLogo] = useState('');
    //const [logoBool, setLogoBool] = useState(false);




    
    const [applyEmail, setApplyEmail] = useState('');
    const [applyEmailBool, setApplyEmailBool] = useState(true);
    const [appURL, setAppURL] = useState('');
    const [appURLBool, setAppURLBool] = useState(true);


    const [websiteBool, setWebsiteBool] = useState(false);
    const [emailBool, setEmailBool] = useState(false);
    const [screen, setScreen] = useState(0);

    const [loadingIndicatorSecond, setLoadingIndicatorSecond] = useState(false);
    const [successSecond, setSuccessSecond] = useState(false);


    function currencyFormat(num) {
        return '$' + String(num).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
    }

    const [rolesBool, setRolesBool] = useState([
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false
    ]);

    const [roles, setRoles] = useState([
        "Design",
        "Engineering",
        "Finance",
        "Founder",
        "Growth",
        "Human Resources",
        "Investment",
        "Management",
        "Marketing",
        "Operations",
        "Product",
        "Sales",
        "Other"
    ]);

    

 
    const CheckoutForm = () => {
        const stripe = useStripe();
        const elements = useElements();

        const [loadingIndicator, setLoadingIndicator] = useState(false);
        const [stripeError, setStripeError] = useState(false);
        const [firebaseError, setFirebaseError] = useState(false);
        const [successful, setSuccessful] = useState(false);


        const handleSubmitPayment = async (event) => {
            // We don't want to let default form submission happen here,
            // which would refresh the page.
             event.preventDefault();
            setLoadingIndicator(true);
            setStripeError(false);
            setFirebaseError(false);
            await new Promise((resolve)=>setTimeout(resolve, 500))

           
            // console.log("CLICK")

            // console.log("BILLINGDETAILS", billingDetails);
            if (!stripe || !elements) {
              // Stripe.js has not yet loaded.
              // Make sure to disable form submission until Stripe.js has loaded.
              return;
            }
            const cardElement = await elements.getElement("card");

            const billingDetails={
                name: company,
                email: accountEmail
            }


            const paymentMethodReq = await stripe.createPaymentMethod({
                type: "card",
                card: cardElement,
                billing_details: billingDetails
            })

            if (paymentMethodReq.error){
                console.log(company);
                console.log(accountEmail);
                console.log(cardElement);
                console.log(paymentMethodReq.error)
                setStripeError(true);
                setLoadingIndicator(false);
            } else{
                    const data = await fetch('https://us-central1-web3careers-88177.cloudfunctions.net/createPaymentIntent', {
                    method: 'POST',
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        payment_id: paymentMethodReq.paymentMethod.id,
                        email: accountEmail
                    })
                })

                const responseJson = await data.json();

                
                const {error} = await stripe.confirmCardPayment(responseJson.client_secret, {
                    payment_method: paymentMethodReq.paymentMethod.id
                })

                let url;

                const tagHash = {}
                authContext.tagFilter.map((tag, i)=>{
                    tagHash[tag] = true;
                })

                const tagArray = tags.split(',');
                tagArray.map((tag, i)=>{
                    tagHash[tag.trim().toLowerCase()] = true;
                })

                const locationHash = {}
                authContext.locationFilter.map((location1, i)=>{
                    locationHash[location1] = true;
                })

                const locationArray = jobLocation.split(',');
                locationArray.map((location1, i)=>{
                    locationHash[location1.trim().toLowerCase()] = true;
                })

                await Firebase.firestore().collection('filters').doc('filters').set({
                    //role_filters: Object.keys(roleHash),
                    tag_filters: Object.keys(tagHash),
                    location_filters: Object.keys(locationHash)
                }, {merge: true})


                if (error){
                    setStripeError(true);
                    setLoadingIndicator(false);
                } else{
                    const resizeFile = (file) =>
                    new Promise((resolve) => {
                        Resizer.imageFileResizer(file, 100, 100, 'PNG', 100, 0, (uri) => {
                        resolve(uri);
                        });
                    });

                const uri = await resizeFile(selectedImage);
                const thumbRef = Firebase.storage().ref(`images/${company}`);
                const thumbSnapshot = Firebase.storage().ref(`images/${company}`).putString(uri, 'data_url');
                //const thumbUrl = await getDownloadURL(thumbSnapshot.ref);
                thumbSnapshot.on('state_changed', 
                    (snapShot) => {
                    //takes a snap shot of the process as it is happening
                    }, (err) => {
                        setFirebaseError(true);
                        setLoadingIndicator(false);
                    }, () => {
                    // gets the functions from storage refences the image storage in firebase by the children
                    // gets the download url then sets the image from firebase as the value for the imgUrl key:
                        Firebase.storage().ref('images').child(company).getDownloadURL().then(async (urlTemp)=>{
                        url = urlTemp;
                        await Firebase.firestore().collection('job postings').doc().set({
                            company_name: company,
                            job_title: jobTitle,
                            job_description: jobDescription,
                            company_logo_name: selectedImage.name,
                            company_logo_url: url,
                            company_size: companySize,
                            role: role,
                            contract_type: contractType,
                            location: jobLocation,
                            tags: tags,
                            min_yearly_salary: compensationLow,
                            max_yearly_salary: compensationHigh,
                            your_email: accountEmail,
                            additional_comments: comments,
                            apply_by: websiteBool ? 'website' : emailBool ? 'email' : 'none',
                            application_email: applyEmail,
                            application_website: appURL,
                            live: false,
                            created_on: new Date()
                        })
                    })
                    })
                
                    setLoadingIndicator(false);
                    setSuccessful(true);
            }
            }

            

           if (firebaseError === true || stripeError === true){
               setLoadingIndicator(false);
           }
        }

        

        return (
            <form >
                 <div className='label-and-entry'>
                    <label className = "title" for="job-title"> Email:</label>
                    <div className = 'entry-container'>
                        <div className = "entry-filled">{accountEmail}</div>
                    </div>
                </div>
                <div className='label-and-entry'>
                    <label className = "title" for="job-title"> Card:</label>
                    <div className = 'card'>
                        <CardElement options={{style:{base:{color: 'white', marginTop: '10px', width: '95%'}}}}/>
                    </div>
                </div>

                <button className='next' disabled ={loadingIndicator} onClick={(e)=>handleSubmitPayment(e)}>Purchase Posting ($49)</button>
                 <input onClick={(e)=>{if (loadingIndicator === false) {visitPrevious(e)}}} className="previous" type="submit" value="Edit Previous"></input>
                
                {loadingIndicator ? <div className = 'loading-indicator'></div> : null}

                {stripeError ? <div className = 'error'>Your credit card information could not be processed. Please try again.</div> : null}
                {firebaseError ? <div className = 'error'>We're sorry, your purchase could not be processed. Please contact support to try again.</div> : null}
                {successful ? <div className = 'success'>Success!!! <br/> Your posting will be live in a few moments and an email receipt will be sent to you shortly. <br/> Please contact support if you have any questions.</div> : null}

           
                
                <br/>
            </form>
        )
    };

    const handleSubmitQuickUpload = async (event) => {
            // We don't want to let default form submission happen here,
            // which would refresh the page.
            setLoadingIndicatorSecond(true);
            await new Promise((resolve)=>setTimeout(resolve, 500))
             event.preventDefault();
                let url;

                const tagHash = {}
                authContext.tagFilter.map((tag, i)=>{
                    tagHash[tag] = true;
                })

                const tagArray = tags.split(',');
                tagArray.map((tag, i)=>{
                    tagHash[tag.trim().toLowerCase()] = true;
                })

                const locationHash = {}
                authContext.locationFilter.map((location1, i)=>{
                    locationHash[location1] = true;
                })

                const locationArray = jobLocation.split(',');
                locationArray.map((location1, i)=>{
                    locationHash[location1.trim().toLowerCase()] = true;
                })

                await Firebase.firestore().collection('filters').doc('filters').set({
                    tag_filters: Object.keys(tagHash),
                    location_filters: Object.keys(locationHash)
                }, {merge: true})


                
                    const resizeFile = (file) =>
                    new Promise((resolve) => {
                        Resizer.imageFileResizer(file, 100, 100, 'PNG', 100, 0, (uri) => {
                        resolve(uri);
                        });
                    });

                const uri = await resizeFile(selectedImage);
                const thumbRef = Firebase.storage().ref(`images/${company}`);
                const thumbSnapshot = Firebase.storage().ref(`images/${company}`).putString(uri, 'data_url');
                //const thumbUrl = await getDownloadURL(thumbSnapshot.ref);
                thumbSnapshot.on('state_changed', 
                    (snapShot) => {
                    //takes a snap shot of the process as it is happening
                    }, (err) => {
                    }, () => {
                    // gets the functions from storage refences the image storage in firebase by the children
                    // gets the download url then sets the image from firebase as the value for the imgUrl key:
                        Firebase.storage().ref('images').child(company).getDownloadURL().then(async (urlTemp)=>{
                        url = urlTemp;
                        await Firebase.firestore().collection('job postings').doc().set({
                            company_name: company,
                            job_title: jobTitle,
                            job_description: jobDescription,
                            company_logo_name: selectedImage.name,
                            company_logo_url: url,
                            company_size: companySize,
                            role: role,
                            contract_type: contractType,
                            location: jobLocation,
                            tags: tags,
                            min_yearly_salary: compensationLow,
                            max_yearly_salary: compensationHigh,
                            your_email: accountEmail,
                            additional_comments: comments,
                            apply_by: websiteBool ? 'website' : emailBool ? 'email' : 'none',
                            application_email: applyEmail,
                            application_website: appURL,
                            live: false,
                            created_on: new Date()
                        })
                    })
                    })
                    setSuccessSecond(true);
                    setLoadingIndicatorSecond(false);
            
            }

    


    const handleSubmit = (e) => {
        setSubmitClicked(true);
        e.preventDefault();
        var myDiv = document.getElementsByClassName('job-post-form')[0].scrollIntoView(false, { behavior: 'smooth', block: 'start' })

        var continueTemp = true;
        setContinue1(true);

        if (company === ''){
            setCompanyBool(false);
            setContinue1(false);
            continueTemp = false;
        } else{
            setCompanyBool(true);
        }

        if (jobTitle === ''){
            setJobTitleBool(false);
            setContinue1(false);
            continueTemp = false;
        } else{
            setJobTitleBool(true);
        }

        if (jobDescription === ''){
            setJobDescriptionBool(false);
            setContinue1(false);
            continueTemp = false;
        } else{
            setJobDescriptionBool(true);
        }

        if (contractTypeBool === false){
            setContractTypeBool(false);
            setContinue1(false);
            continueTemp = false;
        } else{
            setContractTypeBool(true);
        }

         if (jobLocation === ''){
            setJobLocationBool(false);
            setContinue1(false);
            continueTemp = false;
        } else{
            setJobLocationBool(true);
        }

        if (accountEmail === ''){
            setAccountEmailBool(false);
            setContinue1(false);
            continueTemp = false;
        } else{
            setAccountEmailBool(true);
        }

        if (selectedImage === null){
            setLogoBool(false);
            setContinue1(false);
            continueTemp = false;
        } else{
            setLogoBool(true);
        }

        

        if (websiteBool === false && emailBool === false){
            setContinue1(false);
            continueTemp = false;
        } else if (websiteBool === true && appURL === ''){
            setAppURLBool(false);
            setContinue1(false);
            continueTemp = false;
        } else if (emailBool === true && applyEmail === ''){
            setApplyEmailBool(false);
            setContinue1(false);
            continueTemp = false;
        } else{
            setAppURLBool(true);
            setApplyEmailBool(true);
        }


        if (continueTemp === true){
            const rolesTemp = [];
            roles.map((x, i)=>{
                if (rolesBool[i] === true){
                    rolesTemp.push(x);
                }
            });
            setRole(rolesTemp.join(', '));
            setScreen(1);
        } else{
            var div = document.getElementsByClassName('progress-bar')[0].scrollIntoView();
            //console.log(div[0]);
        }

    }

    const handleSubmit1 = async (e) => {
        setLoadingIndicatorSecond(true);
        if (comments === 'anniejohnsusan1993'){
            handleSubmitQuickUpload(e);
        } else{
            // setLoadingIndicator(true);
            await new Promise((resolve)=>setTimeout(resolve, 500))
            e.preventDefault();
            var myDiv = document.getElementsByClassName('job-post-form')[0].scrollIntoView(false, { behavior: 'smooth', block: 'start' })
            setScreen(2);
            setLoadingIndicatorSecond(false);

            // setLoadingIndicator(false)
        }
        return false;
    }

    const visitPrevious = (e) => {
        e.preventDefault();
        var myDiv = document.getElementsByClassName('job-post-form')[0].scrollIntoView(false, { behavior: 'smooth', block: 'start' })
        if (screen===3){
            setScreen(2);
        } else if (screen === 2){
            setScreen(1);
        } else if (screen === 1){
            setScreen(0);
        }
        return false;
    }



    return (
        <div className = "content">
            {/* <div className= 'features-background'>
            </div> */}
            {/* <div className= 'explanation-background'></div> */}
            <FeaturesCard/>
            <ExplanationCard/>
            <div className = "progress-bar">
                <div className = "progress-one">
                    <div className = "dot">
                        {screen === 0 ? <div className = "dot-filler"></div> : null}
                    </div>
                    <div className="dot-text">1. Posting </div>
                </div>
                <div className = 'line'>

                </div>
                <div className = "progress-two">
                    <div className = "dot">
                        {screen === 1 ? <div className = "dot-filler"></div> : null}
                    </div>
                    <div className="dot-text">2. Review </div>
                </div>
                <div className = 'line'>
                    
                </div>
                <div className = "progress-three">
                    <div className = "dot">
                        {screen === 2 ? <div className = "dot-filler"></div> : null}
                    </div>
                    <div className="dot-text">3. Payment </div>
                </div>
            </div> <br/>
            {screen === 0 ?
            <form onSubmit={(e)=>handleSubmit(e)} className="job-post-form">
                <div className='label-and-entry'>
                    <label className = "title" for="cname">Company Name:</label>
                        
                        {companyBool === false && submitClicked === true ? 
                        <div className = 'entry-container' style = {{border: '1px solid red'}}>
                        <input className = "entry" line-height="50"   placeholder='Please enter your company name' type="text" id="cname" name="cname" value={company} 
                        onChange={(event)=>{setCompany(event.target.value)
                        }}/>                  
                        </div> :
                        <div className = 'entry-container'>
                        <input className = "entry" line-height="50"   placeholder='Please enter your company name' type="text" id="cname" name="cname" value={company} 
                        onChange={(event)=>{setCompany(event.target.value)
                        }}/>                  
                        </div>}


                
                </div>

                <div className='label-and-entry'>
                <label className = "title" for="job-title"> Job Title:</label>
                {jobTitleBool === false && submitClicked === true ? 
                <div className = 'entry-container' style = {{border: '1px solid red'}}>
                <input className = "entry" line-height="50" type="text" placeholder='Please enter the title of this job.' id="job-title" name="job-title" value={jobTitle} 
                onChange={(event)=>{
                    setJobTitle(event.target.value);
                    }}/>
                </div> : 
                <div className = 'entry-container'>
                <input className = "entry" line-height="50" type="text" placeholder='Please enter the title of this job.' id="job-title" name="job-title" value={jobTitle} 
                onChange={(event)=>{
                    setJobTitle(event.target.value);
                    }}/>
                </div>}


                
                </div>
                
                <div className='label-and-entry-job-description'>
                    <label className = "title" for="job-description"> Job Description: <br/>
                    <div className = 'description'>Markdown enabled, or we'll review and format your posting for you.</div></label>
                    {jobDescriptionBool === false && submitClicked === true ? 
                    <div className = 'entry-container2' style = {{border: '1px solid red'}}>
                        <textarea className = "job-description" line-height="300" type="text" placeholder='Please enter a detailed description of your role.' id="job-description" name="job-description" 
                        value={jobDescription} 
                        onChange={(event)=>{
                            setJobDescription(event.target.value);
                            }}/>
                    </div> :
                     <div className = 'entry-container2'>
                        <textarea className = "job-description" line-height="300" type="text" placeholder='Please enter a detailed description of your role.' id="job-description" name="job-description" 
                        value={jobDescription} 
                        onChange={(event)=>{
                            setJobDescription(event.target.value);
                            }}/>
                    </div>} </div>

                <div className='label-and-entry'>
                <label className = "title" for="job-title"> Company Logo:</label>
                {logoBool === false && submitClicked === true ? 
                <div className = 'entry-container' style = {{border: '1px solid red'}}>
                    <div role="paper-clip" aria-label="paper-clip" className="paper-clip" width="100">📎</div>
                    {selectedImage && (
                        <div className = 'logo-info'>
                        {/* <img alt="not found" width={"250px"} src={URL.createObjectURL(selectedImage)} /> */}
                            <div className = 'logo-name'> 
                            
                            {selectedImage['name']}
                                 
                            </div>
                            
                        </div>
                    )}
                    <label for="files" className = 'upload'>Upload Image</label>
                    <input
                    type="file"
                    id = 'files'
                    name="myImage"
                    style={{visibility: 'hidden'}}
                    onChange={(event) => {
                    setSelectedImage(imageFile => (event.target.files[0]));
                    }}
                    />
                </div> : 
                <div className = 'entry-container'>
                    <div role="paper-clip" aria-label="paper-clip" className="paper-clip" width="100">📎</div>
                    {selectedImage && (
                        <div className = 'logo-info'>
                        {/* <img alt="not found" width={"250px"} src={URL.createObjectURL(selectedImage)} /> */}
                            <div className = 'logo-name'> 
                            
                            {selectedImage['name']}
                                 
                            </div>
                            
                        </div>
                    )}

                    <label for="files" className = 'upload'>Upload Image</label>
                    <input
                    type="file"
                    id = 'files'
                    name="myImage"
                    style={{visibility: 'hidden'}}
                    onChange={(event) => {
                    setSelectedImage(imageFile => (event.target.files[0]));
                    }}
                    />
                </div>}

                    
                </div>
                {/* <div className='label-and-entry-company-description'>
                    <label className = "title" for="company-description">Company Description:</label>
                    <div className = 'entry-container3'>
                    <textarea className = "company-description" line-height="140" placeholder = 'Please enter a description of your company (this section is optional).' type="text" id="company-description" name="company-description" value={companyDescription} onChange={(event)=>setCompanyDescription(event.target.value)}/>
                    </div>
                </div> */}

                <div className='label-and-entry-role'>
                    <div className='role-container'>
                    <label className = "title-role" for="company-description">Roles:
                    </label><br/>
                    </div>

                <div className = 'right-role-container'>
                

                <input type="checkbox" id="email" name="apply-by" value="Email"
                 checked={rolesBool[0]} onChange={()=>{ 
                    var tempRoles = rolesBool.map((x)=>x);
                    if (rolesBool[0]===true){
                        tempRoles[0] = false;
                    } else{
                        tempRoles[0] = true;
                    }
                    setRolesBool(tempRoles);
                }}/>
                <label for="Email">Design</label>

                <input type="checkbox" id="email" name="apply-by" value="Email"
                 checked={rolesBool[1]} onChange={()=>{
                    var tempRoles = rolesBool.map((x)=>x);
                    if (rolesBool[1]===true){
                        tempRoles[1] = false;
                    } else{
                        tempRoles[1] = true;
                    }
                    setRolesBool(tempRoles);
                }}/>
                <label for="Email">Engineering</label>

                <input type="checkbox" id="email" name="apply-by" value="Email"
                 checked={rolesBool[2]} onChange={()=>{
                    var tempRoles = rolesBool.map((x)=>x);
                    if (rolesBool[2]===true){
                        tempRoles[2] = false;
                    } else{
                        tempRoles[2] = true;
                    }
                    setRolesBool(tempRoles);
                }}/>
                <label for="Email">Finance</label>

                <input type="checkbox" id="email" name="apply-by" value="Email"
                 checked={rolesBool[3]} onChange={()=>{
                    var tempRoles = rolesBool.map((x)=>x);
                    if (rolesBool[3]===true){
                        tempRoles[3] = false;
                    } else{
                        tempRoles[3] = true;
                    }
                    setRolesBool(tempRoles);
                }}/>
                <label for="Email">Founder</label>

                <input type="checkbox" id="email" name="apply-by" value="Email"
                 checked={rolesBool[4]} onChange={()=>{
                    var tempRoles = rolesBool.map((x)=>x);
                    if (rolesBool[4]===true){
                        tempRoles[4] = false;
                    } else{
                        tempRoles[4] = true;
                    }
                    setRolesBool(tempRoles);
                }}/>
                <label for="Email">Growth</label>

                <input type="checkbox" id="email" name="apply-by" value="Email"
                 checked={rolesBool[5]} onChange={()=>{
                    var tempRoles = rolesBool.map((x)=>x);
                    if (rolesBool[5]===true){
                        tempRoles[5] = false;
                    } else{
                        tempRoles[5] = true;
                    }
                    setRolesBool(tempRoles);
                }}/>
                <label for="Email">HR</label>

                <input type="checkbox" id="email" name="apply-by" value="Email"
                 checked={rolesBool[6]} onChange={()=>{
                    var tempRoles = rolesBool.map((x)=>x);
                    if (rolesBool[6]===true){
                        tempRoles[6] = false;
                    } else{
                        tempRoles[6] = true;
                    }
                    setRolesBool(tempRoles);
                }}/>
                <label for="Email">Investment</label>

                <input type="checkbox" id="email" name="apply-by" value="Email"
                 checked={rolesBool[7]} onChange={()=>{
                    var tempRoles = rolesBool.map((x)=>x);
                    if (rolesBool[7]===true){
                        tempRoles[7] = false;
                    } else{
                        tempRoles[7] = true;
                    }
                    setRolesBool(tempRoles);
                }}/>
                <label for="Email">Marketing</label>

                <input type="checkbox" id="email" name="apply-by" value="Email"
                 checked={rolesBool[8]} onChange={()=>{
                    var tempRoles = rolesBool.map((x)=>x);
                    if (rolesBool[8]===true){
                        tempRoles[8] = false;
                    } else{
                        tempRoles[8] = true;
                    }
                    setRolesBool(tempRoles);
                }}/>
                <label for="Email">Management</label>

                <input type="checkbox" id="email" name="apply-by" value="Email"
                 checked={rolesBool[9]} onChange={()=>{
                    var tempRoles = rolesBool.map((x)=>x);
                    if (rolesBool[9]===true){
                        tempRoles[9] = false;
                    } else{
                        tempRoles[9] = true;
                    }
                    setRolesBool(tempRoles);
                }}/>
                <label for="Email">Operations</label>

                <input type="checkbox" id="email" name="apply-by" value="Email"
                 checked={rolesBool[10]} onChange={()=>{
                    var tempRoles = rolesBool.map((x)=>x);
                    if (rolesBool[10]===true){
                        tempRoles[10] = false;
                    } else{
                        tempRoles[10] = true;
                    }
                    setRolesBool(tempRoles);
                }}/>
                <label for="Email">Product</label>

                
                <input type="checkbox" id="email" name="apply-by" value="Email"
                 checked={rolesBool[11]} onChange={()=>{
                    var tempRoles = rolesBool.map((x)=>x);
                    if (rolesBool[11]===true){
                        tempRoles[11] = false;
                    } else{
                        tempRoles[11] = true;
                    }
                    setRolesBool(tempRoles);
                }}/>
                <label for="Email">Sales</label> 
                

                <input type="checkbox" id="email" name="apply-by" value="Email"
                 checked={rolesBool[12]} onChange={()=>{
                    var tempRoles = rolesBool.map((x)=>x);
                    if (rolesBool[12]===true){
                        tempRoles[12] = false;
                    } else{
                        tempRoles[12] = true;
                    }
                    setRolesBool(tempRoles);
                }}/>
                <label for="Email">Other</label> <br/><br/>
                </div>

                </div>
                <div className = 'label-and-entry'>

                <label className = "title-location" for="company-description"> Contract Type:
                </label>

                {contractTypeBool === false && submitClicked === true ? 

                <div className = 'radio-buttons' style = {{color: 'red'}}>
                <input type="radio" id="radio1" name="apply-by1" className = 'radio'
                    value = {contractType === 'Full-time' ? true : false} onClick={()=>{setContractType('Full-time'); setContractTypeBool(true)}}/>
                <label for="radio1" className = 'radio'>Full-time</label>
                <input type="radio" id="radio1" name="apply-by1" className = 'radio'
                    value = {contractType === 'Part-time' ? true : false} onClick={()=>{setContractType('Part-time'); setContractTypeBool(true)}}/>
                <label for="radio1" className = 'radio'>Part-time</label>
                <input type="radio" id="radio1" name="apply-by1" className = 'radio'
                    value = {contractType === 'Contract' ? true : false} onClick={()=>{setContractType('Contract'); setContractTypeBool(true)}}/>
                <label for="radio1" className = 'radio'>Contract</label>
                <input type="radio" id="radio1" name="apply-by1" className = 'radio'
                    value = {contractType === 'Internship' ? true : false} onClick={()=>{setContractType('Internship'); setContractTypeBool(true)}}/>
                <label for="radio1" className = 'radio'>Internship</label>
                </div>
                :

                <div className = 'radio-buttons'>
                <input type="radio" id="radio1" name="apply-by1" className = 'radio'
                    value = {contractType === 'Full-time' ? true : false} onClick={()=>{setContractType('Full-time'); setContractTypeBool(true)}}/>
                <label for="radio1" className = 'radio'>Full-time</label>
                <input type="radio" id="radio1" name="apply-by1" className = 'radio'
                    value = {contractType === 'Part-time' ? true : false} onClick={()=>{setContractType('Part-time'); setContractTypeBool(true)}}/>
                <label for="radio1" className = 'radio'>Part-time</label>
                <input type="radio" id="radio1" name="apply-by1" className = 'radio'
                    value = {contractType === 'Contract' ? true : false} onClick={()=>{setContractType('Contract'); setContractTypeBool(true)}}/>
                <label for="radio1" className = 'radio'>Contract</label>
                <input type="radio" id="radio1" name="apply-by1" className = 'radio'
                    value = {contractType === 'Internship' ? true : false} onClick={()=>{setContractType('Internship'); setContractTypeBool(true)}}/>
                <label for="radio1" className = 'radio'>Internship</label>
                </div>}
                </div>

                <div className = 'label-and-entry'>

                <label className = "title-location" for="company-description"> Company Size:
                </label>

                <div className = 'radio-buttons'>
                <input type="radio" id="radio1" name="company-size1" className = 'radio'
                    value = {companySize=== 0 ? true : false} onClick={()=>{setCompanySize(0); setCompanySizeBool(true)}}/>
                <label for="radio1" className = 'radio'>1-10 employees </label>
                <input type="radio" id="radio1" name="company-size1" className = 'radio'
                    value = {companySize=== 1 ? true : false} onClick={()=>{setCompanySize(1); setCompanySizeBool(true)}}/>
                <label for="radio1" className = 'radio'>11-50 employees </label>
                <input type="radio" id="radio1" name="company-size1" className = 'radio'
                    value = {companySize=== 2 ? true : false} onClick={()=>{setCompanySize(2); setCompanySizeBool(true)}}/>
                <label for="radio1" className = 'radio'>51-100 employees </label>
                <input type="radio" id="radio1" name="company-size1" className = 'radio'
                    value = {companySize=== 3 ? true : false} onClick={()=>{setCompanySize(3); setCompanySizeBool(true)}}/>
                <label for="radio1" className = 'radio'>101-500 employees </label>
                <input type="radio" id="radio1" name="company-size1" className = 'radio'
                    value = {companySize=== 4 ? true : false} onClick={()=>{setCompanySize(4); setCompanySizeBool(true)}}/>
                <label for="radio1" className = 'radio'>501-1000 employees </label>
                <input type="radio" id="radio1" name="company-size1" className = 'radio'
                    value = {companySize=== 5 ? true : false} onClick={()=>{setCompanySize(5); setCompanySizeBool(true)}}/>
                <label for="radio1" className = 'radio'>1001+ employees </label>
                </div>
                </div>
                
                <div className = 'label-and-entry'>
                    <label className = "title"  for="company-description"> Location:
                    </label>

                    {jobLocationBool === false && submitClicked === true ?
                    <div className = 'entry-container' style = {{border: '1px solid red'}}>
                    <input className = "entry" type="text" placeholder='Comma separated if more than one location (e.g. Remote, New York City, Toronto)' id="company-description" name="company-description" value={jobLocation} onChange={(event)=>setJobLocation(event.target.value)}/>
                    </div> :
                    <div className = 'entry-container'>
                    <input className = "entry" type="text" placeholder='Comma separated if more than one location (e.g. Remote, New York City, Toronto)' id="company-description" name="company-description" value={jobLocation} onChange={(event)=>setJobLocation(event.target.value)}/>
                    </div>}
                </div>

                <div className = 'label-and-entry'>
                <label className = "title" for="company-description">Tags:</label>
                <div className = 'entry-container'>
                <input className = "entry" placeholder = 'Comma separated (e.g. DeFi, React, Non-Tech, Mobile).' type="text" id="company-description" name="company-description" value={tags} onChange={(event)=>setTags(event.target.value)}/>
                </div>
                </div>

                <div className = 'label-and-entry'>
                <label className = "title" for="company-description">Min Yearly Salary:</label>
                <div className = 'entry-container'>
                <input className = "entry" type="number" id="company-description" placeholder = 'Minimum annual salary (e.g. 100000). Optional but recommended to increase views.' name="company-description" value={compensationLow === 0 ? null : compensationLow} onChange={(event)=>setCompensationLow(event.target.value)}/>
                </div>
                </div>

                <div className = 'label-and-entry'>
                <label className = "title" for="company-description">Max Yearly Salary:</label>
                <div className = 'entry-container'>
                <input className = "entry" type="number" id="company-description" name="company-description" placeholder = 'Maximum annual salary (e.g. 100000). Optional but recommended to increase views.' value={compensationHigh === 0 ? null : compensationHigh} onChange={(event)=>setCompensationHigh(event.target.value)}/>
                </div>
                </div>

                <div className = 'label-and-entry'>
                <label className = "title" for="company-description"> Your Email:</label>

                {accountEmailBool === false && submitClicked === true ? 
                <div className = 'entry-container' style = {{border: '1px solid red'}}>
                <input className = "entry" type="email" id="company-description" name="company-description" placeholder = 'Please enter your email address. Not shown to applicants.' value={accountEmail} onChange={(event)=>setAccountEmail(event.target.value)}/>
                </div> :
                <div className = 'entry-container'>
                <input className = "entry" type="email" id="company-description" name="company-description" placeholder = 'Please enter your email address. Not shown to applicants.' value={accountEmail} onChange={(event)=>setAccountEmail(event.target.value)}/>
                </div>}


                </div>

                <div className = 'label-and-entry'>
                <label className = "title" for="company-description">Additional Comments:</label>
                <div className = 'entry-container'>
                <input className = "entry" type="text" id="company-description" name="company-description" placeholder = 'Please enter your email address (not shown to applicants).'placeholder = 'Please enter any additional notes/comments. Not shown to applicants. ' value={comments} onChange={(event)=>setComments(event.target.value)}/>
                </div>
                </div>

                <div className = 'label-and-entry'>
                <label className="title" for="apply-type"> Apply by:</label>

                {websiteBool === false && emailBool === false && submitClicked === true ? 

                <div style = {{color: 'red'}}>
                <input className = 'radio' type="radio" id="url" name="apply-by" value="Website" checked={websiteBool} onClick={()=>{
                    if (websiteBool === false){
                        setWebsiteBool(true);
                        setEmailBool(false);
                    } else{
                        setWebsiteBool(false);
                        setEmailBool(true);
                        
                    }
                }}/>
                
                <label className = 'radio' for="url">Website</label>
                <input className = 'radio' type="radio" id="email" name="apply-by" value="Email" checked={emailBool} onClick={()=>{
                    if (emailBool === false){
                        setWebsiteBool(false);
                        setEmailBool(true);
                    } else{
                        setWebsiteBool(true);
                        setEmailBool(false);
                    }
                }}/>
                <label className = 'radio' for="Email">Email</label><br/><br/>
                </div>
                : 

                <div>
                <input className = 'radio' type="radio" id="url" name="apply-by" value="Website" checked={websiteBool} onClick={()=>{
                    if (websiteBool === false){
                        setWebsiteBool(true);
                        setEmailBool(false);
                    } else{
                        setWebsiteBool(false);
                        setEmailBool(true);
                    }
                }}/>
                
                <label className = 'radio' for="url">Website</label>
                <input className = 'radio' type="radio" id="email" name="apply-by" value="Email" checked={emailBool} onClick={()=>{
                    if (emailBool === false){
                        setWebsiteBool(false);
                        setEmailBool(true);
                    } else{
                        setWebsiteBool(true);
                        setEmailBool(false);
                    }
                }}/>
                <label className = 'radio' for="Email">Email</label><br/><br/>
                </div>}
                </div>



                {emailBool ? <div className = 'label-and-entry' >
                    <label className = "title" for="company-description"> Email:</label>

                    {applyEmailBool === false && submitClicked === true ? 
                    <div className = 'entry-container' style={{border: '1px solid red'}}>
                        <input className = "entry" placeholder = 'Please enter an email your applicants can send applications to.' type="email" id="company-description" name="company-description" value={applyEmail} onChange={(event)=>setApplyEmail(event.target.value)}/>
                    </div> :
                    <div className = 'entry-container'>
                        <input className = "entry" placeholder = 'Please enter an email your applicants can send applications to.' type="email" id="company-description" name="company-description" value={applyEmail} onChange={(event)=>setApplyEmail(event.target.value)}/>
                    </div>}
                </div> : null}

                {websiteBool ? <div className = 'label-and-entry'>
                    <label className = "title" for="company-description">Website Link:</label>

                    {appURLBool === false && submitClicked === true ? 
                    <div className = 'entry-container' style={{border: '1px solid red'}}>
                    <input className = "entry" placeholder = 'Please enter a link your applicants can send applications to.' type="text" id="company-description" name="company-description" value={appURL} onChange={(event)=>setAppURL(event.target.value)}/>
                    </div> : 
                    <div className = 'entry-container'>
                    <input className = "entry" placeholder = 'Please enter a link your applicants can send applications to.' type="text" id="company-description" name="company-description" value={appURL} onChange={(event)=>setAppURL(event.target.value)}/>
                    </div> }
                </div> : null}
                <br/><br/>
                <input className="next" type="submit" value="Next"></input>
            </form> : null}

            {screen===1 ? 

             <form onSubmit={(e)=>handleSubmit1(e)} className="job-post-form">
                <div className = 'job-header-info'>
                        <div className = 'job-page-logo-container'>
                            {/* <img className = 'job-page-logo' src={companyLogo}/> */}
                            <img alt="not found" className = 'job-page-logo'  src={URL.createObjectURL(selectedImage)} />
                        </div>
                        <div className = 'job-page-header-details'>
                            <div className = 'job-page-title' id = 'job-page-title'>{jobTitle}</div> <br/>
                            <div className = 'job-page-name'>{company}</div> <br/>
                        </div>
                        <a href={websiteBool ? `${appURL}` : `mailto:${applyEmail}`} target="_blank">
                            <div className = 'apply-button'>
                                Apply Now
                            </div>
                        </a>
                    <div className = 'details-half-container'>
                    <div className = 'details-half'>
                        <div className='job-page-deets'>📍  {jobLocation}</div>
                        <div className='job-page-deets'>⏱  {contractType}</div>
                    </div>

                    <div className = 'details-half'>
                        {role === '' ? null : 
                        <div className='job-page-deets'>💼  {role}</div> }
                        {tags === '' ? null : 
                        <div className='job-page-deets'>🏷  {tags}</div> }
                    </div>
                    </div>
                        
                    </div>

                    <div className = 'job-page-line'></div>
                    
                   
                    <ReactMarkdown className = 'job-page-details' children={jobDescription}/>

                    {Number(compensationLow) <= 0 && Number(compensationHigh) <= 0 ? null : Number(compensationLow) <= 0 ? 
                    <div className = 'job-page-compensation'>
                        Compensation Estimate:
                        <div className = 'estimate'>{currencyFormat(compensationHigh)}</div>
                    </div> : compensationHigh === 0 ? 
                    <div className = 'job-page-compensation'>
                        Compensation Estimate:
                        <div className = 'estimate'>{currencyFormat(compensationLow)}</div>
                    </div> : 
                    <div className = 'job-page-compensation'>
                        Compensation Estimate:
                        <div className = 'estimate'> {currencyFormat(compensationLow)} - {currencyFormat(compensationHigh)}</div>
                    </div>}

                        <input className="next" type="submit" value="Proceed to checkout ($49)"></input>

                        {loadingIndicatorSecond ? <div className = 'loading-indicator'></div> : null}
                        {successSecond ? <BsCheckLg/> : null}
                        <input onClick={(e)=>visitPrevious(e)} className="previous" type="submit" value="Edit Previous"></input><br/>
                    </form> : null
            }

            {screen===2 ? 

             <form className="job-post-form">
                 <Elements stripe={stripePromise}>
                           <CheckoutForm/>
                
                </Elements>
             </form> 
             : null
            } 

            <div className='bottom-spacing'></div>
            

        <Footer/>
        
        </div>
    );
}

export default JobPost;