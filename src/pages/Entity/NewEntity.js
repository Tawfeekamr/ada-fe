import React, { Component } from 'react';
import { Formik, Form } from 'formik';
import { connect } from 'react-redux';
import { toastr } from 'react-redux-toastr';
import * as Yup from 'yup';
import * as moment from 'moment';
import PropTypes from 'prop-types';
import { strings, translateString, Navigation } from '../../utilities';
import { MyInputField, MyDatePicker, MyCheckbox } from '../../components';
import { createEntity } from '../../actions';
/**
 * An admin can add new Entity, including EC and entity info.
 * @visibleName New Entity
 */
export class NewEntity extends Component {
  render() {
    return (
      <div className="form-container entity-form">
        <h1 className="title form-title">
          {translateString(strings.entity.newEntity)}
        </h1>
        <Formik
          initialValues={{
            'name:en': '',
            'name:ar': '',
            'address:en': '',
            'address:ar': '',
            'shortname:en': '',
            'shortname:ar': '',
            code: '',
            include_beneficiary_experience: false,
            employees_number: '',
            first_name: '',
            last_name: '',
            email: '',
          }}
          validationSchema={Yup.object().shape({
            'name:en': Yup.string().required(
              translateString(strings.errors.name)
            ),
            'name:ar': Yup.string().required(
              translateString(strings.errors.name)
            ),
            'address:en': Yup.string().required(
              translateString(strings.errors.addressEn)
            ),
            'address:ar': Yup.string().required(
              translateString(strings.errors.addressAr)
            ),
            'shortname:en': Yup.string().required(
              translateString(strings.errors.shortnameEn)
            ),
            'shortname:ar': Yup.string().required(
              translateString(strings.errors.shortnameAr)
            ),
            onboarding_date: Yup.date()
              .typeError(translateString(strings.errors.dateType))
              .required(translateString(strings.errors.date)),
            code: Yup.string().required(translateString(strings.errors.code)),
            employees_number: Yup.number()
              .min(1, translateString(strings.errors.numberInvalid))
              .required(translateString(strings.errors.number)),
            first_name: Yup.string().required(
              translateString(strings.errors.firstName)
            ),
            last_name: Yup.string().required(
              translateString(strings.errors.lastName)
            ),
            email: Yup.string()
              .email(translateString(strings.errors.emailInvalid))
              .required(translateString(strings.login.emailRequired)),
          })}
          onSubmit={(values, { setSubmitting, setErrors }) => {
            /* eslint no-param-reassign: ["error", { "props": true, "ignorePropertyModificationsFor": ["values"] }] */
            setSubmitting(true);
            values.onboarding_date = moment(values.onboarding_date)
              .locale('en')
              .format('YYYY-MM-DD');
            this.props
              .createEntity(values)
              .then(() => {
                setSubmitting(false);
                toastr.success(translateString(strings.message.entity));
                this.props.history.push('/entities');
              })
              .catch(() => {
                const errors = [];
                setSubmitting(false);
                if (this.props.entityCreated.errors) {
                  Object.keys(this.props.entityCreated.errors).forEach(key => {
                    // Eslint suggests destructuring in this assignment
                    errors[key] = this.props.entityCreated.errors[key][0]; // eslint-disable-line
                  });
                  setErrors(errors);
                }
                toastr.error(this.props.entityCreated.message);
              });
          }}
          render={({
            values,
            touched,
            errors,
            handleChange,
            handleBlur,
            handleSubmit,
            setFieldValue,
            setFieldTouched,
            isSubmitting,
          }) => (
            <Form className="form-wrapper" onSubmit={handleSubmit}>
              <div className="grid-wrapper grid--2 flip-rtl">
                <div className="form-group">
                  <legend className="form-section-title">
                    {translateString(strings.newAssessment.english)}
                  </legend>
                  <MyInputField
                    label={translateString(strings.form.name)}
                    type="text"
                    name="name:en"
                    id="name:en"
                    placeholder={`${translateString(strings.form.name)}*`}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values['name:en']}
                    touched={touched['name:en']}
                    error={errors['name:en']}
                  />
                  <MyInputField
                    label={translateString(strings.form.address)}
                    type="text"
                    name="address:en"
                    id="address:en"
                    placeholder={`${translateString(strings.form.address)}*`}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values['address:en']}
                    touched={touched['address:en']}
                    error={errors['address:en']}
                  />
                  <MyInputField
                    label={translateString(strings.form.shortname)}
                    type="text"
                    name="shortname:en"
                    id="shortname:en"
                    placeholder={`${translateString(strings.form.shortname)}*`}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values['shortname:en']}
                    touched={touched['shortname:en']}
                    error={errors['shortname:en']}
                  />
                </div>
                <div className="form-group">
                  <legend className="form-section-title">
                    {translateString(strings.newAssessment.arabic)}
                  </legend>
                  <MyInputField
                    label={translateString(strings.form.name)}
                    type="text"
                    name="name:ar"
                    id="name:ar"
                    placeholder={`${translateString(strings.form.name)}*`}
                    className="rtl"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values['name:ar']}
                    touched={touched['name:ar']}
                    error={errors['name:ar']}
                  />
                  <MyInputField
                    label={translateString(strings.form.address)}
                    type="text"
                    name="address:ar"
                    id="address:ar"
                    placeholder={`${translateString(strings.form.address)}*`}
                    className="rtl"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values['address:ar']}
                    touched={touched['address:ar']}
                    error={errors['address:ar']}
                  />
                  <MyInputField
                    label={translateString(strings.form.shortname)}
                    type="text"
                    name="shortname:ar"
                    id="shortname:ar"
                    placeholder={`${translateString(strings.form.shortname)}*`}
                    className="rtl"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values['shortname:ar']}
                    touched={touched['shortname:ar']}
                    error={errors['shortname:ar']}
                  />
                </div>
              </div>
              <div className="form-section">
                <div className="grid-wrapper grid--1 one-third">
                  <MyInputField
                    label="code"
                    type="text"
                    name="code"
                    id="code"
                    placeholder={`${translateString(
                      strings.placeholders.code
                    )}*`}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.code}
                    touched={touched.code}
                    error={errors.code}
                  />
                </div>
                <div className="grid-wrapper grid--3">
                  <MyInputField
                    label="employees_number"
                    type="number"
                    // min="1"
                    name="employees_number"
                    id="employees_number"
                    placeholder={`${translateString(
                      strings.placeholders.employeesNumber
                    )}*`}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.employees_number}
                    touched={touched.employees_number}
                    error={errors.employees_number}
                  />
                  <MyDatePicker
                    id="onboarding_date"
                    label={'onboarding_date'}
                    value={values.onboarding_date}
                    onChange={setFieldValue}
                    onBlur={setFieldTouched}
                    error={errors.onboarding_date}
                    placeholderText={`${translateString(
                      strings.placeholders.dateOfOnboarding
                    )}*`}
                    touched={touched.onboarding_date}
                    maxDate={moment()}
                  />
                  <MyCheckbox
                    label={translateString(strings.placeholders.beneficiary)}
                    type="checkbox"
                    name="include_beneficiary_experience"
                    id="include"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.include_beneficiary_experience}
                  />
                </div>
              </div>
              <div className="form-section">
                <legend className="form-section-title">
                  {translateString(strings.roles.entityCoordinator)}
                </legend>
                <div className="grid-wrapper grid--3">
                  <MyInputField
                    label="first_name"
                    type="text"
                    name="first_name"
                    id="first_name"
                    placeholder={`${translateString(
                      strings.placeholders.firstName
                    )}*`}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.first_name}
                    touched={touched.first_name}
                    error={errors.first_name}
                  />

                  <MyInputField
                    label="last_name"
                    type="text"
                    name="last_name"
                    id="last_name"
                    placeholder={`${translateString(
                      strings.placeholders.lastName
                    )}*`}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.last_name}
                    touched={touched.last_name}
                    error={errors.last_name}
                  />

                  <MyInputField
                    label="email"
                    type="text"
                    name="email"
                    id="email"
                    placeholder={`${translateString(
                      strings.placeholders.email
                    )}*`}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.email}
                    touched={touched.email}
                    error={errors.email}
                  />
                </div>
              </div>
              <div className="buttons--wrapper">
                <button
                  className="button button--primary"
                  onClick={() => {
                    Navigation.cancelAndGoBack(this);
                  }}
                >
                  {translateString(strings.table.cancel)}
                </button>
                <button
                  className="button button--secondary"
                  type="submit"
                  disabled={isSubmitting}
                >
                  {translateString(strings.entity.create)}
                </button>
              </div>
            </Form>
          )}
        />
      </div>
    );
  }
}

function mapStateToProps(state) {
  const { entityCreated } = state;

  return {
    entityCreated,
  };
}
const mapDispatchToProps = {
  createEntity,
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(NewEntity);

NewEntity.propTypes = {
  /** @ignore */
  history: PropTypes.object,
  /** Creates new entity */
  createEntity: PropTypes.func,
  /** Status of entity created */
  entityCreated: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
};
