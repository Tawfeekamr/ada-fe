import React, { Component } from 'react';
import PropTypes from 'prop-types';
import DatePicker from 'react-datepicker';
import * as moment from 'moment';
/**
 * Custom DatePicker component
 */
class MyDatePicker extends Component {
  handleChange = value => {
    // this is going to call setFieldValue and manually update values.topcis
    this.props.onChange(this.props.label, value);
  };

  handleBlur = () => {
    // this is going to call setFieldTouched and manually update touched.topcis
    this.props.onBlur(this.props.label, true);
  };

  render() {
    const {
      placeholderText,
      maxDate,
      minDate,
      disabled,
      labelVisible,
      id,
      label,
      labelContent,
      popperPlacement,
    } = this.props;
    return (
      <div className="form-item">
        <label
          className={labelVisible ? 'form-label' : 'visually-hidden'}
          htmlFor={id}
        >
          {labelContent}
        </label>
        <DatePicker
          autoComplete="off"
          id={this.props.id}
          maxDate={maxDate || null}
          minDate={minDate || null}
          selected={
            typeof this.props.value === 'string'
              ? moment(this.props.value)
              : this.props.value
          }
          placeholderText={placeholderText}
          onBlur={this.handleBlur}
          dateFormat="DD MMMM YYYY"
          onChange={this.handleChange}
          disabled={disabled}
          popperPlacement={popperPlacement}
        />
        {this.props.error && <p className="form-error">{this.props.error}</p>}
      </div>
    );
  }
}

MyDatePicker.propTypes = {
  minDate: PropTypes.instanceOf(moment),
  maxDate: PropTypes.instanceOf(moment),
  label: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  placeholderText: PropTypes.string,
  onChange: PropTypes.func,
  onBlur: PropTypes.func,
  error: PropTypes.string,
  touched: PropTypes.oneOfType([PropTypes.bool, PropTypes.object]),
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  disabled: PropTypes.bool,
  labelVisible: PropTypes.bool,
  labelContent: PropTypes.string,
  popperPlacement: PropTypes.string,
};

export default MyDatePicker;
