import React, { Component } from 'react';
import { connect } from 'react-redux';
import { toastr } from 'react-redux-toastr';
import * as moment from 'moment';
import PropTypes from 'prop-types';
import { strings, translateString } from '../../utilities';
import { Timeline, Loading } from '../../components';
import { CampaignEntities } from '../../pages';
import {
  setCampaignEntities,
  setCampaignConfiguration,
  getAssessments,
  getEntities,
} from '../../actions';
import NewCampaignConfiguration from './NewCampaignConfiguration';
import Assessors from './Assessors';
/**
 * A Master Assessor can add New Campaign.
 * Firstly, the user enter the campaign data such as name and assessment.
 * Secondly, the user can select more than an entity to be assigned to campaign.
 * Thirdly, the user assigns list of assessors to answer certain pillars of assessment.
 * @visibleName New Campaign
 */
export class NewCampaign extends Component {
  state = {
    currentIndex: 0,
    selectedEntities: [],
  };
  componentDidMount() {
    this.props.getAssessments({ paginate: false });
  }

  render() {
    if (this.props.assessments.data) {
      if (this.props.assessments.data.en.length === 1) {
        return (
          <div className="container">
            <div className="not-available-msg">
              <p>{translateString(strings.campaign.noAssessmentsInCampaign)}</p>
            </div>
          </div>
        );
      }
      return (
        <div className="form-container campaign-form container">
          <h1 className="title form-title">
            {translateString(strings.campaign.newCampaignTitle)}
          </h1>
          <Timeline
            current={this.state.currentIndex}
            items={[
              translateString(strings.campaign.configuration),
              translateString(strings.campaign.entities),
              translateString(strings.campaign.assessors),
            ]}
          />
          {this.state.currentIndex === 0 && (
            <NewCampaignConfiguration
              action={(values, setSubmitting) => {
                values.self_assessment_duration_unit = 1; // eslint-disable-line
                values.start_date = moment(values.start_date) // eslint-disable-line
                  .locale('en')
                  .format('YYYY-MM-DD');
                values.end_date = moment(values.end_date) // eslint-disable-line
                  .locale('en')
                  .format('YYYY-MM-DD');
                this.props
                  .setCampaignConfiguration(values)
                  .then(() => {
                    setSubmitting(false);
                    this.setState(
                      {
                        assessmentID: this.props.configuredCampaign
                          .assessment_id,
                        campaignID: this.props.configuredCampaign.id,
                      },
                      () => {
                        this.setState({ currentIndex: 1 });
                      }
                    );
                  })
                  .catch(() => {
                    setSubmitting(false);
                    toastr.error(this.props.configuredCampaign.message);
                  });
              }}
              assessments={this.props.assessments.data[this.props.language]}
            />
          )}
          {this.state.currentIndex === 1 && (
            <CampaignEntities
              campaignID={this.props.configuredCampaign.campaign.id}
              entitiesList={this.props.entities}
              action={(addedCampaigns, addedCampaignsData) => {
                this.props
                  .setCampaignEntities(
                    this.props.configuredCampaign.campaign.id,
                    {
                      entities: addedCampaigns,
                    }
                  )
                  .then(() => {
                    const list = { en: [], ar: [] };
                    let index = 0;
                    addedCampaignsData.forEach(el => {
                      list.en[index] = {
                        label: el.nameTranslations.en,
                        value: el.id,
                      };
                      list.ar[index] = {
                        label: el.nameTranslations.ar,
                        value: el.id,
                      };
                      index += 1;
                    });
                    this.setState({
                      selectedEntities: list,
                      currentIndex: 2,
                    });
                  })
                  .catch(err => {
                    toastr.error(err.response.data.data);
                  });
              }}
            />
          )}
          {this.state.currentIndex === 2 && (
            <Assessors
              entitiesList={this.state.selectedEntities}
              campaignID={this.props.configuredCampaign.campaign.id}
              assessmentID={
                this.props.configuredCampaign.campaign.assessment_id
              }
              next={() => {
                this.props.history.push('/campaigns');
              }}
            />
          )}
        </div>
      );
    }
    return <Loading />;
  }
}

function mapStateToProps(state) {
  const { assessments, language, configuredCampaign, entities } = state;
  return {
    assessments,
    entities,
    language,
    configuredCampaign,
  };
}
const mapDispatchToProps = {
  getAssessments,
  getEntities,
  setCampaignConfiguration,
  setCampaignEntities,
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(NewCampaign);

NewCampaign.propTypes = {
  /** List of entities for assessment */
  entities: PropTypes.object,
  /** @ignore */
  history: PropTypes.object,
  /** Gets list of assessments */
  getAssessments: PropTypes.func,
  /** @ignore */
  assessments: PropTypes.object,
  /** @ignore */
  configuredCampaign: PropTypes.object,
  /** @ignore */
  language: PropTypes.string,
  /** @ignore */
  setCampaignConfiguration: PropTypes.func,
  /** Gets list of entities */
  getEntities: PropTypes.func,
  /** @ignore */
  setCampaignEntities: PropTypes.func,
};
