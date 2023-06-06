import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { Formik } from 'formik';
import PropTypes from 'prop-types';
import { toastr } from 'react-redux-toastr';
import * as Yup from 'yup';
import { strings, getLanguage, translateString } from '../../utilities';
import { forgotPassword, toggleLanguage } from '../../actions';
/**
 * A view where user can enter his email to receive an email to reset his password.
 * @visibleName Forgot Password
 */
class Forgot extends Component {
  state = {
    redirectToReferrer: false,
  };
  render() {
    const { from } = this.props.location.state || { from: { pathname: '/' } };
    const { isAuthenticated } = this.props;
    if (isAuthenticated) {
      return <Redirect to={from.pathname} />;
    }
    return (
      <div className="splash">
        <div className="splash__logo">
          <img
            src={
              this.state.language === 'en'
                ? '/assets/images/logo-white.png'
                : '/assets/images/logo-white-ar.png'
            }
            alt={this.state.language === 'en' ? 'ADAA' : 'آداء'}
          />
        </div>
        <Formik
          initialValues={{
            email: '',
          }}
          validationSchema={Yup.object().shape({
            email: Yup.string()
              .email()
              .required(translateString(strings.login.emailRequired)),
          })}
          onSubmit={(values, { setSubmitting }) => {
            setSubmitting(true);
            this.props
              .forgotPassword(values)
              .then(res => {
                setSubmitting(false);
                toastr.success(res.value.message);
              })
              .catch(err => {
                setSubmitting(false);
                toastr.error(err.response.data.message);
              });
          }}
          render={({
            values,
            errors,
            touched,
            handleChange,
            handleBlur,
            handleSubmit,
            isSubmitting,
          }) => (
            <form className="form login-form" onSubmit={handleSubmit}>
              <legend className="title">
                {translateString(strings.login.title)}
              </legend>
              <div className="login-form__input">
                <label className="visually-hidden">Email</label>
                <input
                  type="email"
                  name="email"
                  placeholder="name.example@email.com"
                  autoComplete="email"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.email}
                />
                <div className="login-form__error">
                  {touched.email && errors.email ? errors.email : ''}
                </div>
              </div>
              <div className="login-form__button">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="button button--transparent button--wide"
                >
                  {translateString(strings.forgot.button)}
                </button>
              </div>
            </form>
          )}
        />
        <p className="login-form__actions">
          <Link className="login-form__link" to="/login">
            {translateString(strings.forgot.login)}
          </Link>
          <a
            className="login-form__link"
            onClick={() => {
              this.props.toggleLanguage();
              this.setState({ language: getLanguage() });
            }}
          >
            {translateString(strings.language)}
          </a>
        </p>

        {this.props.message && !this.props.isLoading && (
          <div className="login-form__error">
            <p>{translateString(strings.forgot.error)}</p>
          </div>
        )}
      </div>
    );
  }
}
function mapStateToProps(state) {
  return {
    isAuthenticated: state.isAuthenticated,
    ...state.flags,
  };
}
const mapDispatchToProps = {
  forgotPassword,
  toggleLanguage,
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Forgot);

Forgot.propTypes = {
  /** Update System Language */
  toggleLanguage: PropTypes.func,
  /** @ignore */
  location: PropTypes.object,
  /** Submits email */
  forgotPassword: PropTypes.func,
  /** Check if user is not logged in */
  isAuthenticated: PropTypes.bool,
  /** @ignore */
  isLoading: PropTypes.number,
  /** Status of request */
  message: PropTypes.string,
};
