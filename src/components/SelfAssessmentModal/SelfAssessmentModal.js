import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as Yup from 'yup';
import * as moment from 'moment';
import Modal from 'react-modal';
import PropTypes from 'prop-types';
import { toastr } from 'react-redux-toastr';
import { Formik, Form } from 'formik';
import { strings, translateString } from '../../utilities';
import { MyDatePicker } from '../../components';
import { setNewSelfAssessmentDate } from '../../actions';

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    padding: '0',
    width: '600px',
    overflow: 'initial',
  },
};

/**
 * This component is used by the Master Assessor to extend the end date of a Self Assessment.
 */
class SelfAssessmentModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showModal: false,
    };

    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
  }

  openModal() {
    this.setState({ showModal: true });
  }

  closeModal() {
    this.setState({ showModal: false });
  }

  render() {
    const {
      campaignStartDate,
      campaignEndDate,
      campaignId,
      entityId,
      selfAssessmentDuration,
    } = this.props;
    return (
      <div className="self-assessment-modal">
        <div className="accordion-header__extension">
          <button onClick={this.openModal}>
            {translateString(strings.selfAssessmentExtension)}
          </button>
        </div>
        <Modal
          isOpen={this.state.showModal}
          contentLabel="Extend Self Assessment Date"
          style={customStyles}
        >
          <Formik
            initialValues={{}}
            validationSchema={() => {
              return Yup.lazy(() => {
                return Yup.object().shape({
                  self_assessment_end_date: Yup.date()
                    .typeError(translateString(strings.errors.dateInvalid))
                    .required(translateString(strings.errors.date)),
                });
              });
            }}
            onSubmit={(values, { setSubmitting, setErrors }) => {
              setSubmitting(true);
              values.self_assessment_end_date = moment(
                values.self_assessment_end_date
              )
                .locale('en')
                .format('YYYY-MM-DD');

              this.props
                .setNewSelfAssessmentDate(campaignId, entityId, values)
                .then(() => {
                  setSubmitting(false);
                  this.setState({
                    showModal: false,
                  });
                  toastr.success(
                    translateString(strings.message.selfAssessment)
                  );
                })
                .catch(() => {
                  setSubmitting(false);
                  const errors = [];
                  if (this.props.newSelfAssessmentDateCreated.errors) {
                    Object.keys(
                      this.props.newSelfAssessmentDateCreated.errors
                    ).forEach(key => {
                      errors[
                        key
                      ] = this.props.newSelfAssessmentDateCreated.errors[
                        key
                      ][0]; // eslint-disable-line
                    });
                  }
                  setErrors(errors);
                });
            }}
            render={({
              values,
              touched,
              errors,
              handleSubmit,
              setFieldValue,
              setFieldTouched,
              isSubmitting,
            }) => (
              <Form
                className="form-wrapper extend-self-assessment-form"
                onSubmit={handleSubmit}
              >
                <div className="form-group">
                  <fieldset>
                    <legend className="form-section-title">
                      {translateString(strings.selfAssessmentExtension)}
                    </legend>
                    <div className="grid-wrapper">
                      <MyDatePicker
                        id="self_assessment_end_date"
                        name="self_assessment_end_date"
                        label="self_assessment_end_date"
                        labelContent={translateString(
                          strings.selfAssessmentExtension.endDate
                        )}
                        labelVisible={true}
                        value={values.self_assessment_end_date}
                        onChange={setFieldValue}
                        onBlur={setFieldTouched}
                        error={errors.self_assessment_end_date}
                        minDate={moment.max(
                          moment(campaignStartDate).add(
                            selfAssessmentDuration,
                            'day'
                          ),
                          moment()
                        )}
                        maxDate={moment(campaignEndDate)}
                        placeholderText={translateString(
                          strings.selfAssessmentExtension.endDate
                        )}
                        touched={touched.self_assessment_end_date}
                      />
                    </div>
                  </fieldset>
                </div>
                <div className="buttons--wrapper">
                  <button
                    onClick={this.closeModal}
                    className="button button--primary"
                  >
                    {translateString(strings.selfAssessmentExtension.cancel)}
                  </button>
                  <button
                    className="button button--secondary"
                    type="submit"
                    disabled={isSubmitting}
                  >
                    {translateString(strings.selfAssessmentExtension.submit)}
                  </button>
                </div>
              </Form>
            )}
          />
        </Modal>
      </div>
    );
  }
}

function mapStateToProps(state) {
  const { newSelfAssessmentDateCreated } = state;
  return {
    newSelfAssessmentDateCreated,
  };
}

const mapDispatchToProps = {
  setNewSelfAssessmentDate,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SelfAssessmentModal);

SelfAssessmentModal.propTypes = {
  /** A function that saves the new end date of the current self assessment. */
  setNewSelfAssessmentDate: PropTypes.func,
  /** An object that hold the state of the SelfAssessmentModal component. */
  newSelfAssessmentDateCreated: PropTypes.object,
  /** The start date of the current campaign. */
  campaignStartDate: PropTypes.string,
  /** The end date of the current campaign. */
  campaignEndDate: PropTypes.string,
  /** The ID of the current campaign. */
  campaignId: PropTypes.number,
  /** The ID of the entity taking the current self assessment. */
  entityId: PropTypes.number,
  /** The number of days allowed to complete the current self assessment starting from the current campaign's start date. */
  selfAssessmentDuration: PropTypes.number,
};
