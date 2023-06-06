import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Formik } from 'formik';
import PropTypes from 'prop-types';
import { toastr } from 'react-redux-toastr';
import * as Yup from 'yup';
import {
  resetPassword,
  checkResetTokenValidity,
  toggleLanguage,
} from '../../actions';
import { strings, translateString, getLanguage } from '../../utilities';

/**
 * Resets password for user
 * @visibleName Reset Password
 */
class Reset extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  componentDidMount() {
    sessionStorage.clear();
    const token = this.props.location.pathname.replace(
      `${this.props.match.url}/`,
      ''
    );
    this.setState({ token });
    this.props
      .checkResetTokenValidity({
        email: this.props.location.search.replace('?email=', ''),
        token,
      })
      .catch(err => {
        toastr.error(err.response.data.message);
        this.props.history.push(`/login${this.props.location.search}`);
      });
  }
  resetPasswordAction = (values, setSubmitting) => {
    const body = Object.assign({}, values, { token: this.state.token });
    return this.props
      .resetPassword(body)
      .then(() => {
        setSubmitting(false);
        this.props.history.push(`/login${this.props.location.search}`);
      })
      .catch(() => {
        setSubmitting(false);
        toastr.error(this.props.tokenStatus.error);
      });
  };

  render() {
    return (
      <div>
        <div className="splash">
          <div className="splash__logo">
            <img
              src={
                this.state.language === 'en'
                  ? '/assets/images/logo-white.png'
                  : '/assets/images/logo-white-ar.png'
              }
              alt={this.state.language === 'en' ? 'Adaa' : 'آداء'}
            />
          </div>
          <Formik
            initialValues={{
              email: this.props.location.search.replace('?email=', ''),
              password: '',
              password_confirmation: '',
            }}
            validationSchema={Yup.lazy(values => {
              return Yup.object().shape({
                email: Yup.string()
                  .email(translateString(strings.login.emailValid))
                  .required(translateString(strings.login.emailRequired)),

                password: Yup.string()
                  .required(translateString(strings.login.passwordRequired))
                  .matches(
                    /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*_-])(?=.{8,})/,
                    translateString(strings.passwordValidationError)
                  ),
                password_confirmation: Yup.mixed().test(
                  'match',
                  translateString(strings.reset.errorPassword),
                  val => {
                    return val === values.password;
                  }
                ),
              });
            })}
            onSubmit={(values, { setSubmitting }) => {
              setSubmitting(true);
              this.resetPasswordAction(values, setSubmitting);
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
                    autoComplete="off"
                    type="email"
                    name="email"
                    disabled
                    placeholder="name.example@email.com"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.email}
                  />
                  <div className="login-form__error">
                    {touched.email && errors.email ? errors.email : ''}
                  </div>
                </div>
                <div className="login-form__input">
                  <label className="visually-hidden">Password</label>
                  <input
                    autoComplete="off"
                    type="password"
                    name="password"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.password}
                    placeholder={translateString(strings.reset.password)}
                    required
                  />
                  <div className="login-form__error">
                    {touched.password && errors.password ? errors.password : ''}
                  </div>
                </div>
                <div className="login-form__input">
                  <label className="visually-hidden">Confirm Password</label>
                  <input
                    autoComplete="off"
                    type="password"
                    name="password_confirmation"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder={translateString(strings.reset.confirmPassword)}
                    value={values.password_confirmation}
                    required
                  />
                  <div className="login-form__error">
                    {touched.password_confirmation &&
                    errors.password_confirmation
                      ? errors.password_confirmation
                      : ''}
                  </div>
                </div>
                <div className="login-form__button">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="button button--transparent button--wide"
                  >
                    {translateString(strings.reset.button)}
                  </button>
                </div>
                <p className="login-form__actions">
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
              </form>
            )}
          />
        </div>
      </div>
    );
  }
}
function mapStateToProps(state) {
  const {
    isLoading,
    message,
    user_details: userData,
    access_token: token,
  } = state.loggedIn;
  const { tokenStatus } = state;
  return {
    isLoading,
    message,
    userData,
    token,
    tokenStatus,
  };
}
const mapDispatchToProps = {
  resetPassword,
  checkResetTokenValidity,
  toggleLanguage,
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Reset);

Reset.propTypes = {
  /** Check if token is valid */
  checkResetTokenValidity: PropTypes.func,
  /** Change language for system */
  toggleLanguage: PropTypes.func,
  /** @ignore */
  Reset: PropTypes.func,
  /** Resets password for system */
  resetPassword: PropTypes.func,
  /** @ignore */
  match: PropTypes.object,
  /** @ignore */
  location: PropTypes.object,
  /** @ignore */
  history: PropTypes.object,
  /** Status for token received from email */
  tokenStatus: PropTypes.object,
  /** @ignore */
  isLoading: PropTypes.number,
};
