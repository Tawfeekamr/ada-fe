import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import 'core-js/fn/string/includes';
import 'core-js/fn/array/includes';

/**
 * A component that allows navigation between pillars while completing the assessment.
 */
const PillarNavigation = props => {
  return (
    <ul className="pillars-controllers">
      {props.pillars.map((pillar, pillarIndex) => {
        return (
          <li
            key={pillarIndex}
            onClick={() => {
              props.activatePillar(pillarIndex);
            }}
            className={props.activePillar === pillarIndex ? 'active' : ''}
          >
            {
              pillar.translations.find(item => {
                return item.locale === props.language;
              }).name
            }
            {props.inCompletedPillars.includes(pillar.id) && (
              <span className="has-errors"> **</span>
            )}
          </li>
        );
      })}
    </ul>
  );
};

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
)(PillarNavigation);

PillarNavigation.propTypes = {
  pillars: PropTypes.array,
  activePillar: PropTypes.number,
  inCompletedPillars: PropTypes.array,
  activatePillar: PropTypes.func,
  language: PropTypes.string,
};
