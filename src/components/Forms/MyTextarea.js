import React, { Component } from 'react';
import { Field, getIn } from 'formik';
import PropTypes from 'prop-types';
import 'react-select/dist/react-select.css';
/**
 * Custom Textarea component
 */
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

class MyTextarea extends Component {
  render() {
    const {
      id,
      label,
      value,
      placeholder,
      onChange,
      onBlur,
      title,
      className,
      autoComplete,
      classNameTitle,
      containerName,
      name,
      disabled,
    } = this.props;
    return (
      <div className={`form-item ${containerName || ''}`}>
        <label className="visually-hidden" htmlFor={id}>
          {label}
        </label>
        {title && <p className={classNameTitle}>{title}</p>}
        <textarea
          className={className}
          id={id}
          name={name || id}
          onChange={onChange}
          placeholder={placeholder}
          autoComplete={autoComplete || 'off'}
          onBlur={onBlur}
          value={value}
          disabled={disabled}
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

MyTextarea.propTypes = {
  id: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  name: PropTypes.string,
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
};

export default MyTextarea;
