import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FieldArray } from 'formik';
import { MyInputField, MyTextarea } from '../../components';
import Question from './Question';
import { strings, translateString, Confirmation } from '../../utilities';

class Section extends Component {
  render() {
    const {
      values,
      handleBlur,
      setFieldValue,
      setFieldTouched,
      handleChange,
      pillarIndex,
    } = this.props;
    const sectionFactory = {
      'name:en': '',
      'name:ar': '',
      'description:en': '',
      'description:ar': '',
      questions: [
        {
          'question:en': '',
          'question:ar': '',
          'description:en': '',
          'description:ar': '',
          weight: '',
        },
      ],
    };
    // values: array of sections
    return (
      <FieldArray
        name={`pillars[${pillarIndex}]sections`}
        render={arrayHelpers => (
          <div className="field-array">
            {values &&
              values.map((item, index) => {
                return (
                  <div className="section-wrapper" key={index}>
                    <div className="form-action">
                      {values.length > 1 && (
                        <button
                          className="button--remove"
                          type="button"
                          onClick={() => {
                            Confirmation.removeEntityFromFieldArray(
                              {
                                title:
                                  strings.newAssessment
                                    .confirmDeleteSectionTitle,
                                message:
                                  strings.newAssessment
                                    .confirmDeleteSectionMessage,
                              },
                              arrayHelpers.remove,
                              index
                            );
                          }}
                        />
                      )}
                      <p className="assessment-section-title">
                        {translateString(strings.newAssessment.sectionName)}
                      </p>
                    </div>
                    <div className="section">
                      <div className="grid-wrapper grid--2">
                        <MyInputField
                          type="text"
                          className="english"
                          label={`${translateString(
                            strings.newAssessment.sectionName
                          )} ${translateString(
                            strings.newAssessment.errors.inEnglish
                          )}`}
                          name={`pillars[${pillarIndex}]sections[${index}]name:en`}
                          id={`sections-name:en-${index}`}
                          placeholder={`${translateString(
                            strings.newAssessment.sectionName
                          )} ${translateString(
                            strings.newAssessment.errors.inEnglish
                          )}`}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          value={values[index]['name:en']}
                        />
                        <MyInputField
                          type="text"
                          name={`pillars[${pillarIndex}]sections[${index}]name:ar`}
                          label={`${translateString(
                            strings.newAssessment.sectionName
                          )} ${translateString(
                            strings.newAssessment.errors.inArabic
                          )}`}
                          id={`sections-name:ar-${index}`}
                          placeholder={`${translateString(
                            strings.newAssessment.sectionName
                          )} ${translateString(
                            strings.newAssessment.errors.inArabic
                          )}`}
                          className="rtl"
                          containerName="rtl"
                          onChange={handleChange}
                          onBlur={handleBlur}
                          value={values[index]['name:ar']}
                        />
                      </div>
                      <div className="grid-wrapper grid--2">
                        <MyTextarea
                          className="english"
                          label={`${translateString(
                            strings.newAssessment.sectionDescription
                          )} ${translateString(
                            strings.newAssessment.errors.inEnglish
                          )}`}
                          name={`pillars[${pillarIndex}]sections[${index}]description:en`}
                          id={`sections-description:en-${index}`}
                          placeholder={`${translateString(
                            strings.newAssessment.sectionDescription
                          )} ${translateString(
                            strings.newAssessment.errors.inEnglish
                          )}`}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          value={values[index]['description:en']}
                        />
                        <MyTextarea
                          className="rtl"
                          label={`${translateString(
                            strings.newAssessment.sectionDescription
                          )} ${translateString(
                            strings.newAssessment.errors.inArabic
                          )}`}
                          name={`pillars[${pillarIndex}]sections[${index}]description:ar`}
                          id={`sections-description:ar-${index}`}
                          containerName="rtl"
                          placeholder={`${translateString(
                            strings.newAssessment.sectionDescription
                          )} ${translateString(
                            strings.newAssessment.errors.inArabic
                          )}`}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          value={values[index]['description:ar']}
                        />
                      </div>
                      <Question
                        values={values[index].questions}
                        pillarIndex={pillarIndex}
                        sectionIndex={index}
                        handleBlur={handleBlur}
                        setFieldValue={setFieldValue}
                        setFieldTouched={setFieldTouched}
                        handleChange={handleChange}
                      />
                    </div>
                  </div>
                );
              })}
            <button
              className="button button--primary button--block"
              type="button"
              onClick={() => {
                arrayHelpers.push(sectionFactory);
              }}
            >
              + {translateString(strings.newAssessment.addSection)}
            </button>
          </div>
        )}
      />
    );
  }
}
Section.propTypes = {
  values: PropTypes.array,
  handleBlur: PropTypes.func,
  setFieldValue: PropTypes.func,
  setFieldTouched: PropTypes.func,
  handleChange: PropTypes.func,
  pillarIndex: PropTypes.number,
};
export default Section;
