import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
/**
 * Navigation between sections
 */
import 'core-js/fn/string/includes';
import 'core-js/fn/array/includes';

const SectionNavigation = props => {
  const {
    pillar,
    activeSection,
    setActiveSection,
    inCompletedSections,
  } = props;
  return (
    <ul className="tabs-controllers">
      {pillar.sections.map((section, index) => {
        return (
          <li
            onClick={() => {
              setActiveSection(index);
            }}
            className={activeSection === index ? 'active' : ''}
            key={index}
          >
            {section.translations.length > 0 &&
              section.translations.find(item => {
                return item.locale === props.language;
              }).name}
            {inCompletedSections.includes(section.id) && (
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
)(SectionNavigation);

SectionNavigation.propTypes = {
  /** Data for pillar */
  pillar: PropTypes.object,
  /** Currently active section */
  activeSection: PropTypes.number,
  /** Update active section */
  setActiveSection: PropTypes.func,
  /** Current language for system */
  language: PropTypes.string,
};
