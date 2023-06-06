import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import {
  strings,
  translateString,
  ADMIN,
  MASTER_ASSESSOR,
  ASSESSOR,
  ENTITY_ADVISOR,
  ENTITY_COORDINATOR,
} from '../../utilities';
import { logoutUser } from '../../actions';
import AdminHeader from './AdminHeader';
import MasterAssessorHeader from './MasterAssessorHeader';
import EntityCoordinatorHeader from './EntityCoordinatorHeader';
import AssessorHeader from './AssessorHeader';
import EntityAdvisorHeader from './EntityAdvisorHeader';
import GenericHeader from './GenericHeader';

/**
 * A header component that renders the required header based on the role.
 */
class Header extends Component {
  getHeaderRole = role => {
    const { first_name: firstName, last_name: lastName } = this.props.userData;
    switch (role) {
      case ADMIN:
        return <AdminHeader firstName={firstName} lastName={lastName} />;
      case MASTER_ASSESSOR:
        return (
          <MasterAssessorHeader firstName={firstName} lastName={lastName} />
        );
      case ASSESSOR:
        return <AssessorHeader firstName={firstName} lastName={lastName} />;
      case ENTITY_ADVISOR:
        return (
          <EntityAdvisorHeader firstName={firstName} lastName={lastName} />
        );
      case ENTITY_COORDINATOR:
        return (
          <EntityCoordinatorHeader firstName={firstName} lastName={lastName} />
        );

      default:
        return (
          <GenericHeader
            firstName={firstName}
            lastName={lastName}
            role={role}
          />
        );
    }
  };
  render() {
    const { userRole: role, toggleLanguage } = this.props;
    return (
      <header className="header shadow-bottom clearfix">
        <div className="container header__wrapper">
          <Link to="/">
            <h1 className="header__logo">
              <span className="visually-hidden">
                {translateString(strings.title)}
              </span>
              <img
                alt="logo"
                src={`/assets/images/${
                  this.props.language === 'ar' ? 'logo-ar' : 'logo'
                }.png`}
              />
            </h1>
          </Link>
          <div className="header__actions-wrapper">
            {this.getHeaderRole(role)}
            <ul className="header__list list list--inline actions">
              <li className="header__list-item">
                <button
                  className="switch-language"
                  onClick={() => {
                    toggleLanguage();
                  }}
                >
                  {translateString(strings.language)}
                </button>
              </li>
              <li className="header__list-item">
                <button
                  className="logout button button--small button--primary"
                  onClick={() => {
                    this.props.logoutUser().then(() => {
                      sessionStorage.clear();
                      window.location.href = '/login';
                    });
                  }}
                >
                  {translateString(strings.header.logout)}
                </button>
              </li>
            </ul>
          </div>
        </div>
      </header>
    );
  }
}

function mapStateToProps(state) {
  return {
    ...state.flags,
  };
}
const mapDispatchToProps = {
  logoutUser,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Header);

Header.propTypes = {
  /** A function that ends the current user's session. */
  logoutUser: PropTypes.func,
  /** A function that changes the language of the application from English to Arabic and vice versa. */
  toggleLanguage: PropTypes.func,
  /** The current language of the application. */
  language: PropTypes.string,
  /** An object containing the current user's data (first name and last name). */
  userData: PropTypes.shape({
    first_name: PropTypes.string,
    last_name: PropTypes.string,
  }),
  /** The current user's role. */
  userRole: PropTypes.number,
};
