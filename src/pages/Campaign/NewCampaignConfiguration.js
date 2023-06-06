import React from 'react';
import { Formik, Form } from 'formik';
import { Link } from 'react-router-dom';
import * as Yup from 'yup';
import * as moment from 'moment';
import PropTypes from 'prop-types';
import { strings, translateString } from '../../utilities';
import { MySelect, MyInputField, MyDatePicker } from '../../components';

const NewCampaignConfiguration = props => {
  return (
    <Formik
      initialValues={{
        'name:en': '',
        'name:ar': '',
        self_assessment_duration: '',
        self_assessment_duration_unit: 1,
        assessment_id: '',
      }}
      validationSchema={() => {
        return Yup.lazy(values => {
          return Yup.object().shape({
            'name:en': Yup.string().required(
              translateString(strings.errors.name)
            ),
            'name:ar': Yup.string().required(
              translateString(strings.errors.name)
            ),
            start_date: Yup.date()
              .typeError(translateString(strings.errors.dateInvalid))
              .required(translateString(strings.errors.date)),
            end_date: Yup.mixed().test(
              'end_date',
              translateString(strings.endDateError),
              () => {
                return moment(values.start_date).isBefore(
                  values.end_date,
                  'day'
                );
              }
            ),
            self_assessment_duration: Yup.number()
              .integer(`${translateString(strings.errors.integer)}`)
              .test(
                'self_assessment_duration',
                values.start_date && values.end_date
                  ? `${translateString(strings.errors.duration)} ${Math.ceil(
                      moment
                        .duration(
                          moment(values.end_date).diff(values.start_date)
                        )
                        .asDays()
                    ) + 1} ${translateString(strings.errors.days)}`
                  : translateString(strings.errors.pleaseSelectStartAndEnd),
                () => {
                  const days = moment
                    .duration(moment(values.end_date).diff(values.start_date))
                    .asDays();
                  return (
                    values.self_assessment_duration <= days + 1 &&
                    values.self_assessment_duration > 0
                  );
                }
              )
              .required(),
            assessment_id: Yup.string().required(
              translateString(strings.errors.assessment)
            ),
          });
        });
      }}
      onSubmit={(values, { setSubmitting }) => {
        setSubmitting(true);
        props.action(values, setSubmitting);
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
          <div className="form-group">
            <legend className="form-section-title">
              {translateString(strings.form.basicInfo)}
            </legend>
            <div className="grid-wrapper grid--2 flip-rtl">
              <div className="form-group">
                <legend className="form-section-subtitle">
                  {translateString(strings.newAssessment.english)}
                </legend>
                <MyInputField
                  label={translateString(strings.form.campaignName)}
                  type="text"
                  name="name:en"
                  id="name:en"
                  placeholder={translateString(strings.form.campaignName)}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values['name:en']}
                  touched={touched['name:en']}
                  error={errors['name:en']}
                />
              </div>
              <div className="form-group">
                <legend className="form-section-subtitle">
                  {' '}
                  {translateString(strings.newAssessment.arabic)}
                </legend>
                <MyInputField
                  label={translateString(strings.form.campaignName)}
                  type="text"
                  name="name:ar"
                  id="name:ar"
                  placeholder={translateString(strings.form.campaignName)}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values['name:ar']}
                  touched={touched['name:ar']}
                  error={errors['name:ar']}
                />
              </div>
            </div>
            <div className="grid-wrapper grid--2 half">
              <MyDatePicker
                id="start_date"
                label={'start_date'}
                value={values.start_date}
                onChange={setFieldValue}
                onBlur={setFieldTouched}
                error={errors.start_date}
                placeholderText={translateString(strings.form.startDate)}
                touched={touched.start_date}
              />
              <MyDatePicker
                id="end_date"
                label={'end_date'}
                value={values.end_date}
                onChange={setFieldValue}
                onBlur={setFieldTouched}
                error={errors.end_date}
                // moment.max(moment(), moment(values.start_date))
                minDate={moment.max(
                  moment().add(1, 'day'),
                  moment(values.start_date).add(1, 'day')
                )}
                disabled={!values.start_date}
                placeholderText={translateString(strings.form.endDate)}
                touched={touched.end_date}
              />
            </div>
          </div>
          <div className="form-section">
            <legend className="form-section-title">
              {translateString(strings.form.selfAssessmentDuration)}
            </legend>
            <div className="grid-wrapper grid--2">
              <div className="form-group">
                <div className="input-group">
                  <div className="input-group__input duration-input">
                    <MyInputField
                      label={translateString(strings.form.number)}
                      type="number"
                      name="self_assessment_duration"
                      id="self_assessment_duration"
                      placeholder={translateString(strings.form.number)}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.self_assessment_duration}
                      touched={touched.self_assessment_duration}
                      error={errors.self_assessment_duration}
                    />
                  </div>
                  <div className="input-group__postfix">
                    <p>{translateString(strings.form.days)}</p>
                  </div>
                </div>
              </div>
              <div className="form-group">
                <MySelect
                  id="assessment_id"
                  name="assessment_id"
                  labelHidden={true}
                  required
                  options={props.assessments || []}
                  label={translateString(strings.form.assessment)}
                  onChange={setFieldValue}
                  placeholder={translateString(strings.form.assessment)}
                  onBlur={setFieldTouched}
                  error={errors.assessment_id}
                  value={values.assessment_id}
                  touched={touched.assessment_id}
                />
              </div>
            </div>
          </div>

          <div className="buttons--wrapper">
            <Link to="/campaigns" className="button button--primary">
              {translateString(strings.table.cancel)}
            </Link>
            <button
              className="button button--secondary"
              type="submit"
              disabled={isSubmitting}
            >
              {translateString(strings.entity.next)}
            </button>
          </div>
        </Form>
      )}
    />
  );
};
export default NewCampaignConfiguration;
NewCampaignConfiguration.propTypes = {
  action: PropTypes.func,
  language: PropTypes.bool,
  assessments: PropTypes.array,
  cancelSubmission: PropTypes.func,
};
