import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { CustomTable } from '../../components';
import { getCampaignsWithStatus, getCampaigns } from '../../actions';
import { strings, numbers, translateString } from '../../utilities';
/** Shows a list of all active campaigns
 * @visibleName Active Campaigns List
 */
class ActiveCampaigns extends Component {
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
          const { name } = row.original.translations.find(item => {
            return item.locale === this.props.language;
          });
          return <span title={name}>{name}</span>;
        },
      },
      {
        Header: translateString(strings.table.header.startDate),
        accessor: 'start_date',
        Cell: row => {
          return !row.original.start_date
            ? '-'
            : moment(row.original.start_date).format('DD MMMM YYYY');
        },
      },
      {
        Header: translateString(strings.table.header.endDate),
        accessor: 'end_date',
        sortable: false,
        Cell: row => {
          return !row.original.end_date
            ? '-'
            : moment(row.original.end_date).format('DD MMMM YYYY');
        },
      },
      {
        Header: translateString(strings.table.header.assessmentUsed),
        accessor: 'assessment',
        sortable: false,
        Cell: row => {
          const { name } = row.original.assessment.translations.find(item => {
            return item.locale === this.props.language;
          });
          return <span title={name}>{name}</span>;
        },
      },
      // {
      //   Header: translateString(strings.table.header.entitiesStatus),
      //   accessor: 'entities',
      //   sortable: false,
      //   Cell: row => {
      //     return !row.original.entities ? '-' : `${row.original.entities}`;
      //   },
      // },
      // {
      //   Header: translateString(strings.table.header.status),
      //   accessor: 'status',
      //   sortable: false,
      //   Cell: row => {
      //     return row.original.status === 0
      //       ? translateString(strings.campaign.inactive)
      //       : translateString(strings.campaign.active);
      //   },
      // },
      {
        sortable: false,
        Cell: row => {
          return (
            <div className="table table__actions">
              <Link
                to={`/campaign/${row.original.id}`}
                className="table-action"
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
      paginate: true,
      page: requestedPage,
      per_page: 25,
      sort: sorting,
      sort_by: sorted && sorted.id,
    };
    if (
      this.state.currentQuery.page !== query.page ||
      this.state.currentQuery.sort !== query.sort ||
      this.state.currentQuery.sort_by !== query.sort_by
    ) {
      // This is because of a bug causing on Fetch data to be called infinitely according to page size
      this.setState({ currentQuery: query });
      this.props.getCampaignsWithStatus(true, query); // To get Active Campaigns with Listing
    }
  };

  render() {
    const {
      campaigns: { data: campaignsList, totalPages, total, isFetching },
      language,
    } = this.props;
    const columns = this.initializeColumns();
    return (
      <section className="table-wrapper">
        <div className="container">
          <header>
            <h1 className="section-title bold">
              {translateString(strings.activeAssessments.campaignTitle)}{' '}
              {total && (
                <small>
                  ({language === 'ar' ? numbers.convertToArabic(total) : total})
                </small>
              )}
            </h1>
          </header>
          <CustomTable
            columns={columns}
            data={campaignsList} // should default to []
            pages={totalPages} // should default to -1 (which means we don't know how many pages we have)
            loading={isFetching}
            manual // informs React Table that you'll be handling sorting and pagination server-side
            onFetchData={this.fetchData}
            filterable={false}
            filtered={false}
            defaultPageSize={25}
          />
        </div>
      </section>
    );
  }
}

function mapStateToProps(state) {
  return {
    campaigns: state.activeCampaigns,
    language: state.language,
    ...state.flags,
  };
}
const mapDispatchToProps = {
  getCampaignsWithStatus,
  getCampaigns,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ActiveCampaigns);

ActiveCampaigns.propTypes = {
  /** Role of Logged in Users */
  userRole: PropTypes.number,
  /** Gets active campaign */
  getCampaignsWithStatus: PropTypes.func,
  /** List of active campaign */
  campaigns: PropTypes.object,
  /** Language of system */
  language: PropTypes.string,
  /** Status of fetching data */
  isLoading: PropTypes.number,
};
