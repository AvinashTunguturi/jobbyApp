import {Link} from 'react-router-dom'
import {AiFillStar} from 'react-icons/ai'
import {FaMapMarkerAlt} from 'react-icons/fa'
import {BsBriefcaseFill} from 'react-icons/bs'

import './index.css'

const JobDetailsCard = props => {
  const {eachJobDetails} = props
  const {
    companyLogoUrl,
    employmentType,
    id,
    jobDescription,
    location,
    packagePerAnnum,
    rating,
    title,
  } = eachJobDetails

  return (
    <Link to={`/jobs/${id}`}>
      <li className="jobs-details-card">
        <div className="jobs-details-container">
          <div className="jobs-details-logo-title-rating-container">
            <img
              src={companyLogoUrl}
              className="jobs-details__logo"
              alt="company logo"
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
            <h1 className="jobs-details__description__heading">Description</h1>
            <p className="jobs-details__description">{jobDescription}</p>
          </div>
        </div>
      </li>
    </Link>
  )
}

export default JobDetailsCard
