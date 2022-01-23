import React, { useContext, useState, useMemo, useEffect} from 'react';
import ReactDOM from 'react-dom';
import {Firebase, db, functions} from '../../config/firebase';
import { BrowserRouter as Router, Link } from 'react-router-dom';
import AuthContext from '../../context/Context';
import {AiOutlineSearch} from 'react-icons/ai'
import logo from '../../public/web3careers-gradient.png'
import {useLocation, withRouter} from 'react-router-dom';
import Footer from '../components/footer'

//import {Firebase, db} from '../config/firebase';
import Select from 'react-select'

import Newsletter from '../components/footer'
import { BsSlack } from 'react-icons/bs';

export default function Jobs() {
    const authContext = useContext(AuthContext);
    const [email, setEmail] = useState('')
    const [loadMore, setLoadMore] = useState(false);
    var jobNumber = 0;
    var displayedJobNumber = 0;
    var options = [];
    var locationOptions = [];
    const [roles, setRoles] = useState([
        {id: 0, value: "Design", label:"Design"},
        {id: 0, value: "Engineering", label: "Engineering"},
        {id: 0, value: "Finance", label: "Finance"},
        {id: 0, value: "Founder", label: "Founder"},
        {id: 0, value:  "Growth", label:  "Growth"},
        {id: 0, value: "Human Resources", label:"Human Resources" },
        {id: 0, value: "Investment", label: "Investment"},
        {id: 0, value: "Marketing", label:"Marketing" },
        {id: 0, value: "Operations", label: "Operations"},
        {id: 0, value: "Product", label: "Product"},
        {id: 0, value: "Sales", label: "Sales"},
        {id: 0, value: "Other", label: "Other"}
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
        display: 'flex',
        flexWrap: 'wrap',
        color: 'white',
        boxShadow: state.isFocused ? null : null,
        zIndex: 0
        }),

        option: (provided, state) => ({
            ...provided,
            background: state.isSelected ? 'rgb(56, 112, 154)' : 'transparent',
            background: state.isFocused ? 'lightGray' : 'transparent',
            color: 'black',
            zIndex: 0,
            textTransform: 'capitalize'
        }),

        multiValue: (provided, state) => ({
            ...provided,
            float: 'left',
            background: 'gray',
            color: 'white',
            zIndex: 0,
        }),

        valueContainer: (provided, state) => ({
        ...provided,
        padding: '2px 2px',
        float: 'left',
        display: 'flex',
        flexWrap: 'wrap',
        color: 'white',
        zIndex: 0,
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


    const handleClearFilter = async () =>{
        authContext.setFilteringBool(true);
        authContext.setPage(1)
        authContext.setContractFilterFinal(null);
        authContext.setLocationFilterFinal(null);
        authContext.setTagFilterFinal(null);
        authContext.setSizeFilterFinal(null);
        authContext.setRoleFilterFinal(null);

        authContext.setContractFilterFinalObject(null);
        authContext.setLocationFilterFinalObject(null);
        authContext.setTagFilterFinalObject(null);
        authContext.setSizeFilterFinalObject(null);
        authContext.setRoleFilterFinalObject(null);
        await new Promise(resolve => setTimeout(resolve, 400))
        authContext.setFilteringBool(false);
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
    }

    const handleChange = (event) => {
        let tagsTemp = Array.from(event.target.selectedOptions,
            (option) => option.value
        );
        if (tagsTemp[0]==='None'){
            authContext.setTagFilterFinal(null);
        } else{
            authContext.setTagFilterFinal(tagsTemp);
        }

        
        
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

    const doesStrIncludeArray = (arr, str) => {
        var bool = false;
        arr.map((ele, i)=>{
            if (str.toLowerCase().includes(String(ele).trim().toLowerCase())===true){
                bool = true;
            }
        })
        return bool;
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
        }

        return selected;

        var locationMatch = false;
    }

    const handleSelect = (event, setStateFunction) => {
        let tagsTemp = Array.from(event.target.selectedOptions,
            (option) => option.value
        );

        if (tagsTemp[0]==='None'){
            setStateFunction(null);
        } else{
            setStateFunction(tagsTemp[0])
        }
        


    }

    const handleChangeMultiple = async (e, setValueFunction, setFunction) => {
        authContext.setFilteringBool(true);
        authContext.setPage(1)
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
        authContext.setPage(1)
        setValueFunction(e);
        if (e.value === "None"){
            setFunction(null);
        } else{
            setFunction(e.value);
        }
        await new Promise(resolve => setTimeout(resolve, 400))
        authContext.setFilteringBool(false);

    }   

    useEffect(async () => {
        await new Promise((resolve)=>setTimeout(resolve, 300))
        authContext.setFilteringBool(false);
    }, [])




    return (
        <div className = "content">
            {/* <img className = 'logo' src={logo}/> */}
            
            
            <div className = 'jobs-wrapper'>
            
            <div className = 'jobs-left'>

                <div className = 'submit-filter-jobs' onClick={()=>{handleClearFilter()}}>Reset filters</div> <br/>

                {authContext.tagFilter.map((tag, i)=>{
                            options.push({id: String(i), value: tag, label: tag.slice(0,1).toUpperCase() + tag.slice(1).toLowerCase()});
                        })}

                        {authContext.locationFilter.map((location, i)=>{
                            locationOptions.push({id: String(i), value: location, label: location.slice(0,1).toUpperCase() + location.slice(1).toLowerCase()});
                        })}

                        
                        <div className = 'react-select-wrapper-jobs'>
                        <div for="contract" className = 'dropdown-label-jobs'>Tags:</div>
                        <Select
                            value={authContext.tagFilterFinalObject} 
                            className = 'select-dropdown-jobs' 
                            onChange={(e)=>handleChangeMultiple(e, authContext.setTagFilterFinalObject, authContext.setTagFilterFinal)}
                            options={options}
                            isMulti={true}
                            styles={customStyles}
                            label={'Tags'}


                        />
                        </div>


                        <div className = 'react-select-wrapper-jobs'>
                        <div for="contract" className = 'dropdown-label-jobs'>Roles:</div>
                         <Select
                            value={authContext.roleFilterFinalObject} 
                            className = 'select-dropdown-jobs' 
                            onChange={(e)=>handleChangeMultiple(e, authContext.setRoleFilterFinalObject, authContext.setRoleFilterFinal)}
                            options={roles}
                            styles={customStyles}
                            isMulti={true}
                        />
                        </div>

                        <div className = 'react-select-wrapper-jobs'>
                        <div for="contract" className = 'dropdown-label-jobs'>Job type:</div>
                         <Select
                            value={authContext.contractFilterFinalObject} 
                            className = 'select-dropdown-jobs' 
                            onChange={(e)=>handleChangeSingle(e, authContext.setContractFilterFinalObject, authContext.setContractFilterFinal)}
                            options={contracts}
                            styles={customStyles}
                            isMulti={false}
                        />
                        </div>

                        <div className = 'react-select-wrapper-jobs'>
                        <div for="contract" className = 'dropdown-label-jobs'>Company size:</div>
                         <Select
                            value={authContext.sizeFilterFinalObject} 
                            className = 'select-dropdown-jobs' 
                            onChange={(e)=>handleChangeSingle(e, authContext.setSizeFilterFinalObject, authContext.setSizeFilterFinal)}
                            options={sizes}
                            styles={customStyles}
                            isMulti={false}
                        />
                        </div>

                        <div className = 'react-select-wrapper-jobs'>
                        <div for="contract" className = 'dropdown-label-jobs'>Location:</div>
                         <Select
                            value={authContext.locationFilterFinalObject} 
                            className = 'select-dropdown-jobs' 
                            onChange={(e)=>handleChangeMultiple(e, authContext.setLocationFilterFinalObject, authContext.setLocationFilterFinal)}
                            options={locationOptions}
                            styles={customStyles}
                            isMulti={true}
                        />
                        </div>



            </div> 
            <div className = 'jobs-right-wrapper'>
            {authContext.filteringBool ? 
            <div className = 'jobs-right'>
                {[1,2,3,4,5,6,7,8,9,10].map((ele, i)=>{
                    return(
                        <div className = 'job-container-loading'>
                            <div className = 'job-loading'></div>
                        </div>
                    )
                })}
            </div>:
            <div className = 'jobs-right'>
            {authContext.jobs.map((job, i)=>{

                if (filterJob(job) === true){
                    jobNumber += 1;

                    if (jobNumber<= authContext.page*20){
                        displayedJobNumber +=1;
                        return (
                        <Link  key={i} className = 'job-container' to={
                            {
                                pathname: "/jobdetails",
                                search: `${job.id}`
                            }
                            
                        }
                        onClick={()=> setLocalStorage(job)}>
                            <div  className = 'job' key={i}>
                                <div className = 'img-container'>
                                    <img className = 'company-logo' src={job['company_logo_url']}/>
                                </div> 
                                <div className = 'company-info'>
                                    <div className = 'job-title'> {job["job_title"]} </div>
                                    <div className = 'company-name'>{job["company_name"]}</div>
                                    <div className = 'location'>{job["location"].slice(0,1).toUpperCase()+job["location"].slice(1)}</div>
                                    <div className = 'location'>{job["contract_type"]}</div>

                                </div>

                                
                                
                            </div>
                        </Link>
                        )                    }
                    
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
            </div>}
             </div>
            </div>
          <Footer/>
            </div>
    );
}