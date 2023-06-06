import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import { CustomTable } from '../../components';
import { getCampaignsWithStatus, generateSelfReport } from '../../actions';
import { strings, translateString } from '../../utilities';

class PreviousAssessmentsTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentQuery: {},
    };
  }
  initializeColumns = () => {
    const columns = [
      {
        Header: translateString(strings.table.header.name),
        accessor: 'name',
        Cell: row => {
          const { name } = row.original.assessment.translations.find(item => {
            return item.locale === this.props.language;
          });
          return <span title={name}>{name}</span>;
        },
      },
      {
        Header: translateString(strings.table.header.creationDate),
        accessor: 'creation_date',
        Cell: row => {
          return !row.original.created_at
            ? '-'
            : moment(row.original.created_at).format('DD MMMM YYYY');
        },
      },
      {
        Header: translateString(strings.table.header.createdBy),
        accessor: 'created_by',
        sortable: false,
        Cell: row => {
          return `${row.original.creator.first_name} ${row.original.creator.last_name}`;
        },
      },

      {
        Header: translateString(strings.table.header.campaign),
        accessor: 'campaign',
        sortable: false,
        Cell: row => {
          const { name } = row.original.translations.find(item => {
            return item.locale === this.props.language;
          });
          return <span title={name}>{name}</span>;
        },
      },
      {
        sortable: false,
        Cell: row => {
          return (
            <div className="table table__actions">
              <Link
                to={`/campaigns/${row.original.id}`}
                //   to={`/campaign/${row.original.id}`}
                className="button button--link table-action"
              >
                {translateString(strings.table.header.view)}
              </Link>
            </div>
          );
        },
      },
    ];
    return columns;
  };
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
      paginate: true,
    };
    if (
      this.state.currentQuery.page !== query.page ||
      this.state.currentQuery.sort !== query.sort ||
      this.state.currentQuery.sort_by !== query.sort_by
    ) {
      // This is because of a bug causing on Fetch data to be called infinitely according to page size
      this.setState({ currentQuery: query });
      this.props.getCampaignsWithStatus(false, query); // To get Active Campaigns
    }
  };

  render() {
    const {
      inActiveCampaigns: { data: campaignList, totalPages, isFetching },
    } = this.props;
    const columns = this.initializeColumns();
    return (
      <section className="previous-assessments">
        <h1 className="previous-assessments__title">
          {translateString(strings.previousAssessments.titleInactive)}
        </h1>
        <CustomTable
          columns={columns}
          data={campaignList} // should default to []
          pages={totalPages} // should default to -1 (which means we don't know how many pages we have)
          loading={!!isFetching}
          manual // informs React Table that you'll be handling sorting and pagination server-side
          onFetchData={this.fetchData}
          filterable={false}
          filtered={false}
          defaultPageSize={25}
        />
      </section>
    );
  }
}

function mapStateToProps(state) {
  return {
    inActiveCampaigns: state.inactiveCampaigns,
    language: state.language,
  };
}
const mapDispatchToProps = {
  getCampaignsWithStatus,
  generateSelfReport,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PreviousAssessmentsTable);

PreviousAssessmentsTable.propTypes = {
  getCampaignsWithStatus: PropTypes.func,
  generateSelfReport: PropTypes.func,

  inActiveCampaigns: PropTypes.shape({
    currentPage: PropTypes.number,
    data: PropTypes.array,
    campaignList: PropTypes.array,
    totalPages: PropTypes.number,
    total: PropTypes.number,
    isFetching: PropTypes.bool,
  }),

  language: PropTypes.string,
  isLoading: PropTypes.number,
};
