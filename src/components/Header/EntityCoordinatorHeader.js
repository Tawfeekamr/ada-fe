import React from 'react';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';
import { strings, translateString } from '../../utilities';
/**
 * Header component rendered for Entity Coordinator
 */
const EntityCoordinatorHeader = props => {
  const { firstName, lastName } = props;
  return (
    <ul className="header__list list list--inline">
      <li className="header__list-item">
        <NavLink
          to="/assessments"
          className={window.location.pathname === '/' ? 'active' : ''}
        >
          {translateString(strings.header.assessments)}
        </NavLink>
      </li>
      <li className="header__list-item">
        <NavLink to="/entities">
          {translateString(strings.header.entity)}
        </NavLink>
      </li>
      <li className="header__list-item">
        <NavLink to="/users">
          {translateString(strings.header.euManage)}
        </NavLink>
      </li>
      <li className="header__list-item">
        <NavLink to="/reports">
          {translateString(strings.header.reports)}
        </NavLink>
      </li>
      <li className="header__list-item">
        <span className="username">{`${firstName} ${lastName}`}</span>
        <small>{` (${translateString(
          strings.roles.entityCoordinator
        )})`}</small>
      </li>
    </ul>
  );
};

EntityCoordinatorHeader.propTypes = {
  /** Entity Coordinator's first name. */
  firstName: PropTypes.string,
  /** Entity Coordinator's last name. */
  lastName: PropTypes.string,
  /** A function that changes the language of the application from English to Arabic and vice versa. */
  toggleLanguage: PropTypes.func,
};

export default EntityCoordinatorHeader;
