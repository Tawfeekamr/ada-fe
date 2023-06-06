import React, { Component } from 'react';
import PropTypes from 'prop-types';

/**
 * The Accordion component (in its expanded state) shows the name of an entity, its progress (in percentage) in the current campaign, and its complete and incomplete steps.
 */
class Accordion extends Component {
  state = {
    active: -1,
  };
  render() {
    return (
      <div>
        {this.props.accordionArray.map((item, index) => {
          const isActive = this.state.active === index;
          return (
            <div
              className={`accordion__section ${isActive ? '' : 'shrink'}`}
              key={index}
            >
              <div className={`accordion__header ${isActive ? '' : 'shrink'}`}>
                {this.props.renderAccordionHeader(item, index)}
                <button
                  className={`accordion__button ${isActive ? '' : 'shrink'}`}
                  onClick={() => {
                    setTimeout(
                      this.setState({
                        active: !isActive ? index : -1,
                      }),
                      2000
                    );
                  }}
                >
                  <img src="/assets/images/next-timeline.png" alt="Expand" />
                </button>
              </div>
              {isActive && (
                <div
                  className={`accordion__content ${isActive ? '' : 'shrink'}`}
                >
                  {this.props.renderAccordionContent(item, index)}
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  }
}
export default Accordion;
Accordion.propTypes = {
  /** It renders the contents of the Accordion component in its expanded state. */
  renderAccordionContent: PropTypes.func,
  /** It contains all the entities in a specific campaign with data about each entity's progress in this campaign. */
  accordionArray: PropTypes.array,
  /** It is a function that changes the language (Arabic to English and vice versa) according to user preference. */
  toggleLanguage: PropTypes.func,
  /** It is a function that renders the top part of the Accordion component in 2 different states (expanded and collapsed). */
  renderAccordionHeader: PropTypes.func,
};
