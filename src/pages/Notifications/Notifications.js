import React, { Component } from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { strings, translateString } from '../../utilities';
import { getNotifications } from '../../actions';
import { CustomTable } from '../../components';

/**
 * This component renders the reports form where users can customize any report that they need to generate and download.
 */
class Reports extends Component {
  componentDidMount() {
    // this.props.getNotifications();
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
    this.props.getNotifications(query);
  };

  initializeColumns = () => {
    const columns = [
      {
        Header: translateString(strings.table.header.date),
        accessor: 'created_at',
        sortable: true,
        width: 200,
        Cell: row => {
          return moment(row.value).format('DD MMMM YYYY - h:mm a');
        },
      },
      {
        Header: translateString(strings.table.header.campaign),
        accessor: 'campaign_name',
        sortable: true,
        width: 160,
        Cell: row => {
          return !row.original.campaign ? (
            '-'
          ) : (
            <span title={row.original.campaign.name}>
              {row.original.campaign.name}
            </span>
          );
        },
      },
      {
        Header: translateString(strings.table.header.action),
        accessor: translateString(strings.table.column.actionMessage),
        sortable: false,
        Cell: row => {
          return <span title={row.value}>{row.value}</span>;
        },
      },
    ];
    return columns;
  };

  render() {
    const {
      notifications: { data: notifications, totalPages, isFetching },
    } = this.props;
    const columns = this.initializeColumns();
    return (
      <div className="container">
        <div className="table-wrapper">
          <header>
            <h1 className="section-title bold">
              {translateString(strings.notifications.title)}
            </h1>
          </header>
          <CustomTable
            columns={columns}
            data={notifications} // should default to []
            pages={totalPages} // should default to -1 (which means we don't know how many pages we have)
            loading={isFetching}
            onFetchData={this.fetchData}
            defaultPageSize={25}
          />
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  const { language, notifications } = state;
  return {
    language,
    notifications,
  };
}

const mapDispatchToProps = {
  getNotifications,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Reports);

Reports.propTypes = {
  getNotifications: PropTypes.func,
  notifications: PropTypes.object,
};
