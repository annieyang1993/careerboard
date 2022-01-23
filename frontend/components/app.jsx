import React, { useContext, useState, useMemo, useEffect} from 'react';

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  HashRouter
} from "react-router-dom";

import JobsContainer from '../pages/jobs'
import NewsletterContainer from '../pages/newsletter'
import PostJobContainer from '../pages/jobpost'
import JobDetailsContainer from '../pages/jobpage'

export default function App() {
    const [test, setTest] = useState('');
  return (
      <div className='app'>
        {/* A <Switch> looks through its children <Route>s and
            renders the first one that matches the current URL. */}
        <Switch>
          <Route exact path="/">
              <JobsContainer/>
            </Route>
          <Route path="/newsletter">
              <NewsletterContainer/>
          </Route>
          <Route path="/postjob">
              <PostJobContainer/>
          </Route>
          <Route path="/jobdetails" component={JobDetailsContainer} render={props => 
            <JobDetailsContainer {...props}/>
            }>
              
          </Route>
        </Switch>
        </div>

  );
}


