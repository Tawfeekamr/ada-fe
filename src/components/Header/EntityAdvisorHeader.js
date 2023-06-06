import React from 'react';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';
import 'core-js/fn/string/starts-with';
import { strings, translateString } from '../../utilities';
/**
 * Header component rendered for Entity Advisor
 */
const EntityAdvisorHeader = props => {
  const { firstName, lastName } = props;
  return (
    <ul className="header__list list list--inline">
      <li className="header__list-item">
        <NavLink
          to="/assessment"
          className={
            window.location.pathname === '/' ||
            window.location.pathname.startsWith('/campaigns')
              ? 'active'
              : ''
          }
        >
          {translateString(strings.header.assessments)}
        </NavLink>
      </li>
      <li className="header__list-item">
        <NavLink to="/entities">
          {translateString(strings.header.entities)}
        </NavLink>
      </li>
      <li className="header__list-item">
        <NavLink to="/campaign">
          {translateString(strings.header.activeCampaigns)}
        </NavLink>
      </li>
      <li className="header__list-item">
        <NavLink to="/reports">
          {translateString(strings.header.reports)}
        </NavLink>
      </li>
      <li className="header__list-item">
        <span className="username">{`${firstName} ${lastName}`}</span>
        <small>{` (${translateString(strings.roles.advisor)})`}</small>
      </li>
    </ul>
  );
};

EntityAdvisorHeader.propTypes = {
  /** Entity Advisor's first name. */
  firstName: PropTypes.string,
  /** Entity Advisor's last name. */
  lastName: PropTypes.string,
  /** A function that changes the language of the application from English to Arabic and vice versa. */
  toggleLanguage: PropTypes.func,
};

export default EntityAdvisorHeader;
