import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { MyRadio } from "../../../components";
import { numbers, translateString, strings } from "../../../utilities";
import QuestionContent from "./QuestionContent";
/**
 * This component renders an assessment's question for the Entity Advisor.
 */
class QuestionAdvisorAssessment extends Component {
  render() {
    const {
      language,
      handleBlur,
      handleChange,
      values,
      section,
      role
    } = this.props;

    return (
      <ul className="assessment-section__questions">
        {section.questions.map((question, idx) => {
          const questionLocale = question.translations.find(item => {
            return item.locale === language;
          });
          const {
            ratings: { self: selfRating, assessor },
            // comments: {
            //   advisor: { analysis_comment: advisorAnalysisComment },
            //   assessor: { analysis_comment: assessorAnalysisComment },
            // },
            assessor_analysis_comment: assessorAnalysisComment,
            advisor_analysis_comment: advisorAnalysisComment
          } = question;
          const { description, question_text: title } = questionLocale;

          return (
            <li key={idx} className="assessment-section__question-list-wrapper">
              <div className="assessment-section__question-wrapper">
                <div className="assessment-section__question-content">
                  <p className="assessment-section__question-title">{title}</p>
                </div>
                <div className="assessment-section__question-scores-wrapper">
                  <div className="assessment-section__question-scoring">
                    <span>
                      {language === "ar"
                        ? numbers.convertToArabic(selfRating)
                        : selfRating}
                    </span>
                  </div>
                  <div className="assessment-section__question-scoring">
                    <span>
                      {language === "ar"
                        ? numbers.convertToArabic(assessor)
                        : assessor}
                    </span>
                  </div>
                </div>
                <div className="assessment-section__question-answers-wrapper">
                  <div className="assessment-section__question-answers agree">
                    {[1, 2].map(val => {
                      return (
                        <div className="inline-radio" key={val}>
                          <MyRadio
                            label={
                              val === 1
                                ? translateString(
                                    strings.advisorAssessment.agree
                                  )
                                : translateString(
                                    strings.advisorAssessment.disagree
                                  )
                            }
                            className=""
                            id={`question-${question.id}-${val}`}
                            type="radio"
                            name={String(question.id)}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={String(val)}
                            checked={parseInt(values[question.id], 10) === val}
                          />
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
              <QuestionContent
                assessorAnalysisComment={assessorAnalysisComment}
                advisorAnalysisComment={advisorAnalysisComment}
                handleChange={handleChange}
                description={description}
                disabled={true}
                values={values}
                id={question.id}
                role={role}
              />
            </li>
          );
        })}
      </ul>
    );
  }
}

function mapStateToProps(state) {
  return {
    language: state.language,
    ...state.flags
  };
}
const mapDispatchToProps = {};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(QuestionAdvisorAssessment);

QuestionAdvisorAssessment.propTypes = {
  /** @ignore */
  section: PropTypes.object,
  /** @ignore */
  handleChange: PropTypes.func,
  /** @ignore */
  handleBlur: PropTypes.func,
  /** Current values for questions */
  values: PropTypes.object,
  /** Current logged in role */
  role: PropTypes.number,
  /** Current language of system */
  language: PropTypes.string,
  /** If question is disabled */
  isDisabled: PropTypes.bool
};
