import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import moment from 'moment';
import PropTypes from 'prop-types';
import { toastr } from 'react-redux-toastr';
import { connect } from 'react-redux';
import { CustomTable } from '../../components';
import { getCampaignsEntities, setCampaignEntitiesList } from '../../actions';
import { strings, translateString } from '../../utilities';

class CampaignEntities extends Component {
  constructor(props) {
    super(props);
    this.state = {
      addedCampaigns: [],
      addedCampaignsData: [],
      currentQuery: {},
    };
  }
  componentDidMount() {
    const query = {
      page: 1,
      with_last_campaignt: true,
      per_page: 25,
      campaign_id: this.props.campaignID,
      paginate: true,
    };
    this.props.getCampaignsEntities(query);
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
      with_last_campaignt: true,
      campaign_id: this.props.campaignID,
      paginate: true,
    };

    if (
      this.state.currentQuery.page !== query.page ||
      this.state.currentQuery.sort !== query.sort ||
      this.state.currentQuery.sort_by !== query.sort_by
    ) {
      this.setState({ currentQuery: query });
      this.props.getCampaignsEntities(query);
    }
  };

  handleCheckboxChange = ev => {
    const { target } = ev;
    let checkedValues = [];
    let checkedData = [];
    if (target.checked) {
      checkedValues = [...this.state.addedCampaigns, Number(target.value)];
      checkedData = [
        ...this.state.addedCampaignsData,
        this.props.entities.data.find(el => el.id === Number(target.value)),
      ];
    } else {
      checkedValues = [...this.state.addedCampaigns];
      checkedData = [...this.state.addedCampaignsData];
      checkedValues.splice(checkedValues.indexOf(Number(target.value)), 1);
      checkedData = checkedData.filter(
        item => item.id !== Number(target.value)
      );
    }
    this.setState({
      addedCampaigns: checkedValues,
      addedCampaignsData: checkedData,
    });
  };

  submitData = () => {
    if (this.state.addedCampaigns.length > 0) {
      this.props.action(
        this.state.addedCampaigns,
        this.state.addedCampaignsData
      );
    } else {
      toastr.error(translateString(strings.campaign.errorEmptyEntities));
    }
  };

  render() {
    const { data, isLoading, totalPages } = this.props.entities;
    const columns = [
      {
        Header: () => (
          <span className="format-header">
            {translateString(strings.campaign.addToCampaign)}
          </span>
        ),
        accessor: 'id',
        Cell: row => {
          return (
            <div className="button-checkbox-wrapper">
              <input
                type="checkbox"
                className="button-checkbox"
                onChange={this.handleCheckboxChange}
                value={row.original.id}
                id={row.original.id}
                checked={
                  this.state.addedCampaigns.indexOf(row.original.id) > -1
                }
              />
              <label htmlFor={row.original.id} />
            </div>
          );
        },
        sortable: false,
      },
      {
        Header: translateString(strings.table.header.code),
        accessor: 'code',
        sortable: true,
      },
      {
        Header: translateString(strings.table.header.name),
        accessor: 'name',
        sortable: true,
        Cell: row => {
          return row.original.nameTranslations[this.props.language];
        },
      },
      {
        Header: () => (
          <span className="format-header">
            {translateString(strings.table.header.lastAssessmentDate)}
          </span>
        ),
        accessor: 'last_campaign_info.last_campaign_date',
        sortable: false,
        Cell: row => {
          return row.value ? moment(row.value).format('DD MMMM YYYY') : '-';
        },
      },
      {
        Header: () => (
          <span className="format-header">
            {' '}
            {translateString(strings.table.header.lastAssessmentScore)}
          </span>
        ),
        accessor: 'last_campaign_info.last_campaign_score',
        sortable: false,
        Cell: row => {
          return row.value ? row.value : '-';
        },
      },
      // {
      //   Header: () => (
      //     <span className="format-header">
      //       {translateString(strings.table.header.lastAssessmentType)}
      //     </span>
      //   ),
      //   accessor: 'last_campaign_info',
      //   sortable: false,
      //   Cell: row => {
      //     return row.value && row.value.last_campaign_score
      //       ? row.value.last_campaign_score
      //       : '-';
      //   },
      // },
      {
        Header: () => (
          <span className="format-header">
            {translateString(strings.table.header.onBoardingDate)}
          </span>
        ),
        accessor: 'onboarding_date',
        sortable: true,
        Cell: row => {
          return moment(row.original.onboarding_date).format('DD MMMM YYYY');
        },
      },
      {
        Header: translateString(strings.table.header.advisor),
        accessor: 'advisor',
        sortable: false,
        Cell: row => {
          return row.value
            ? `${row.value.first_name} ${row.value.last_name}`
            : '-';
        },
      },
    ];
    return (
      <section className="table-wrapper">
        <div>
          <h1 className="section-title bold">
            {translateString(strings.campaign.entitiesIncluded)}
          </h1>
          <CustomTable
            columns={columns}
            data={data} // should default to []
            pages={totalPages} // should default to -1 (which means we don't know how many pages we have)
            loading={isLoading}
            manual // informs React Table that you'll be handling sorting and pagination server-side
            onFetchData={this.fetchData}
            defaultPageSize={25}
          />
          <div className="button-group">
            <Link to="/campaigns" className="button button--primary">
              {translateString(strings.table.cancel)}
            </Link>
            <button
              onClick={() => {
                this.submitData();
              }}
              className="button button--secondary"
            >
              {translateString(strings.table.nextText)}
            </button>
          </div>
        </div>
        {/* </div> */}
      </section>
    );
  }
}

function mapStateToProps(state) {
  return {
    entities: state.campaignEntities,
    language: state.language,
    ...state.flags,
  };
}
const mapDispatchToProps = {
  getCampaignsEntities,
  setCampaignEntitiesList,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CampaignEntities);

CampaignEntities.propTypes = {
  action: PropTypes.func,
  success: PropTypes.func,
  campaignID: PropTypes.number,
  getEntities: PropTypes.func,
  language: PropTypes.string,
  isLoading: PropTypes.number,
  entities: PropTypes.object,
  getCampaignsEntities: PropTypes.func,
  setCampaignEntitiesList: PropTypes.func,
  campaignsEntities: PropTypes.shape({
    currentPage: PropTypes.number,
    data: PropTypes.array,
  }),
};
