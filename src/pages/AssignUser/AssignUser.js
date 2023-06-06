import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Formik, Form } from 'formik';
import { Link } from 'react-router-dom';
import * as Yup from 'yup';
import { confirmAlert } from 'react-confirm-alert';
import { toastr } from 'react-redux-toastr';
import { connect } from 'react-redux';
import { numbers, strings, translateString } from '../../utilities';
import { MySelect, Loading, CustomTable } from '../../components';
import {
  getEntityUsers,
  getAvailablePillars,
  getECAssignedUsers,
  assignUser,
  deassignUser,
  sendReminder,
} from '../../actions';
/** This is for the Entity Coordinator.
 * In order to assign users to pillars to the assessments assigned to him.
 * EC can also send reminders to already assigned users.
 * @visibleName Assign Users to Assessment
 */
class AssignUser extends Component {
  state = {
    assignedUsersList: [],
  };
  componentDidMount() {
    const { id } = this.props.match.params;
    this.props.getEntityUsers();
    this.props.getAvailablePillars(id).then(() => {
      this.setState({ entity: this.props.pillars.entity.translations });
      this.setState({ assessment: this.props.pillars.assessment.translations });
    });
    this.props.getECAssignedUsers(id).then(() => {
      this.setState({ assignedUsersList: this.props.assignedUsers });
    });
  }
  fetchData = (state, instance) => {
    this.setState({ tableState: state, tableInstance: instance });
    // const sorted = state.sorted[0];
    const { id } = this.props.match.params;
    this.props.getECAssignedUsers(id);

    // this.props.getUsers(query);
  };

  confirmReset(userID) {
    confirmAlert({
      title: translateString(strings.assignUser.deleteMessageConfirmation),
      message: `${translateString(strings.assignUser.deleteMessage)}`,
      buttons: [
        {
          label: translateString(strings.confirm.yes),
          onClick: () => {
            const { id } = this.props.match.params;
            this.setState({ currentId: userID });
            this.props
              .deassignUser(id, { entityusers: [userID] })
              .then(() => {
                toastr.success(this.props.deassignedUser.message);
                const assignedEntityUsersTemp = this.state.assignedUsersList.filter(
                  item => item.id !== userID
                );
                this.props.getAvailablePillars(id);
                this.setState({ assignedUsersList: assignedEntityUsersTemp });
              })
              .catch(() => {
                toastr.error(this.props.deassignedUser.message);
              });
          },
        },
        {
          label: translateString(strings.confirm.no),
        },
      ],
    });
  }

