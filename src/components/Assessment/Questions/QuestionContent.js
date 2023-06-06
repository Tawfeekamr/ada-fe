import React, { Fragment, Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { translateString, strings } from '../../../utilities';

/**
 * This component controls how an assessment's question will be viewed according to the user's role.
 */
class QuestionContent extends Component {
  state = {
    showText: false,
    showAssessorComment: false,
  };
  truncateText = text => {
    const currentText = text.split(' ');
    return currentText.length < 15 ? text : currentText.slice(0, 14).join(' ');
  };
  getDescription = content => {
    if (!this.state.showText) {
      if (content.split('\n').length > 2)
        return content
          .split('\n')
          .slice(0, 2)
          .join('\n');
      return this.truncateText(content);
    }
    return content;
  };

  render() {
    const {
      values,
      description,
      disabled,
      handleChange,
      handleBlur,
      id,
      showAdvisorComment: shouldShowAdvisorComment,
    } = this.props;
    const shouldShowTruncateButton =
      this.truncateText(description) !== description;
    const descriptionList = this.getDescription(description).split('\n');
    const shouldShowAnalysisComment =
      !disabled || values.analysisComment !== null;
    return (
      <div>
        <p className="assessment-section__question-description">
          {descriptionList.map((item, key) => {
            return (
              <Fragment key={key}>
                {item}

                {key < descriptionList.length - 1 && <br />}
              </Fragment>
            );
          })}
          {shouldShowTruncateButton && (
            <Link
              to="#!"
              className="button button--link show-more"
              onClick={e => {
                e.preventDefault();
                this.setState({ showText: !this.state.showText });
              }}
            >
              {!this.state.showText
                ? translateString(strings.advisorAssessment.showMore)
                : translateString(strings.advisorAssessment.showLess)}
            </Link>
          )}
        </p>
        {shouldShowAnalysisComment && (
          <p>
            <Link
              to="#!"
              className="button button--link"
              onClick={e => {
                e.preventDefault();
                this.setState({
                  showAssessorComment: !this.state.showAssessorComment,
                });
              }}
            >
              {translateString(
                !this.state.showAssessorComment
                  ? strings.advisorAssessment.showAnalysisComment
                  : strings.advisorAssessment.hideAnalysisComment
              )}
            </Link>
          </p>
        )}
        {this.state.showAssessorComment && (
          <p>{`${translateString(strings.advisorAssessment.assessorComment)}: ${
            values.assessor_analysis_comment[String(id)]
          }`}</p>
        )}
        {shouldShowAdvisorComment && (
          <p>
            <Link
              to="#!"
              className="button button--link"
              onClick={e => {
                e.preventDefault();
                this.setState({
                  showAdvisorComment: !this.state.showAdvisorComment,
                });
              }}
            >
              {translateString(
                !this.state.showAdvisorComment
                  ? strings.maAssessment.showAnalysisComment
                  : strings.maAssessment.hideAnalysisComment
              )}
            </Link>
          </p>
        )}
        {this.state.showAdvisorComment && (
          <p>{`${translateString(strings.advisorAssessment.advisorComment)}: ${
            values.advisor_analysis_comment[String(id)]
          }`}</p>
        )}
        <div className="form-item">
          <label htmlFor="advisor-analysis-comment">
            {translateString(
              shouldShowAdvisorComment
                ? strings.advisorAssessment.maComment
                : strings.advisorAssessment.advisorComment
            )}
          </label>
          <textarea
            name={`analysis_comment[${String(id)}]`}
            form="assessment-answer"
            placeholder={translateString(strings.assessorAssessment.comment)}
            value={values.analysis_comment[String(id)]}
            onChange={handleChange}
            onBlur={handleBlur}
          />
        </div>
      </div>
    );
  }
}

export default QuestionContent;

QuestionContent.propTypes = {
  handleChange: PropTypes.func,
  handleBlur: PropTypes.func,
  description: PropTypes.string,
  analysisComment: PropTypes.string,
  showAnalysisComment: PropTypes.bool,
  disabled: PropTypes.bool,
  values: PropTypes.object,
  id: PropTypes.number,
  role: PropTypes.number,
  showAdvisorComment: PropTypes.bool,
  autocompleteMAComment: PropTypes.bool,
};
