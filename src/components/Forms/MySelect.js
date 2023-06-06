import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Select from 'react-select';
import 'react-select/dist/react-select.css';
/**
 * Custom select component
 */
class MySelect extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: '',
    };
  }
  handleChange = value => {
    // this is going to call setFieldValue and manually update values.topcis
    if (this.props.multi) {
      this.setState({ value });
      this.props.onChange(this.props.id, value);
    } else {
      this.props.onChange(this.props.id, value ? value.value : value);
    }
  };

  handleBlur = () => {
    // this is going to call setFieldTouched and manually update touched.topcis
    if (this.props.onBlur) this.props.onBlur(this.props.id, true);
  };

  render() {
    const {
      id,
      label,
      placeholder,
      value,
      multi,
      labelHidden,
      loading,
      options,
    } = this.props;
    return (
      <div className="form-item">
        <label className="bold" hidden={labelHidden} htmlFor={id}>
          {label}
        </label>
        <Select
          className={loading ? 'loading-select' : ''}
          id={this.props.id}
          options={options}
          multi={multi}
          onChange={this.handleChange}
          onBlur={this.handleBlur}
          value={value || this.state.value}
          placeholder={placeholder}
          classNamePrefix="react-select"
          instanceId={this.props.id}
          resetValue={''}
          disabled={loading || this.props.disabled}
        />
        {this.props.touched && this.props.error && (
          <p className="form-error">{this.props.error}</p>
        )}
      </div>
    );
  }
}

MySelect.propTypes = {
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
    PropTypes.object,
    PropTypes.array,
  ]),
  touched: PropTypes.oneOfType([PropTypes.bool, PropTypes.array]),
  error: PropTypes.string,
  options: PropTypes.array,
  id: PropTypes.string.isRequired,
  onChange: PropTypes.func,
  onBlur: PropTypes.func,
  placeholder: PropTypes.string,
  label: PropTypes.string,
  multi: PropTypes.bool,
  labelHidden: PropTypes.bool,
  disabled: PropTypes.bool,
  loading: PropTypes.bool,
};

export default MySelect;
