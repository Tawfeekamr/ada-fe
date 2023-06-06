import React, { Component } from 'react';
import Modal from 'react-modal';
import { strings, translateString } from '../../utilities';
import SkipCampaignForm from './form';

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    padding: '20px 30px',
  },
};

if (document.getElementById('root')) {
  Modal.setAppElement('#root');
} else {
  Modal.setAppElement('#rsg-root');
}

/**
 * A component that displays a modal containing a confirmation message to skip the campaign.
 */
class SkipCampaign extends Component {
  state = {
    modalIsOpen: false,
  };
  openModal = () => {
    this.setState({ modalIsOpen: true });
  };
  closeModal = () => {
    this.setState({ modalIsOpen: false });
  };
  render() {
    return (
      <div>
        <button
          type="button"
          className="button--link no-line"
          onClick={() => {
            this.openModal();
          }}
        >
          {translateString(strings.skipCampaign.link)}
        </button>
        <Modal
          isOpen={this.state.modalIsOpen}
          onAfterOpen={this.afterOpenModal}
          onRequestClose={this.closeModal}
          style={customStyles}
          contentLabel="Example Modal"
        >
          <SkipCampaignForm
            closeModal={() => {
              this.closeModal();
            }}
            {...this.props}
          />
        </Modal>
      </div>
    );
  }
}

export default SkipCampaign;
