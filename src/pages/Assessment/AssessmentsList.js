import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { toastr } from 'react-redux-toastr';
import { CustomTable } from '../../components';
import { getAssessments, getEcAssessments } from '../../actions';
import {
  strings,
  numbers,
  translateString,
  ENTITY_COORDINATOR,
  MASTER_ASSESSOR,
} from '../../utilities';

class AssessmentList extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  fetchData = (state, instance) => {
    this.setState({ tableState: state, tableInstance: instance });
    const sorted = state.sorted[0];
    const requestedPage = state.page + 1;
    const sorting = sorted ? (sorted && sorted.desc ? 'desc' : 'asc') : 'desc';
    const query = {
      page: requestedPage,
      per_page: 25,
      sort: sorting,
      sort_by: sorted && sorted.id,
    };
    if (this.props.role === ENTITY_COORDINATOR) {
      this.props.getEcAssessments(false, query);
    } else {
      this.props.getAssessments(query);
    }
  };

  initializeColumns() {
    let columns = [
      {
        Header: translateString(strings.table.header.creationDate),
        accessor: 'created_at',
        Cell: row => {
          return moment(row.value).format('DD MMMM YYYY');
        },
      },
      {
        Header: translateString(strings.table.header.campaigns),
        accessor: 'campaigns',
        sortable: false,
        Cell: row => {
          if (this.props.role === ENTITY_COORDINATOR) {
            const { name } = row.original.translations.find(item => {
              return item.locale === this.props.language;
            });
            return <span title={name}>{name}</span>;
          } else if (row.original.campaigns) {
            const campaigns = row.original.campaigns.map(campaign => {
              return campaign.translations.find(item => {
                return item.locale === this.props.language;
              }).name;
            });
            return campaigns.join(', ');
          }
          return '';
        },
      },
    ];
    if (this.props.role === ENTITY_COORDINATOR) {
      columns.push({
        Header: translateString(strings.table.header.campaignStartDate),
        accessor: 'start_date',
        sortable: false,
        Cell: row => {
          return moment(row.value).format('DD MMMM YYYY');
        },
      });
      columns.push({
        Header: translateString(strings.table.header.type),
        accessor: 'entities_progress',
        sortable: false,
        Cell: row => {
          const { assessment_type: assessmentType } = row.value;
          return assessmentType === 1
            ? translateString(strings.assesmentType.deepDive)
            : translateString(strings.assesmentType.lightTouch);
        },
      });
      columns.push({
        Header: translateString(strings.table.header.reportSubmissionDate),
        accessor: 'submission_date',
        sortable: false,
        Cell: row => {
          return !row.original.submission_date
            ? '-'
            : moment(row.original.submission_date).format('DD MMMM YYYY');
        },
      });
      columns.push({
        Header: '',
        accessor: 'id',
        sortable: false,
        Cell: row => {
          const {
            id: campaignID,
            assessment_id: assessmentID,
            entities_progress: { entity_id: entityID },
          } = row.original;
          return (
            <div className="table__actions">
              <Link
                className="button button--link"
                to={{
                  pathname: `/campaign/${campaignID}/assessment/${assessmentID}/entity/${entityID}`,
                  state: { disabled: true },
                }}
              >
                {translateString(strings.table.header.view)}
              </Link>
            </div>
          );
        },
      });
    } else {
      columns = [
        ...columns.slice(0, 2),
        {
          Header: translateString(strings.table.header.createdBy),
          accessor: 'creator',
          sortable: false,
          Cell: row => {
            return row.original.creator
              ? `${row.original.creator.first_name} ${
                  row.original.creator.last_name
                }`
              : '-';
          },
        },
        ...columns.slice(2),
      ];
    }
    if (this.props.role !== ENTITY_COORDINATOR) {
      columns.unshift({
        Header: translateString(strings.table.header.name),
        accessor: 'name',
        Cell: row => {
          let data = row.original.translations;
          if (this.props.role === ENTITY_COORDINATOR) {
            data = row.original.assessment.translations;
          }
          const { name } = data.find(item => {
            return item.locale === this.props.language;
          });
          return <span title={name}>{name}</span>;
        },
      });
    }
    if (this.props.role === MASTER_ASSESSOR) {
      columns.push({
        sortable: false,
        width: 300,
        Cell: row => {
          return (
            <div className="table table__actions">
              <Link
                className="button button--link"
                to={`/assessments/${row.original.id}/edit`}
                onClick={e => {
                  if (row.original.campaigns.length) {
                    e.preventDefault();
                    toastr.error(
                      translateString(strings.errors.editAssessment)
                    );
                  }
                }}
              >
                {translateString(strings.assessment.edit)}
              </Link>
            </div>
          );
        },
      });
    }
    return columns;
  }

  render() {
    const columns = this.initializeColumns();
    const {
      isLoading,
      role,
      language,
      inActiveCampaignAssessments,
      assessments,
    } = this.props;
    const { data: assessmentsList, totalPages, total } =
      role === ENTITY_COORDINATOR ? inActiveCampaignAssessments : assessments;
    return (
      <section className="table-wrapper">
        <div className="container">
          <header>
            <h1 className="section-title bold">
              {`${translateString(strings.assessments.title)} `}
              {total !== undefined && total > 0 && (
                <small>
                  ({language === 'ar' ? numbers.convertToArabic(total) : total})
                </small>
              )}
            </h1>
            {role === 2 && (
              <p className="new-link">
                <Link
                  to="/assessments/new"
                  className="button button--primary add"
                >
                  {translateString(strings.newAssessment.title)}
                </Link>
              </p>
            )}
          </header>
          <CustomTable
            columns={columns}
            data={assessmentsList} // should default to []
            pages={totalPages} // should default to -1 (which means we don't know how many pages we have)
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
    assessments: state.assessmentsPaginated,
    inActiveCampaignAssessments: state.inactiveAssessments,
    language: state.language,
    role: state.userData.role_id,
    ...state.flags,
  };
}
const mapDispatchToProps = {
  getAssessments,
  getEcAssessments,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AssessmentList);

AssessmentList.propTypes = {
  getAssessments: PropTypes.func,
  getEcAssessments: PropTypes.func,
  assessments: PropTypes.shape({
    currentPage: PropTypes.number,
    data: PropTypes.array,
  }),

  inActiveCampaignAssessments: PropTypes.shape({
    currentPage: PropTypes.number,
    data: PropTypes.array,
  }),

  language: PropTypes.string,
  isLoading: PropTypes.number,
  userRole: PropTypes.number,
  role: PropTypes.number,
  activeCampaign: PropTypes.bool,
};
