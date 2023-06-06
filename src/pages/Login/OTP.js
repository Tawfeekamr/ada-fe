import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import { connect } from "react-redux";
import { Formik } from "formik";
import PropTypes from "prop-types";
import { toastr } from "react-redux-toastr";
import * as Yup from "yup";
import { strings, getLanguage, translateString } from "../../utilities";
import { Loading } from "../../components";
import {
  loginUser,
  setAuthenticated,
  setUserData,
  toggleLanguage,
  setOTPSentFalse
} from "../../actions";
/**
 * Login Page for the system
 */
class Login extends Component {
  state = {
    redirectToReferrer: false,
    language: getLanguage(),
    loginLoading: false
  };
  render() {
    const { from } = this.props.location.state || {
      from: { pathname: "/" }
    };
    const { isAuthenticated, isLoading } = this.props;

    if (isAuthenticated) {
      return <Redirect to={from.pathname} />;
    }

    return (
      <div>
        {isLoading === 1 && !this.state.loginLoading && <Loading />}
        <div className="splash">
          <div className="splash__logo">
            <img
              src={
                this.state.language === "en"
                  ? "/assets/images/logo-white.png"
                  : "/assets/images/logo-white-ar.png"
              }
              alt={this.state.language === "en" ? "ADAA" : "آداء"}
            />
          </div>
          <Formik
            initialValues={{
              otp_code: ""
            }}
            validationSchema={Yup.object().shape({
              otp_code: Yup.string().required(
                translateString(strings.login.otpRequired)
              )
            })}
            onSubmit={(values, { setSubmitting }) => {
              values.email = sessionStorage.getItem("email");
              values.password = sessionStorage.getItem("password");

              setSubmitting(true);
              this.setState({ loginLoading: true });
              this.props
                .loginUser(values)
                .then(res => {
                  sessionStorage.removeItem("email");
                  sessionStorage.removeItem("password");
                })
                .catch(err => {
                  setSubmitting(false);
                  if (err.response !== undefined) {
                    toastr.error(err.response.data.message);
                  } else {
                    toastr.error(translateString(strings.genericError));
                  }
                });
            }}
            render={({
              values,
              errors,
              touched,
              handleChange,
              handleBlur,
              handleSubmit,
              isSubmitting
            }) => (
              <form className="form login-form" onSubmit={handleSubmit}>
                <legend className="title">
                  {translateString(strings.login.title)}
                </legend>
                <div className="login-form__input">
                  <label className="visually-hidden">OTP</label>
                  <input
                    type="text"
                    name="otp_code"
                    placeholder={translateString(
                      strings.login.VerificationCode
                    )}
                    autoComplete=""
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.otp_code}
                  />
                  <div className="login-form__error">
                    {touched.otp_code && errors.otp_code ? errors.otp_code : ""}
                  </div>
                </div>

                <div className="login-form__button">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="button button--transparent button--wide"
                  >
                    {translateString(strings.login.button)}
                  </button>
                </div>
              </form>
            )}
          />
          <p className="login-form__actions">
            <a
              className="login-form__link"
              onClick={() => {
                this.props.setOTPSentFalse();
                sessionStorage.clear();
                window.location.href = "/login";
              }}
            >
              {translateString(strings.forgot.login)}
            </a>
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
              <p>{translateString(strings.login.error)}</p>
            </div>
          )}
        </div>
      </div>
    );
  }
}
function mapStateToProps(state) {
  const { user_details: userData } = state.loggedIn;
  return {
    userData,
    isAuthenticated: state.isAuthenticated,
    ...state.flags
  };
}
const mapDispatchToProps = {
  loginUser,
  setAuthenticated,
  setUserData,
  toggleLanguage,
  setOTPSentFalse
};
export default connect(mapStateToProps, mapDispatchToProps)(Login);

Login.propTypes = {
  /** Change system language */
  toggleLanguage: PropTypes.func,
  /** @ignore */
  location: PropTypes.object,
  /** Login User */
  login: PropTypes.func,
  /** @ignore */
  loginUser: PropTypes.func,
  /** Sets status in all system */
  setAuthenticated: PropTypes.func,
  /** Saves user data */
  setUserData: PropTypes.func,
  /** Check if user is logged in */
  isAuthenticated: PropTypes.bool,
  /** Data for user */
  userData: PropTypes.object,
  /** @ignore */
  isLoading: PropTypes.number,
  /** @ignore */
  message: PropTypes.string
};
