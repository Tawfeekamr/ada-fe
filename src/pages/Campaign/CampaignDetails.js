import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { confirmAlert } from 'react-confirm-alert';
import { toastr } from 'react-redux-toastr';
import {
  strings,
  translateString,
  numbers,
  ASSESSOR_ASSESSMENT,
  SELF_ASSESSMENT,
  ADVISOR_ASSESSMENT,
  MASTER_ASSESSOR_ASSESSMENT,
  MASTER_ASSESSOR,
  ASSESSOR,
} from '../../utilities';
import {
  Loading,
  Accordion,
  Timeline,
  SelfAssessmentModal,
} from '../../components';
import {
  getCampaignData,
  generateSelfReport,
  removeEntityFromCampaign,
} from '../../actions';
import { LIGHT_TOUCH } from './AssessmentTypes';
/**
 * Gets data for entities in a certain campaign.
 * It shows progress for all entities in campaign.
 * In addition to the status of assessment review.
 * A user can add induction meeting details.
 * A user can remove entity from campaign.
 * A user can generate report for self assessment.
 * A user can skip EA review.
 * @visibleName Campaign Details
 */
export class CampaignDetails extends Component {
  confirmDelete(campaignId, entityId) {
    confirmAlert({
      title: translateString(strings.entity.confirmDeleteTitleFromCampaign),
      message: translateString(
        strings.entity.confirmDeleteQuestionFromCampaign
      ),
      buttons: [
        {
          label: translateString(strings.confirm.yes),
          onClick: () => {
            this.props
              .removeEntityFromCampaign(campaignId, entityId)
              .then(() => {
                toastr.success(translateString(strings.entity.entityDeleted));
                this.props.getCampaignData(this.props.match.params.id);
              })
              .catch(err => {
                toastr.error(err.response.data.message);
              });
          },
        },
        {
          label: translateString(strings.confirm.no),
        },
      ],
    });
  }
  componentDidMount() {
    this.props.getCampaignData(this.props.match.params.id);
  }
  generateSelfReport(campaignId) {
    this.props
      .generateSelfReport(campaignId)
      .then(res => {
        window.open(res.value.data.url);
      })
      .catch(() => {
        toastr.error(this.props.generatedSelfReport.message);
      });
  }
  renderAccordionHeader(campaign, index) {
    const langIndex = this.props.language === 'en' ? 1 : 0;
    const progress =
      Math.round(
        this.props.campaign.data.entities_progress[index].timeline_progress *
          100
      ) / 100;
    return (
      <div className="accordion__data-header">
        <div>
          <p>{campaign.data.translations[langIndex].name}</p>
          <p>{`${translateString(strings.assessment)}: ${
            this.props.language === 'ar'
              ? numbers.convertToArabic(String(progress))
              : String(progress)
          } ${translateString(strings.complete)}`}</p>
        </div>
      </div>
    );
  }
  renderAccordionHeader = (campaign, index) => {
    return <p>{`${index}`}</p>;
  };

