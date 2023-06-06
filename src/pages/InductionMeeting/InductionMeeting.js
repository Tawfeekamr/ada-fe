import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import * as moment from 'moment';
import * as Yup from 'yup';
import { toastr } from 'react-redux-toastr';
import { Formik, Form } from 'formik';
import { Link } from 'react-router-dom';
import Dropzone from 'react-dropzone';
import { strings, translateString } from '../../utilities';
import { MyTextarea, MyDatePicker, Loading } from '../../components';
import { setInductionMeeting, getCampaignData } from '../../actions';

/**
 * This component renders the induction meeting form where the Assessor fills in the induction meeting data.
 */
// http://localhost:3000/campaigns/663/entity/252/induction-meeting
class InductionMeeting extends Component {
  constructor(props) {
    super(props);
    this.state = {
      file: '',
    };
  }

  onDrop(file) {
    this.setState({
      file,
    });
  }

  removeFile() {
    this.setState({ file: '' });
  }

  componentDidMount() {
    this.props.getCampaignData(this.props.match.params.campaignId);
  }

  render() {
    const { entityId, campaignId } = this.props.match.params;
    const { campaign } = this.props;
    if (campaign.isFetching) {
      return <Loading />;
    }
    const { induction_meeting: disabled } = campaign.data.entities[0];
    const inductionDetails = disabled
      ? campaign.data.entities[0].induction_details
      : {
          induction_meeting_attendees: '',
          induction_meeting_notes: '',
        };

    return (
      <div className="form-container">
        <legend className="form-title">
          {translateString(strings.inductionMeeting.induction)}
        </legend>
        <Formik
          initialValues={inductionDetails}
          validationSchema={Yup.lazy(() => {
            return Yup.object().shape({
              induction_meeting_date: Yup.date()
                .typeError(translateString(strings.errors.dateInvalid))
                .required(translateString(strings.errors.date)),
              induction_meeting_attendees: Yup.string().required(
                translateString(strings.inductionMeeting.errors.attendees)
              ),
              induction_meeting_notes: Yup.string().required(
                translateString(strings.inductionMeeting.errors.notes)
              ),
            });
          })}
          onSubmit={(values, { setSubmitting, setErrors }) => {
            setSubmitting(true);
            values.induction_meeting_date = moment(
              values.induction_meeting_date
            )
              .locale('en')
              .format('YYYY-MM-DD');
            // const body = { ...values };

            const data = new FormData();
            data.append(
              'induction_meeting_date',
              values.induction_meeting_date
            );
            data.append(
              'induction_meeting_attendees',
              values.induction_meeting_attendees
            );
            data.append(
              'induction_meeting_notes',
              values.induction_meeting_notes
            );
            data.append('induction_meeting_file', this.state.file[0]);

            this.props
              .setInductionMeeting(campaignId, entityId, data)
              .then(() => {
                setSubmitting(false);
                toastr.success(translateString(strings.message.induction));
                this.props.history.push(`/campaigns/${campaignId}`);
              })
              .catch(() => {
                setSubmitting(false);
                const errors = [];
                if (this.props.inductionMeetingHeld.errors) {
                  Object.keys(this.props.inductionMeetingHeld.errors).forEach(
                    key => {
                      errors[key] = this.props.inductionMeetingHeld.errors[
                        key
                      ][0]; // eslint-disable-line
                    }
                  );
                }
                setErrors(errors);
              });
          }}
          render={({
            values,
            touched,
            errors,
            handleChange,
            handleBlur,
            handleSubmit,
            setFieldValue,
            setFieldTouched,
            isSubmitting,
          }) => (
            <Form
              className="form-wrapper induction-meeting"
              onSubmit={handleSubmit}
            >
              <fieldset>
                <MyDatePicker
                  name="induction_meeting_date"
                  id="induction_meeting_date"
                  label="induction_meeting_date"
                  value={values.induction_meeting_date}
                  onChange={setFieldValue}
                  onBlur={setFieldTouched}
                  error={errors.induction_meeting_date}
                  placeholderText={translateString(
                    strings.inductionMeeting.dateOfMeeting
                  )}
                  touched={touched.induction_meeting_date}
                  maxDate={moment(campaign.data.end_date)}
                />
                <label className="attendees-label">
                  {translateString(strings.inductionMeeting.attendees)}
                </label>
                <MyTextarea
                  label={translateString(strings.inductionMeeting.attendees)}
                  name="induction_meeting_attendees"
                  id="induction_meeting_attendees"
                  placeholder={translateString(
                    strings.inductionMeeting.attendees
                  )}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.induction_meeting_attendees}
                  error={errors.induction_meeting_attendees}
                />
                <MyTextarea
                  label={translateString(strings.inductionMeeting.notes)}
                  name="induction_meeting_notes"
                  id="induction_meeting_notes"
                  placeholder={translateString(strings.inductionMeeting.notes)}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.induction_meeting_notes}
                  error={errors.induction_meeting_notes}
                />
              </fieldset>
              <React.Fragment>
                <Dropzone
                  id="file"
                  label="files"
                  onDrop={this.onDrop.bind(this)}
                />
                <ul className="list evidence-attach">
                  {this.state.file && (
                    <li className="file-item">
                      <a target="_blank" href={this.state.file[0].preview}>
                        {this.state.file[0].name}
                      </a>
                      <button
                        onClick={() => this.removeFile()}
                        className="button button--plain"
                        type="button"
                      >
                        &times;
                      </button>
                    </li>
                  )}
                </ul>
              </React.Fragment>
              {disabled && (
                <ul className="list evidence-attach">
                  <li className="file-item">
                    <a target="_blank" href={values.induction_meeting_file}>
                      {translateString(strings.inductionMeeting.download)}
                    </a>
                  </li>
                </ul>
              )}
              <div className="buttons--wrapper">
                <Link
                  to={`/campaigns/${campaignId}`}
                  className="button button--primary"
                >
                  {translateString(strings.inductionMeeting.cancel)}
                </Link>
                <button
                  className="button button--secondary"
                  type="submit"
                  disabled={isSubmitting}
                >
                  {translateString(strings.inductionMeeting.submit)}
                </button>
              </div>
            </Form>
          )}
        />
      </div>
    );
  }
}

function mapStateToProps(state) {
  const { inductionMeetingHeld, campaign } = state;
  return {
    inductionMeetingHeld,
    campaign,
  };
}

const mapDispatchToProps = {
  setInductionMeeting,
  getCampaignData,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(InductionMeeting);

InductionMeeting.propTypes = {
  /** A function that saves the data entered in the induction meeting form. */
  setInductionMeeting: PropTypes.func,
  /** A function that loads the current campaign's data when the induction meeting form is loaded. */
  getCampaignData: PropTypes.func,
  /** An object that holds the state of InductionMeeting component. */
  inductionMeetingHeld: PropTypes.object,
  /** An object used to change the session's URL after submitting the induction meeting form. */
  history: PropTypes.object,
  /** The current campaign's data. */
  campaign: PropTypes.object,
  /** An object that contains data taken from the current session's URL. */
  match: PropTypes.shape({
    params: PropTypes.shape({
      campaignId: PropTypes.string,
      entityId: PropTypes.string,
    }),
  }),
};
