import React from "react";
import PropTypes from "prop-types";
import { NavLink } from "react-router-dom";
import { strings, translateString } from "../../utilities";
/**
 * Header component rendered for Admin
 */
const AdminHeader = props => {
  const { firstName, lastName } = props;

  return (
    <ul className="header__list list list--inline">
      <li className="header__list-item">
        <NavLink
          to="/dashboard"
          className={window.location.pathname === "/dashboard" ? "active" : ""}
        >
          {translateString(strings.header.dashboard)}
        </NavLink>
      </li>
      <li className="header__list-item">
        <NavLink
          to="/logs"
          className={window.location.pathname === "/logs" ? "active" : ""}
        >
          {translateString(strings.header.logs)}
        </NavLink>
      </li>
      <li className="header__list-item">
        <NavLink
          to="/users"
          className={window.location.pathname === "/" ? "active" : ""}
        >
          {translateString(strings.header.users)}
        </NavLink>
      </li>
      <li className="header__list-item">
        <NavLink to="/entities">
          {translateString(strings.header.entities)}
        </NavLink>
      </li>
      <li className="header__list-item">
        <NavLink to="/reports">
          {translateString(strings.header.reports)}
        </NavLink>
      </li>
      <li className="header__list-item">
        <span className="username">{`${firstName} ${lastName}`}</span>
        <small>{` (${translateString(strings.roles.admin)})`}</small>
      </li>
    </ul>
  );
};

AdminHeader.propTypes = {
  /** Admin's first name. */
  firstName: PropTypes.string,
  /** Admin's last name. */
  lastName: PropTypes.string,
  /** A function that changes the language of the application from English to Arabic and vice versa. */
  toggleLanguage: PropTypes.func
};

export default AdminHeader;
