import React, { Component } from 'react';
import { Field, getIn } from 'formik';
import PropTypes from 'prop-types';
import 'react-select/dist/react-select.css';

const ErrorMessage = ({ name }) => (
  <Field
    name={name}
    render={({ form }) => {
      const error = getIn(form.errors, name);
      const touch = getIn(form.touched, name);
      return touch && error ? <p className="form-error">{error}</p> : null;
    }}
  />
);

/**
 * A custom input field.
 */
class MyInputField extends Component {
  render() {
    const {
      id,
      label,
      value,
      type,
      placeholder,
      onChange,
      onBlur,
      title,
      className,
      autoComplete,
      classNameTitle,
      containerName,
      name,
      min,
      max,
      labelVisible,
    } = this.props;
    return (
      <div className={`form-item ${containerName || ''}`}>
        <label
          className={labelVisible ? 'form-label' : 'visually-hidden'}
          htmlFor={id}
        >
          {label}
        </label>
        {title && <p className={classNameTitle}>{title}</p>}
        <Field
          className={className}
          id={id}
          min={min}
          max={max}
          type={type}
          name={name || id}
          onChange={onChange}
          placeholder={placeholder}
          autoComplete={autoComplete || 'off'}
          onBlur={onBlur}
          {...(value !== undefined ? { value } : {})}
        />
        {/* touched && error && <p className="form-error">{error}</p> */}
        <ErrorMessage name={name} />
      </div>
    );
  }
}

ErrorMessage.propTypes = {
  name: PropTypes.string,
};

MyInputField.propTypes = {
  id: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  name: PropTypes.string,
  type: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  error: PropTypes.string,
  touched: PropTypes.bool,
  onChange: PropTypes.func,
  onBlur: PropTypes.func,
  className: PropTypes.string,
  placeholder: PropTypes.string,
  autoComplete: PropTypes.string,
  containerName: PropTypes.string,
  classNameTitle: PropTypes.string,
  title: PropTypes.string,
  min: PropTypes.string,
  max: PropTypes.string,
  labelVisible: PropTypes.bool,
};

export default MyInputField;
