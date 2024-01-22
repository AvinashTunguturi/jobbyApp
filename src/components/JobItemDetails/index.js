import {Component} from 'react'
import Loader from 'react-loader-spinner'

import Cookies from 'js-cookie'

import {AiFillStar} from 'react-icons/ai'
import {FaMapMarkerAlt} from 'react-icons/fa'
import {BsBriefcaseFill} from 'react-icons/bs'
import {FiExternalLink} from 'react-icons/fi'

import Header from '../Header'

import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  inProgress: 'IN_PROGRESS',
  failure: 'FAILURE',
  success: 'SUCCESS',
}

class JobItemDetails extends Component {
  state = {
    apiStatus: apiStatusConstants.initial,
    jobItemDetails: {},
    similarJobs: [],
  }

  componentDidMount() {
    this.getJobItemDetails()
  }

  getJobItemDetails = async () => {
    this.setState({
      apiStatus: apiStatusConstants.inProgress,
    })
    const {match} = this.props
    const {params} = match
    const {id} = params

    const jwtToken = Cookies.get('jwt_token')
    const apiUrl = `https://apis.ccbp.in/jobs/${id}`
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(apiUrl, options)

    if (response.ok === true) {
      const fetchedData = await response.json()
      const jobDetails = fetchedData.job_details
      const jobItemDetails = {
        companyLogoUrl: jobDetails.company_logo_url,
        companyWebsiteUrl: jobDetails.company_website_url,
        employmentType: jobDetails.employment_type,
        id: jobDetails.id,
        jobDescription: jobDetails.job_description,
        location: jobDetails.location,
        packagePerAnnum: jobDetails.package_per_annum,
        rating: jobDetails.rating,
        title: jobDetails.title,
        skills: jobDetails.skills.map(eachSkill => ({
          imageUrl: eachSkill.image_url,
          name: eachSkill.name,
        })),
        lifeAtCompany: {
          description: jobDetails.life_at_company.description,
          imageUrl: jobDetails.life_at_company.image_url,
        },
      }

      const similarJobs = fetchedData.similar_jobs.map(eachJob => ({
        companyLogoUrl: eachJob.company_logo_url,
        employmentType: eachJob.employment_type,
        jobDescription: eachJob.job_description,
        location: eachJob.location,
        rating: eachJob.rating,
        title: eachJob.title,
        id: eachJob.id,
      }))

      this.setState({
        jobItemDetails,
        similarJobs,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({
        apiStatus: apiStatusConstants.failure,
      })
    }
  }

  retryJobItemDetails = () => this.getJobItemDetails()

  renderSkills = () => {
    const {jobItemDetails} = this.state
    const {skills} = jobItemDetails
    return (
      <>
        <h1 className="skill-heading">Skills</h1>
        <ul className="skill-container">
          {skills.map(eachSkill => (
            <li className="skill-list-item" key={eachSkill.name}>
              <img
                src={eachSkill.imageUrl}
                className="skill-image"
                alt={eachSkill.name}
              />
              <h1 className="skill-name">{eachSkill.name}</h1>
            </li>
          ))}
        </ul>
      </>
    )
  }

  renderLifeAtCompany = () => {
    const {jobItemDetails} = this.state
    const {lifeAtCompany} = jobItemDetails
    const {description, imageUrl} = lifeAtCompany
    return (
      <>
        <h1 className="life-at__heading">Life At Company</h1>
        <div className="life-at-company-container">
          <p className="life-at-company-description">{description}</p>
          <img
            src={imageUrl}
            alt="life at company"
            className="life-at-company-image"
          />
        </div>
      </>
    )
  }

  renderJobItemDetails = () => {
    const {jobItemDetails} = this.state
    const {
      companyLogoUrl,
      companyWebsiteUrl,
      employmentType,
      jobDescription,
      location,
      title,
      packagePerAnnum,
      rating,
    } = jobItemDetails
    return (
      <div className="jobs-details-card">
        <div className="jobs-details-container">
          <div className="jobs-details-logo-title-rating-container">
            <img
              src={companyLogoUrl}
              className="jobs-details__logo"
              alt="job details company logo"
            />
            <div className="jobs-details__title-container">
              <h1 className="jobs-details__title">{title}</h1>
              <div>
                <AiFillStar className="job-rating" />
                <p className="jobs-details__rating">{rating}</p>
              </div>
            </div>
          </div>
          <div className="jobs-details-location-type-package-container">
            <div className="jobs-details__location-type-container">
              <div className="jobs-details__location-container">
                <FaMapMarkerAlt />
                <p className="jobs-details__location">{location}</p>
              </div>
              <div className="jobs-details__location-container">
                <BsBriefcaseFill />
                <p className="jobs-details__type">{employmentType}</p>
              </div>
            </div>
            <p className="jobs-details__package">{packagePerAnnum}</p>
          </div>
          <hr />
          <div className="jobs-details__description-container">
            <div className="description-link-container">
              <h1 className="jobs-details__description__heading">
                Description
              </h1>
              <a href={companyWebsiteUrl} target="_blank" rel="noreferrer">
                <p>Visit</p>
                <FiExternalLink />
              </a>
            </div>
            <p className="jobs-details__description">{jobDescription}</p>
          </div>
        </div>
      </div>
    )
  }

  renderJobItemDetailsCard = () => (
    <div className="job-item-detail-card">
      {this.renderJobItemDetails()}
      {this.renderSkills()}
      {this.renderLifeAtCompany()}
    </div>
  )

  renderSimilarJobs = () => {
    const {similarJobs} = this.state

    return (
      <>
        <h1 className="similar-job-items-heading">Similar Jobs</h1>
        <ul className="similar-job-list-container">
          {similarJobs.map(eachJobItem => {
            const {
              companyLogoUrl,
              employmentType,
              jobDescription,
              location,
              rating,
              title,
              id,
            } = eachJobItem

            return (
              <li className="similar-job-list-item-container" key={id}>
                <div className="similar-job-logo-title-container">
                  <img
                    src={companyLogoUrl}
                    alt="similar job company logo"
                    className="similar-job-item-logo"
                  />
                  <div className="similar-job-title-rating-container">
                    <h1 className="similar-job-title">{title}</h1>
                    <p className="similar-job-title">{rating}</p>
                  </div>
                </div>
                <h1 className="similar-job-description__heading">
                  Description
                </h1>
                <p className="similar-job-description">{jobDescription}</p>
                <div className="similar-job-location-type-container">
                  <div>
                    <FaMapMarkerAlt className="react-icon" />
                    <p>{location}</p>
                  </div>
                  <div>
                    <BsBriefcaseFill className="react-icon" />
                    <p>{employmentType}</p>
                  </div>
                </div>
              </li>
            )
          })}
        </ul>
      </>
    )
  }

  renderJobItemDetailsView = () => (
    <>
      {this.renderJobItemDetailsCard()}
      {this.renderSimilarJobs()}
    </>
  )

  renderLoadingView = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  renderFailureView = () => (
    <div className="jobs-details-failure-view-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        alt="failure view"
        className="failure-img"
      />
      <h1 className="failure-view__heading">Oops! Something Went Wrong</h1>
      <p className="failure-view__description">
        We cannot seem to find the page you are looking for
      </p>
      <div className="retry-button-container">
        <button
          type="button"
          className="retry-button"
          onClick={this.retryJobItemDetails}
        >
          Retry
        </button>
      </div>
    </div>
  )

  renderAllJobItemDetailsViews = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderJobItemDetailsView()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      case apiStatusConstants.inProgress:
        return this.renderLoadingView()
      default:
        return null
    }
  }

  render() {
    return (
      <>
        <Header />
        <div className="job-item-details-container">
          {this.renderAllJobItemDetailsViews()}
        </div>
      </>
    )
  }
}

export default JobItemDetails
