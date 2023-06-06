import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Bar } from 'react-chartjs-2';
import PropTypes from 'prop-types';
import moment from 'moment';
import { getDashboardChartData, getLogs } from '../../actions';
import { MySelect, CustomTable } from '../../components';
import { strings, numbers, translateString } from '../../utilities';

/**
 * Dashboard for users activites.
 * It shows logs and graphs of entity scores
 */
class Dashboard extends Component {
  constructor() {
    super();
    this.state = {
      filters: {
        duration: '7',
        duration_unit: 'day',
        type: '',
        // per_page: '25',
      },
      chartLabels: [],
      chartValues: [],
      durationFilter: '7_day',
    };
  }
  componentDidMount() {
    this.getDashboardChartData();
  }
  initializeColumns = () => {
    const columns = [
      {
        Header: translateString(strings.table.header.by),
        accessor: 'actor_name',
        sortable: true,
        width: 180,
        Cell: row => {
          return <span title={row.value}>{row.value}</span>;
        },
      },
      {
        Header: translateString(strings.table.header.date),
        accessor: 'created_at',
        sortable: true,
        width: 180,
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
      finished: true,
    };
    this.props.getLogs(query);
  };
  getDashboardChartData = () => {
    const query = {};
    const { filters } = this.state;
    Object.keys(filters).forEach((key, index) => {
      if (filters[key]) {
        query[`filters[${index}][field]`] = key;
        query[`filters[${index}][value]`] = filters[key];
        query[`filters[${index}][operator]`] = '=';
      }
    });
    this.props.getDashboardChartData(query);
  };

  render() {
    const {
      language,
      dashboardChartData,
      logs: { data: logs, totalPages, isFetching },
    } = this.props;
    const { entities, total } = dashboardChartData;
    const columns = this.initializeColumns();
    const data = canvas => {
      const ctx = canvas.getContext('2d');
      const gradient = ctx.createLinearGradient(0, 0, 0, 200);
      gradient.addColorStop(0, '#00ba8b');
      gradient.addColorStop(1, '#007064');
      return {
        labels: entities.map(item => {
          return language === 'ar'
            ? item.entity.translations[0].name
            : item.entity.translations[1].name;
        }),
        datasets: [
          {
            label: translateString(strings.dashboard.maturityScore),
            backgroundColor: gradient,
            hoverBackgroundColor: gradient,
            pointBackgroundColor: gradient,
            data: entities.map(item => {
              return item.finished_score;
            }),
          },
        ],
      };
    };
    const options = {
      maintainAspectRatio: true,
      responsive: true,
      legend: {
        position: 'bottom',
        display: false,
        // labels: {
        //   fontFamily: "'FrutigerArabic','Etelka','sans-serif'",
        //   fontSize: 16,
        // },
      },
      scales: {
        xAxes: [
          {
            ticks: {
              fontFamily: "'FrutigerArabic','Etelka','sans-serif'",
              fontSize: 14,
              fontStyle: 300,
              autoSkip: false,
            },
            barPercentage: 0.6,
            categoryPercentage: 0.6,
            display: true,
            gridLines: {
              display: false,
              color: '#000',
            },
            scaleLabel: {
              display: true,
              fontFamily: "'FrutigerArabic','Etelka','sans-serif'",
              fontSize: 16,
              labelString: translateString(strings.dashboard.entity),
            },
          },
        ],
        yAxes: [
          {
            ticks: {
              min: 0,
              max: 5,
              stepSize: 1,
              callback(value) {
                return language === 'ar'
                  ? numbers.convertToArabic(value)
                  : value;
              },
            },
            display: true,
            gridLines: {
              display: false,
              color: '#000',
            },
            scaleLabel: {
              display: true,
              fontFamily: "'FrutigerArabic','Etelka','sans-serif'",
              fontSize: 16,
              labelString: translateString(strings.dashboard.overallScore),
            },
            position: language === 'ar' ? 'right' : 'left',
          },
        ],
      },
    };

    const reportTypes = ['SS', 'DD'];
    const filterOptions = [
      {
        duration: 7,
        duration_unit: 'day',
      },
      {
        duration: 1,
        duration_unit: 'month',
      },
      {
        duration: 3,
        duration_unit: 'month',
      },
      {
        duration: 6,
        duration_unit: 'month',
      },
      {
        duration: 1,
        duration_unit: 'year',
      },
    ];
    return (
      <section className="dashboard">
        <div className="container">
          <div className="dashboard__filter-wrapper">
            <h2 className="dashboard__chart-title">
              {translateString(strings.dashboard.overallScores)}
            </h2>
            <div className="dashboard__filters">
              <MySelect
                className="dashboard__filter"
                required
                multi={false}
                label={translateString(strings.form.duration)}
                labelHidden={true}
                options={reportTypes.map(value => ({
                  label: value,
                  value,
                }))}
                placeholder={translateString(strings.form.report_type)}
                onChange={(id, value) => {
                  const filters = {
                    ...this.state.filters,
                    type: value,
                  };
                  this.setState({ filters }, () => {
                    this.getDashboardChartData();
                  });
                }}
                name="duration"
                id="duration"
                value={this.state.filters.type}
              />
              <MySelect
                className="dashboard__filter"
                required
                multi={false}
                label={translateString(strings.form.duration)}
                labelHidden={true}
                options={filterOptions.map(value => {
                  const duration =
                    language === 'ar'
                      ? numbers.convertToArabic(value.duration)
                      : value.duration;
                  const durationUnit =
                    value.duration > 1
                      ? `${value.duration_unit}s`
                      : value.duration_unit;
                  const label = `${duration} ${translateString(
                    strings.form[`${durationUnit}`]
                  )}`;
                  return {
                    label,
                    value: `${value.duration}_${value.duration_unit}`,
                  };
                })}
                placeholder={translateString(strings.form.duration)}
                onChange={(id, value) => {
                  const durationArray = value.split('_');
                  const filters = {
                    ...this.state.filters,
                    duration: durationArray[0],
                    duration_unit: durationArray[1],
                  };
                  this.setState({ filters, durationFilter: value }, () => {
                    this.getDashboardChartData();
                  });
                }}
                name="duration"
                id="duration"
                value={this.state.durationFilter}
              />
            </div>
          </div>
          <div className="dashboard__chart-wrapper clearfix">
            {total > 0 && (
              <div className="dashboard__entities">
                <p>
                  {/* <span>
                    {language === 'ar' ? numbers.convertToArabic(total) : total}
                  </span>
                  {translateString(strings.dashboard.totalEntities)} */}
                </p>
              </div>
            )}
            <div className="dashboard__chart">
              <Bar data={data} width={100} height={50} options={options} />
            </div>
          </div>
          <div className="table-wrapper">
            <header>
              <h1 className="section-title bold">
                {translateString(strings.dashboard.actions)}
              </h1>
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
        </div>
      </section>
    );
  }
}

function mapStateToProps(state) {
  const { dashboardChartData, logs, language } = state;
  return {
    dashboardChartData,
    logs,
    language,
  };
}

const mapDispatchToProps = {
  getDashboardChartData,
  getLogs,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Dashboard);

Dashboard.propTypes = {
  language: PropTypes.string,
  getDashboardChartData: PropTypes.func,
  getLogs: PropTypes.func,
  dashboardChartData: PropTypes.object,
  logs: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
};
