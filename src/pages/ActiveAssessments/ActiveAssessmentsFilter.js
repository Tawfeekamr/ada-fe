import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { connect } from 'react-redux';
import {
  getCampaignsWithStatus,
  getActiveCampaignEntities,
} from '../../actions';
import { strings, translateString } from '../../utilities';
import { MySelect } from '../../components';

class ActiveAssessmentsFilter extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  componentDidMount() {
    const qs = {
      paginate: true,
    };
    this.props.getCampaignsWithStatus(true, qs); // To get Active Campaigns
  }
  setActiveAssessmentID = id => {
    const assessmentID = this.props.activeCampaigns.data.find(item => {
      return item.id === id;
    }).assessment_id;
    this.setState({ assessmentID });
  };
  render() {
    const {
      activeCampaigns: {
        // assessmentID,
        list: campaignsArray,
        isFetching: campaignsLoading,
      },
      activeCampaignEntities: {
        list: entitiesArray,
        entitiesForCampaign: entitesData,
        isFetching: entitiesLoading,
      },
      language,
      goToPage,
    } = this.props;
    return (
      <section>
        <Formik
          initialValues={{
            campaign: '',
            entity: '',
          }}
          validationSchema={Yup.object().shape({
            campaign: Yup.number().required(
              translateString(strings.activeAssessments.selectCampaignError)
            ),
            entity: Yup.number().required(
              translateString(strings.activeAssessments.selectEntityError)
            ),
          })}
          onSubmit={(values, { setSubmitting }) => {
            setSubmitting(true);
            goToPage(
              `/assessment/${this.state.assessmentID}/campaign/${
                values.campaign
              }/entity/${values.entity}`
            );
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
              className="active-assessment active-assessment__form"
              onSubmit={handleSubmit}
            >
              <legend className="active-assessment__title">
                {translateString(strings.activeAssessments.title)}
              </legend>

              <div className="grid-wrapper grid--2">
                <MySelect
                  id="campaign"
                  required
                  className="custom-select"
                  name="campaign"
                  labelHidden
                  loading={campaignsLoading}
                  label={translateString(strings.header.campaigns)}
                  placeholder={`${translateString(
                    strings.activeAssessments.selectCampaign
                  )}*`}
                  onChange={(name, val) => {
                    if (val) {
                      this.setActiveAssessmentID(val);
                    }
                    if (
                      (val && val !== '' && !entitesData) ||
                      (entitesData && entitesData.id !== val)
                    ) {
                      this.props.getActiveCampaignEntities(val);
                    }
                    setFieldValue(name, val);
                  }}
                  onBlur={setFieldTouched}
                  error={errors.campaign}
                  touched={touched.campaign}
                  options={campaignsArray ? campaignsArray[language] : []}
                  value={values.campaign}
                />
                <MySelect
                  id="entity"
                  required
                  className="custom-select"
                  name="entity"
                  labelHidden
                  loading={entitiesLoading}
                  label={translateString(strings.entity)}
                  placeholder={`${translateString(
                    strings.activeAssessments.selectEntity
                  )}*`}
                  disabled={values.campaign === ''}
                  onChange={setFieldValue}
                  onBlur={setFieldTouched}
                  error={errors.entity}
                  touched={touched.entity}
                  options={entitiesArray ? entitiesArray[language] : []}
                  value={values.entity}
                />
              </div>
              <div className="button-wrapper">
                <button
                  className="button button--primary"
                  type="submit"
                  disabled={isSubmitting}
                >
                  {translateString(
                    strings.activeAssessments.continueAssessment
                  )}
                </button>
              </div>
            </Form>
          )}
        />
      </section>
    );
  }
}

function mapStateToProps(state) {
  const { activeCampaigns, language, activeCampaignEntities } = state;
  return {
    activeCampaigns,
    language,
    activeCampaignEntities,
  };
}
const mapDispatchToProps = {
  getCampaignsWithStatus,
  getActiveCampaignEntities,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ActiveAssessmentsFilter);

ActiveAssessmentsFilter.propTypes = {
  getCampaignsWithStatus: PropTypes.func,
  getActiveCampaignEntities: PropTypes.func,
  activeCampaignEntities: PropTypes.shape({
    isFetching: PropTypes.bool,
    list: PropTypes.object,
  }),
  activeCampaigns: PropTypes.shape({
    isFetching: PropTypes.bool,
    list: PropTypes.object,
    assessmentID: PropTypes.number,
    data: PropTypes.array,
  }),
  goToPage: PropTypes.func,
  language: PropTypes.string,
  isLoading: PropTypes.number,
};
