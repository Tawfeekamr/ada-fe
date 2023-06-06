import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { strings, translateString } from '../../utilities';
import { MyInputField } from '../../components';

export default class Trainings extends Component {
  render() {
    return (
      <Formik
        initialValues={{
          year: '',
          section: '',
          type: '',
          number_of_attendees: '',
          number_of_hours: '',
        }}
        validationSchema={Yup.object().shape({
          year: Yup.number()
            .typeError(translateString(strings.errors.numberInvalid))
            .min(
              2000,
              translateString(strings.errors.yearInvalid) +
                new Date().getFullYear().toString()
            )
            .max(
              new Date().getFullYear(),
              translateString(strings.errors.yearInvalid) +
                new Date().getFullYear().toString()
            )
            .required(translateString(strings.errors.year)),

          section: Yup.string().required(
            translateString(strings.errors.section)
          ),

          type: Yup.string().required(
            translateString(strings.errors.trainingType)
          ),

          number_of_attendees: Yup.number()
            .typeError(translateString(strings.errors.number_of_attendees))
            .min(1, translateString(strings.errors.numberInvalid))
            .required(translateString(strings.errors.number_of_attendees)),

          number_of_hours: Yup.number()
            .typeError(translateString(strings.errors.number_of_hours))
            .min(1, translateString(strings.errors.numberInvalid))
            .required(translateString(strings.errors.number_of_hours)),
        })}
        onSubmit={(values, { resetForm, setSubmitting }) => {
          this.props.addTraining(values);
          resetForm({
            year: '',
            section: '',
            type: '',
            number_of_attendees: '',
            number_of_hours: '',
          });

          setSubmitting(false);
        }}
        render={({
          touched,
          errors,
          handleChange,
          handleBlur,
          handleSubmit,
        }) => (
          <Form onSubmit={handleSubmit}>
            <div className="form-group">
              <div className="grid-wrapper grid--1">
                <MyInputField
                  label={translateString(strings.form.year)}
                  type="number"
                  name="year"
                  id="year"
                  labelVisible={true}
                  placeholder={`${translateString(strings.form.year)}*`}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  touched={touched.year}
                  error={errors.year}
                />
                <MyInputField
                  label={translateString(strings.form.section)}
                  type="text"
                  name="section"
                  id="section"
                  labelVisible={true}
                  placeholder={`${translateString(strings.form.section)}*`}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  touched={touched.section}
                  error={errors.section}
                />
                <MyInputField
                  label={translateString(strings.form.type)}
                  type="text"
                  name="type"
                  id="type"
                  labelVisible={true}
                  placeholder={`${translateString(strings.form.type)}*`}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  touched={touched.type}
                  error={errors.type}
                />
                <MyInputField
                  label={translateString(strings.form.number_of_attendees)}
                  type="number"
                  name="number_of_attendees"
                  id="number_of_attendees"
                  labelVisible={true}
                  placeholder={`${translateString(
                    strings.form.number_of_attendees
                  )}*`}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  touched={touched.number_of_attendees}
                  error={errors.number_of_attendees}
                />
                <MyInputField
                  label={translateString(strings.form.number_of_hours)}
                  type="number"
                  name="number_of_hours"
                  id="number_of_hours"
                  labelVisible={true}
                  placeholder={`${translateString(
                    strings.form.number_of_hours
                  )}*`}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  touched={touched.number_of_hours}
                  error={errors.number_of_hours}
                />
              </div>

              <div className="buttons--wrapper">
                <button type="submit" className="button button--primary">
                  + {translateString(strings.newAssessment.addTraining)}
                </button>
              </div>
            </div>
          </Form>
        )}
      />
    );
  }
}

Trainings.propTypes = {
  addTraining: PropTypes.func,
};
