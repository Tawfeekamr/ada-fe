import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { toastr } from 'react-redux-toastr';
import { strings, translateString } from '../../utilities';
import { skipCampaign, setSkipped } from '../../actions';

class SkipCampaignForm extends Component {
  state = {
    error: false,
  };
  openModal = () => {
    this.setState({ modalIsOpen: true });
  };
  closeModal = () => {
    this.setState({ modalIsOpen: false });
  };
  render() {
    const { entityId, campaignId } = this.props;
    return (
      <form className="skip-modal">
        <legend className="title">
          {translateString(strings.skipCampaign.link)}
        </legend>
        <button className="close" onClick={this.closeModal}>
          <span className="visually-hidden">close</span>
        </button>
        <div className="form-item">
          <label htmlFor="reason">
            {translateString(strings.skipCampaign.reason)}
          </label>
          <textarea
            name="reason"
            form="reason"
            placeholder={translateString(strings.skipCampaign.placeholder)}
            value={this.state.reason}
            onChange={e => {
              this.setState({ reason: e.target.value });
            }}
          />
          {this.state.error && (
            <p className="form-error">
              {translateString(strings.skipCampaign.error)}
            </p>
          )}
        </div>
        <p className="skip-modal__buttons">
          <button
            className="button button--secondary"
            disabled={this.props.skipped.isFetching}
            onClick={e => {
              e.preventDefault();
              if (this.state.reason && this.state.reason !== '') {
                this.setState({ error: false });
                this.props
                  .skipCampaign(campaignId, entityId, {
                    reason: this.state.reason,
                  })
                  .then(() => {
                    this.props.closeModal();
                    this.props.setSkipped({
                      campaign: campaignId,
                      entity: entityId,
                    });
                    toastr.success(translateString(strings.message.skip));
                  })
                  .catch(() => {
                    this.props.closeModal();
                    this.props.setSkipped(null);
                    toastr.error(this.props.skipped.error);
                  });
              } else {
                this.setState({ error: true });
              }
            }}
          >
            {translateString(strings.confirm.submit)}
          </button>
          <button
            className="button button--primary"
            onClick={this.props.closeModal}
          >
            {translateString(strings.confirm.cancel)}
          </button>
        </p>
      </form>
    );
  }
}

function mapStateToProps(state) {
  return {
    skipped: state.skipped,
  };
}
const mapDispatchToProps = {
  skipCampaign,
  setSkipped,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SkipCampaignForm);

SkipCampaignForm.propTypes = {
  campaignId: PropTypes.number,
  entityId: PropTypes.number,
  skipCampaign: PropTypes.func,
  closeModal: PropTypes.func,
  setSkipped: PropTypes.func,
};
