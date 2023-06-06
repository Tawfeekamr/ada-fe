import React, { Fragment, Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { MyRadio } from '../../../components';
import { translateString, strings, numbers } from '../../../utilities';

/**
 * This component renders an assessment's question for the Assessor.
 */
class QuestionAssessorAssessment extends Component {
  state = {
    showComment: [],
    comment: {},
  };

  render() {
    const {
      section,
      language,
      handleBlur,
      handleChange,
      values,
      isDisabled,
    } = this.props;
    return (
      <ul className="assessment-section__questions">
        {section.questions.map((question, idx) => {
          const { id } = question;
          const hasComment =
            values.analysis_comment[String(id)] !== '' &&
            values.analysis_comment[String(id)] !== null;

          return (
            <li key={idx} className="assessment-section__question">
              <p className="assessment-section__question-title">
                {
                  question.translations.find(item => {
                    return item.locale === language;
                  }).question_text
                }
              </p>
              <p className="assessment-section__question-description">
                {question.translations
                  .find(item => {
                    return item.locale === language;
                  })
                  .description.split('\n')
                  .map((item, key) => {
                    return (
                      <Fragment key={key}>
                        {item}
                        <br />
                      </Fragment>
                    );
                  })}
              </p>
              <div className="assessment-section__question-answers-wrapper">
                <div className="assessment-section__question-answers">
                  {[1, 2, 3, 4, 5].map(val => {
                    return (
                      <div className="inline-radio" key={val}>
                        <MyRadio
                          label={
                            language === 'ar'
                              ? numbers.convertToArabic(String(val))
                              : String(val)
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
                  <div>
                    {!this.state.showComment[idx] && (
                      <button
                        hidden={isDisabled || hasComment}
                        onClick={() => {
                          const showCommentTemp = [...this.state.showComment];
                          showCommentTemp[idx] = true;
                          this.setState({ showComment: showCommentTemp });
                        }}
                        className="button button--primary add"
                      >
                        {translateString(strings.assessorAssessment.addComment)}
                      </button>
                    )}
                    {(this.state.showComment[idx] || hasComment) && (
                      <div className="form-item">
                        <textarea
                          name={`analysis_comment[${String(id)}]`}
                          form={`analysis_comment[${String(id)}]`}
                          placeholder={translateString(
                            strings.assessorAssessment.comment
                          )}
                          value={values.analysis_comment[String(id)]}
                          onChange={handleChange}
                          onBlur={handleBlur}
                        />
                      </div>
                    )}
                  </div>
                </div>
                <div className="assessment-section__question-score">
                  <p>{translateString(strings.assessorAssessment.score)}</p>
                  <span className="score">
                    {language === 'ar'
                      ? numbers.convertToArabic(question.ratings.self)
                      : question.ratings.self}
                  </span>
                </div>
              </div>
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
    ...state.flags,
  };
}
const mapDispatchToProps = {};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(QuestionAssessorAssessment);

QuestionAssessorAssessment.propTypes = {
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
  isDisabled: PropTypes.bool,
};
