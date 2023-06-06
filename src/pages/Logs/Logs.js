import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { connect } from 'react-redux';
import { CustomTable, MyDatePicker, MySelect } from '../../components';
import { getLogs, getLogsActions } from '../../actions';
import { strings, translateString } from '../../utilities';

class Logs extends Component {
  constructor(props) {
    super(props);
    this.state = {
      filters: {
        actor_email: '',
        action_name: '',
      },
      filtersOperators: {
        actor_email: 'LIKE',
        start_date: '>=',
        end_date: '<=',
        action_name: '=',
      },
    };
  }
  componentDidMount() {
    this.props.getLogsActions();
  }

  handleDateChange = (value, filterName) => {
    const val = value
      ? moment(value)
          .locale('en')
          .format('YYYY-MM-DD')
      : value;
    const filters = { ...this.state.filters };
    filters[filterName] = val;
    this.setState({ filters });
  };

  getActions = () => {
    const { language, logsActions } = this.props;
    return logsActions[language];
  };

  fetchData = (state, instance) => {
    this.setState({ tableState: state, tableInstance: instance });
    const sorted = state.sorted[0];
    const requestedPage = state.page + 1;
    const sorting = sorted ? (sorted && sorted.desc ? 'desc' : 'asc') : 'desc';
    this.setState({
      requestedPage,
      sorted,
    });
    const query = {
      paginate: true,
      page: requestedPage,
      per_page: 25,
      sort: sorting,
      sort_by: sorted && sorted.id,
    };
    const { filters, filtersOperators } = this.state;
    Object.keys(filters).forEach((key, index) => {
      if (filters[key]) {
        query[`filters[${index}][field]`] =
          key === 'start_date' || key === 'end_date' ? 'created_at' : key;
        query[`filters[${index}][value]`] =
          key === 'end_date'
            ? moment(filters[key])
                .add('days', 1)
                .locale('en')
                .format('YYYY-MM-DD')
            : filters[key];
        query[`filters[${index}][operator]`] = filtersOperators[key];
      }
    });
    this.props.getLogs(query);
  };

  initializeColumns = () => {
    const columns = [
      {
        Header: translateString(strings.table.header.actorName),
        accessor: 'actor_name',
        sortable: true,
        Cell: row => {
          return <span title={row.value}>{row.value}</span>;
        },
      },
      {
        Header: translateString(strings.table.header.actorEmail),
        accessor: 'actor_email',
        sortable: true,
        Cell: row => {
          return <span title={row.value}>{row.value}</span>;
        },
      },
      {
        Header: translateString(strings.table.header.timestamp),
        accessor: 'created_at',
        sortable: true,
        Cell: row => {
          return moment(row.value).format('DD MMMM YYYY - h:mm a');
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
      logs: { data: logs, totalPages, isFetching },
    } = this.props;

    const columns = this.initializeColumns();
    return (
      <section className="table-wrapper">
        <div className="container">
          <header>
            <h1 className="section-title bold">
              {translateString(strings.header.systemLogs)}
            </h1>

            <div className="grid-wrapper two-thirds grid--2 section-actions">
              <div className="form-item">
                <label className="visually-hidden" htmlFor="actor_email">
                  {translateString(strings.table.header.actorEmail)}
                </label>
                <input
                  type="text"
                  id="actor_email"
                  name="actor_email"
                  placeholder={translateString(strings.table.header.actorEmail)}
                  onKeyPress={e => {
                    if (e.key === 'Enter') {
                      const filters = {
                        ...this.state.filters,
                        actor_email: e.target.value,
                      };
                      this.setState({ filters }, () =>
                        this.state.tableInstance.fireFetchData()
                      );
                    }
                  }}
                />
              </div>
              <MyDatePicker
                id="start_date"
                label={translateString(strings.form.startDate)}
                labelContent={translateString(strings.form.startDate)}
                labelVisible={false}
                value={this.state.filters.start_date}
                onChange={(label, value) => {
                  this.handleDateChange(value, 'start_date');
                }}
                onBlur={() => {
                  this.state.tableInstance.fireFetchData();
                }}
                placeholderText={translateString(strings.form.startDate)}
                popperPlacement="top-end"
              />
              <MyDatePicker
                id="end_date"
                label={translateString(strings.form.endDate)}
                labelContent={translateString(strings.form.endDate)}
                labelVisible={false}
                value={this.state.filters.end_date}
                onChange={(label, value) => {
                  this.handleDateChange(value, 'end_date');
                }}
                onBlur={() => {
                  this.state.tableInstance.fireFetchData();
                }}
                minDate={moment(this.state.filters.start_date).add(1, 'day')}
                placeholderText={translateString(strings.form.endDate)}
                popperPlacement="top-end"
              />
              <MySelect
                required
                multi={false}
                options={this.getActions()}
                label={translateString(strings.form.actions)}
                labelHidden={true}
                placeholder={translateString(strings.form.actions)}
                onChange={(id, value) => {
                  const filters = {
                    ...this.state.filters,
                    action_name: value,
                  };
                  this.setState({ filters }, () => {
                    this.state.tableInstance.fireFetchData();
                  });
                }}
                name="actions"
                id="actions"
                value={this.state.filters.action_name}
              />
            </div>
          </header>
          <CustomTable
            columns={columns}
            data={logs} // should default to []
            pages={totalPages} // should default to -1 (which means we don't know how many pages we have)
            loading={!!isFetching}
            manual // informs React Table that you'll be handling sorting and pagination server-side
            onFetchData={this.fetchData}
            defaultPageSize={25}
          />
        </div>
      </section>
    );
  }
}

function mapStateToProps(state) {
  const { logs, logsActions, language, isFetching } = state;
  return {
    logs,
    logsActions,
    language,
    isFetching,
  };
}
const mapDispatchToProps = {
  getLogs,
  getLogsActions,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Logs);

Logs.propTypes = {
  logs: PropTypes.object,
  role_id: PropTypes.number,
  language: PropTypes.string,
  isFetching: PropTypes.number,
  getLogs: PropTypes.func,
  getLogsActions: PropTypes.func,
  logsActions: PropTypes.object,
};
