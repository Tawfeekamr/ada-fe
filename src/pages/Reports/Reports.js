import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import * as Yup from 'yup';
import { Formik, Form } from 'formik';
import { toastr } from 'react-redux-toastr';
import { MySelect } from '../../components';
import {
  strings,
  translateString,
  ADMIN,
  ENTITY_COORDINATOR,
} from '../../utilities';
import {
  getReportYears,
  getReportCampaigns,
  getReportEntities,
  generateAndDownloadReport,
} from '../../actions';

/**
 * This component renders the reports form where users can customize any report that they need to generate and download.
 */
class Reports extends Component {
  componentDidMount() {
    this.props.getReportYears();
  }

  render() {
    const {
      language,
      reportYears,
      reportCampaigns,
      reportEntities,
    } = this.props;
    const reportTypes = [
      {
        code: 'DD_PDF',
        ar: 'تقرير التقييم التفصيلي - PDF',
        en: 'Deep Dive Report - PDF',
      },
      {
        code: 'SA_PDF',
        ar: 'تقرير التقييم الذاتي - PDF',
        en: 'Self Assessment Report - PDF',
      },
      // {
      //   code: 'EX_PDF',
      //   ar: 'تقرير الملخص التنفيذي - PDF',
      //   en: 'Executive Summary Report - PDF',
      // },
    ];
    if (this.props.userRole === ADMIN) {
      reportTypes.push({
        code: 'FINAL_CSV',
        ar: 'تقرير نهائي - CSV',
        en: 'Final Report - CSV',
      });
      reportTypes.push({
        code: 'TRAINING_CSV',
        ar: 'تقرير التدريب - CSV',
        en: 'Training Report - CSV',
      });
    }
    if (this.props.userRole !== ENTITY_COORDINATOR) {
      reportTypes.push({
        code: 'FULL_CSV',
        ar: 'تقرير كامل - CSV',
        en: 'Full Report - CSV',
      });
    }
    const typesOfReports = reportTypes.map(type => {
      return {
        label: type[language],
        value: type.code,
      };
    });

    return (
      <div className="form-container reports">
        <legend className="form-title">
          {translateString(strings.reports.generateReport)}
        </legend>
        <Formik
          initialValues={{
            report_year: '',
            report_campaign: '',
            report_type: '',
            report_entity: '',
          }}
          validationSchema={Yup.lazy(() => {
            return Yup.object().shape({
              report_year: Yup.number().required(
                translateString(strings.reports.errors.year)
              ),
              report_campaign: Yup.string().required(
                translateString(strings.reports.errors.campaign)
              ),
              report_type: Yup.string().required(
                translateString(strings.reports.errors.type)
              ),
              report_entity: Yup.string().when(
                'report_type',
                (reportType, schema) => {
                  if (reportType !== 'FULL_CSV' && reportType !== 'FINAL_CSV')
                    return schema.required(
                      translateString(strings.reports.errors.entity)
                    );
                  return schema;
                }
              ),
            });
          })}
          onSubmit={(values, { resetForm, setSubmitting }) => {
            this.props
              .generateAndDownloadReport(
                values.report_type,
                values.report_campaign,
                values.report_entity
              )
              .then(res => {
                setSubmitting(false);
                resetForm({
                  report_year: '',
                  report_campaign: '',
                  report_type: '',
                  report_entity: '',
                });
                window.open(res.value.data.url);
              })
              .catch(err => {
                setSubmitting(false);
                toastr.error(err.response.data.message);
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
            <Form className="form-wrapper" onSubmit={handleSubmit}>
              <fieldset>
                <MySelect
                  id="report_year"
                  required
                  loading={!!reportYears.isFetching}
                  className="custom-select"
                  name="report_year"
                  label={translateString(strings.reports.year)}
                  placeholder={`${translateString(
                    strings.reports.yearPlaceholder
                  )}*`}
                  onChange={(key, value) => {
                    setFieldValue(key, value);
                    if (value) this.props.getReportCampaigns(value);
                  }}
                  onBlur={setFieldTouched}
                  error={errors.report_year}
                  touched={touched.report_year}
                  options={reportYears.data[language]}
                  value={values.report_year}
                />
                <MySelect
                  id="report_campaign"
                  required
                  loading={!!reportCampaigns.isFetching}
                  className="custom-select"
                  name="report_campaign"
                  label={translateString(strings.reports.campaign)}
                  placeholder={`${translateString(
                    strings.reports.campaignPlaceholder
                  )}*`}
                  onChange={(key, value) => {
                    setFieldValue(key, value);
                    if (value && values.report_type) {
                      this.props.getReportEntities(value, values.report_type);
                    }
                  }}
                  onBlur={setFieldTouched}
                  error={errors.report_campaign}
                  touched={touched.report_campaign}
                  disabled={values.report_year === ''}
                  options={reportCampaigns.data[language]}
                  value={values.report_campaign}
                />
                <MySelect
                  id="report_type"
                  required
                  className="custom-select"
                  name="report_type"
                  label={translateString(strings.reports.type)}
                  placeholder={`${translateString(strings.reports.type)}*`}
                  onChange={(key, value) => {
                    if (
                      value &&
                      values.report_campaign &&
                      value !== 'FULL_CSV' &&
                      value !== 'FINAL_CSV'
                    ) {
                      this.props.getReportEntities(
                        values.report_campaign,
                        value
                      );
                    }
                    setFieldValue(key, value);
                  }}
                  onBlur={setFieldTouched}
                  error={errors.report_type}
                  touched={touched.report_type}
                  disabled={values.report_campaign === ''}
                  options={typesOfReports}
                  value={values.report_type}
                />
                {values.report_type !== 'FULL_CSV' &&
                  values.report_type !== 'FINAL_CSV' && (
                    <MySelect
                      id="report_entity"
                      required={
                        values.report_type !== 'FULL_CSV' &&
                        values.report_type !== 'FINAL_CSV'
                      }
                      loading={!!reportEntities.isFetching}
                      className="custom-select"
                      name="report_entity"
                      label={translateString(strings.reports.entity)}
                      placeholder={`${translateString(
                        strings.reports.entityPlaceholder
                      )}*`}
                      onChange={setFieldValue}
                      onBlur={setFieldTouched}
                      error={errors.report_entity}
                      touched={touched.report_entity}
                      disabled={values.report_type === ''}
                      options={reportEntities.data[language]}
                      value={values.report_entity}
                    />
                  )}
              </fieldset>
              <div className="reports__button-wrapper">
                <button
                  className="button button--secondary"
                  type="submit"
                  disabled={isSubmitting}
                >
                  {translateString(strings.reports.generateAndDownload)}
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
  const { language, reportYears, reportCampaigns, reportEntities } = state;
  return {
    language,
    reportYears,
    reportCampaigns,
    reportEntities,
  };
}

const mapDispatchToProps = {
  getReportYears,
  getReportCampaigns,
  getReportEntities,
  generateAndDownloadReport,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Reports);

Reports.propTypes = {
  /** This string is used to determine the language used to display the years */
  language: PropTypes.string,
  /** This function sends a request to get all the years that contain campaigns */
  getReportYears: PropTypes.func,
  /** An object that contains all the years that contain campaigns */
  reportYears: PropTypes.object,
  /** This function sends a request to get all campaigns that were created in the year selected by the current user */
  getReportCampaigns: PropTypes.func,
  /** An object that contains all the created campaigns in the year selected by the current user */
  reportCampaigns: PropTypes.object,
  /** This function sends a request to get the entities that the current user can generate a report for, according to the previous selections */
  getReportEntities: PropTypes.func,
  /** An object that contains all the entities that the current user can generate a report for */
  reportEntities: PropTypes.object,
  /** This function sends a request that generates and downloads the report according to the selections made by the current user */
  generateAndDownloadReport: PropTypes.func,
  /** A number that determines the role of the current user */
  userRole: PropTypes.number,
};
