import React, { Component } from "react";
import { Link, Redirect } from "react-router-dom";
import { connect } from "react-redux";
import { Formik } from "formik";
import PropTypes from "prop-types";
import { toastr } from "react-redux-toastr";
import * as Yup from "yup";
import { strings, getLanguage, translateString } from "../../utilities";
import { Loading } from "../../components";
import {
  otpUser,
  setAuthenticated,
  setUserData,
  toggleLanguage
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
      from: { pathname: "/otp" }
    };

    const { isAuthenticated, isLoading, otp_sent } = this.props;
    if (otp_sent) {
      return <Redirect to={from.pathname} />;
    }

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
              email: this.props.location.search.replace("?email=", "") || "",
              password: ""
            }}
            validationSchema={Yup.object().shape({
              email: Yup.string()
                .email(translateString(strings.login.emailValid))
                .required(translateString(strings.login.emailRequired)),
              password: Yup.string().required(
                translateString(strings.login.passwordRequired)
              )
            })}
            onSubmit={(values, { setSubmitting }) => {
              setSubmitting(true);
              this.setState({ loginLoading: true });
              this.props
                .otpUser(values)
                .then(res => {
                  toastr.success(
                    translateString(strings.login.enterOtpRequired)
                  );
                  otp_sent = true;
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
                    {touched.email && errors.email ? errors.email : ""}
                  </div>
                </div>
                <div className="login-form__input">
                  <label className="visually-hidden">Password</label>
                  <input
                    type="password"
                    name="password"
                    autoComplete="current-password"
                    placeholder={translateString(strings.login.password)}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.password}
                  />
                  <div className="login-form__error">
                    {touched.password && errors.password ? errors.password : ""}
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
            <Link className="login-form__link" to="/forgot">
              {translateString(strings.login.forgot)}
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
    otp_sent: state.otp_sent.otp_sent,
    isAuthenticated: state.isAuthenticated,
    ...state.flags
  };
}
const mapDispatchToProps = {
  otpUser,
  setAuthenticated,
  setUserData,
  toggleLanguage
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
  otpUser: PropTypes.func,
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
