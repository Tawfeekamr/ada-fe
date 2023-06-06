import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { numbers, translateString, strings } from '../../../utilities';
import QuestionContent from './QuestionContent';
import QuestionMaContent from './QuestionMaContent';

/**
 * A wrapper component to display the questions and the assessment by the Master Assesor.
 */
class QuestionMaAssessment extends Component {
  state = {
    questions: [],
  };
  componentDidMount() {
    const { section, language } = this.props;
    const questionsArray = section.questions.map(question => {
      return question.translations.find(item => {
        return item.locale === language;
      });
    });
    this.setState({ questions: questionsArray });
  }

  render() {
    const {
      language,
      handleBlur,
      handleChange,
      values,
      section,
      isDisabled,
      role,
    } = this.props;
    const keys = ['self', 'assessor', 'advisor', 'maturity'];
    return (
      <div>
        <div className="assessment-section__score">
          <h3 className="assessment-section__title">
            {translateString(strings.advisorAssessment.scores)}
          </h3>
          <div className="assessment-section__question-score-wrapper full-width">
            {keys.map((item, index) => {
              return (
                <div key={index} className="assessment-section__question-score">
                  <span>{translateString(strings.maAssessment[item])}</span>
                  <span className={section.score[item] ? 'score' : ''}>
                    {language === 'ar'
                      ? numbers.convertToArabic(section.score[item] || '')
                      : section.score[item] || ''}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
        <ul className="assessment-section__questions">
          {section.questions.map((question, idx) => {
            const questionLocale = question.translations.find(item => {
              return item.locale === language;
            });
            const { id } = question;
            const { description, question_text: title } = questionLocale;

            return (
              <li
                key={idx}
                className="assessment-section__question-list-wrapper"
              >
                <div className="assessment-section__question-wrapper">
                  <div className="assessment-section__question-content">
                    <p className="assessment-section__question-title">
                      {title}
                    </p>
                  </div>
                  <QuestionMaContent
                    keys={keys}
                    id={id}
                    values={values}
                    handleChange={handleChange}
                    handleBlur={handleBlur}
                    language={language}
                    isDisabled={isDisabled}
                  />
                </div>
                <QuestionContent
                  id={id}
                  description={description}
                  language={language}
                  disabled={isDisabled}
                  values={values}
                  handleChange={handleChange}
                  handleBlur={handleBlur}
                  showAdvisorComment={true}
                  role={role}
                />
              </li>
            );
          })}
        </ul>
      </div>
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
)(QuestionMaAssessment);

QuestionMaAssessment.propTypes = {
  section: PropTypes.object,
  handleChange: PropTypes.func,
  handleBlur: PropTypes.func,
  values: PropTypes.object,
  role: PropTypes.number,
  language: PropTypes.string,
  isDisabled: PropTypes.bool,
};
