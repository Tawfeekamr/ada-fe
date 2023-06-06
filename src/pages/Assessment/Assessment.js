import React, { Component } from 'react';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { connect } from 'react-redux';
import { toastr } from 'react-redux-toastr';
import PropTypes from 'prop-types';
import { Loading, MyInputField } from '../../components';
import {
  strings,
  translateString,
  // validateForm,
  numbers,
  getLanguage,
  Navigation,
} from '../../utilities';
import Pillar from './Pillar';
import {
  createAssessment,
  getAssessmentDetails,
  editAssessment,
} from '../../actions';
/**
 * A form to create new assessment.
 * It defines the data for pillars, sections and questions.
 * @visibleName New Assessment
 */
class Assessment extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activePillar: 0,
    };
  }
  componentDidMount() {
    const {
      match: {
        params: { id },
        path,
      },
    } = this.props;
    const existingAssessment = !!(
      id !== undefined && path === '/assessments/:id/edit'
    );
    if (existingAssessment) this.props.getAssessmentDetails(id);
  }
  setActivePillar(index) {
    this.setState({ activePillar: index });
  }
  handleInCampaignAssessment = () => {
    setTimeout(() => {
      this.props.history.push('/assessments');
    }, 500);
  };

  render() {
    const {
      match: {
        params: { id },
        path,
      },
      assessment: { data: assessmentData, isFetching },
    } = this.props;
    const existingAssessment = !!(
      id !== undefined && path === '/assessments/:id/edit'
    );
    if (
      (existingAssessment && isFetching) ||
      (existingAssessment &&
        assessmentData &&
        assessmentData.id !== parseInt(id, 10))
    ) {
      return <Loading />;
    } else if (existingAssessment && !isFetching) {
      const { inCampaign } = assessmentData;
      if (inCampaign && assessmentData.id === parseInt(id, 10)) {
        this.handleInCampaignAssessment();
        return <Loading />;
      }
    }
    const hasInitialValues = !isFetching && existingAssessment;
    let initialValues;
    if (hasInitialValues) {
      const { translations, pillars } = assessmentData;
      initialValues = {
        id,
        'name:en': translations[1].name,
        'name:ar': translations[0].name,
        pillars: pillars.map(pillar => ({
          id: pillar.id,
          'name:en': pillar.translations[1].name,
          'name:ar': pillar.translations[0].name,
          'description:en': pillar.translations[1].description,
          'description:ar': pillar.translations[0].description,
          evidences: pillar.evidences.map(evidence => ({
            id: evidence.id,
            'name:en': evidence.translations[1].name,
            'name:ar': evidence.translations[0].name,
            'description:en': evidence.translations[1].description,
            'description:ar': evidence.translations[0].description,
          })),
          sections: pillar.sections.map(section => ({
            id: section.id,
            'name:en': section.translations[1].name,
            'name:ar': section.translations[0].name,
            'description:en': section.translations[1].description,
            'description:ar': section.translations[0].description,
            questions: section.questions.map(question => ({
              'title:en': question.translations[1].title,
              'title:ar': question.translations[0].title,
              id: question.id,
              'question:en': question.translations[1].question_text,
              'question:ar': question.translations[0].question_text,
              'description:en': question.translations[1].description,
              'description:ar': question.translations[0].description,
              weight: question.weight,
            })),
          })),
        })),
      };
    }
    return (
      <Formik
        enableReinitialize
        initialValues={
          initialValues || {
            'name:en': '',
            'name:ar': '',
            pillars: [
              {
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
                        'title:en': '',
                        'title:ar': '',
                        'question:en': '',
                        'question:ar': '',
                        'description:en': '',
                        'description:ar': '',
                        weight: '',
                      },
                    ],
                  },
                ],
              },
            ],
          }
        }
        validationSchema={Yup.object().shape({
          'name:en': Yup.string().required(
            `${translateString(
              strings.newAssessment.errors.name
            )} ${translateString(strings.newAssessment.errors.inEnglish)}`
          ),
          'name:ar': Yup.string().required(
            `${translateString(
              strings.newAssessment.errors.name
            )} ${translateString(strings.newAssessment.errors.inArabic)}`
          ),
          pillars: Yup.array()
            .of(
              Yup.object().shape({
                'name:en': Yup.string().required(
                  `${translateString(
                    strings.newAssessment.errors.pillarName
                  )} ${translateString(strings.newAssessment.errors.inEnglish)}`
                ),
                'name:ar': Yup.string().required(
                  `${translateString(
                    strings.newAssessment.errors.pillarName
                  )} ${translateString(strings.newAssessment.errors.inArabic)}`
                ),
                'description:en': Yup.string().required(
                  `${translateString(
                    strings.newAssessment.errors.description
                  )} ${translateString(strings.newAssessment.errors.inEnglish)}`
                ),
                'description:ar': Yup.string().required(
                  `${translateString(
                    strings.newAssessment.errors.description
                  )} ${translateString(strings.newAssessment.errors.inArabic)}`
                ),
                evidences: Yup.array().of(
                  Yup.object().shape({
                    'name:en': Yup.string().required(
                      `${translateString(
                        strings.newAssessment.errors.evidenceName
                      )} ${translateString(
                        strings.newAssessment.errors.inEnglish
                      )}`
                    ),
                    'name:ar': Yup.string().required(
                      `${translateString(
                        strings.newAssessment.errors.evidenceName
                      )} ${translateString(
                        strings.newAssessment.errors.inArabic
                      )}`
                    ),
                    'description:en': Yup.string().required(
                      `${translateString(
                        strings.newAssessment.errors.evidenceDescription
                      )} ${translateString(
                        strings.newAssessment.errors.inEnglish
                      )}`
                    ),
                    'description:ar': Yup.string().required(
                      `${translateString(
                        strings.newAssessment.errors.evidenceDescription
                      )} ${translateString(
                        strings.newAssessment.errors.inArabic
                      )}`
                    ),
                  })
                ),
                sections: Yup.array().of(
                  Yup.object().shape({
                    'name:en': Yup.string().required(
                      `${translateString(
                        strings.newAssessment.errors.sectionName
                      )} ${translateString(
                        strings.newAssessment.errors.inEnglish
                      )}`
                    ),
                    'name:ar': Yup.string().required(
                      `${translateString(
                        strings.newAssessment.errors.sectionName
                      )} ${translateString(
                        strings.newAssessment.errors.inArabic
                      )}`
                    ),
                    'description:en': Yup.string().required(
                      `${translateString(
                        strings.newAssessment.errors.sectionDescription
                      )} ${translateString(
                        strings.newAssessment.errors.inEnglish
                      )}`
                    ),
                    'description:ar': Yup.string().required(
                      `${translateString(
                        strings.newAssessment.errors.sectionDescription
                      )} ${translateString(
                        strings.newAssessment.errors.inArabic
                      )}`
                    ),
                    questions: Yup.array().of(
                      Yup.object().shape({
                        'title:en': Yup.string().required(
                          `${translateString(
                            strings.newAssessment.errors.questionTitle
                          )} ${translateString(
                            strings.newAssessment.errors.inEnglish
                          )}`
                        ),
                        'title:ar': Yup.string().required(
                          `${translateString(
                            strings.newAssessment.errors.questionTitle
                          )} ${translateString(
                            strings.newAssessment.errors.inArabic
                          )}`
                        ),
                        'question:en': Yup.string().required(
                          `${translateString(
                            strings.newAssessment.errors.questionText
                          )} ${translateString(
                            strings.newAssessment.errors.inEnglish
                          )}`
                        ),
                        'question:ar': Yup.string().required(
                          `${translateString(
                            strings.newAssessment.errors.questionText
                          )} ${translateString(
                            strings.newAssessment.errors.inArabic
                          )}`
                        ),
                        'description:en': Yup.string().required(
                          `${translateString(
                            strings.newAssessment.errors.scoreDesciption
                          )} ${translateString(
                            strings.newAssessment.errors.inEnglish
                          )}`
                        ),
                        'description:ar': Yup.string().required(
                          `${translateString(
                            strings.newAssessment.errors.scoreDesciption
                          )} ${translateString(
                            strings.newAssessment.errors.inArabic
                          )}`
                        ),
                        weight: Yup.number()
                          .typeError(
                            translateString(strings.errors.numberInvalid)
                          )
                          .min(1, translateString(strings.errors.numberInvalid))
                          .max(
                            1000,
                            translateString(strings.errors.numberMaxInvalid)
                          )
                          .required(
                            translateString(strings.errors.weightIsRequired)
                          ),
                      })
                    ),
                  })
                ),
              })
            )
            .required('Please add a pillar'),
        })}
        onSubmit={(values, { setSubmitting }) => {
          /* eslint no-param-reassign: ["error", { "props": true, "ignorePropertyModificationsFor": ["values"] }] */
          let isValid = true;
          values.pillars.forEach(pillar => {
            if (pillar.sections.length > 8) {
              toastr.error(
                translateString(strings.errors.maxSections) +
                  (getLanguage() === 'ar' ? numbers.convertToArabic(8) : 8)
              );
              isValid = false;
              setSubmitting(false);
            } else if (pillar.sections.length < 3) {
              toastr.error(
                translateString(strings.errors.minSections) +
                  (getLanguage() === 'ar' ? numbers.convertToArabic(3) : 3)
              );
              isValid = false;
              setSubmitting(false);
            }
          });
          if (!isValid) return;
          if (existingAssessment) {
            setSubmitting(true);
            this.props
              .editAssessment(id, values)
              .then(() => {
                setSubmitting(false);
                toastr.success(
                  translateString(strings.message.editedAssessment)
                );
                this.props.history.push('/assessments');
              })
              .catch(() => {
                setSubmitting(false);
                toastr.error(this.props.assessmentEdited);
              });
          } else {
            setSubmitting(true);
            this.props
              .createAssessment(values)
              .then(() => {
                setSubmitting(false);
                toastr.success(translateString(strings.message.assessment));
                this.props.history.push('/assessments');
              })
              .catch(() => {
                setSubmitting(false);
                toastr.error(this.props.assessmentCreated);
              });
          }
        }}
        render={({
          values,
          handleChange,
          handleBlur,
          errors,
          touched,
          setFieldValue,
          setFieldTouched,
          handleSubmit,
          isSubmitting,
          // isValid,
        }) => {
          return (
            <Form
              className="assessment-form-wrapper container"
              onSubmit={handleSubmit}
            >
              <legend className="form-title">
                {existingAssessment
                  ? translateString(strings.editAssessment.title)
                  : translateString(strings.newAssessment.title)}
              </legend>
              <div className="grid-wrapper grid--2">
                <div className="form-item">
                  <MyInputField
                    type="text"
                    name="name:en"
                    label={`${translateString(
                      strings.newAssessment.name
                    )} ${translateString(
                      strings.newAssessment.errors.inEnglish
                    )}`}
                    id="name:en"
                    placeholder={`${translateString(
                      strings.newAssessment.name
                    )} ${translateString(
                      strings.newAssessment.errors.inEnglish
                    )}`}
                    className="english"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values['name:en']}
                    error={errors['name:en']}
                    touched={touched['name:en']}
                  />
                </div>
                <div className="form-item">
                  <MyInputField
                    type="text"
                    name="name:ar"
                    className="rtl"
                    id="name:ar"
                    label={`${translateString(
                      strings.newAssessment.name
                    )} ${translateString(
                      strings.newAssessment.errors.inArabic
                    )}`}
                    placeholder={`${translateString(
                      strings.newAssessment.name
                    )} ${translateString(
                      strings.newAssessment.errors.inArabic
                    )}`}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values['name:ar']}
                    containerName="rtl"
                    touched={touched['name:ar']}
                    error={errors['name:ar']}
                  />
                </div>
              </div>
              <ul className="list assessment-tabs">
                {values.pillars.map((item, index) => (
                  <li
                    key={index}
                    className={
                      this.state.activePillar === index ? 'active' : ''
                    }
                    onClick={() => {
                      this.setActivePillar(index);
                      // if (isValid) {
                      //   this.setActivePillar(index);
                      // } else {
                      //   validateForm.loopOnData(values, '', setFieldTouched);
                      // }
                    }}
                  >
                    <p>
                      {item[`name:${getLanguage()}`] ||
                        `${translateString(
                          strings.newAssessment.pillar
                        )} ${index + 1}`}
                    </p>
                  </li>
                ))}
              </ul>
              <div className="pillar-wrapper">
                <Pillar
                  // isValid={isValid}
                  activePillarIndex={this.state.activePillar}
                  values={values.pillars}
                  allValues={values}
                  handleBlur={handleBlur}
                  setFieldValue={setFieldValue}
                  setFieldTouched={setFieldTouched}
                  handleChange={handleChange}
                  touched={errors.pillars}
                  errors={errors}
                  setActivePillar={this.setActivePillar.bind(this)}
                />
              </div>
              <p className="submit-assessment">
                <button
                  className="button button--primary"
                  onClick={event => {
                    event.preventDefault();
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
                  {existingAssessment
                    ? translateString(strings.entity.edit)
                    : translateString(strings.entity.create)}
                </button>
              </p>
            </Form>
          );
        }}
      />
    );
  }
}
function mapStateToProps(state) {
  const { assessmentCreated, assessmentEdited, assessment } = state;

  return {
    assessmentCreated,
    assessmentEdited,
    assessment,
  };
}
const mapDispatchToProps = {
  editAssessment,
  createAssessment,
  getAssessmentDetails,
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Assessment);
Assessment.propTypes = {
  /** Submit data to create new assessment */
  createAssessment: PropTypes.func,
  editAssessment: PropTypes.func,
  getAssessmentDetails: PropTypes.func,
  /** Status of created assessment */
  assessmentCreated: PropTypes.object,
  assessmentEdited: PropTypes.object,
  assessment: PropTypes.object,
  /** @ignore */
  history: PropTypes.object,
  /** @ignore */
  push: PropTypes.func,
  /** @ignore */
  match: PropTypes.object,
};
