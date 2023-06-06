import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { Formik, Form } from "formik";
import { toastr } from "react-redux-toastr";
import { Loading, EvidenceDetails } from "../../components";
import {
  Progress,
  PillarNavigation,
  SectionNavigation,
  SectionPillarNavigation,
  SectionWrapper,
  Buttons
} from "../../components/Assessment";

import {
  saveRating,
  getAssessmentData,
  getAssessmentDataByParams,
  saveAssessorRating,
  generateSelfReport
} from "../../actions";
import { Landing, Thanks } from "../../pages";

import {
  strings,
  translateString,
  AssessmentHelper,
  ASSESSOR_ASSESSMENT,
  SELF_ASSESSMENT,
  ADVISOR_ASSESSMENT,
  ENTITY_USER,
  ENTITY_COORDINATOR,
  MASTER_ASSESSOR_ASSESSMENT,
  numbers
} from "../../utilities";
import { LIGHT_TOUCH } from "../Campaign/AssessmentTypes";
/** Shows the assessment depending on the user role.
 * It has the list of pillars and sections where user can navigate from.
 * User can answer or view only assessment depending on the status.
 * @visibleName Assessment Details
 */
class AssessmentDetails extends Component {
  state = {};
  constructor(props) {
    super(props);
    this.state = {
      activePillar: 0,
      activeSection: 0,
      evidences: [],
      displayMessage: true,
      inCompletedPillars: [],
      inCompletedSections: []
    };
  }
  componentDidMount() {
    if (this.props.match.params.entityId) {
      const { entityId, campaignId, assessmentId } = this.props.match.params;
      this.props.getAssessmentDataByParams(entityId, campaignId, assessmentId);
    } else {
      //  this.props.getAssessmentData();
      this.props.getAssessmentData().catch(err => {
        // toastr.error(err.response.data.message);
      });
    }
  }
  getCommentsView = assessmentType => {
    switch (assessmentType) {
      case MASTER_ASSESSOR_ASSESSMENT:
        return "master_assessor";
      case ADVISOR_ASSESSMENT:
        return "advisor";
      default:
        return "assessor";
    }
  };
  showAssesment() {
    this.setState({
      displayMessage: false
    });
  }
  setActivePillar(index) {
    this.setState({
      activeSection: 0,
      activePillar: index
    });
  }
  setActiveSection(index) {
    this.setState({ activeSection: index });
  }
  updateActivePillarSection(section, pillar) {
    this.setState({
      activeSection: section,
      activePillar: pillar
    });
  }

  generateSelfReport = campaignId => {
    this.props
      .generateSelfReport(campaignId)
      .then(res => {
        window.open(res.value.data.url);
      })
      .catch(() => {});
  };

