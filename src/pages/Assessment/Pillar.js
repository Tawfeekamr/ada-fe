import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FieldArray } from 'formik';
import { MyInputField, MyTextarea } from '../../components';
import {
  strings,
  translateString,
  validateForm,
  Confirmation,
} from '../../utilities';
import Section from './Section';
import PredefinedEvidences from './PredefinedEvidences';

class Pillar extends Component {
  render() {
    const {
      values,
      handleBlur,
      setFieldValue,
      setFieldTouched,
      handleChange,
      activePillarIndex,
      allValues,
      // isValid,
      errors,
      setActivePillar,
    } = this.props;
    const pillarFactory = {
      'name:en': '',
      'name:ar': '',
      'description:en': '',
      'description:ar': '',
      evidences: [],
      sections: [
        {
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
        },
      ],
    };
    // values: array of sections
    return (
      <FieldArray
        name={'pillars'}
        render={arrayHelpers => (
          <div className="field-array">
            <button
              className="button button--primary add-pillar"
              type="button"
              onClick={() => {
                validateForm.loopOnData(allValues, '', setFieldTouched);
                const isFormValid =
                  Object.entries(errors).length === 0 &&
                  errors.constructor === Object;
                if (isFormValid) {
                  arrayHelpers.push(pillarFactory);
                  setActivePillar(values.length);
                }
              }}
            >
              + {translateString(strings.newAssessment.addPillar)}
            </button>
            {values &&
              values.map((item, index) => {
                return (
                  <div key={index} hidden={activePillarIndex !== index}>
                    {values.length > 1 && (
                      <div className="form-action">
                        <button
                          className="button--remove"
                          type="button"
                          onClick={() => {
                            Confirmation.removeEntityFromFieldArray(
                              {
                                title: strings.newAssessment.confirmDeleteTitle,
                                message:
                                  strings.newAssessment.confirmDeleteMessage,
                              },
                              arrayHelpers.remove,
                              index,
                              () => {
                                this.props.setActivePillar(
                                  index === 0 ? 0 : index - 1
                                );
                              }
                            );
                          }}
                        />
                      </div>
                    )}
                    <div className="grid-wrapper grid--2">
                      <MyInputField
                        type="text"
                        title={translateString(strings.newAssessment.english)}
                        className="english"
                        classNameTitle="english"
                        label={`${translateString(
                          strings.newAssessment.pillarName
                        )} ${translateString(
                          strings.newAssessment.errors.inEnglish
                        )}`}
                        name={`pillars[${index}]name:en`}
                        id={`pillars[${index}]name:en`}
                        placeholder={`${translateString(
                          strings.newAssessment.pillarName
                        )} ${translateString(
                          strings.newAssessment.errors.inEnglish
                        )}`}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values['name:en']}
                      />
                      <MyInputField
                        title={translateString(strings.newAssessment.arabic)}
                        className="rtl"
                        containerName="rtl"
                        type="text"
                        label={`${translateString(
                          strings.newAssessment.pillarName
                        )} ${translateString(
                          strings.newAssessment.errors.inArabic
                        )}`}
                        name={`pillars[${index}]name:ar`}
                        id={`pillars[${index}]name:ar`}
                        placeholder={`${translateString(
                          strings.newAssessment.pillarName
                        )} ${translateString(
                          strings.newAssessment.errors.inArabic
                        )}`}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values['name:ar']}
                      />
                    </div>
                    <div className="grid-wrapper grid--2">
                      <MyTextarea
                        className="english"
                        label={`${translateString(
                          strings.newAssessment.pillarDescription
                        )} ${translateString(
                          strings.newAssessment.errors.inEnglish
                        )}`}
                        name={`pillars[${index}]description:en`}
                        id={`pillars[${index}]description:en`}
                        placeholder={`${translateString(
                          strings.newAssessment.pillarDescription
                        )} ${translateString(
                          strings.newAssessment.errors.inEnglish
                        )}`}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={item['description:en']}
                      />
                      <MyTextarea
                        label={`${translateString(
                          strings.newAssessment.pillarDescription
                        )} ${translateString(
                          strings.newAssessment.errors.inArabic
                        )}`}
                        name={`pillars[${index}]description:ar`}
                        id={`pillars[${index}]description:ar`}
                        placeholder={`${translateString(
                          strings.newAssessment.pillarDescription
                        )} ${translateString(
                          strings.newAssessment.errors.inArabic
                        )}`}
                        className="rtl"
                        containerName="rtl"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={item['description:ar']}
                      />
                    </div>
                    <Section
                      pillarIndex={index}
                      values={values[index].sections}
                      handleBlur={handleBlur}
                      setFieldValue={setFieldValue}
                      setFieldTouched={setFieldTouched}
                      handleChange={handleChange}
                    />
                    <PredefinedEvidences
                      pillarIndex={index}
                      values={values[index].evidences}
                      handleBlur={handleBlur}
                      handleChange={handleChange}
                    />
                  </div>
                );
              })}
          </div>
        )}
      />
    );
  }
}
Pillar.propTypes = {
  setActivePillar: PropTypes.func,
  // isValid: PropTypes.bool,
  values: PropTypes.array,
  errors: PropTypes.object,
  allValues: PropTypes.object,
  handleBlur: PropTypes.func,
  setFieldValue: PropTypes.func,
  setFieldTouched: PropTypes.func,
  handleChange: PropTypes.func,
  activePillarIndex: PropTypes.number,
};
export default Pillar;
