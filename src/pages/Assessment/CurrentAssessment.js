import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { CustomTable } from '../../components';
import { getEcAssessments } from '../../actions';
import { numbers, strings, translateString } from '../../utilities';

class CurrentAssessment extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  fetchData = (state, instance) => {
    this.setState({ tableState: state, tableInstance: instance });
    this.props.getEcAssessments(true, { paginate: false });
  };

  initializeColumns() {
    const columns = [
      // {
      //   Header: translateString(strings.table.header.name),
      //   accessor: 'name',
      //   sortable: false,
      //   Cell: row => {
      //     const { name } = row.original.assessment.translations.find(item => {
      //       return item.locale === this.props.language;
      //     });
      //     return <span title={name}>{name}</span>;
      //   },
      // },
      {
        Header: translateString(strings.table.header.assessmentStartDate),
        accessor: 'start_date',
        sortable: false,
        Cell: row => {
          return moment(row.value).format('DD MMMM YYYY');
        },
      },
      {
        Header: translateString(strings.table.header.assessmentEndDate),
        accessor: 'self_end_date',
        sortable: false,
        Cell: row => {
          return moment(row.value).format('DD MMMM YYYY');
        },
      },
      // {
      //   Header: translateString(strings.table.header.createdBy),
      //   accessor: 'creator',
      //   sortable: false,
      //   Cell: row => {
      //     return row.original.creator
      //       ? `${row.original.creator.first_name} ${
      //           row.original.creator.last_name
      //         }`
      //       : '-';
      //   },
      // },
      {
        Header: translateString(strings.table.header.type),
        accessor: 'entities_progress',
        sortable: false,
        Cell: row => {
          const { assessment_type: assessmentType } = row.value;
          return assessmentType === 1
            ? translateString(strings.assesmentType.deepDive)
            : translateString(strings.assesmentType.lightTouch);
        },
      },
      {
        Header: translateString(strings.table.header.campaign),
        accessor: 'campaigns',
        sortable: false,
        Cell: row => {
          const { name } = row.original.translations.find(item => {
            return item.locale === this.props.language;
          });
          return (
            <span>
              <span title={name}>{name}</span>
              <span className="active-word">
                ({translateString(strings.campaign.active)})
              </span>
            </span>
          );
        },
      },
      {
        Header: translateString(strings.table.header.progress),
        accessor: 'entities_progress',
        sortable: false,
        width: 100,
        Cell: row => {
          const progress =
            Math.round(
              row.original.entities_progress
                .self_assessment_progress_percentage * 100
            ) / 100;
          return `${
            this.props.language === 'ar'
              ? numbers.convertToArabic(progress)
              : progress
          } %`;
        },
      },
      {
        Header: '',
        accessor: 'actions',
        sortable: false,
        width: 300,
        Cell: row => {
          const {
            id: campaignID,
            assessment_id: assessmentID,
            entities_progress: {
              entity_id: entityID,
              submitted,
              self_assessment_progress_percentage: selfAssessmentProgressPercentage,
            },
          } = row.original;
          if (!submitted.self) {
            return (
              <div className="table table__actions">
                <Link
                  className="button button--link"
                  to={`/campaign/${campaignID}/assign`}
                >
                  {translateString(strings.table.assignUsers)}
                </Link>{' '}
                <Link
                  className="button button--primary button--medium"
                  to={`/campaign/${campaignID}/assessment/${assessmentID}/entity/${entityID}`}
                >
                  {selfAssessmentProgressPercentage
                    ? translateString(strings.table.continue)
                    : translateString(strings.table.start)}
                </Link>
              </div>
            );
          }
          return (
            <div className="table table__actions">
              <Link
                className="button button--link"
                to={{
                  pathname: `/campaign/${campaignID}/assessment/${assessmentID}/entity/${entityID}`,
                  //   pathname: `assessment/${assessmentID}/${campaignID}/${entityID}`,
                  state: { disabled: true },
                }}
              >
                {translateString(strings.table.header.view)}
              </Link>
            </div>
          );
        },
      },
    ];

    return columns;
  }

  render() {
    const columns = this.initializeColumns();
    const { isLoading, activeCampaignAssessments } = this.props;
    const { data: assessmentsList } = activeCampaignAssessments;
    return (
      <section className="table-wrapper current-assessment">
        <div className="container">
          <header>
            <h1 className="section-title bold">
              {translateString(strings.assessments.currentTitle)}
            </h1>
          </header>
          <CustomTable
            columns={columns}
            data={assessmentsList} // should default to []
            //  pages={totalPages} // should default to -1 (which means we don't know how many pages we have)
            loading={!!isLoading}
            manual // informs React Table that you'll be handling sorting and pagination server-side
            onFetchData={this.fetchData}
            defaultPageSize={25}
            filterable={false}
            filtered={false}
          />
        </div>
      </section>
    );
  }
}

function mapStateToProps(state) {
  return {
    activeCampaignAssessments: state.activeAssessments,
    language: state.language,
    ...state.flags,
  };
}
const mapDispatchToProps = {
  getEcAssessments,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CurrentAssessment);

CurrentAssessment.propTypes = {
  getEcAssessments: PropTypes.func,
  activeCampaignAssessments: PropTypes.shape({
    currentPage: PropTypes.number,
    data: PropTypes.array,
  }),
  language: PropTypes.string,
  isLoading: PropTypes.number,
};
