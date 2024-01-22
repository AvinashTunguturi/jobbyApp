import {Component} from 'react'
import Loader from 'react-loader-spinner'
import {BsSearch} from 'react-icons/bs'

import Cookies from 'js-cookie'

import JobDetailsCard from '../JobDetailsCard'
import Header from '../Header'

import ProfileDetails from '../ProfileDetails'
import './index.css'

// These are the lists used in the application. You can move them to any component needed.
const employmentTypesList = [
  {
    label: 'Full Time',
    employmentTypeId: 'FULLTIME',
  },
  {
    label: 'Part Time',
    employmentTypeId: 'PARTTIME',
  },
  {
    label: 'Freelance',
    employmentTypeId: 'FREELANCE',
  },
  {
    label: 'Internship',
    employmentTypeId: 'INTERNSHIP',
  },
]

const salaryRangesList = [
  {
    salaryRangeId: '1000000',
    label: '10 LPA and above',
  },
  {
    salaryRangeId: '2000000',
    label: '20 LPA and above',
  },
  {
    salaryRangeId: '3000000',
    label: '30 LPA and above',
  },
  {
    salaryRangeId: '4000000',
    label: '40 LPA and above',
  },
]

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class Jobs extends Component {
  state = {
    apiStatus: apiStatusConstants.initial,
    jobsDetails: [],
    checkListSelected: [],
    salaryRangeSelected: '',
    search: '',
  }

  componentDidMount() {
    this.getJobsData()
  }

  getJobsData = async () => {
    this.setState({
      apiStatus: apiStatusConstants.inProgress,
    })

    const {checkListSelected, salaryRangeSelected, search} = this.state

    const jwtToken = Cookies.get('jwt_token')

    const apiUrl = `https://apis.ccbp.in/jobs?employment_type=${checkListSelected}&minimum_package=${salaryRangeSelected}&search=${search}`

    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(apiUrl, options)

    if (response.ok === true) {
      const fetchedData = await response.json()

      const formattedJobsDetails = fetchedData.jobs.map(jobDetails => ({
        companyLogoUrl: jobDetails.company_logo_url,
        employmentType: jobDetails.employment_type,
        id: jobDetails.id,
        jobDescription: jobDetails.job_description,
        location: jobDetails.location,
        packagePerAnnum: jobDetails.package_per_annum,
        rating: jobDetails.rating,
        title: jobDetails.title,
      }))
      this.setState({
        jobsDetails: formattedJobsDetails,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  onChangeCheckedStatus = event => {
    const selectedStatus = event.target.checked
    const {checkListSelected} = this.state
    const selectedId = event.target.id
    if (selectedStatus) {
      this.setState(
        {
          checkListSelected: [...checkListSelected, selectedId],
        },
        this.getJobsData,
      )
    } else {
      const updatedCheckList = checkListSelected.filter(id => id !== selectedId)

      this.setState(
        {
          checkListSelected: updatedCheckList,
        },
        this.getJobsData,
      )
    }
  }

  onChangeSalaryRange = event => {
    this.setState(
      {
        salaryRangeSelected: event.target.id,
      },
      this.getJobsData,
    )
  }

  onChangeSearchValue = event => {
    this.setState({
      search: event.target.value,
    })
  }

  onClickSearchIcon = () => {
    this.getJobsData()
  }

  renderEmploymentTypeList = () => (
    <div className="jobs-types-container">
      <h1 className="jobs-types__heading">Type of Employment</h1>
      <ul className="check-list-container">
        {employmentTypesList.map(choice => (
          <li className="check-list-item" key={choice.employmentTypeId}>
            <input
              type="checkbox"
              className="check-input"
              id={choice.employmentTypeId}
              onChange={this.onChangeCheckedStatus}
            />
            <label htmlFor={choice.employmentTypeId} className="job-type-label">
              {choice.label}
            </label>
          </li>
        ))}
      </ul>
    </div>
  )

  renderSalaryRange = () => (
    <div className="jobs-salary-range-container">
      <h1 className="jobs-salary__heading">Salary Range</h1>
      <ul className="radio-list-container">
        {salaryRangesList.map(choice => (
          <li className="radio-list-item" key={choice.salaryRangeId}>
            <input
              type="radio"
              className="radio-input"
              id={choice.salaryRangeId}
              onChange={this.onChangeSalaryRange}
              name="salary-range"
            />
            <label htmlFor={choice.salaryRangeId} className="job-salary-label">
              {choice.label}
            </label>
          </li>
        ))}
      </ul>
    </div>
  )

  renderLoadingView = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  renderNoJobsView = () => (
    <div className="jobs-details-no-jobs-view-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/no-jobs-img.png "
        alt="no jobs"
        className="no-job-img"
      />
      <h1 className="no-jobs__heading">No Jobs Found</h1>
      <p className="no-jobs__description">
        We could not find any jobs. Try other filters.
      </p>
    </div>
  )

  onClickRetry = () => this.getJobsData()

  renderFailureView = () => (
    <div className="jobs-details-failure-view-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        alt="failure view"
        className="failure-img"
      />
      <h1 className="failure-view__heading">Oops! Something Went Wrong </h1>
      <p className="failure-view__description">
        We cannot seem to find the page you are looking for
      </p>
      <div className="retry-button-container">
        <button
          type="button"
          className="retry-button"
          onClick={this.onClickRetry}
        >
          Retry
        </button>
      </div>
    </div>
  )

  renderJobsDetailCard = () => {
    const {jobsDetails} = this.state
    const areNoJobs = jobsDetails.length === 0

    return (
      <>
        {areNoJobs ? (
          this.renderNoJobsView()
        ) : (
          <ul className="jobs-details-cards-container">
            {jobsDetails.map(eachJobDetails => (
              <JobDetailsCard
                eachJobDetails={eachJobDetails}
                key={eachJobDetails.id}
              />
            ))}
          </ul>
        )}
      </>
    )
  }

  renderAllJobsDetailsView = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderJobsDetailCard()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      case apiStatusConstants.inProgress:
        return this.renderLoadingView()
      default:
        return null
    }
  }

  renderSearchContainerForSmallDevices = () => (
    <div className="jobs-input-search-sm-container">
      <input
        type="search"
        className="input-container"
        placeholder="Search"
        onChange={this.onChangeSearchValue}
      />
      <button
        type="button"
        className="search-button"
        onClick={this.onClickSearchIcon}
        data-testid="searchButton"
      >
        <BsSearch className="search-icon" />
      </button>
    </div>
  )

  renderSearchContainerForLargeDevices = () => (
    <div className="jobs-input-search-lg-container">
      <input
        type="search"
        className="input-container"
        placeholder="Search"
        onChange={this.onChangeSearchValue}
      />
      <button
        type="button"
        className="search-button"
        onClick={this.onClickSearchIcon}
        data-testid="searchButton"
      >
        <BsSearch className="search-icon" />
      </button>
    </div>
  )

  render() {
    return (
      <>
        <Header />
        <div className="jobs-container">
          <div className="jobs-profile-options-container">
            {this.renderSearchContainerForSmallDevices()}
            <ProfileDetails />
            <hr className="h-line" />
            {this.renderEmploymentTypeList()}
            <hr className="h-line" />
            {this.renderSalaryRange()}
          </div>
          <div className="jobs-result-container">
            {this.renderSearchContainerForLargeDevices()}
            {this.renderAllJobsDetailsView()}
          </div>
        </div>
      </>
    )
  }
}

export default Jobs
