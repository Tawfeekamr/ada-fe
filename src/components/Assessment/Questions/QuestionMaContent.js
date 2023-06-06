import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { translateString, strings, numbers } from '../../../utilities';

/**
 * A wrapper component to display the assessment result by the Master Assesor.
 */
class QuestionMaContent extends Component {
  constructor(props) {
    super(props);
    this.textInput = React.createRef();
    this.focusTextInput = this.focusTextInput.bind(this);
  }
  state = {
    editText: false,
  };
  focusTextInput() {
    setTimeout(() => this.textInput.current.focus(), 100);
  }

  render() {
    const { keys, language, handleChange, values, id, isDisabled } = this.props;

    values[id].maturity =
      Number(values[id].maturity) === -1
        ? values[id].assessor
        : values[id].maturity;
    if (!this.state.editText && values[id].maturity === '') {
      values[id].maturity = values[id].assessor;
    }
    return (
      <div className="assessment-section__question-answers-wrapper full-width">
        {keys.map((item, index) => {
          const itemIdentifier = `${String(id)}[${item}]`;
          return (
            <div
              key={index}
              className="assessment-section__question-input ma-question"
            >
              {item !== 'advisor' && (
                <input
                  ref={
                    item === 'maturity' ? this.textInput : this.textOtherInput
                  }
                  disabled={!this.state.editText || item !== 'maturity'}
                  name={itemIdentifier}
                  id={itemIdentifier}
                  value={
                    values[id][item] === -1
                      ? ''
                      : language === 'ar'
                      ? numbers.convertToArabic(values[id][item])
                      : values[id][item]
                  }
                  onChange={el => {
                    const input = el.target.value;
                    let val = input;
                    const englishVal = numbers.convertToEnglish(input);
                    if (englishVal !== val) {
                      // Number is in arabic
                      val = englishVal;
                    }
                    if (
                      input === '' ||
                      (Number(val) <= 5 && Number(val) >= 1)
                    ) {
                      /* eslint-disable no-param-reassign */
                      el.target.value = val;
                      /* eslint-enable no-param-reassign */
                      handleChange(el);
                    }
                  }}
                  onBlur={el => {
                    if (values[id].maturity === '') {
                      values[id].maturity = values[id].assessor;
                      /* eslint-disable no-param-reassign */
                      el.target.value = numbers.convertToArabic(
                        values[id].assessor
                      );
                      /* eslint-enable no-param-reassign */
                    }
                  }}
                />
              )}
              {item === 'advisor' && (
                <span>
                  {(() => {
                    if (values[id][item] === '1') {
                      return translateString(strings.advisorAssessment.agree);
                    } else if (values[id][item] === '2') {
                      return translateString(
                        strings.advisorAssessment.disagree
                      );
                    }
                    return translateString(strings.advisorAssessment.skipped);
                  })()}
                </span>
              )}
            </div>
          );
        })}
        {!isDisabled && (
          <button
            type="button"
            onClick={() => {
              this.focusTextInput();

              this.setState({ editText: !this.state.editText });
            }}
            className="edit-content"
          >
            <span className="visually-hidden">Show Content</span>
          </button>
        )}
      </div>
    );
  }
}

export default QuestionMaContent;

QuestionMaContent.propTypes = {
  language: PropTypes.string,
  keys: PropTypes.array,
  ratings: PropTypes.object,
  handleChange: PropTypes.func,
  values: PropTypes.array,
  isDisabled: PropTypes.bool,
  id: PropTypes.string,
};
