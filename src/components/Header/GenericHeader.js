import React from "react";
import PropTypes from "prop-types";
import { strings, translateString } from "../../utilities";

/**
 * A generic header component that renders by defaults if no existing role specified.
 */
const GenericHeader = props => {
  const { firstName, lastName, role } = props;
  const roles = {
    1: "admin",
    2: "masterAssessor",
    3: "assessor",
    4: "advisor",
    5: "entityCoordinator",
    6: "entityUser"
  };
  return (
    <ul className="header__list list list--inline">
      <li className="header__list-item">
        <span className="username">{`${firstName} ${lastName}`}</span>
        <small>{` (${translateString(strings.roles[roles[role]])})`}</small>
      </li>
    </ul>
  );
};

GenericHeader.propTypes = {
  /** Current user's first name. */
  firstName: PropTypes.string,
  /** Current user's last name. */
  lastName: PropTypes.string,
  /** Current user's role. */
  role: PropTypes.number,
  /** A function that changes the language of the application from English to Arabic and vice versa. */
  toggleLanguage: PropTypes.func
};

export default GenericHeader;
