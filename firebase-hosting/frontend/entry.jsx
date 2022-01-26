import React, { useContext, useState, useMemo, useEffect} from 'react';
import ReactDOM from 'react-dom';
// import {Firebase, db} from '../../config/firebase';
import App from './components/app'
import {HashRouter} from 'react-router-dom'
import AuthContext from '../context/Context'
import {Firebase, db, functions} from '../config/firebase';
import Header from './components/header'
import Footer from './components/footer'
import 'babel-polyfill';

function Root() {
    // Declare a new state variable, which we'll call "count"
    const [count, setCount] = useState(0);
    const [jobs, setJobs] = useState([]);
    const [roleFilter, setRoleFilters] = useState([]);
    const [tagFilter, setTagFilters] = useState([]);
    const [locationFilter, setLocationFilters] = useState([]);

    const [roleFilterFinal, setRoleFilterFinal] = useState(null);
    const [contractFilterFinal, setContractFilterFinal] = useState(null);
    const [locationFilterFinal, setLocationFilterFinal] = useState(null);
    const [tagFilterFinal, setTagFilterFinal] = useState(null);
    const [sizeFilterFinal, setSizeFilterFinal] = useState(null);
    const [experienceFilterFinal, setExperienceFilterFinal] = useState(null);

    const [search, setSearch] = useState('');
    const [searchFinal, setSearchFinal] = useState('')
    const [filteringBool, setFilteringBool] = useState(true);
    const [loadingFirebase, setLoadingFirebase] = useState(true);

    const [tagFilterFinalObject, setTagFilterFinalObject] = useState([]);
    const [roleFilterFinalObject, setRoleFilterFinalObject] = useState([]);
    const [contractFilterFinalObject, setContractFilterFinalObject] = useState([]);
    const [sizeFilterFinalObject, setSizeFilterFinalObject] = useState([]);
    const [locationFilterFinalObject, setLocationFilterFinalObject] = useState([]);
    const [experienceFilterFinalObject, setExperienceFilterFinalObject] = useState(null);

    const [page, setPage] = useState(1);

    const getJobs = async () =>{
        const jobsDocs = await Firebase.firestore().collection('job postings').orderBy("created_on").get().then(async (jobsDocs)=>{
            const jobsDocsArray = jobsDocs.docs.reverse();
            const jobsTemp = []
            jobsDocsArray.map((job, i)=>{
                const jobTemp = job.data();
                jobTemp['id'] = job.id;
                jobsTemp.push(jobTemp);
            });

            setJobs(jobsTemp);
            await new Promise((resolve)=>setTimeout(resolve, 400))
            setFilteringBool(false);
            setLoadingFirebase(false);
        });
    }

    const getFilters = async () => {
      const tag_filters = await Firebase.firestore().collection('tag_filters').doc('tag_filters').get();
      const location_filters = await Firebase.firestore().collection('location_filters').doc('location_filters').get();
      setTagFilters(Object.keys(tag_filters.data()));
      setLocationFilters(Object.keys(location_filters.data()));
    }



    useEffect(async ()=>{
      getJobs();
      getFilters();

    }, [])

  return (
    <AuthContext.Provider value={{jobs, setJobs, roleFilter, setRoleFilters, tagFilter, setTagFilters, locationFilter, setLocationFilters,
    roleFilterFinal, setRoleFilterFinal, contractFilterFinal, setContractFilterFinal, locationFilterFinal, setLocationFilterFinal,
    tagFilterFinal, setTagFilterFinal, sizeFilterFinal, setSizeFilterFinal, search, setSearch, searchFinal, setSearchFinal, filteringBool, 
    setFilteringBool, tagFilterFinalObject, setTagFilterFinalObject, roleFilterFinalObject, setRoleFilterFinalObject, contractFilterFinalObject, setContractFilterFinalObject,
    sizeFilterFinalObject, setSizeFilterFinalObject, locationFilterFinalObject, setLocationFilterFinalObject, page, setPage, loadingFirebase, setLoadingFirebase,
    experienceFilterFinalObject, setExperienceFilterFinalObject, experienceFilterFinal, setExperienceFilterFinal

    
    
    
    
    
    }}>
      <HashRouter>
        <div className='wrap'>
          <Header/>
          <App/>
        </div>
      </HashRouter>
    </AuthContext.Provider>
  );
}

document.addEventListener('DOMContentLoaded', () => {
  ReactDOM.render(<Root/>, document.getElementById('main'));
});
