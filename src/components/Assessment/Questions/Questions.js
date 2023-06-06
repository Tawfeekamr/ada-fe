import React from 'react';
import PropTypes from 'prop-types';
import QuestionAssessorAssessment from './QuestionAssessorAssessment';
import QuestionSelfAssessment from './QuestionSelfAssessment';
import QuestionAdvisorAssessment from './QuestionAdvisorAssessment';
import QuestionMaAssessment from './QuestionMaAssessment';

import {
  ASSESSOR_ASSESSMENT,
  SELF_ASSESSMENT,
  ADVISOR_ASSESSMENT,
  MASTER_ASSESSOR_ASSESSMENT,
} from '../../../utilities';

/**
 * A component that renders the required question component based on the assessment type.
 */
const Questions = props => {
  const { type } = props;
  switch (type) {
    case SELF_ASSESSMENT:
      return <QuestionSelfAssessment {...props} />;
    case ASSESSOR_ASSESSMENT:
      return <QuestionAssessorAssessment {...props} />;
    case ADVISOR_ASSESSMENT:
      return <QuestionAdvisorAssessment {...props} />;
    case MASTER_ASSESSOR_ASSESSMENT:
      return <QuestionMaAssessment {...props} />;
    default:
      return <QuestionSelfAssessment {...props} />;
  }
};
export default Questions;

Questions.propTypes = {
  type: PropTypes.number,
  section: PropTypes.object,
  handleChange: PropTypes.func,
  handleBlur: PropTypes.func,
  values: PropTypes.object,
  role: PropTypes.number,
  language: PropTypes.string,
  isDisabled: PropTypes.bool,
};
