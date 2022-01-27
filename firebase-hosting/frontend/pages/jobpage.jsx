import React, { useContext, useState, useMemo, useEffect} from 'react';
import ReactDOM from 'react-dom';
import {Firebase, db, functions} from '../../config/firebase';
import {useLocation, withRouter} from 'react-router-dom';
import AuthContext from '../../context/Context';
import ReactMarkdown from 'react-markdown';
import Header from '../components/header'
import {GoLocation} from 'react-icons/go'
import { BrowserRouter as Router, Link } from 'react-router-dom';
import Select from 'react-select'
import { BiLeftTopArrowCircle } from 'react-icons/bi';
import { BsFileX } from 'react-icons/bs';
import { withTheme } from '@emotion/react';
import $ from 'jquery'
import LoadingAnimation from 'react-circle-loading-animation'
import Footer from '../components/footer'


require('smoothscroll-polyfill').polyfill();

//import {Firebase, db} from '../config/firebase';

export default function JobPage() {
    const authContext = useContext(AuthContext);
    const location = useLocation();
    const [loading, setLoading] = useState(true);
    const [companyName, setCompanyName] = useState(localStorage.getItem(`${location.search.slice(1)}-company-name`))
    const [jobTitle, setJobTitle] = useState(localStorage.getItem(`${location.search.slice(1)}-job-title`))
    const [jobDescription, setJobDescription] = useState(localStorage.getItem(`${location.search.slice(1)}-job-description`));
    const [companyLogo, setCompanyLogo] = useState(localStorage.getItem(`${location.search.slice(1)}-company-logo-url`));

    const [role, setRole] = useState(localStorage.getItem(`${location.search.slice(1)}-role`));
    const [contractType, setContractType] = useState(localStorage.getItem(`${location.search.slice(1)}-contract-type`));
    const [jobLocation, setJobLocation] = useState(localStorage.getItem(`${location.search.slice(1)}-location`));
    const [tags, setTags] = useState(localStorage.getItem(`${location.search.slice(1)}-tags`));


    const [minYearlySalary, setMinYearlySalary] = useState(localStorage.getItem(`${location.search.slice(1)}-min-yearly-salary`));
    const [maxYearlySalary, setMaxYearlySalary] = useState(localStorage.getItem(`${location.search.slice(1)}-max-yearly-salary`));
    const [companySize, setCompanySize] = useState(localStorage.getItem(`${location.search.slice(1)}-company-size`))
    const [applyBy, setApplyBy] = useState(localStorage.getItem(`${location.search.slice(1)}-apply-by`));
    const [applicationEmail, setApplicationEmail] = useState(localStorage.getItem(`${location.search.slice(1)}-application-email`));
    const [applicationWebsite, setApplicationWebsite] = useState(localStorage.getItem(`${location.search.slice(1)}-application-website`));
    const [createdOn, setCreatedOn] = useState(localStorage.getItem(`${location.search.slice(1)}-created-on`))
    const [loadMore, setLoadMore] = useState(false);
    var jobNumber = 0;
    var displayedJobNumber = 0;


    const companySizes = ['1-10 employees', '11-50 employees', '51-100 employees', '101-500 employees', '501-1000 employees', '1001+ employees']


    const [loaded, setLoaded] = useState(false);
    var options = [];
    var locationOptions = [];

    function currencyFormat(num) {
        return '$' + String(num).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
    }

    useEffect(async () => {
        var myDiv3 = document.getElementsByClassName('content')[0].scrollIntoView(false, { behavior: 'smooth', block: 'start' })
        await new Promise((resolve)=>setTimeout(resolve, 300))
        setLoading(false);
    }, [])

    const [experienceLevel, setExperienceLevel] = useState([
        {id: 0, value: [0, 1], label:"0-1 years"},
        {id: 1, value: [2, 5], label: "2-5 years"},
        {id: 2, value: [5, 10], label: "5-10 years"},
        {id: 3, value: [10, 100], label: "10 + years"},
    ]);


    function MyReactComponent(){
        return(
            <div>TESTING123</div>
        )
    }
    const filterJob = (job) => {
        var selected = true;        
        var tagBool = false;
        var roleBool = false;

        if (authContext.contractFilterFinal!==null && authContext.contractFilterFinal!==job.contract_type){
            selected = false;
        } else if (authContext.sizeFilterFinal!==null && (Number(authContext.sizeFilterFinal)!==Number(job.company_size) || job.company_size===null)){
            selected = false;
        } else if (authContext.locationFilterFinal!==null && doesStrIncludeArray(authContext.locationFilterFinal, job.location)===false){
            selected = false;
        } else if (authContext.searchFinal!==null && jobIncludeSearch(authContext.searchFinal, job)===false){
            selected = false;
        }  else if (authContext.tagFilterFinal!==null && doesStrIncludeArray(authContext.tagFilterFinal, job.tags)===false){
            selected = false;
        } else if (authContext.roleFilterFinal!==null && doesStrIncludeArray(authContext.roleFilterFinal, job.role)===false){
            selected = false;
        } else if (authContext.experienceFilterFinal!==null){
            if (job.experience_level === undefined){
                selected = false;
            } else{
                if (Number(job.experience_level) < authContext.experienceFilterFinal[0] || Number(job.experience_level) > authContext.experienceFilterFinal[1]){
                    selected = false;
                }
            }
            
        }

        return selected;

        var locationMatch = false;
    }

    const jobIncludeSearch = (str, job) =>{
        var bool = false;

        if (job.company_name.toLowerCase().includes(authContext.searchFinal.toLowerCase())){
            return true;
        } else if (job.job_title.toLowerCase().includes(authContext.searchFinal.toLowerCase())){
            return true;
        } else if (job.job_description.toLowerCase().includes(authContext.searchFinal.toLowerCase())){
            return true
        } else if (job.role.toLowerCase().includes(authContext.searchFinal.toLowerCase())){
            return true;
        } else if (job.contract_type.toLowerCase().includes(authContext.searchFinal.toLowerCase())){
            return true;
        } else if (job.location.toLowerCase().includes(authContext.searchFinal.toLowerCase())){
            return true;
        } else if (job.tags.toLowerCase().includes(authContext.searchFinal.toLowerCase())){
            return true;
        } 
        return false;
    }

    const setJob = async (job) =>{
        setLoading(true);
        setCompanyName(job.company_name);
        setJobTitle(job.job_title);
        setJobDescription(job.job_description);
        setCompanyLogo(job.company_logo_url);
        setRole(job.role);
        setContractType(job.contract_type);
        setJobLocation(job.location)
        setCompanySize(job.company_size);
        setTags(job.tags);
        setMinYearlySalary(job.min_yearly_salary);
        setMaxYearlySalary(job.max_yearly_salary);
        setApplyBy(job.apply_by);
        setCreatedOn(job.created_on.seconds)
        setApplicationEmail(job.application_email);
        setApplicationWebsite(job.application_website); 
        var myDiv = document.getElementsByClassName('content')[0].scrollIntoView(false, { behavior: 'smooth', block: 'start' })
        await new Promise(resolve => setTimeout(resolve, 400))
        setLocalStorage(job);
        setLoading(false);
        // myDiv.innerHTML = variableLongText;
        // myDiv.scrollTop = -100

    //     $('html, body').animate({
    //     scrollTop: $("job-page-title").offset().top
    // }, 1000);
        
    }

    const setLocalStorage = (job) =>{
        localStorage.setItem(`${job.id}-company-name`, job.company_name);
        localStorage.setItem(`${job.id}-job-title`, job.job_title);
        localStorage.setItem(`${job.id}-job-description`, job.job_description);
        localStorage.setItem(`${job.id}-company-logo-url`, job.company_logo_url);
        localStorage.setItem(`${job.id}-role`, job.role);
        localStorage.setItem(`${job.id}-contract-type`, job.contract_type);
        localStorage.setItem(`${job.id}-location`, job.location);
        localStorage.setItem(`${job.id}-tags`, job.tags);
        localStorage.setItem(`${job.id}-min-yearly-salary`, job.min_yearly_salary);
        localStorage.setItem(`${job.id}-max-yearly-salary`, job.max_yearly_salary);
        localStorage.setItem(`${job.id}-apply-by`, job.apply_by);
        localStorage.setItem(`${job.id}-application-email`, job.application_email);
        localStorage.setItem(`${job.id}-application-website`, job.application_website);
        localStorage.setItem(`${job.id}-company-size`, job.company_size);
        localStorage.setItem(`${job.id}-created-on`, job.created_on.seconds);
    }
    const doesStrInclude = (ele, str) => {
        var bool = false;
        str.toLowerCase().split(',').map((e, i)=>{
            if (String(ele) === String(e).trim()){
                bool = true;
            }
        })
        return bool;
    }

    const handleChangeMultiple = async (e, setValueFunction, setFunction) => {
        authContext.setFilteringBool(true);
        var myDiv = document.getElementsByClassName('content')[0].scrollIntoView(false, { behavior: 'smooth', block: 'start' });
        authContext.setPage(1);
        setValueFunction(e);
        var tagTemp = [];
        e.map((val, i)=>{
            tagTemp.push(val.value)
        })
        if (tagTemp.length === 0){
            setFunction(null);
        } else{
            setFunction(tagTemp);
        }
        await new Promise(resolve => setTimeout(resolve, 400))

        authContext.setFilteringBool(false);

    }

    const handleChangeSingle = async (e, setValueFunction, setFunction) => {
        authContext.setFilteringBool(true);
        var myDiv = document.getElementsByClassName('content')[0].scrollIntoView(false, { behavior: 'smooth', block: 'start' })
        authContext.setPage(1);
        setValueFunction(e);
        if (e.value === "None"){
            setFunction(null);
        } else{
            setFunction(e.value);
        }
        await new Promise(resolve => setTimeout(resolve, 400))

        authContext.setFilteringBool(false);

    }

    const doesStrIncludeArray = (arr, str) => {
        var bool = false;
        arr.map((ele, i)=>{
            if (str.toLowerCase().includes(String(ele).toLowerCase())===true){
                bool = true;
            }
        })
        return bool;
    }

        const handleClearFilter = async () =>{
        authContext.setFilteringBool(true);
        var myDiv = document.getElementsByClassName('content')[0].scrollIntoView(false, { behavior: 'smooth', block: 'start' })
        authContext.setPage(1);
        authContext.setContractFilterFinal(null);
        authContext.setLocationFilterFinal(null);
        authContext.setTagFilterFinal(null);
        authContext.setSizeFilterFinal(null);
        authContext.setRoleFilterFinal(null);
        authContext.setExperienceFilterFinal(null);
        authContext.setContractFilterFinalObject(null);
        authContext.setLocationFilterFinalObject(null);
        authContext.setTagFilterFinalObject(null);
        authContext.setSizeFilterFinalObject(null);
        authContext.setRoleFilterFinalObject(null);
        authContext.setExperienceFilterFinalObject(null);
        await new Promise(resolve => setTimeout(resolve, 400))

        

        authContext.setFilteringBool(false);
    }

    const [roles, setRoles] = useState([
        {id: 0, value: "Design", label:"Design"},
        {id: 1, value: "Engineering", label: "Engineering"},
        {id: 2, value: "Finance", label: "Finance"},
        {id: 3, value: "Founder", label: "Founder"},
        {id: 4, value:  "Growth", label:  "Growth"},
        {id: 5, value: "Human Resources", label:"Human Resources" },
        {id: 6, value: "Investment", label: "Investment"},
        {id: 7, value: "Management", label:"Management" },
        {id: 8, value: "Marketing", label:"Marketing" },
        {id: 9, value: "Operations", label: "Operations"},
        {id: 10, value: "Product", label: "Product"},
        {id: 11, value: "Sales", label: "Sales"},
        {id: 12, value: "Other", label: "Other"}
    ]);

    const [contracts, setContracts] = useState([
        {id: 0, value: "Full-time", label:"Full-time"},
        {id: 1, value: "Part-time", label: "Part-time"},
        {id: 2, value: "Contract", label: "Contract"},
        {id: 3, value: "Internship", label: "Internship"},
        {id: 4, value: "None", label: "No filter"},
    ]);

    const [sizes, setSizes] = useState([
        {id: 0, value: 0, label:"1-10"},
        {id: 1, value: 1, label: "11-50"},
        {id: 2, value: 2, label: "51-100"},
        {id: 3, value: 3, label: "101-500"},
        {id: 4, value: 4, label: "501-1000"},
        {id: 5, value: 5, label: "1000+"},
        {id: 6, value: "None", label: "No filter"},
    ]);

    const customStyles = {
        control: (provided, state) => ({
        ...provided,
        background: 'black',
        borderColor: '#9e9e9e',
        minHeight: '28px',
        height: '28px',
        display: 'flex',
        flexWrap: 'wrap',
        overflowY: 'scroll',
        color: 'white',
        boxShadow: state.isFocused ? null : null,
        }),

        option: (provided, state) => ({
            ...provided,
            background: state.isSelected ? 'rgb(56, 112, 154)' : 'transparent',
            background: state.isFocused ? 'lightGray' : 'transparent',
            color: 'black',
            textTransform: 'capitalize',
    
        }),

        multiValue: (provided, state) => ({
            ...provided,
            float: 'left',
            background: 'gray',
            color: 'white'
        }),

        valueContainer: (provided, state) => ({
        ...provided,
        padding: '2px 2px',
        float: 'left',
        display: 'flex',
        flexWrap: 'wrap',
        color: 'white',
        textTransform: 'capitalize'
        }),



        

        input: (provided, state) => ({
        ...provided,
        margin: '0px',
        color: 'white'
        }),
        indicatorSeparator: state => ({
        display: 'none',
        }),
        indicatorsContainer: (provided, state) => ({
        ...provided,
        height: '28px',
        }),
    };






    return (

            <div className = "content">
                
                <div className = 'top-filter-wrapper'>
                <div className = 'top-filter'>
                    
                            
                        {/* <div style={{color: 'rgb(61, 184, 158)', fontWeight: 'bold'}} for="contract" className = 'chosen-select'>Tags:</div>

                        <select  multiple="multiple"  onChange={(e)=>{handleChange(e)}} value={authContext.tagFilterFinal === null ? '' : authContext.tagFilterFinal} className = 'dropdown' name="tag" id="tag" placeholder='Tag type'>
                            <option value="None">None</option>
                            {
                            
                            
                            authContext.tagFilter.map((t, i)=>{
                                return(
                                    <option key={i} value={t} >{t.slice(0,1).toUpperCase()+t.slice(1)}</option>
                                )

                            })}
                        </select> */}
                        {authContext.tagFilter.map((tag, i)=>{
                            options.push({id: String(i), value: tag, label: tag.slice(0,1).toUpperCase() + tag.slice(1).toLowerCase()});
                        })}

                        {authContext.locationFilter.map((location, i)=>{
                            locationOptions.push({id: String(i), value: location, label: location.slice(0,1).toUpperCase() + location.slice(1).toLowerCase()});
                        })}

                        <div className = 'react-select-wrapper'>
                        <div for="contract" className = 'dropdown-label'>Experience level:</div>
                        <Select
                            value={authContext.experienceFilterFinalObject} 
                            className = 'select-dropdown' 
                            onChange={(e)=>handleChangeSingle(e, authContext.setExperienceFilterFinalObject, authContext.setExperienceFilterFinal)}
                            options={experienceLevel}
                            isMulti={false}
                            styles={customStyles}
                            label={'Tags'}


                        />
                        </div>

                        
                        <div className = 'react-select-wrapper'>
                        <div for="contract" className = 'dropdown-label'>Tags/Skills:</div>
                        <Select
                            value={authContext.tagFilterFinalObject} 
                            className = 'select-dropdown' 
                            onChange={(e)=>handleChangeMultiple(e, authContext.setTagFilterFinalObject, authContext.setTagFilterFinal)}
                            options={options}
                            isMulti={true}
                            styles={customStyles}
                            label={'Tags'}


                        />
                        </div>


                        <div className = 'react-select-wrapper'>
                        <div for="contract" className = 'dropdown-label'>Roles:</div>
                         <Select
                            value={authContext.roleFilterFinalObject} 
                            className = 'select-dropdown' 
                            onChange={(e)=>handleChangeMultiple(e, authContext.setRoleFilterFinalObject, authContext.setRoleFilterFinal)}
                            options={roles}
                            styles={customStyles}
                            isMulti={true}
                        />
                        </div>

                        <div className = 'react-select-wrapper'>
                        <div for="contract" className = 'dropdown-label'>Job type:</div>
                         <Select
                            value={authContext.contractFilterFinalObject} 
                            className = 'select-dropdown' 
                            onChange={(e)=>handleChangeSingle(e, authContext.setContractFilterFinalObject, authContext.setContractFilterFinal)}
                            options={contracts}
                            styles={customStyles}
                            isMulti={false}
                        />
                        </div>

                        <div className = 'react-select-wrapper'>
                        <div for="contract" className = 'dropdown-label'>Company size:</div>
                         <Select
                            value={authContext.sizeFilterFinalObject} 
                            className = 'select-dropdown' 
                            onChange={(e)=>handleChangeSingle(e, authContext.setSizeFilterFinalObject, authContext.setSizeFilterFinal)}
                            options={sizes}
                            styles={customStyles}
                            isMulti={false}
                        />
                        </div>

                        <div className = 'react-select-wrapper'>
                        <div for="contract" className = 'dropdown-label'>Location:</div>
                         <Select
                            value={authContext.locationFilterFinalObject} 
                            className = 'select-dropdown' 
                            onChange={(e)=>handleChangeMultiple(e, authContext.setLocationFilterFinalObject, authContext.setLocationFilterFinal)}
                            options={locationOptions}
                            styles={customStyles}
                            isMulti={true}
                        />
                        </div>

                        <div>  <Link className = 'back' onClick={()=> {authContext.setFilteringBool(true); authContext.setPage(1)}} to='/'>{`Back to jobs`}</Link> </div>

                        <div className = 'submit-filter'  onClick={()=>{handleClearFilter()}}>
                           Reset filters</div>
                        
                       

                    

                       


                    </div>   
                    </div>


                <div className = 'job-details-page'> 


                 {loading ? <div className = 'loader'></div> : 

                <div className = 'job-page-right' id='job-page-right'>

                                    
                    <div className = 'job-header-info'>
                        <div className = 'job-page-logo-container'>
                            <img className = 'job-page-logo' src={companyLogo}/>
                        </div>
                        <div className = 'job-page-header-details'>
                            <div className = 'job-page-title' id = 'job-page-title'>{jobTitle}</div> <br/>
                            <div className = 'job-page-name'>{companyName}</div> <br/>
                        </div>
                        <a href={applyBy === 'website' ? `${applicationWebsite}` : `mailto:${applicationEmail}`} target="_blank">
                            <div className = 'apply-button'>
                                Apply Now
                            </div>
                        </a>
                    <div className = 'details-half-container'>
                    <div className = 'details-half'>
                        <div className='job-page-deets'><div className='job-page-inner-1'>📍 </div><div className='job-page-inner'>{jobLocation}</div></div>
                        <div className='job-page-deets'><div className='job-page-inner-1'>⏱  </div><div className='job-page-inner'>{contractType}</div></div>
                    </div>

                    <div className = 'details-half'>
                        {role === '' ? null : 
                        <div className='job-page-deets'><div className='job-page-inner-1'>💼  </div><div className='job-page-inner'>{role}</div></div> }
                        {tags === '' ? null : 
                        <div className='job-page-deets'><div className='job-page-inner-1'>🏷  </div><div className='job-page-inner'>{tags}</div></div> }
                    </div>
                    </div>
                        
                    </div>

                    <div className = 'job-page-line'></div>
                    
                   
                    <ReactMarkdown className = 'job-page-details' children={jobDescription}/>
                    <br/>

                    {Number(minYearlySalary) <= 0 && Number(maxYearlySalary) <= 0 ? null : Number(minYearlySalary) <= 0 ? 
                    <div className = 'job-page-compensation'>
                        Compensation Estimate:
                        <div className = 'estimate'>{currencyFormat(maxYearlySalary)}</div>
                    </div> : maxYearlySalary === 0 ? 
                    <div className = 'job-page-compensation'>
                        Compensation Estimate:
                        <div className = 'estimate'>{currencyFormat(minYearlySalary)}</div>
                    </div> : 
                    <div className = 'job-page-compensation'>
                        Compensation Estimate:
                        <div className = 'estimate'> {currencyFormat(minYearlySalary)} - {currencyFormat(maxYearlySalary)}</div>
                    </div>}

                    {companySize !== null ? <div className = 'job-page-compensation'>
                        Company Size:
                        <div className = 'estimate'>{companySizes[Number(companySize)]}</div>
                    </div> : null}

                    <div className = 'job-page-compensation'>
                        Posted On:
                        <div className = 'estimate'>{new Date(createdOn*1000).toLocaleDateString()}</div>
                    </div>

                     <a  href={applyBy === 'website' ? `${applicationWebsite}` : `mailto:${applicationEmail}`} target="_blank">
                        <div className = 'apply-button-bottom'>
                            Apply Now
                        </div>
                    </a>
                    </div> }

                </div>   

                {authContext.filteringBool ? <div className = 'job-page-left'>

                    {[1,2,3,4,5,6,7,8,9,10].map((ele, i)=>{
                        return (
                             <div  key={i} className = 'loading-job-wrapper'>
                                    <div  className = 'loading-job' key={i}>
                                </div>
                            </div>
                        )
                    })}
                </div>  :    
                
                <div className = 'job-page-left'>

                    {authContext.jobs.map((job, i)=>{
                        if (filterJob(job) === true){
                            jobNumber += 1;

                            if (jobNumber <= authContext.page*20){
                                displayedJobNumber +=1;
                                if (job.job_title === jobTitle && job.company_name === companyName){
                                    return (
                                    <div  key={i} className = 'job-page-container-selected'>
                                        <div  className = 'job-page-job-selected' key={i}>
                                            <div className = 'img-container-page'>
                                                <img className = 'company-logo-page' src={job['company_logo_url']}/>
                                            </div> 
                                            <div className = 'company-info-page'>
                                                <div className = 'job-title-page'> {job["job_title"]} </div>
                                                <div className = 'company-name-page'>{job["company_name"]}</div>
                                                <div className = 'location-page'>{job["location"].slice(0,1).toUpperCase()+job["location"].slice(1)} - </div>
                                                <div className = 'location-page'>  {job["contract_type"]}</div>

                                            </div>

                                            
                                            
                                        </div>
                                    </div>
                                    )
                                } else {
                                    return (
                                        <Link  key={i} className = 'job-page-container' to={
                                            {
                                                pathname: "/jobdetails",
                                                search: `${job.id}`
                                            }
                                            
                                        }
                                        onClick={()=> setJob(job)}>
                                            <div  className = 'job-page-job' key={i}>
                                                <div className = 'img-container-page'>
                                                    <img className = 'company-logo-page' src={job['company_logo_url']}/>
                                                </div> 
                                                <div className = 'company-info-page'>
                                                    <div className = 'job-title-page'> {job["job_title"]} </div>
                                                    <div className = 'company-name-page'>{job["company_name"]}</div>
                                                    <div className = 'location-page'>{job["location"].slice(0,1).toUpperCase()+job["location"].slice(1)} - </div>
                                                    <div className = 'location-page'>  {job["contract_type"]}</div>

                                                </div>

                                                
                                                
                                            </div>
                                        </Link>
                                    )
                                }                                

                            }
                            
                            
                        }
                        
                    })}
            {jobNumber > displayedJobNumber ? 
                <div className = 'see-more' onClick={async ()=>{
                    setLoadMore(true);
                    await new Promise((resolve)=>setTimeout(resolve, 300));
                    authContext.setPage(authContext.page+1);
                    setLoadMore(false)}}> 
                    
                    {loadMore ? <div>Loading...</div>: <div>See More</div>}  </div> : null
            }

            {/* {jobNumber!== 0 ? <div>{Math.ceil(jobNumber/2)}</div> : null} */}

            {jobNumber === 0 ? <div className = 'no-jobs'>We're sorry, no jobs match your filter criteria. <br/> Please adjust your filter settings to see more postings.</div> : null}
                    
                </div> }

               
            
            </div>
    );


}
