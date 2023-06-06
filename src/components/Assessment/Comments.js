import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import {
  translateString,
  strings,
  ADVISOR_ASSESSMENT,
  MASTER_ASSESSOR_ASSESSMENT,
} from '../../utilities';

/**
 * A wrapper component to display the comments on the campaign assesment.
 */
class Comments extends Component {
  state = {
    showComment: [],
    comment: {},
    showAssessorSectionComment: false,
    showAssessorImprovementPlan: false,
    showAdvisorSectionComment: false,
    showAdvisorImprovementPlan: false,
  };
  render() {
    const {
      section,
      handleBlur,
      handleChange,
      values,
      assessmentViewType,
    } = this.props;
    const { id } = section;
    return (
      <section className="improvement-step">
        <h1 className="visually-hidden">Improvement Step</h1>
        <div className="assessment-section__textarea-wrapper">
          <div className="form-item">
            <label htmlFor="improvement-plan-step">
              {translateString(strings.assessorAssessment.improvementPlan)}
            </label>
            {(assessmentViewType === ADVISOR_ASSESSMENT ||
              assessmentViewType === MASTER_ASSESSOR_ASSESSMENT) && (
              <p>
                <Link
                  to="#!"
                  className="button button--link not-submitting"
                  onClick={e => {
                    e.preventDefault();
                    this.setState({
                      showAssessorImprovementPlan: !this.state
                        .showAssessorImprovementPlan,
                    });
                  }}
                >
                  {translateString(
                    !this.state.showAssessorImprovementPlan
                      ? strings.advisorAssessment.showImprovementPlan
                      : strings.advisorAssessment.hideImprovementPlan
                  )}
                </Link>
              </p>
            )}
            {this.state.showAssessorImprovementPlan && (
              <p>{`${translateString(
                strings.advisorAssessment.assessorComment
              )}: ${values.assessor_improvement_plans[String(id)]}`}</p>
            )}
            {assessmentViewType === MASTER_ASSESSOR_ASSESSMENT && (
              <p>
                <Link
                  to="#!"
                  className="button button--link not-submitting"
                  onClick={e => {
                    e.preventDefault();
                    this.setState({
                      showAdvisorImprovementPlan: !this.state
                        .showAdvisorImprovementPlan,
                    });
                  }}
                >
                  {translateString(
                    !this.state.showAdvisorImprovementPlan
                      ? strings.maAssessment.showAdvisorImprovementPlan
                      : strings.maAssessment.hideAdvisorImprovementPlan
                  )}
                </Link>
              </p>
            )}
            {this.state.showAdvisorImprovementPlan && (
              <p>{`${translateString(strings.maAssessment.advisorComment)}: ${
                values.advisor_improvement_plans[String(id)]
              }`}</p>
            )}
            {assessmentViewType === MASTER_ASSESSOR_ASSESSMENT && (
              <textarea
                name={`improvement_plans[${String(id)}]`}
                form="assessment-answer"
                placeholder={translateString(strings.evidence.description)}
                value={values.improvement_plans[String(id)]}
                onChange={handleChange}
                onBlur={handleBlur}
              />
            )}
            {assessmentViewType !== MASTER_ASSESSOR_ASSESSMENT && (
              <textarea
                name={`improvement_plans[${String(id)}]`}
                form="assessment-answer"
                placeholder={translateString(strings.evidence.description)}
                value={values.improvement_plans[String(id)]}
                onChange={handleChange}
                onBlur={handleBlur}
              />
            )}
          </div>
          <div className="form-item">
            <label htmlFor="analysis-comment">
              {translateString(strings.assessorAssessment.analysisComment)}
            </label>
            {(assessmentViewType === ADVISOR_ASSESSMENT ||
              assessmentViewType === MASTER_ASSESSOR_ASSESSMENT) && (
              <p>
                <Link
                  to="#!"
                  className="button button--link"
                  onClick={e => {
                    e.preventDefault();
                    this.setState({
                      showAssessorSectionComment: !this.state
                        .showAssessorSectionComment,
                    });
                  }}
                >
                  {translateString(
                    !this.state.showAssessorSectionComment
                      ? strings.advisorAssessment.showAnalysisComment
                      : strings.advisorAssessment.hideAnalysisComment
                  )}
                </Link>
              </p>
            )}
            {this.state.showAssessorSectionComment && (
              <p>{`${translateString(
                strings.advisorAssessment.assessorComment
              )}: ${values.assessor_section_analysis_comments[String(id)]}`}</p>
            )}
            {assessmentViewType === MASTER_ASSESSOR_ASSESSMENT && (
              <p>
                <Link
                  to="#!"
                  className="button button--link not-submitting"
                  onClick={e => {
                    e.preventDefault();
                    this.setState({
                      showAdvisorSectionComment: !this.state
                        .showAdvisorSectionComment,
                    });
                  }}
                >
                  {translateString(
                    !this.state.showAdvisorSectionComment
                      ? strings.maAssessment.showAnalysisComment
                      : strings.maAssessment.hideAnalysisComment
                  )}
                </Link>
              </p>
            )}
            {this.state.showAdvisorSectionComment && (
              <p>{`${translateString(strings.maAssessment.advisorComment)}: ${
                values.advisor_section_analysis_comments[String(id)]
              }`}</p>
            )}
            {assessmentViewType === MASTER_ASSESSOR_ASSESSMENT && (
              <textarea
                name={`section_analysis_comments[${String(id)}]`}
                form="assessment-answer"
                placeholder={translateString(strings.evidence.description)}
                value={values.section_analysis_comments[String(id)]}
                onChange={handleChange}
                onBlur={handleBlur}
              />
            )}
            {assessmentViewType !== MASTER_ASSESSOR_ASSESSMENT && (
              <textarea
                name={`section_analysis_comments[${String(id)}]`}
                form="assessment-answer"
                placeholder={translateString(strings.evidence.description)}
                value={values.section_analysis_comments[String(id)]}
                onChange={handleChange}
                onBlur={handleBlur}
              />
            )}
          </div>
        </div>
      </section>
    );
  }
}

export default Comments;

Comments.propTypes = {
  section: PropTypes.object,
  handleChange: PropTypes.func,
  handleBlur: PropTypes.func,
  values: PropTypes.object,
  role: PropTypes.number,
  language: PropTypes.string,
  assessmentViewType: PropTypes.number,
};
