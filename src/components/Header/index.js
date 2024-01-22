import {Link, withRouter} from 'react-router-dom'

import Cookies from 'js-cookie'

import {MdHome} from 'react-icons/md'
import {BsBriefcaseFill} from 'react-icons/bs'

import {FiLogOut} from 'react-icons/fi'
import './index.css'

const Header = props => {
  const onClickLogout = () => {
    const {history} = props
    Cookies.remove('jwt_token')
    history.replace('/login')
  }
  return (
    <nav className="nav-container">
      <Link to="/">
        <img
          src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
          className="website-logo"
          alt="website logo"
        />
      </Link>
      <ul className="nav-mobile-links-container">
        <li className="nav-mobile-icon-button">
          <Link to="/">
            <MdHome className="home-icon" />
          </Link>
        </li>
        <li>
          <Link to="/jobs" className="nav-mobile-icon-button">
            <BsBriefcaseFill className="home-icon" />
          </Link>
        </li>
        <li>
          <button
            type="button"
            className="nav-mobile-icon-button"
            onClick={onClickLogout}
          >
            <FiLogOut className="home-icon" />
          </button>
        </li>
      </ul>

      <ul className="nav-lg-links-container">
        <li className="nav-lg-link">
          <Link to="/" className="nav-link">
            Home
          </Link>
        </li>
        <li className="nav-lg-link">
          <Link to="/jobs" className="nav-link">
            Jobs
          </Link>
        </li>
      </ul>

      <button
        type="button"
        className="nav-lg-logout-button"
        onClick={onClickLogout}
      >
        Logout
      </button>
    </nav>
  )
}

export default withRouter(Header)
