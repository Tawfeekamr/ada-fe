import React, { Component } from 'react';
import { Field } from 'formik';
import PropTypes from 'prop-types';
/**
 * Custom Radio button component
 */
class MyRadio extends Component {
  render() {
    const { id, label, value, onChange, className, name, checked } = this.props;
    return (
      <div className="form-item custom-checkbox">
        <Field
          className={className}
          id={id}
          name={name}
          type="radio"
          onChange={onChange}
          value={value}
          checked={checked}
        />
        <label htmlFor={id}>{label}</label>
      </div>
    );
  }
}

MyRadio.propTypes = {
  id: PropTypes.string.isRequired,
  label: PropTypes.string,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func,
  className: PropTypes.string,
  checked: PropTypes.bool,
  name: PropTypes.string.isRequired,
};

export default MyRadio;
