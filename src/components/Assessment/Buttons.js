import React from 'react';
import PropTypes from 'prop-types';
import { confirmAlert } from 'react-confirm-alert';
import { strings, translateString } from '../../utilities';

/**
 * This component is used to navigate an assessment and submit it, eventually.
 */
const Buttons = props => {
  const {
    exit,
    saveDisabled,
    submitDisabled,
    submitSuccess,
    confirmationMessage,
  } = props;

  return (
    <p className="align-center">
      <button
        className={
          exit
            ? 'button button--secondary not-submitting'
            : 'button button--secondary'
        }
        type="submit"
        disabled={saveDisabled}
      >
        {translateString(strings.assessment.save)}
      </button>
      {
        <button
          className={
            exit
              ? 'button button--secondary'
              : 'button button--secondary not-submitting'
          }
          type="button"
          disabled={submitDisabled}
          onClick={() => {
            confirmAlert({
              title: translateString(strings.assessment.submitMessageTitle),
              message: confirmationMessage,
              buttons: [
                {
                  label: translateString(strings.confirm.yes),
                  onClick: submitSuccess,
                },
                {
                  label: translateString(strings.confirm.no),
                },
              ],
            });
          }}
        >
          {translateString(strings.assessment.submit)}
        </button>
      }
    </p>
  );
};

export default Buttons;
Buttons.propTypes = {
  /** @ignore */
  exit: PropTypes.bool,
  /** Button disabled on saving */
  saveDisabled: PropTypes.bool,
  /** Button disabled on submitting */
  submitDisabled: PropTypes.bool,
  /** On Submit function */
  submitSuccess: PropTypes.func,
  /** If it shows confirmation window */
  confirmationMessage: PropTypes.string,
};
