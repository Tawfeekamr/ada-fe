import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { confirmAlert } from 'react-confirm-alert';
import { toastr } from 'react-redux-toastr';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { CustomTable } from '../../components';
import { getEntities, deleteEntity } from '../../actions';
import {
  strings,
  numbers,
  translateString,
  getLanguage,
  ENTITY_COORDINATOR,
  ENTITY_ADVISOR,
} from '../../utilities';
/**
 * A List of Entities viewed by Admin, EC and MA
 * An admin can delete entity
 */
class Entities extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  fetchData = (state, instance) => {
    this.setState({
      entitiesTableState: state,
      entitiesTableInstance: instance,
    });
    const sorted = state.sorted[0];
    const requestedPage = state.page + 1;
    const sorting = sorted ? (sorted && sorted.desc ? 'desc' : 'asc') : 'desc';
    this.setState({
      entitiesRequestedPage: requestedPage,
      entitiesSorted: sorted,
    });
    const query = {
      paginate: true,
      page: requestedPage,
      per_page: 25,
      sort: sorting,
      sort_by: sorted && sorted.id,
    };
    this.props.getEntities(query).then(res => {
      const roleId = this.props.role_id;
      let entityId;
      if (roleId === ENTITY_COORDINATOR) {
        // Entity Coordinator
        const {
          entities: { data: entitiesList },
        } = res.value.data;
        entityId = entitiesList.length ? entitiesList[0].id : entityId;
        if (entityId && this.props.type === 'entity')
          this.setState({ entityId });
      }
    });
  };

  getTitle = () => {
    const {
      entities: { total },
      language,
      role_id: roleId,
      type,
    } = this.props;

    if (roleId === ENTITY_ADVISOR) {
      if (type === 'entity') {
        return (
          <h1 className="section-title bold">
            {translateString(strings.entity.profile)}
          </h1>
        );
      }
      return (
        <h1 className="section-title bold">
          {translateString(strings.entity.title)}{' '}
          {total && (
            <small>
              ({language === 'ar' ? numbers.convertToArabic(total) : total})
            </small>
          )}
        </h1>
      );
    } else if (roleId === ENTITY_COORDINATOR) {
      return (
        <h1 className="section-title bold">
          {translateString(strings.entity.profile)}
        </h1>
      );
    }
    return (
      <h1 className="section-title bold">
        {translateString(strings.entity.title)}{' '}
        {total && (
          <small>
            ({language === 'ar' ? numbers.convertToArabic(total) : total})
          </small>
        )}
      </h1>
    );
  };

  confirmDelete(id) {
    confirmAlert({
      title: translateString(strings.entity.confirmDeleteTitle),
      message: translateString(strings.entity.confirmDeleteQuestion),
      buttons: [
        {
          label: translateString(strings.confirm.yes),
          onClick: () => {
            this.props
              .deleteEntity(id)
              .then(() => {
                toastr.success(translateString(strings.entity.entityDeleted));
                this.state.entitiesTableInstance.fireFetchData();
              })
              .catch(err => {
                toastr.error(err.response.data.message);
              });
          },
        },
        {
          label: translateString(strings.confirm.no),
        },
      ],
    });
  }

  initializeColumns = () => {
    const columns = [
      {
        Header: translateString(strings.table.header.code),
        accessor: 'code',
        sortable: this.props.role_id !== 5,
        Cell: row => {
          return <span title={row.original.code}>{row.original.code}</span>;
        },
      },
      {
        Header: translateString(strings.table.header.name),
        accessor: 'name',
        sortable: this.props.role_id !== 5,
        Cell: row => {
          const { name } = row.original.translations.find(item => {
            return item.locale === this.props.language;
          });
          return <span title={name}>{name}</span>;
        },
      },
      {
        Header: translateString(strings.table.header.creationDate),
        accessor: 'created_at',
        sortable: this.props.role_id !== 5,
        Cell: row => {
          return moment(row.value).format('DD MMMM YYYY');
        },
      },
      {
        Header: translateString(strings.table.header.onBoardingDate),
        accessor: 'onboarding_date',
        sortable: this.props.role_id !== 5,
        Cell: row => {
          return moment(row.value).format('DD MMMM YYYY');
        },
      },
      {
        Header: translateString(strings.roles.entityCoordinator),
        accessor: 'entity_coordinator',
        sortable: false,
        Cell: row => {
          return row.value
            ? `${row.value.first_name} ${row.value.last_name}`
            : '-';
        },
      },
      {
        Header: translateString(strings.table.header.ecEmail),
        accessor: 'entity_coordinator',
        sortable: false,
        width: 230,
        Cell: row => {
          return row.value ? `${row.value.email}` : '-';
        },
      },
    ];
    if (this.props.role_id !== ENTITY_ADVISOR) {
      columns.push({
        Header: translateString(strings.roles.advisor),
        accessor: 'advisor',
        sortable: false,
        Cell: row => {
          return row.value
            ? `${row.value.first_name} ${row.value.last_name}`
            : '-';
        },
      });
      columns.push({
        Header: translateString(strings.table.header.advisorEmail),
        accessor: 'advisor',
        sortable: false,
        Cell: row => {
          return row.value ? `${row.value.email}` : '-';
        },
      });
    }
    if (this.props.role_id !== 2) {
      // Not a master assessor
      columns.push({
        sortable: false,
        Cell: row => {
          return (
            <div className="table table__actions">
              {this.props.role_id === ENTITY_ADVISOR &&
                this.props.type === 'entities' && (
                  <React.Fragment>
                    <Link
                      className="button button--link"
                      to={`/entities/${row.original.id}/view`}
                    >
                      {translateString(strings.entity.view)}
                    </Link>
                    <span>|</span>
                  </React.Fragment>
                )}
              <Link
                className="button button--link"
                to={`/entities/${row.original.id}/edit`}
              >
                {translateString(strings.entity.edit)}
              </Link>
              {this.props.role_id === 1 && (
                <React.Fragment>
                  <span>|</span>
                  <button
                    className="button button--link"
                    onClick={() => {
                      this.confirmDelete(row.original.id);
                    }}
                  >
                    {translateString(strings.entity.confirmDeleteButton)}
                  </button>
                </React.Fragment>
              )}
            </div>
          );
        },
      });
    }
    return columns;
  };

  render() {
    moment.locale(getLanguage());
    const {
      entities: { data: entitiesList, totalPages: entitiesTotalPages, total },
      isLoading,
      userRole: role,
      type,
      match: {
        params: { id: entityId },
      },
    } = this.props;
    const columns = this.initializeColumns();
    let entityList = [];
    if (role === ENTITY_ADVISOR && type === 'entity') {
      entityList = entitiesList.filter(entity => {
        return entity.id === parseInt(entityId, 10);
      });
    }
    // if (role === 2) {
    //   // Remove the actions column
    //   //  columns.splice(5, 1);
    // }
    return (
      <div>
        <section className="table-wrapper">
          <div className="container">
            <header>
              {this.getTitle(total)}
              {role === 1 && (
                <p className="new-link">
                  <Link
                    to="/entities/new"
                    className="button button--primary add"
                  >
                    {translateString(strings.entity.newEntity)}
                  </Link>
                </p>
              )}
            </header>
            <CustomTable
              columns={columns}
              data={
                role === ENTITY_ADVISOR && type === 'entity'
                  ? entityList
                  : entitiesList
              } // should default to []
              pages={entitiesTotalPages} // should default to -1 (which means we don't know how many pages we have)
              loading={!!isLoading}
              manual // informs React Table that you'll be handling sorting and pagination server-side
              onFetchData={this.fetchData}
              defaultPageSize={25}
            />
          </div>
        </section>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    entities: state.entities,
    language: state.language,
    role_id: state.userData.role_id,
    ...state.flags,
  };
}
const mapDispatchToProps = {
  getEntities,
  deleteEntity,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Entities);

Entities.propTypes = {
  /** List of entities */
  entities: PropTypes.object,
  /** Role of logged in user */
  role_id: PropTypes.number,
  /** Current language of system */
  language: PropTypes.string,
  /** Status of fetching data */
  isLoading: PropTypes.number,
  /** Gets List of entities */
  getEntities: PropTypes.func,
  /** Deletes Entity */
  deleteEntity: PropTypes.func,
  /** @ignore */
  type: PropTypes.string,
  /** @ignore */
  match: PropTypes.object,
  /** @ignore */
  userRole: PropTypes.number,
};