  render() {
    const { userRole: role, disabled, type: assessmentViewType } = this.props;
    let data = {};
    if (assessmentViewType !== SELF_ASSESSMENT) {
      data = {
        analysis_comment: {},
        improvement_plans: {},
        section_analysis_comments: {},
        assessor_section_analysis_comments: {},
        advisor_improvement_plans: {},
        assessor_improvement_plans: {},
        assessor_analysis_comment: {},
        advisor_analysis_comment: {},
        advisor_section_analysis_comments: {}
      };
    }
    if (this.props.assessment.isFetching) {
      return <Loading />;
    }
    if (this.props.assessment.hasErrors) {
      return (
        <div className="container">
          <p>{translateString(strings.assessment.noAssessments)}</p>
        </div>
      );
    }

    const {
      pillars,
      translations,
      answered,
      submitted,
      readonly,
      id: assessmentID,
      assessment_type: assessmentType,
      skip_advisor_status: skipped,
      skip_advisor_reason: reason
    } = this.props.assessment.data;
    const { entityId, campaignId } = this.props.match.params;
    const hasSelfAssessmentRoles = role === ENTITY_USER; // roles that has self assessment, should be refactored
    const shouldShowLandingPage =
      (role === ENTITY_COORDINATOR || role === ENTITY_USER) && !answered; // EC and EU show show a Landing page when not selfsubmitted
    /**  TODO Should be tested and then removed where disabled
     should be retrieved from the route props or backend * */
    const isDisabled = !!(
      (this.props.history.location.state &&
        this.props.history.location.state.disabled) ||
      AssessmentHelper.shouldBeDisabled(role, readonly) ||
      disabled
    );
    const { language } = this.props;
    if (this.state.displayMessage && shouldShowLandingPage) {
      // eslint-disable-line
      return (
        <Landing type={assessmentType} hide={this.showAssesment.bind(this)} />
      );
    }
    if (this.state.thanks || (submitted.self === 1 && hasSelfAssessmentRoles)) {
      return (
        <Thanks
          reportFetching={this.props.generatedSelfReport.isFetching}
          generateSelfReport={this.generateSelfReport}
          campaignId={campaignId}
          type={assessmentType}
          role={role}
        />
      );
    }
    if (pillars[this.state.activePillar] === undefined) {
      return (
        <div className="container top-component">
          <p>Assessment is empty</p>
        </div>
      );
    }
    if (assessmentViewType === MASTER_ASSESSOR_ASSESSMENT) {
      pillars.forEach(pillar => {
        pillar.sections.forEach(section => {
          if (section.comments.master_assessor.improvement_plan === "") {
            section.comments.master_assessor.improvement_plan =
              section.comments.assessor.improvement_plan;
          }
          if (section.comments.master_assessor.analysis_comment === "") {
            section.comments.master_assessor.analysis_comment =
              section.comments.assessor.analysis_comment;
          }
          section.questions.forEach(question => {
            if (question.comments.master_assessor.analysis_comment === "") {
              question.comments.master_assessor.analysis_comment =
                question.comments.assessor.analysis_comment;
            }
          });
        });
      });
    }
    pillars.forEach(pillar => {
      pillar.sections.forEach(section => {
        if (assessmentViewType !== SELF_ASSESSMENT) {
          data.improvement_plans[section.id] =
            section.comments[this.getCommentsView(assessmentViewType)]
              .improvement_plan || "";
          data.section_analysis_comments[section.id] =
            section.comments[this.getCommentsView(assessmentViewType)]
              .analysis_comment || "";

          if (assessmentViewType === MASTER_ASSESSOR_ASSESSMENT) {
            data.advisor_section_analysis_comments[section.id] =
              section.comments.advisor.analysis_comment;
            data.advisor_improvement_plans[section.id] =
              section.comments.advisor.improvement_plan;
            data.assessor_section_analysis_comments[section.id] =
              section.comments.assessor.analysis_comment;
            data.assessor_improvement_plans[section.id] =
              section.comments.assessor.improvement_plan;
          }

          if (assessmentViewType === ADVISOR_ASSESSMENT) {
            data.assessor_section_analysis_comments[section.id] =
              section.comments.assessor.analysis_comment;
            data.assessor_improvement_plans[section.id] =
              section.comments.assessor.improvement_plan;
          }
        }
        section.questions.forEach(question => {
          if (assessmentViewType === SELF_ASSESSMENT) {
            data[question.id] = question.ratings.self || 0;
          } else {
            data.analysis_comment[question.id] =
              question.comments[this.getCommentsView(assessmentViewType)]
                .analysis_comment || "";
            if (assessmentViewType === ASSESSOR_ASSESSMENT) {
              data[question.id] = question.ratings.assessor || 0;
            }
            if (assessmentViewType === ADVISOR_ASSESSMENT) {
              data[question.id] = question.ratings.advisor || 0;
              data.assessor_analysis_comment[question.id] =
                question.comments.assessor.analysis_comment;
              // data.advisor_analysis_comment[question.id] =
              //   question.comments.advisor.analysis_comment;
            }
            if (assessmentViewType === MASTER_ASSESSOR_ASSESSMENT) {
              data[question.id] = question.ratings;
              //  if (data.assessor_analysis_comment[question.id] === '') {
              data.assessor_analysis_comment[question.id] =
                question.comments.assessor.analysis_comment || "";
              //  }
              // if (data.advisor_analysis_comment[question.id] === '') {
              data.advisor_analysis_comment[question.id] =
                question.comments.advisor.analysis_comment || "";
              // }
            }
          }
        });
      });
    });
    return (
      <Formik
        id="assessment-answer"
        initialValues={data}
        onSubmit={(values, { setSubmitting }) => {
          setSubmitting(true);
          const payload = AssessmentHelper.getAssessmentPayLoad(
            values,
            assessmentViewType,
            campaignId,
            entityId
          );
          if (this.state.exit) {
            payload.exit = 1;
          }
          const saveFunction =
            assessmentViewType !== SELF_ASSESSMENT
              ? this.props.saveAssessorRating(assessmentID, payload)
              : this.props.saveRating(payload);
          saveFunction
            .then(res => {
              setSubmitting(false);
              toastr.success(res.value.message);
              if (this.state.exit) {
                this.setState({
                  thanks: true,
                  exit: false
                });
              }
            })
            .catch(err => {
              setSubmitting(false);
              this.setState({ exit: false });
              toastr.error(err.response.data.message);
            });
        }}
        render={({
          values,
          handleChange,
          handleBlur,
          handleSubmit,
          isSubmitting,
          submitForm
        }) => (
          <Form onSubmit={handleSubmit} className="assessment">
            <div className="container top-component">
              <header>
                <h1 className="section-title bold">
                  {translations.length > 1 &&
                    translations.find(item => {
                      return item.locale === language;
                    }).name}
                </h1>
              </header>
              <PillarNavigation
                pillars={pillars}
                activePillar={this.state.activePillar}
                activatePillar={this.setActivePillar.bind(this)}
                inCompletedPillars={this.state.inCompletedPillars}
              />
              <Progress
                language={this.props.language}
                type={assessmentViewType}
                values={values}
              />
              {!!skipped && assessmentViewType === MASTER_ASSESSOR_ASSESSMENT && (
                <div className="assessment assessment__skip">
                  <p>
                    {translateString(strings.skipCampaign.assessmentSkipped)}
                  </p>
                  <dl className="assessment assessment__reason">
                    <dt>
                      {translateString(strings.skipCampaign.assessmentReason)}
                    </dt>
                    <dd>{reason}</dd>
                  </dl>
                </div>
              )}
              <p className="pillar-description">
                {pillars[this.state.activePillar].translations
                  .find(item => {
                    return item.locale === language;
                  })
                  .description.split("\n")
                  .map((item, key) => {
                    return (
                      <Fragment key={key}>
                        {item}
                        <br />
                      </Fragment>
                    );
                  })}
              </p>

              {!isDisabled && (
                <Buttons
                  exit={this.state.exit}
                  saveDisabled={isSubmitting}
                  submitDisabled={isSubmitting}
                  submitSuccess={() => {
                    const assessmentIncompleted = AssessmentHelper.validateAssessment(
                      values,
                      pillars
                    );
                    if (assessmentIncompleted) {
                      const {
                        shouldBeActivePillar,
                        shouldBeActiveSection,
                        inCompletedPillars,
                        inCompletedSections,
                        emptyQuestions
                      } = assessmentIncompleted;
                      const emptyQuestionsLength =
                        language === "ar"
                          ? numbers.convertToArabic(emptyQuestions.length)
                          : emptyQuestions.length;
                      this.updateActivePillarSection(
                        shouldBeActiveSection,
                        shouldBeActivePillar
                      );
                      this.setState({
                        inCompletedPillars,
                        inCompletedSections
                      });
                      toastr.error(
                        translateString(
                          strings.newAssessment.errors.unansweredQuestionsPart1
                        ) +
                          emptyQuestionsLength +
                          translateString(
                            strings.newAssessment.errors
                              .unansweredQuestionsPart2
                          )
                      );
                    } else {
                      this.setState({ exit: true }, submitForm);
                    }
                  }}
                  confirmationMessage={AssessmentHelper.getConfirmationMessage(
                    assessmentType,
                    role
                  )}
                />
              )}
            </div>
            {pillars.map((pillar, pillarIndex) => {
              return (
                <div
                  key={pillarIndex}
                  hidden={pillarIndex !== this.state.activePillar}
                >
                  <div className="container container--wide">
                    <div className="tabs-container">
                      <SectionNavigation
                        pillar={pillar}
                        activeSection={this.state.activeSection}
                        setActiveSection={this.setActiveSection.bind(this)}
                        inCompletedSections={this.state.inCompletedSections}
                      />
                      <div className="form-wrapper">
                        <div className="tabs-content">
                          {pillar.sections.map((section, index) => {
                            return (
                              <fieldset
                                disabled={isDisabled}
                                className="tab tab--item assessment-section"
                                key={index}
                                hidden={index !== this.state.activeSection}
                              >
                                <SectionWrapper
                                  section={section}
                                  handleChange={handleChange}
                                  handleBlur={handleBlur}
                                  language={language}
                                  assessmentViewType={assessmentViewType}
                                  values={values}
                                  role={role}
                                  isDisabled={isDisabled}
                                />
                                {pillar.evidences.length > 0 &&
                                  assessmentType !== LIGHT_TOUCH && (
                                    <div className="evidences">
                                      <h2 className="assessment-section__title">
                                        {translateString(
                                          strings.evidence.title
                                        )}
                                      </h2>
                                      <div className="evidences-list">
                                        {pillar.evidences.map(
                                          (evidence, evidenceIndex) => {
                                            return (
                                              <EvidenceDetails
                                                updateEvidence={AssessmentHelper.updateEvidence.bind(
                                                  this,
                                                  evidence
                                                )}
                                                isDisabled={isDisabled}
                                                userRole={role}
                                                evidence={evidence}
                                                key={evidenceIndex}
                                              />
                                            );
                                          }
                                        )}
                                      </div>
                                    </div>
                                  )}
                                {!isDisabled && (
                                  <SectionPillarNavigation
                                    activePillar={this.state.activePillar}
                                    activeSection={this.state.activeSection}
                                    pillars={pillars}
                                    updateActivePillarSection={this.updateActivePillarSection.bind(
                                      this
                                    )}
                                  />
                                )}
                                {!isDisabled && (
                                  <div className="bottom-assessment">
                                    <Buttons
                                      exit={this.state.exit}
                                      saveDisabled={isSubmitting}
                                      submitDisabled={isSubmitting}
                                      submitSuccess={() => {
                                        const assessmentIncompleted = AssessmentHelper.validateAssessment(
                                          values,
                                          pillars
                                        );
                                        if (assessmentIncompleted) {
                                          const {
                                            shouldBeActivePillar,
                                            shouldBeActiveSection,
                                            inCompletedPillars,
                                            inCompletedSections,
                                            emptyQuestions
                                          } = assessmentIncompleted;
                                          this.updateActivePillarSection(
                                            shouldBeActiveSection,
                                            shouldBeActivePillar
                                          );
                                          this.setState({
                                            inCompletedPillars,
                                            inCompletedSections
                                          });
                                          toastr.error(
                                            translateString(
                                              strings.newAssessment.errors
                                                .unansweredQuestionsPart1
                                            ) +
                                              emptyQuestions.length +
                                              translateString(
                                                strings.newAssessment.errors
                                                  .unansweredQuestionsPart2
                                              )
                                          );
                                        } else {
                                          this.setState(
                                            { exit: true },
                                            submitForm
                                          );
                                        }
                                      }}
                                      confirmationMessage={AssessmentHelper.getConfirmationMessage(
                                        assessmentType,
                                        role
                                      )}
                                    />
                                  </div>
                                )}
                              </fieldset>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </Form>
        )}
      />
    );
  }
}
function mapStateToProps(state) {
  const { assessment, generatedSelfReport } = state;
  const entitiesNoAdvisorList = state.entitiesNoAdvisor.list[state.language];
  const roles = state.roles.list[state.language];

  return {
    assessment,
    generatedSelfReport,
    entitiesNoAdvisorList,
    roles,
    language: state.language,
    ...state.flags
  };
}
const mapDispatchToProps = {
  saveRating,
  getAssessmentData,
  getAssessmentDataByParams,
  saveAssessorRating,
  generateSelfReport
};
export default connect(mapStateToProps, mapDispatchToProps)(AssessmentDetails);

AssessmentDetails.propTypes = {
  /** Number of questions for validation */
  questions_number: PropTypes.number,
  /** Name of assessment */
  name: PropTypes.string,
  /** Retrieve data for assessment */
  getAssessmentData: PropTypes.func,
  /** @ignore */
  getAssessmentDataByParams: PropTypes.func,
  /** Role for current logged in user */
  userRole: PropTypes.number,
  /** @ignore */
  match: PropTypes.shape({
    params: PropTypes.shape({
      assessmentId: PropTypes.string,
      campaignId: PropTypes.string,
      entityId: PropTypes.string
    })
  }),
  /** @ignore */
  history: PropTypes.object,
  /** Saves all answers for assessment */
  saveRating: PropTypes.func,
  /** @ignore */
  saveAssessorRating: PropTypes.func,
  /** Data for assessment including pillars, sections and questions */
  assessment: PropTypes.shape({
    isFetching: PropTypes.bool,
    data: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    hasErrors: PropTypes.bool
  }),
  /** Current language of system */
  language: PropTypes.string,
  /** Generate report for user after submission */
  generateSelfReport: PropTypes.func,
  /** Status of generated report */
  generatedSelfReport: PropTypes.object,
  /** Shows if assessment is read only */
  disabled: PropTypes.bool,
  /** Shows assessment component according to type of user */
  type: PropTypes.number
};
