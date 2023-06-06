import React from 'react';
import PropTypes from 'prop-types';
import Questions from './Questions/Questions';
import Comments from './Comments';
import {
  SELF_ASSESSMENT,
  ADVISOR_ASSESSMENT,
  translateString,
  strings,
  numbers,
} from '../../utilities';

/**
 * A wrapper component to wrap and style the questions and CONDITIONALLY the answers inside it.
 */
const SectionWrapper = props => {
  const {
    section,
    section: { translations },
    handleChange,
    handleBlur,
    values,
    role,
    language,
    assessmentViewType,
    isDisabled,
  } = props;
  return (
    <div className="assessment-section__wrapper">
      <h2 className="assessment-section__title">
        {translations.length > 0 &&
          translations.find(item => {
            return item.locale === language;
          }).name}
      </h2>
      <p className="assessment-section__description">
        {translations.length > 0 &&
          translations.find(item => {
            return item.locale === language;
          }).description}
      </p>
      {assessmentViewType === ADVISOR_ASSESSMENT && (
        <div className="assessment-section__score">
          <h3 className="assessment-section__title">
            {translateString(strings.advisorAssessment.scores)}
          </h3>
          <div className="assessment-section__question-score-wrapper">
            <div className="assessment-section__question-score">
              <span>
                {translateString(strings.advisorAssessment.selfScore)}
              </span>
              <span className="score">
                {language === 'ar'
                  ? numbers.convertToArabic(section.score.self)
                  : section.score.self}
              </span>
            </div>
            <div className="assessment-section__question-score">
              <span>
                {translateString(strings.advisorAssessment.assessorScore)}
              </span>
              <span className="score">
                {language === 'ar'
                  ? numbers.convertToArabic(section.score.assessor)
                  : section.score.assessor}
              </span>
            </div>
          </div>
        </div>
      )}

      <Questions
        section={section}
        handleChange={handleChange}
        handleBlur={handleBlur}
        values={values}
        role={role}
        type={assessmentViewType}
        isDisabled={isDisabled}
      />
      {assessmentViewType !== SELF_ASSESSMENT && (
        <Comments
          section={section}
          handleChange={handleChange}
          handleBlur={handleBlur}
          values={values}
          role={role}
          assessmentViewType={assessmentViewType}
        />
      )}
    </div>
  );
};
export default SectionWrapper;
SectionWrapper.propTypes = {
  section: PropTypes.object,
  handleChange: PropTypes.func,
  handleBlur: PropTypes.func,
  values: PropTypes.object,
  role: PropTypes.number,
  language: PropTypes.string,
  assessmentViewType: PropTypes.number,
  isDisabled: PropTypes.bool,
};
