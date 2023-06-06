import React from 'react';
import PropTypes from 'prop-types';
import { strings, translateString, Scroll } from '../../utilities';

/**
 * A component that allows navigation between sections inside a pillar while completing the assessment.
 */
class SectionPillarNavigation extends React.Component {
  handlePreviousClick() {
    const {
      activeSection,
      activePillar,
      pillars,
      updateActivePillarSection,
    } = this.props;
    const isFirstSection = activeSection === 0;
    // if last section , go to next pillar else go to next section
    if (isFirstSection) {
      updateActivePillarSection(
        pillars[activePillar - 1].sections.length - 1,
        activePillar - 1
      );
    } else {
      updateActivePillarSection(activeSection - 1, activePillar);
    }
    Scroll.scrollToTop();
  }
  handleNextClick() {
    const {
      activeSection,
      activePillar,
      pillars,
      updateActivePillarSection,
    } = this.props;
    const isLastSection =
      pillars[activePillar].sections.length - 1 === activeSection;
    // if last section , go to next pillar else go to next section
    if (isLastSection) {
      updateActivePillarSection(0, activePillar + 1);
    } else {
      updateActivePillarSection(activeSection + 1, activePillar);
    }
    Scroll.scrollToTop();
  }
  render() {
    const { activeSection, activePillar, pillars } = this.props;
    const lastPillarIndex = pillars.length - 1;
    const lastSectionIndex = pillars[pillars.length - 1].sections.length - 1;
    return (
      <p className="align-center">
        {!(activePillar === 0 && activeSection === 0) && (
          <a
            type="button"
            className="button button--primary button--small"
            onClick={() => {
              this.handlePreviousClick();
            }}
          >
            {translateString(strings.assessment.prev)}
          </a>
        )}
        {!(
          lastPillarIndex === activePillar && lastSectionIndex === activeSection
        ) && (
          <a
            type="button"
            className="button button--primary button--small"
            onClick={() => {
              this.handleNextClick();
            }}
          >
            {translateString(strings.assessment.next)}
          </a>
        )}
      </p>
    );
  }
}

export default SectionPillarNavigation;

SectionPillarNavigation.propTypes = {
  /** Current section */
  activeSection: PropTypes.number,
  /** Current pillar */
  activePillar: PropTypes.number,
  /** List of pillars */
  pillars: PropTypes.array,
  /** Update active pillar */
  updateActivePillarSection: PropTypes.func,
};
