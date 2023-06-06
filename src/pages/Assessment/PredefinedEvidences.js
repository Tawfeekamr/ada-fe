import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FieldArray } from 'formik';
import { MyInputField, MyTextarea } from '../../components';
import { strings, translateString, Confirmation } from '../../utilities';

class PredefinedEvidences extends Component {
  render() {
    const { values, handleBlur, handleChange, pillarIndex } = this.props;
    const evidenceFactory = {
      'name:en': '',
      'name:ar': '',
      'description:en': '',
      'description:ar': '',
    };
    return (
      <FieldArray
        name={`pillars[${pillarIndex}]evidences`}
        render={arrayHelpers => (
          <fieldset className="has-border">
            <legend className="assessment-section-title">
              {translateString(strings.newAssessment.predefinedEvidences)}
            </legend>
            <div className="field-array">
              {values &&
                values.map((item, index) => {
                  return (
                    <div className="section-wrapper" key={index}>
                      <div className="form-action">
                        <button
                          className="button--remove"
                          type="button"
                          onClick={() => {
                            Confirmation.removeEntityFromFieldArray(
                              {
                                title:
                                  strings.newAssessment
                                    .confirmDeleteEvidenceTitle,
                                message:
                                  strings.newAssessment
                                    .confirmDeleteEvidenceMessage,
                              },
                              arrayHelpers.remove,
                              index
                            );
                          }}
                        />
                        <p className="assessment-section-title">
                          {translateString(strings.newAssessment.evidenceName)}{' '}
                          {index + 1}
                        </p>
                      </div>
                      <div className="section">
                        <div className="grid-wrapper grid--2">
                          <MyInputField
                            type="text"
                            className="english"
                            label={translateString(
                              strings.newAssessment.evidenceNameInEnglish
                            )}
                            name={`pillars[${pillarIndex}]evidences[${index}]name:en`}
                            id={`evidences-name:en-${index}`}
                            placeholder={translateString(
                              strings.newAssessment.evidenceNameInEnglish
                            )}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values[index]['name:en']}
                          />
                          <MyInputField
                            type="text"
                            name={`pillars[${pillarIndex}]evidences[${index}]name:ar`}
                            label={translateString(
                              strings.newAssessment.evidenceNameInArabic
                            )}
                            id={`evidences-name:ar-${index}`}
                            placeholder={translateString(
                              strings.newAssessment.evidenceNameInArabic
                            )}
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
                            label={translateString(
                              strings.newAssessment.evidenceDescriptionInEnglish
                            )}
                            name={`pillars[${pillarIndex}]evidences[${index}]description:en`}
                            id={`evidences-description:en-${index}`}
                            placeholder={translateString(
                              strings.newAssessment.evidenceDescriptionInEnglish
                            )}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values[index]['description:en']}
                          />
                          <MyTextarea
                            className="rtl"
                            label={translateString(
                              strings.newAssessment.evidenceDescriptionInArabic
                            )}
                            name={`pillars[${pillarIndex}]evidences[${index}]description:ar`}
                            id={`evidences-description:ar-${index}`}
                            containerName="rtl"
                            placeholder={translateString(
                              strings.newAssessment.evidenceDescriptionInArabic
                            )}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values[index]['description:ar']}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              <button
                className="button button--primary button--block"
                type="button"
                onClick={() => {
                  arrayHelpers.push(evidenceFactory);
                }}
              >
                + {translateString(strings.newAssessment.addEvidence)}
              </button>
            </div>
          </fieldset>
        )}
      />
    );
  }
}
PredefinedEvidences.propTypes = {
  values: PropTypes.array,
  handleBlur: PropTypes.func,
  setFieldValue: PropTypes.func,
  setFieldTouched: PropTypes.func,
  handleChange: PropTypes.func,
  pillarIndex: PropTypes.number,
};
export default PredefinedEvidences;
