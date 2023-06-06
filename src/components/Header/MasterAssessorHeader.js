import React from 'react';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';
import 'core-js/fn/string/starts-with';
import { strings, translateString } from '../../utilities';
/**
 * Header component rendered for Master Assessor
 */
const MasterAssessorHeader = props => {
  const { firstName, lastName } = props;

  return (
    <ul className="header__list list list--inline">
      <li className="header__list-item">
        <NavLink
          to="/assessments"
          className={
            window.location.pathname === '/' ||
            window.location.pathname.startsWith('/assessments')
              ? 'active'
              : ''
          }
        >
          {translateString(strings.header.assessments)}
        </NavLink>
      </li>
      <li className="header__list-item">
        <NavLink to="/users">
          {translateString(strings.header.assessors)}
        </NavLink>
      </li>

      <li className="header__list-item">
        <NavLink to="/entities">
          {translateString(strings.header.entities)}
        </NavLink>
      </li>
      <li className="header__list-item">
        <NavLink to="/campaigns">
          {translateString(strings.header.campaigns)}
        </NavLink>
      </li>
      <li className="header__list-item">
        <NavLink to="/reports">
          {translateString(strings.header.reports)}
        </NavLink>
      </li>
      <li className="header__list-item">
        <NavLink to="/notifications">
          {translateString(strings.header.notifications)}
        </NavLink>
      </li>
      <li className="header__list-item">
        <span className="username">{`${firstName} ${lastName}`}</span>
        <small>{` (${translateString(strings.roles.masterAssessor)})`}</small>
      </li>
    </ul>
  );
};

MasterAssessorHeader.propTypes = {
  /** Master Assessor's first name. */
  firstName: PropTypes.string,
  /** Master Assessor's last name. */
  lastName: PropTypes.string,
  /** A function that changes the language of the application from English to Arabic and vice versa. */
  toggleLanguage: PropTypes.func,
};

export default MasterAssessorHeader;
