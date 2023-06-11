import React, { Component, useState } from "react";
import PropTypes from "prop-types";
import moment from "moment";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { toastr } from "react-redux-toastr";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import { CustomTable } from "../../components";
import MySelect from "../../components/Forms/MySelect";
import {
  getUsers,
  forgotPassword,
  deactivateUser,
  activateUser,
  getFilterdUsers
} from "../../actions";
import { strings, numbers, translateString, ADMIN } from "../../utilities";
/**
 * List of users in system. It changes according to role
 * @visiblaName Users List
 */

const Users = props => {
  const [tableState, setTableState] = useState({});
  const [tableInstance, setTableInstance] = useState(null);
  const [filteredData, setFilteredData] = useState({});
  const [isFiltered, setIsFiltered] = useState(false);

  const fetchData = (state, instance) => {
    setTableState(state);
    setTableInstance(instance);
    console.debug("instance", instance);
    const sorted = state.sorted[0];
    const email = state.email;
    const requestedPage = state.page + 1;
    const sorting = sorted ? (sorted && sorted.desc ? "desc" : "asc") : "desc";
    const query = {
      page: requestedPage,
      per_page: 25,
      sort: sorting,
      sort_by: sorted && sorted.id,
      email
    };
    props.getUsers(query);
  };

  const fetchFliterdData = (data = {}) => {
    const first_name = data.first_name;
    const last_name = data.last_name;
    const email = data.email;
    const path = `/users?filters[0][field]=first_name&filters[0][operator]=LIKE&filters[0][value]=${first_name}&filters[1][field]=last_name&filters[1][operator]=LIKE&filters[1][value]=${last_name}&filters[2][field]=email&filters[2][operator]=LIKE&filters[2][value]=${email}`;
    props.getFilterdUsers(path, data).then(res => {
      console.debug("getFilterdUsers", res);
      console.debug("getFilterdUsers data", res.value.data.data.users.data);

      const value = res.value.data.data.users.data || [];
      setFilteredData(value);
      setIsFiltered(true);
    });
  };

  const handleSubmitSearch = event => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    event.preventDefault();
    const values = {};
    for (let [key, value] of formData.entries()) {
      console.log(key, value);
      values[key] = value;
    }
    fetchFliterdData(values);
    console.log(values);
  };

  const confirmReset = (email, name) => {
    confirmAlert({
      title: translateString(strings.reset.confirmTitle),
      message: `${translateString(
        strings.reset.confirmQuestion
      )} ${name} ${translateString(strings.questionMark)}`,
      buttons: [
        {
          label: translateString(strings.confirm.yes),
          onClick: () => {
            props
              .forgotPassword({ email, type: 1 })
              .then(() => {
                toastr.success(
                  `${translateString(
                    strings.reset.resetLinkSentToUser
                  )} ${name}`
                );
              })
              .catch(err => {
                toastr.error(err.response.data.message);
              });
          }
        },
        {
          label: translateString(strings.confirm.no)
        }
      ]
    });
  };

  const deactivateUser = (id, name) => {
    confirmAlert({
      title: translateString(strings.deactivate.confirmTitle),
      message: `${translateString(
        strings.deactivate.confirmQuestion
      )} ${name} ${translateString(strings.questionMark)}`,
      buttons: [
        {
          label: translateString(strings.confirm.yes),
          onClick: () => {
            props
              .deactivateUser(id)
              .then(() => {
                toastr.success(
                  `${translateString(
                    strings.deactivate.deactivateSuccess
                  )} ${name}`
                );
                tableInstance.fireFetchData();
              })
              .catch(err => {
                toastr.error(err.response.data.data);
              });
          }
        },
        {
          label: translateString(strings.confirm.no)
        }
      ]
    });
  };

  const activateUser = (id, name) => {
    confirmAlert({
      title: translateString(strings.activate.confirmTitle),
      message: `${translateString(
        strings.activate.confirmQuestion
      )} ${name} ${translateString(strings.questionMark)}`,
      buttons: [
        {
          label: translateString(strings.confirm.yes),
          onClick: () => {
            props
              .activateUser(id)
              .then(() => {
                toastr.success(
                  `${translateString(strings.activate.activateSuccess)} ${name}`
                );
                tableInstance.fireFetchData();
              })
              .catch(err => {
                toastr.error(err.response.data.data);
              });
          }
        },
        {
          label: translateString(strings.confirm.no)
        }
      ]
    });
  };

  const initializeColumns = role => {
    const columns = [
      {
        Header: () => translateString(strings.table.header.name),
        accessor: "first_name",
        Cell: row => {
          return row.original
            ? `${row.original.first_name} ${row.original.last_name}`
            : "-";
        }
      },
      {
        Header: translateString(strings.table.header.email),
        accessor: "email",
        sortable: false
      },
      {
        Header: translateString(strings.table.header.role),
        accessor: "role",
        width: 120,
        sortable: false,
        Cell: row => {
          if (row.value) {
            const lang = props.language === "ar" ? 0 : 1;
            return row.value.translations[lang].name;
          }
          return "-";
        }
      },
      {
        Header: () => translateString(strings.table.header.joinedDate),
        accessor: "created_at",
        Cell: row => {
          return !row.original.created_at
            ? "-"
            : moment(row.original.created_at).format("DD MMMM YYYY, h:mm a");
        }
      },
      {
        Header: translateString(strings.table.header.lastLoginDate),
        accessor: "last_login",
        sortable: true,
        Cell: row => {
          return !row.original.last_login
            ? "-"
            : moment(row.original.last_login).format("DD MMMM YYYY, h:mm a");
        }
      },
      {
        sortable: false,
        width: 300,
        Cell: row => {
          return (
            <div className="table table__actions">
              <button
                className="button button--link"
                onClick={() => {
                  confirmReset(
                    row.original.email,
                    `${row.original.first_name} ${row.original.last_name}`
                  );
                }}
              >
                {translateString(strings.users.resetPassword)}
              </button>
              {role === ADMIN && (
                <React.Fragment>
                  <span>|</span>
                  <button
                    className="button button--link"
                    onClick={() => {
                      const activated = !row.original.deleted_at;
                      if (activated)
                        deactivateUser(
                          row.original.id,
                          `${row.original.first_name} ${row.original.last_name}`
                        );
                      else
                        activateUser(
                          row.original.id,
                          `${row.original.first_name} ${row.original.last_name}`
                        );
                    }}
                  >
                    {!row.original.deleted_at
                      ? translateString(strings.users.deactivateUser)
                      : translateString(strings.users.activateUser)}
                  </button>
                </React.Fragment>
              )}
            </div>
          );
        }
      }
    ];
    return columns;
  };

  const {
    users: { data: entitiesList = [], totalPages, total },
    isLoading,
    userRole: role,
    language
  } = props;
  const columns = initializeColumns(role);
  if (role === 2 || role === 5) {
    // Remove the role column
    columns.splice(2, 1);
  }
  console.debug("entitiesList", entitiesList);
  return (
    <section className="table-wrapper">
      <div className="container">
        <header className="clearfix">
          <h1 className="section-title bold">
            {role === 1 && translateString(strings.users.title)}
            {role === 2 && translateString(strings.roles.assessors)}
            {role === 5 && translateString(strings.roles.entityUsers)}{" "}
            {total && (
              <small>
                ({language === "ar" ? numbers.convertToArabic(total) : total})
              </small>
            )}
          </h1>
          <div className="new-link">
            <ul className="list-table">
              <li>
                <div>
                  <form onSubmit={handleSubmitSearch}>
                    <input
                      type="search"
                      placeholder={"الاسم الأول"}
                      onChange={() => null}
                      name="first_name"
                    />
                    <input
                      type="search"
                      placeholder={"الاسم الاخير"}
                      onChange={() => null}
                      name={"last_name"}
                    />
                    <input
                      type="search"
                      placeholder={"الايميل"}
                      onChange={() => null}
                      name={"email"}
                    />
                    <button>{"ابحث"}</button>
                  </form>
                </div>
              </li>
              {/* <li>
                <MySelect
                  id="role_id"
                  required
                  className="custom-filter-select"
                  name="role_id"
                  // The label is required to match the key used for the
                  // value to update the field value
                  placeholder={`${translateString(
                    strings.invite.selectFilter
                  )}`}
                  options={props.roles || []}
                  value={0}
                />
              </li> */}
              <li>
                <Link to="/users/new" className="button button--primary add">
                  {role === 1 && translateString(strings.invite.newUser)}
                  {role === 2 && translateString(strings.invite.newAssessor)}
                  {role === 5 && translateString(strings.invite.newEntityUser)}
                </Link>
              </li>
            </ul>
          </div>
        </header>
        <CustomTable
          columns={columns}
          data={isFiltered ? filteredData : entitiesList} // should default to []
          pages={totalPages} // should default to -1 (which means we don't know how many pages we have)
          loading={!!isLoading}
          manual // informs React Table that you'll be handling sorting and pagination server-side
          onFetchData={fetchData}
          filterable={false}
          filtered={false}
          defaultPageSize={25}
        />
      </div>
    </section>
  );
};

function mapStateToProps(state) {
  return {
    users: state.users,
    language: state.language,
    ...state.flags
  };
}
const mapDispatchToProps = {
  getUsers,
  forgotPassword,
  deactivateUser,
  activateUser,
  getFilterdUsers
};

export default connect(mapStateToProps, mapDispatchToProps)(Users);

Users.propTypes = {
  /** Resets password for certain user */
  forgotPassword: PropTypes.func,
  /** Deactivate certain user */
  deactivateUser: PropTypes.func,
  /** Activate certain user */
  activateUser: PropTypes.func,
  /** Role of logged in user */
  userRole: PropTypes.number,
  /** Gets list of users */
  getUsers: PropTypes.func,
  getFilterdUsers: PropTypes.func,
  /** List of users */
  users: PropTypes.object,
  /** Current Language of system */
  language: PropTypes.string,
  /** @ignore */
  isLoading: PropTypes.number
};
