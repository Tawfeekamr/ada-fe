import React, { Component } from 'react';
import { Field } from 'formik';
import PropTypes from 'prop-types';
/**
 * Custom checkbox component
 */
class MyCheckbox extends Component {
  render() {
    const { id, label, value, type, onChange, className, name } = this.props;
    return (
      <div className="form-item custom-checkbox">
        <Field
          className={className}
          id={id}
          type={type}
          onChange={onChange}
          value={value}
          name={name}
        />
        <label htmlFor={id}>{label}</label>
      </div>
    );
  }
}

MyCheckbox.propTypes = {
  id: PropTypes.string.isRequired,
  label: PropTypes.string,
  type: PropTypes.string.isRequired,
  value: PropTypes.bool.isRequired,
  onChange: PropTypes.func,
  name: PropTypes.string,
  className: PropTypes.string,
};

export default MyCheckbox;
