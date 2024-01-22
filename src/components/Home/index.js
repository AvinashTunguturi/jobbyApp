import {Link} from 'react-router-dom'

import Header from '../Header'

import './index.css'

const Home = () => (
  <div className="app-home-container">
    <Header />
    <div className="home-description-container">
      <h1 className="app-purpose">Find The Job That Fits Your Life</h1>
      <p className="app-purpose-description">
        Millions of people are searching for jobs,salary information ,company
        reviews. Find the job that fits your abilities and potential
      </p>
      <Link to="/jobs">
        <button type="button" className="home-find-job-button">
          Find Jobs
        </button>
      </Link>
    </div>
  </div>
)

export default Home
