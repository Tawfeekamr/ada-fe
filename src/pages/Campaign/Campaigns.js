import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { CustomTable } from '../../components';
import { getCampaigns } from '../../actions';
import { strings, numbers, translateString } from '../../utilities';
/**
 * Lists all campaigns
 * @visibleName Campaigns List
 */
class Campaigns extends Component {
  constructor(props) {
    super(props);
    this.state = {};
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
        Header: translateString(strings.table.header.campaignStartDate),
        accessor: 'start_date',
        Cell: row => {
          return !row.original.start_date
            ? '-'
            : moment(row.original.start_date).format('DD MMMM YYYY');
        },
      },
      {
        Header: translateString(strings.table.header.campaignEndDate),
        accessor: 'end_date',
        sortable: false,
        Cell: row => {
          return !row.original.end_date
            ? '-'
            : moment(row.original.end_date).format('DD MMMM YYYY');
        },
      },
      {
        Header: translateString(strings.table.header.selfEndDate),
        accessor: 'self_end_date',
        width: 180,
        sortable: false,
        Cell: row => {
          return !row.original.self_end_date
            ? '-'
            : moment(row.original.self_end_date).format('DD MMMM YYYY');
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
      {
        Header: translateString(strings.table.header.entitiesStatus),
        accessor: 'entities',
        sortable: false,
        Cell: row => {
          return !row.original.entities ? '-' : `${row.original.entities}`;
        },
      },
      {
        Header: translateString(strings.table.header.status),
        accessor: 'status',
        sortable: false,
        Cell: row => {
          return row.original.status === 0
            ? translateString(strings.campaign.inactive)
            : translateString(strings.campaign.active);
        },
      },

      {
        sortable: false,
        width: 80,
        Cell: row => {
          return (
            <Link to={`/campaigns/${row.original.id}`} className="table-action">
              {translateString(strings.table.header.view)}
            </Link>
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
    };
    this.props.getCampaigns(query);
  };

  render() {
    const {
      campaigns: { data: campaignsList, totalPages, total },
      isLoading,
      userRole: role,
      language,
    } = this.props;
    const columns = this.initializeColumns();
    return (
      <section className="table-wrapper">
        <div className="container">
          <header>
            <h1 className="section-title bold">
              {translateString(strings.campaign.title)}{' '}
              {total && (
                <small>
                  ({language === 'ar' ? numbers.convertToArabic(total) : total})
                </small>
              )}
            </h1>
            {role === 2 && (
              <p className="new-link">
                <Link
                  to="/campaigns/new"
                  className="button button--primary add"
                >
                  {translateString(strings.campaign.button)}
                </Link>
              </p>
            )}
          </header>
          <CustomTable
            columns={columns}
            data={campaignsList} // should default to []
            pages={totalPages} // should default to -1 (which means we don't know how many pages we have)
            loading={!!isLoading}
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
    campaigns: state.campaigns,
    language: state.language,
    ...state.flags,
  };
}
const mapDispatchToProps = {
  getCampaigns,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Campaigns);

Campaigns.propTypes = {
  /** Role of currently logged in user */
  userRole: PropTypes.number,
  /** Gets list of campaign */
  getCampaigns: PropTypes.func,
  /** List of campaigns */
  campaigns: PropTypes.object,
  /** Currently selected language */
  language: PropTypes.string,
  /** @ignore */
  isLoading: PropTypes.number,
};