  render() {
    const { role } = this.props;
    if (this.props.campaign.isFetching) {
      return <Loading />;
    }
    const {
      translations,
      entities_progress: progress,
      assessment_id: assessmentId,
      id,
      submitted,
      entities,
      start_date: startDate,
      end_date: endDate,
      status,
      self_assessment_duration: selfAssessmentDuration,
    } = this.props.campaign.data;
    return (
      <section className="table-wrapper">
        <div className="container">
          <header>
            <h1 className="section-title bold">
              {
                translations.find(item => {
                  return item.locale === this.props.language;
                }).name
              }
            </h1>
            <p className="new-link">
              <button
                type="button"
                className="button button--primary not-submitting"
                disabled={
                  this.props.role === ASSESSOR
                    ? submitted.assessor === 0
                    : submitted.self === 0
                }
                onClick={() => {
                  this.generateSelfReport(id);
                }}
              >
                {translateString(strings.campaign.generateSelfReport)}
              </button>
            </p>
          </header>
          <Accordion
            renderAccordionHeader={(entity, index) => {
              const progressHeader =
                Math.round(progress[index].timeline_progress_percentage * 100) /
                100;
              const selfAssessmentSubmission = entities[index].submitted.self;

              return (
                <div className="accordion-header__content">
                  <div className="accordion-header__about">
                    <p className="accordion-header__title">
                      {
                        entity.translations.find(item => {
                          return item.locale === this.props.language;
                        }).name
                      }
                    </p>
                    <p
                      className={`accordion-header__status ${
                        entity.is_delayed && role === MASTER_ASSESSOR
                          ? 'delayed'
                          : ''
                      }`}
                    >{`${translateString(strings.assessment)}: ${
                      this.props.language === 'ar'
                        ? numbers.convertToArabic(String(progressHeader))
                        : String(progressHeader)
                    }% ${translateString(strings.progress.complete)}`}</p>
                  </div>
                  {role === MASTER_ASSESSOR &&
                    status === 1 &&
                    selfAssessmentSubmission === 0 && (
                      <div>
                        <SelfAssessmentModal
                          campaignId={id}
                          entityId={entity.entity_id}
                          campaignStartDate={startDate}
                          campaignEndDate={endDate}
                          selfAssessmentDuration={selfAssessmentDuration}
                        />
                      </div>
                    )}
                </div>
              );
            }}
            renderAccordionContent={(campaign, index) => {
              return (
                <div>
                  {this.props.role === MASTER_ASSESSOR && (
                    <button
                      className="button button--primary remove-from-campaign"
                      onClick={() => {
                        this.confirmDelete(id, campaign.entity_id);
                      }}
                    >
                      {translateString(strings.campaign.removeFromCampaign)}
                    </button>
                  )}
                  <Timeline
                    entityId={campaign.entity_id}
                    campaignId={id}
                    progress={true}
                    role={this.props.role}
                    language={this.props.language}
                    isSkipped={
                      (this.props.isSkipped !== null &&
                        this.props.isSkipped.campaign === id &&
                        this.props.isSkipped.entity === campaign.entity_id) ||
                      !!progress[index].skip_advisor_status
                    }
                    inductionDetails={campaign.induction_details}
                    items={
                      campaign.assessment_type === LIGHT_TOUCH
                        ? [
                            {
                              name: translateString(strings.progress.induction),
                              value: true,
                              held: campaign.induction_meeting,
                            },
                            {
                              name: translateString(
                                strings.progress.selfAssessment
                              ),
                              value:
                                progress[index]
                                  .self_assessment_progress_percentage,
                              key: SELF_ASSESSMENT,
                              ids: {
                                entity: progress[index].entity_id,
                                assessment: assessmentId,
                                campaign: id,
                              },
                              submitted: progress[index].submitted,
                            },
                            {
                              name: translateString(strings.progress.complete),
                              value: campaign.completed,
                            },
                          ]
                        : [
                            {
                              name: translateString(strings.progress.induction),
                              value: true,
                              held: campaign.induction_meeting,
                            },
                            {
                              name: translateString(
                                strings.progress.selfAssessment
                              ),
                              value:
                                progress[index]
                                  .self_assessment_progress_percentage,
                              key: SELF_ASSESSMENT,
                              ids: {
                                entity: progress[index].entity_id,
                                assessment: assessmentId,
                                campaign: id,
                              },
                              submitted: progress[index].submitted,
                            },
                            {
                              name: translateString(
                                strings.progress.assessorAssessment
                              ),
                              value:
                                progress[index]
                                  .assessor_assessment_progress_percentage,
                              key: ASSESSOR_ASSESSMENT,
                              ids: {
                                entity: progress[index].entity_id,
                                assessment: assessmentId,
                                campaign: id,
                              },
                              submitted: progress[index].submitted,
                            },
                            {
                              name: translateString(
                                strings.progress.initiateMeeting
                              ),
                              value: progress[index].submitted.assessor === 1,
                            },
                            {
                              name: translateString(
                                strings.progress.advisorProgress
                              ),
                              key: ADVISOR_ASSESSMENT,
                              ids: {
                                entity: progress[index].entity_id,
                                assessment: assessmentId,
                                campaign: id,
                              },
                              submitted: progress[index].submitted,
                              value:
                                progress[index].advisor_progress_percentage,
                            },
                            {
                              key: MASTER_ASSESSOR_ASSESSMENT,
                              name: translateString(
                                strings.progress.masterAssessorProgress
                              ),
                              ids: {
                                entity: progress[index].entity_id,
                                assessment: assessmentId,
                                campaign: id,
                              },
                              value: this.props.campaign.data.entities_progress[
                                index
                              ].master_assessor_progress_percentage,
                              submitted: progress[index].submitted,
                            },
                            {
                              name: translateString(strings.progress.complete),
                              value: campaign.completed,
                            },
                          ]
                    }
                  />
                </div>
              );
            }}
            accordionArray={entities}
          />
        </div>
      </section>
    );
  }
}
function mapStateToProps(state) {
  const {
    language,
    campaign,
    userData: { role_id: role },
    isSkipped,
    generatedSelfReport,
  } = state;
  return {
    language,
    campaign,
    role,
    isSkipped,
    generatedSelfReport,
  };
}
const mapDispatchToProps = {
  getCampaignData,
  removeEntityFromCampaign,
  generateSelfReport,
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CampaignDetails);

CampaignDetails.propTypes = {
  /** Remove entity from campaign */
  removeEntityFromCampaign: PropTypes.func,
  /** Generate report for self assessment */
  generateSelfReport: PropTypes.func,
  /** Campaign data */
  campaign: PropTypes.shape({
    data: PropTypes.shape({
      name: PropTypes.string,
      entities_progress: PropTypes.array,
      id: PropTypes.number,
      assessment_id: PropTypes.number,
      entities: PropTypes.array,
      submitted: PropTypes.shape({
        self: PropTypes.number,
      }),
      translations: PropTypes.array,
      start_date: PropTypes.string,
      end_date: PropTypes.string,
      status: PropTypes.number,
      self_assessment_duration: PropTypes.number,
    }),
    isFetching: PropTypes.bool,
  }),
  /** Retrieve campaign data */
  getCampaignData: PropTypes.func,
  /** Get current language of system */
  language: PropTypes.string,
  /** @ignore */
  match: PropTypes.object,
  /** Role of logged in user to enable certain functionality */
  role: PropTypes.number,
  /** Status of being skipped by Master Assessor */
  isSkipped: PropTypes.bool,
};
