import React, { Fragment, Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { MyRadio } from '../../../components';
import { numbers } from '../../../utilities';

/**
 * A component that renders a question in a Self Assessment.
 */
class QuestionSelfAssessment extends Component {
  state = {
    comment: {},
  };

  render() {
    const { section, language, handleBlur, handleChange, values } = this.props;
    return (
      <ul className="assessment-section__questions">
        {section.questions.map((question, idx) => {
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
)(QuestionSelfAssessment);

QuestionSelfAssessment.propTypes = {
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