  initializeColumns() {
    const columns = [
      {
        Header: () => translateString(strings.table.header.name),
        accessor: 'first_name',
        sortable: false,
        Cell: row => {
          return row.original
            ? `${row.original.first_name} ${row.original.last_name}`
            : '-';
        },
      },
      {
        Header: () => translateString(strings.table.header.pillar),
        accessor: 'pillars',
        sortable: false,
        Cell: row => {
          let pillarNames = '';
          const comma = this.props.language === 'en' ? ',' : '،';
          // const last = this.props.language === 'en' ? 'and' : ' و ';
          row.original.pillars.forEach((item, index) => {
            const isBetween = index > 0 && index < row.original.pillars.length;
            //  const isLast = index === row.original.pillars.length - 1;
            pillarNames = `${pillarNames}${
              // isBetween ? (isLast ? last : comma) : ''
              isBetween ? comma : ''
            } ${
              item.translations.find(translationItem => {
                return translationItem.locale === this.props.language;
              }).name
            }`;
          });
          return pillarNames;
        },
      },
      {
        Header: translateString(strings.table.header.progress),
        accessor: 'progress',
        sortable: false,
        width: 100,
        Cell: row => {
          const progress = Math.floor(row.original.progress);
          return `${
            this.props.language === 'ar'
              ? numbers.convertToArabic(progress)
              : progress
          } %`;
        },
      },
      {
        sortable: false,
        Cell: row => {
          const { id } = row.original;
          return (
            <div className="assign-user assign-user__actions">
              <button
                className="button button--link"
                disabled={
                  this.state.currentId === id &&
                  this.props.deassignedUser.loading
                }
                onClick={() => {
                  this.confirmReset(
                    id,
                    `${row.original.first_name} ${row.original.last_name}`
                  );
                }}
              >
                {translateString(strings.delete)}
              </button>
              <button
                className={`button button--link ${
                  row.original.submitted ? 'dimmed' : ''
                }`}
                disabled={
                  (this.state.currentId === id &&
                    this.props.sentReminder.loading) ||
                  row.original.submitted
                }
                onClick={() => {
                  this.setState({ currentId: id });
                  this.props
                    .sendReminder(id)
                    .then(() => {
                      toastr.success(this.props.sentReminder.message);
                    })
                    .catch(() => {
                      toastr.error(
                        translateString(this.props.sentReminder.message)
                      );
                    });
                }}
              >
                {translateString(strings.assignUser.sendReminder)}
              </button>
            </div>
          );
        },
      },
    ];
    return columns;
  }
  render() {
    const {
      pillars: { data: pillarsArray, isFetching: pillarsLoading },
      language,
      assessors,
    } = this.props;
    if (!this.state.entity || !this.state.assessment || !assessors) {
      return <Loading />;
    }
    if (assessors.length === 0) {
      return (
        <div className="container">
          <p className="no-data-message">
            {translateString(strings.assignUser.message)}{' '}
            <Link to="/users/new">{translateString(strings.here)}.</Link>
          </p>
        </div>
      );
    }
    const columns = this.initializeColumns();

    return (
      <section className="assign-user">
        <div className="container">
          <h1 className="section-title">
            {`${translateString(strings.assignUser.entity)}: ${
              this.state.entity.find(item => {
                return item.locale === language;
              }).name
            }`}
          </h1>
          <Formik
            initialValues={{
              assessorName: '',
              pillars: [],
            }}
            validationSchema={Yup.object().shape({
              assessorName: Yup.number().required(
                translateString(strings.assignUser.errorUser)
              ),
              pillars: Yup.array().required(
                translateString(strings.assignUser.errorPillar)
              ),
            })}
            onSubmit={(values, { setSubmitting, resetForm }) => {
              const pillarsIDs = values.pillars.map((item, index) => {
                return item.value;
              });
              const body = {
                entityusers: {},
              };

              body.entityusers[values.assessorName] = pillarsIDs;

              /* eslint no-param-reassign: ["error", { "props": true, "ignorePropertyModificationsFor": ["values"] }] */

              setSubmitting(true);
              this.setState({ loading: true });
              const { id } = this.props.match.params;

              this.props
                .assignUser(id, body)
                .then(() => {
                  toastr.success(translateString(strings.message.pillar));
                  this.setState({ loading: false });
                  this.setState({
                    assignedUsersList: this.props.recentAssignedUsers,
                  });
                  this.props.getAvailablePillars(id);
                  setSubmitting(false);
                  resetForm();
                })
                .catch(() => {
                  this.setState({ loading: false });
                  setSubmitting(false);
                });
            }}
            render={({
              values,
              touched,
              errors,
              handleSubmit,
              setFieldValue,
              setFieldTouched,
              isSubmitting,
            }) => (
              <Form
                className="assign-user assign-user__form"
                onSubmit={handleSubmit}
              >
                <legend>{`${translateString(strings.assignUser.assign)} ${
                  this.state.assessment.find(item => {
                    return item.locale === language;
                  }).name
                }`}</legend>

                <div className="grid-wrapper grid--3">
                  <MySelect
                    id="assessorName"
                    required
                    className="custom-select"
                    name="assessorName"
                    labelHidden
                    label={translateString(strings.header.users)}
                    placeholder={`${translateString(
                      strings.assignUser.selectUser
                    )}*`}
                    onChange={setFieldValue}
                    onBlur={setFieldTouched}
                    error={errors.assessorName}
                    touched={touched.assessorName}
                    options={assessors}
                    value={values.assessorName}
                  />
                  <MySelect
                    id="pillars"
                    required
                    multi
                    className="custom-select"
                    name="pillars"
                    labelHidden
                    disabled={pillarsLoading || this.state.loading}
                    label={translateString(strings.pillars)}
                    placeholder={`${translateString(
                      strings.assignUser.selectPillar
                    )}*`}
                    onChange={setFieldValue}
                    onBlur={setFieldTouched}
                    error={errors.pillars}
                    touched={touched.pillars}
                    options={pillarsLoading ? [] : pillarsArray[language]}
                    value={values.pillars}
                  />
                  <div className="form-item">
                    <button
                      className="button button--primary add"
                      type="submit"
                      disabled={isSubmitting}
                    >
                      {translateString(strings.assignUser.addUser)}
                    </button>
                  </div>
                </div>
              </Form>
            )}
          />
          {this.state.assignedUsersList.length > 0 && (
            <CustomTable
              columns={columns}
              data={this.state.assignedUsersList} // should default to []
              // pages={-1} // should default to -1 (which means we don't know how many pages we have)
              loading={this.state.loading}
              manual // informs React Table that you'll be handling sorting and pagination server-side
              onFetchData={this.fetchData}
              filterable={false}
              filtered={false}
              defaultPageSize={25}
            />
          )}
        </div>
      </section>
    );
  }
}
function mapStateToProps(state) {
  return {
    assessors: state.assessors.data,
    language: state.language,
    pillars: state.availablePillars,
    assignedUsers: state.assignedEntityUsers,
    deassignedUser: state.deassignedEntityUsers,
    recentAssignedUsers: state.assignUser.entityUsers,
    sentReminder: state.sentReminder,
  };
}
const mapDispatchToProps = {
  getEntityUsers,
  getAvailablePillars,
  getECAssignedUsers,
  assignUser,
  deassignUser,
  sendReminder,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AssignUser);
AssignUser.propTypes = {
  /** @ignore */
  match: PropTypes.object,
  /** Get list of entity users */
  getEntityUsers: PropTypes.func,
  /** Get list of unassigned pillars */
  getAvailablePillars: PropTypes.func,
  /** Get list of assigned users */
  getECAssignedUsers: PropTypes.func,
  /** Get list of all pillars */
  pillars: PropTypes.object,
  /** Get list of all assessors */
  assessors: PropTypes.array,
  /** Get current language of system */
  language: PropTypes.string,
  /** Get list of assigned users */
  assignedUsers: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  /** Get list of not saved assigned users */
  recentAssignedUsers: PropTypes.array,
  /** Get list of not saved unassigned pillars */
  availablePillars: PropTypes.array,
  /** Undo assignment of user */
  deassignUser: PropTypes.func,
  /** Send reminder to user that hasn't answered */
  sendReminder: PropTypes.func,
  /** @ignore */
  deassignedUser: PropTypes.object,
  /** @ignore */
  sentReminder: PropTypes.shape({
    loading: PropTypes.bool,
    message: PropTypes.string,
  }),
};
