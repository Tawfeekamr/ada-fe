import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { strings, translateString } from '../../utilities';
import { DEEP_DIVE } from '../Campaign/AssessmentTypes';

export class Thanks extends Component {
  getThanksMessage = (role, type) => {
    switch (role) {
      case 5:
        return type === DEEP_DIVE
          ? translateString(strings.assessment.ecThankYouDeepDive)
          : translateString(strings.assessment.ecThankYouSelfAssessment);
      case 6:
        return translateString(strings.assessment.euThankYou);
      case 3:
        return translateString(strings.assessment.asThankYou);
      default:
        return translateString(strings.thanks.description);
    }
  };
  render() {
    const { type, role } = this.props;
    return (
      <div className="container">
        <h1 className="landing-title">
          {translateString(strings.thanks.title)}
        </h1>
        <div>
          <p>{this.getThanksMessage(role, type)}</p>
          {role === 5 && type !== DEEP_DIVE && (
            <p className="align-center">
              <button
                type="button"
                className="button button--secondary"
                disabled={this.props.reportFetching}
                onClick={() => {
                  this.props.generateSelfReport(this.props.campaignId);
                }}
              >
                {translateString(strings.assessment.generateSelfReport)}
              </button>
            </p>
          )}
        </div>
      </div>
    );
  }
}
export default Thanks;
Thanks.propTypes = {
  role: PropTypes.number,
  type: PropTypes.number,
  campaignId: PropTypes.string,
  generateSelfReport: PropTypes.func,
  reportFetching: PropTypes.bool,
};
