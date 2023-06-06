import React from 'react';
import PropTypes from 'prop-types';
import { strings, translateString, numbers } from '../../utilities';

/**
 * A component that allows navigation between sections inside a pillar while completing the assessment.
 */
class SectionPillarNavigation extends React.Component {
  render() {
    const { values, language } = this.props;
    //  const total = Object.keys(values).length;
    let total = 0;
    let completed = 0;
    Object.keys(values).forEach(key => {
      if (Number(key) > 0) {
        total += 1;
        if (values[key] !== -1) {
          completed += 1;
        }
      }
    });
    const finished = `${Math.floor((completed / total) * 100)}%`;
    return (
      <div className="progress-wrapper">
        <p>{translateString(strings.assessment.progress)}</p>
        <div className="progress">
          <div className="filled" style={{ width: finished }} />
        </div>
        <p>
          {language === 'ar'
            ? numbers.convertToArabic(String(finished))
            : String(finished)}{' '}
          {translateString(strings.assessment.completed)}
        </p>
      </div>
    );
  }
}

export default SectionPillarNavigation;

SectionPillarNavigation.propTypes = {
  values: PropTypes.object,
  language: PropTypes.string,
  type: PropTypes.number,
};
