import React, { Component } from 'react';
import { FieldArray } from 'formik';
import PropTypes from 'prop-types';
import { MyInputField, MyTextarea } from '../../components';
import { strings, translateString, Confirmation } from '../../utilities';

class Question extends Component {
  render() {
    const {
      values,
      handleBlur,
      handleChange,
      pillarIndex,
      sectionIndex,
    } = this.props;
    const questionFactory = {
      'title:en': '',
      'title:ar': '',
      'question:en': '',
      'question:ar': '',
      'description:en': '',
      'description:ar': '',
      weight: '',
    };
    return (
      <FieldArray
        name={`pillars[${pillarIndex}]sections[${sectionIndex}]questions`}
        render={arrayHelpers => (
          <div className="field-array">
            {values &&
              values.map((item, index) => {
                return (
                  <div className="question-item" key={index}>
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
                                    .confirmDeleteQuestionTitle,
                                message:
                                  strings.newAssessment
                                    .confirmDeleteQuestionMessage,
                              },
                              arrayHelpers.remove,
                              index
                            );
                          }}
                        />
                      )}
                      <p className="assessment-question-title">
                        {translateString(strings.newAssessment.questionName)}{' '}
                        {index + 1}
                      </p>
                    </div>
                    <div className="grid-wrapper grid--2 two-thirds">
                      <MyInputField
                        type="text"
                        label={`${translateString(
                          strings.newAssessment.questionTitle
                        )} ${translateString(
                          strings.newAssessment.errors.inEnglish
                        )}`}
                        name={`pillars[${pillarIndex}]sections[${sectionIndex}]questions[${index}]title:en`}
                        id={`pillars[${pillarIndex}]sections[${sectionIndex}]questions[${index}]title:en`}
                        placeholder={`${translateString(
                          strings.newAssessment.questionTitle
                        )} ${translateString(
                          strings.newAssessment.errors.inEnglish
                        )}`}
                        className="english"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values[index]['title:en']}
                      />
                      <MyInputField
                        type="text"
                        label={`${translateString(
                          strings.newAssessment.questionTitle
                        )} ${translateString(
                          strings.newAssessment.errors.inArabic
                        )}`}
                        name={`pillars[${pillarIndex}]sections[${sectionIndex}]questions[${index}]title:ar`}
                        id={`pillars[${pillarIndex}]sections[${sectionIndex}]questions[${index}]title:ar`}
                        placeholder={`${translateString(
                          strings.newAssessment.questionTitle
                        )} ${translateString(
                          strings.newAssessment.errors.inArabic
                        )}`}
                        className="rtl"
                        containerName="rtl"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values[index]['title:ar']}
                      />
                    </div>
                    <div className="grid-wrapper grid--3">
                      <MyInputField
                        type="text"
                        label={`${translateString(
                          strings.newAssessment.questionText
                        )} ${translateString(
                          strings.newAssessment.errors.inEnglish
                        )}`}
                        name={`pillars[${pillarIndex}]sections[${sectionIndex}]questions[${index}]question:en`}
                        id={`pillars[${pillarIndex}]sections[${sectionIndex}]questions[${index}]question:en`}
                        placeholder={`${translateString(
                          strings.newAssessment.questionText
                        )} ${translateString(
                          strings.newAssessment.errors.inEnglish
                        )}`}
                        className="english"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values[index]['question:en']}
                      />
                      <MyInputField
                        type="text"
                        label={translateString(strings.newAssessment.weight)}
                        name={`pillars[${pillarIndex}]sections[${sectionIndex}]questions[${index}]weight`}
                        id={`pillars[${pillarIndex}]sections[${sectionIndex}]questions${index}weight`}
                        placeholder={translateString(
                          strings.newAssessment.weight
                        )}
                        className="english"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values[index].weight}
                      />
                      <MyInputField
                        type="text"
                        label={`${translateString(
                          strings.newAssessment.questionText
                        )} ${translateString(
                          strings.newAssessment.errors.inArabic
                        )}`}
                        name={`pillars[${pillarIndex}]sections[${sectionIndex}]questions[${index}]question:ar`}
                        id={`pillars[${pillarIndex}]sections[${sectionIndex}]questions[${index}]question:ar`}
                        placeholder={`${translateString(
                          strings.newAssessment.questionText
                        )} ${translateString(
                          strings.newAssessment.errors.inArabic
                        )}`}
                        className="rtl"
                        containerName="rtl"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values[index]['question:ar']}
                      />
                    </div>
                    <div className="grid-wrapper grid--2">
                      <MyTextarea
                        className="english"
                        label={`${translateString(
                          strings.newAssessment.score
                        )} ${translateString(
                          strings.newAssessment.errors.inEnglish
                        )}`}
                        name={`pillars[${pillarIndex}]sections[${sectionIndex}]questions[${index}]description:en`}
                        id={`pillars[${pillarIndex}]sections[${sectionIndex}]questions${index}description:en`}
                        placeholder={`${translateString(
                          strings.newAssessment.score
                        )} ${translateString(
                          strings.newAssessment.errors.inEnglish
                        )}`}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values[index]['description:en']}
                      />
                      <MyTextarea
                        name={`pillars[${pillarIndex}]sections[${sectionIndex}]questions[${index}]description:ar`}
                        id={`pillars[${pillarIndex}]sections[${sectionIndex}]questions${index}description:ar`}
                        label={`${translateString(
                          strings.newAssessment.score
                        )} ${translateString(
                          strings.newAssessment.errors.inArabic
                        )}`}
                        placeholder={`${translateString(
                          strings.newAssessment.score
                        )} ${translateString(
                          strings.newAssessment.errors.inArabic
                        )}`}
                        onChange={handleChange}
                        containerName="rtl"
                        className="rtl"
                        onBlur={handleBlur}
                        value={values[index]['description:ar']}
                      />
                    </div>
                  </div>
                );
              })}
            <button
              className="button button--primary button--block"
              type="button"
              onClick={() => arrayHelpers.push(questionFactory)}
            >
              + {translateString(strings.newAssessment.addQuestion)}
            </button>
          </div>
        )}
      />
    );
  }
}
Question.propTypes = {
  values: PropTypes.array,
  handleBlur: PropTypes.func,
  handleChange: PropTypes.func,
  pillarIndex: PropTypes.number,
  sectionIndex: PropTypes.number,
};
export default Question;
