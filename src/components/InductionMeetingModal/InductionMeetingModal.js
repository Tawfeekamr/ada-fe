import React, { Component } from "react";
import * as moment from "moment";
import Modal from "react-modal";
import PropTypes from "prop-types";
import { strings, translateString } from "../../utilities";

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    padding: "20px",
    width: "500px"
  }
};

/**
 * This component views the details of the inudction meeting which were previously submitted by the Assessor.
 */
class InductionMeetingModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showDetails: false
    };

    this.openDetails = this.openDetails.bind(this);
    this.closeDetails = this.closeDetails.bind(this);
  }

  openDetails() {
    this.setState({ showDetails: true });
  }

  closeDetails() {
    this.setState({ showDetails: false });
  }

  render() {
    const { date, attendees, notes, file } = this.props;

    return (
      <div className="induction-meeting-modal">
        <button
          className="induction-meeting-modal__open"
          onClick={this.openDetails}
        >
          {translateString(strings.timeline.viewInduction)}
        </button>
        <Modal
          isOpen={this.state.showDetails}
          contentLabel="Induction Meeting Details"
          style={customStyles}
        >
          <button
            className="induction-meeting-modal__close"
            onClick={this.closeDetails}
          >
            &#10005;
          </button>
          <dl className="induction-meeting-modal__details">
            <div className="induction-meeting-modal__details-group">
              <dt>{translateString(strings.inductionMeeting.dateOfMeeting)}</dt>
              <dd>{moment(date).format("DD-MM-YYYY")}</dd>
            </div>
            <div className="induction-meeting-modal__details-group">
              <dt>{translateString(strings.inductionMeeting.attendees)}</dt>
              <dd>
                {attendees.includes("\n")
                  ? attendees
                      .split("\n")
                      .map((attendee, idx) => <p key={idx}>{attendee}</p>)
                  : attendees}
              </dd>
            </div>
            <div className="induction-meeting-modal__details-group">
              <dt>{translateString(strings.inductionMeeting.notes)}</dt>
              <dd>{notes}</dd>
            </div>
            {file !== "" && (
              <div className="induction-meeting-modal__details-group">
                <dt>{translateString(strings.inductionMeeting.file)}</dt>
                <dd>
                  <a target="_blank" href={file}>
                    {translateString(strings.inductionMeeting.download)}
                  </a>
                </dd>
              </div>
            )}
            {file === "" && (
              <div className="induction-meeting-modal__details-group">
                <dt>{translateString(strings.inductionMeeting.file)}</dt>
                <dd>{translateString(strings.inductionMeeting.noFile)}</dd>
              </div>
            )}
          </dl>
        </Modal>
      </div>
    );
  }
}

InductionMeetingModal.propTypes = {
  /** Date of the previously submitted induction meeting. */
  date: PropTypes.string,
  /** Names of attendees of the previously submitted induction meeting. */
  attendees: PropTypes.string,
  /** Notes of the previously submitted induction meeting. */
  notes: PropTypes.string,
  /** The attached file of the previously submitted induction meeting. It can be blank because it is not required. */
  file: PropTypes.string
};

export default InductionMeetingModal;
