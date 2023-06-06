import React, { Component } from 'react';
import { Formik, Form } from 'formik';
import { connect } from 'react-redux';
import { toastr } from 'react-redux-toastr';
import * as Yup from 'yup';
import * as moment from 'moment';
import PropTypes from 'prop-types';
import { strings, translateString, Navigation, ADMIN } from '../../utilities';
import {
  MyInputField,
  MyDatePicker,
  CustomTable,
  Loading,
} from '../../components';
import { viewEntity, editEntity, generateTrainingsReport } from '../../actions';
import Trainings from './Trainings';
/**
 * A user can edit entity details
 * @visibleName Edit Entity
 */

export class EditEntity extends Component {
  constructor() {
    super();
    this.state = {
      trainings: [],
    };
  }
  componentDidMount() {
    const { id } = this.props.match.params;
    this.props.viewEntity(id).then(res => {
      const {
        entity: { trainings },
      } = res.value.data;
      this.setState({ trainings });
    });
  }

  addTraining = training => {
    const trainings = [...this.state.trainings];
    trainings.push(training);
    this.setState({ trainings });
  };

  generateTrainingsReport(entityId) {
    this.props
      .generateTrainingsReport(entityId)
      .then(res => {
        window.open(res.value.data.url);
      })
      .catch(() => {});
  }

  fetchData = () => {};
  initializeColumns = () => {
    const columns = [
      {
        Header: translateString(strings.form.year),
        accessor: 'year',
        sortable: false,
        Cell: row => {
          return <span title={row.value}>{row.value}</span>;
        },
      },
      {
        Header: translateString(strings.form.section),
        accessor: 'section',
        sortable: false,
        Cell: row => {
          return <span title={row.value}>{row.value}</span>;
        },
      },
      {
        Header: translateString(strings.form.type),
        accessor: 'type',
        sortable: false,
        Cell: row => {
          return <span title={row.value}>{row.value}</span>;
        },
      },
      {
        Header: translateString(strings.form.number_of_attendees),
        accessor: 'number_of_attendees',
        sortable: false,
        Cell: row => {
          return <span title={row.value}>{row.value}</span>;
        },
      },
      {
        Header: translateString(strings.form.number_of_hours),
        accessor: 'number_of_hours',
        sortable: false,
        Cell: row => {
          return <span title={row.value}>{row.value}</span>;
        },
      },
      {
        Header: '',
        accessor: '',
        sortable: false,
        Cell: row => {
          return (
            <button
              onClick={() => {
                const trainings = this.state.trainings.filter((item, index) => {
                  return index !== row.index;
                });
                this.setState({ trainings });
              }}
              className="button--link"
            >
              {translateString(strings.delete)}
            </button>
          );
        },
      },
    ];
    return columns;
  };
  render() {
    const { entityDetails } = this.props;
    const { id } = this.props.match.params;
    const columns = this.initializeColumns();
    const { trainings } = this.state;

    if (entityDetails.isFetching) {
      return <Loading />;
    }
    const {
      employees_number: employeesNumber,
      translations,
      onboarding_date: onBoardingDate,
      code,
      isFetching,
      entity_coordinator: entityCoordinator,
      advisor,
    } = entityDetails.data;

    return (
      <div className="form-container entity-form edit-entity">
        <legend className="title form-title">
          {translateString(strings.editEntity.title)}
        </legend>
        <div className="form-wrapper">
          <Formik
            initialValues={{
              'name:en': translations[1].name,
              'name:ar': translations[0].name,
              'address:en': translations[1].address,
              'address:ar': translations[0].address,
              'shortname:en': translations[1].shortname,
              'shortname:ar': translations[0].shortname,
              onboarding_date: onBoardingDate,
              code,
              employees_number: employeesNumber,
              trainings,
              first_name: entityCoordinator ? entityCoordinator.first_name : '',
              last_name: entityCoordinator ? entityCoordinator.last_name : '',
              email: entityCoordinator ? entityCoordinator.email : '',
              advisor: advisor || {
                first_name: '',
                last_name: '',
                email: '',
              },
            }}
            validationSchema={Yup.object().shape({
              'name:en': Yup.string().required(
                translateString(strings.errors.name)
              ),
              'name:ar': Yup.string().required(
                translateString(strings.errors.name)
              ),
              'address:en': Yup.string().required(
                translateString(strings.errors.addressEn)
              ),
              'address:ar': Yup.string().required(
                translateString(strings.errors.addressAr)
              ),
              'shortname:en': Yup.string().required(
                translateString(strings.errors.shortnameEn)
              ),
              'shortname:ar': Yup.string().required(
                translateString(strings.errors.shortnameAr)
              ),
              onboarding_date: Yup.date()
                .typeError(translateString(strings.errors.dateType))
                .required(translateString(strings.errors.date)),
              code: Yup.string().required(translateString(strings.errors.code)),
              employees_number: Yup.number()
                .min(1, translateString(strings.errors.numberInvalid))
                .required(translateString(strings.errors.number)),
              first_name: Yup.string().required(
                translateString(strings.errors.firstName)
              ),
              last_name: Yup.string().required(
                translateString(strings.errors.lastName)
              ),
              email: Yup.string()
                .email(translateString(strings.errors.emailInvalid))
                .required(translateString(strings.login.emailRequired)),
              // advisor: Yup.object().shape({
              //   first_name: Yup.string().required(
              //     translateString(strings.errors.firstName)
              //   ),
              //   last_name: Yup.string().required(
              //     translateString(strings.errors.lastName)
              //   ),
              //   email: Yup.string()
              //     .email(translateString(strings.errors.emailInvalid))
              //     .required(translateString(strings.login.emailRequired)),
              // }),
            })}
            onSubmit={(values, { setSubmitting, setErrors }) => {
              /* eslint no-param-reassign: ["error", { "props": true, "ignorePropertyModificationsFor": ["values"] }] */
              setSubmitting(true);
              values.onboarding_date = moment(values.onboarding_date)
                .locale('en')
                .format('YYYY-MM-DD');
              values.trainings = this.state.trainings;
              // if (values.advisor)
              //   values.advisor = (({ first_name, last_name, email }) => ({
              //     first_name,
              //     last_name,
              //     email,
              //   }))(values.advisor);
              this.props
                .editEntity(id, values)
                .then(() => {
                  setSubmitting(false);
                  toastr.success(translateString(strings.message.entity));
                  this.props.history.push('/entities');
                })
                .catch(() => {
                  const errors = [];
                  setSubmitting(false);
                  if (this.props.editedEntity.errors) {
                    Object.keys(this.props.editedEntity.errors).forEach(key => {
                      // Eslint suggests destructuring in this assignment
                      errors[key] = this.props.editedEntity.errors[key][0]; // eslint-disable-line
                    });
                    setErrors(errors);
                  }
                  toastr.error(this.props.editedEntity.message);
                });
            }}
            render={({
              values,
              touched,
              errors,
              handleChange,
              handleBlur,
              handleSubmit,
              setFieldValue,
              setFieldTouched,
            }) => (
              <Form onSubmit={handleSubmit}>
                <div className="grid-wrapper grid--2 flip-rtl">
                  <div className="form-group">
                    <legend className="form-section-title">
                      {translateString(strings.newAssessment.english)}
                    </legend>
                    {this.props.role === 1 && (
                      <MyInputField
                        label={translateString(strings.form.name)}
                        type="text"
                        name="name:en"
                        id="name:en"
                        labelVisible={true}
                        placeholder={`${translateString(strings.form.name)}*`}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values['name:en']}
                        touched={touched['name:en']}
                        error={errors['name:en']}
                      />
                    )}
                    <MyInputField
                      label={translateString(strings.form.address)}
                      type="text"
                      name="address:en"
                      id="address:en"
                      labelVisible={true}
                      placeholder={`${translateString(strings.form.address)}*`}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values['address:en']}
                      touched={touched['address:en']}
                      error={errors['address:en']}
                    />
                    <MyInputField
                      label={translateString(strings.form.shortname)}
                      type="text"
                      name="shortname:en"
                      id="shortname:en"
                      labelVisible={true}
                      placeholder={`${translateString(
                        strings.form.shortname
                      )}*`}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values['shortname:en']}
                      touched={touched['shortname:en']}
                      error={errors['shortname:en']}
                    />
                  </div>
                  <div className="form-group">
                    <legend className="form-section-title">
                      {translateString(strings.newAssessment.arabic)}
                    </legend>
                    {this.props.role === 1 && (
                      <MyInputField
                        label={translateString(strings.form.name)}
                        type="text"
                        name="name:ar"
                        id="name:ar"
                        labelVisible={true}
                        placeholder={`${translateString(strings.form.name)}*`}
                        className="rtl"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values['name:ar']}
                        touched={touched['name:ar']}
                        error={errors['name:ar']}
                      />
                    )}
                    <MyInputField
                      label={translateString(strings.form.address)}
                      type="text"
                      name="address:ar"
                      id="address:ar"
                      labelVisible={true}
                      placeholder={`${translateString(strings.form.address)}*`}
                      className="rtl"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values['address:ar']}
                      touched={touched['address:ar']}
                      error={errors['address:ar']}
                    />
                    <MyInputField
                      label={translateString(strings.form.shortname)}
                      type="text"
                      name="shortname:ar"
                      id="shortname:ar"
                      labelVisible={true}
                      placeholder={`${translateString(
                        strings.form.shortname
                      )}*`}
                      className="rtl"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values['shortname:ar']}
                      touched={touched['shortname:ar']}
                      error={errors['shortname:ar']}
                    />
                  </div>
                </div>
                {this.props.role === 1 && (
                  <div className="form-group">
                    <div className="grid-wrapper grid--1 one-third">
                      <MyInputField
                        label={translateString(strings.placeholders.code)}
                        labelVisible={true}
                        type="text"
                        name="code"
                        id="code"
                        placeholder={`${translateString(
                          strings.placeholders.code
                        )}*`}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.code}
                        touched={touched.code}
                        error={errors.code}
                      />
                    </div>
                  </div>
                )}

                <div className="form-section">
                  <div className="grid-wrapper two-thirds grid--2">
                    <MyInputField
                      label={translateString(
                        strings.editEntity.employeesNumber
                      )}
                      labelVisible={true}
                      type="number"
                      //  min="1"
                      name="employees_number"
                      id="employees_number"
                      placeholder={`${translateString(
                        strings.placeholders.employeesNumber
                      )}*`}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.employees_number}
                      touched={touched.employees_number}
                      error={errors.employees_number}
                    />

                    <MyDatePicker
                      id="onboarding_date"
                      labelContent={translateString(
                        strings.editEntity.onBoardingDate
                      )}
                      label={'onboarding_date'}
                      value={values.onboarding_date}
                      labelVisible={true}
                      onChange={setFieldValue}
                      onBlur={setFieldTouched}
                      error={errors.onboarding_date}
                      placeholderText={`${translateString(
                        strings.placeholders.dateOfOnboarding
                      )}*`}
                      touched={touched.onboarding_date}
                      maxDate={moment()}
                    />
                  </div>
                </div>
                {this.props.role === ADMIN && (
                  <React.Fragment>
                    <div className="form-section">
                      <legend className="form-section-title">
                        {translateString(strings.roles.entityCoordinator)}
                      </legend>
                      <div className="grid-wrapper grid--3">
                        <MyInputField
                          label="first_name"
                          type="text"
                          name="first_name"
                          id="first_name"
                          placeholder={`${translateString(
                            strings.placeholders.firstName
                          )}*`}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          value={values.first_name}
                          touched={touched.first_name}
                          error={errors.first_name}
                        />

                        <MyInputField
                          label="last_name"
                          type="text"
                          name="last_name"
                          id="last_name"
                          placeholder={`${translateString(
                            strings.placeholders.lastName
                          )}*`}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          value={values.last_name}
                          touched={touched.last_name}
                          error={errors.last_name}
                        />

                        <MyInputField
                          label="email"
                          type="text"
                          name="email"
                          id="email"
                          placeholder={`${translateString(
                            strings.placeholders.email
                          )}*`}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          value={values.email}
                          touched={touched.email}
                          error={errors.email}
                        />
                      </div>
                    </div>
                    <div className="form-section">
                      <legend className="form-section-title">
                        {translateString(strings.roles.advisor)}
                      </legend>
                      <div className="grid-wrapper grid--3">
                        <MyInputField
                          label="advisor.first_name"
                          type="text"
                          name="advisor.first_name"
                          id="advisor.first_name"
                          placeholder={`${translateString(
                            strings.placeholders.firstName
                          )}`}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          touched={touched.first_name}
                          error={errors.first_name}
                        />

                        <MyInputField
                          label="advisor.last_name"
                          type="text"
                          name="advisor.last_name"
                          id="advisor.last_name"
                          placeholder={`${translateString(
                            strings.placeholders.lastName
                          )}`}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          touched={touched.last_name}
                          error={errors.last_name}
                        />

                        <MyInputField
                          label="advisor.email"
                          type="text"
                          name="advisor.email"
                          id="advisor.email"
                          placeholder={`${translateString(
                            strings.placeholders.email
                          )}`}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          touched={touched.email}
                          error={errors.email}
                        />
                      </div>
                    </div>
                  </React.Fragment>
                )}
                <input
                  type="submit"
                  id="submit-form"
                  className="visually-hidden"
                />
              </Form>
            )}
          />
          <section className="table-wrapper">
            {this.props.role === ADMIN && (
              <div className="form-section">
                <div className="form-section-title">
                  <header>
                    <h1 className="section-title bold">
                      {translateString(strings.newAssessment.training)}
                    </h1>
                    <p className="new-link">
                      <button
                        onClick={() =>
                          this.generateTrainingsReport(
                            this.props.match.params.id
                          )
                        }
                        className="button button--primary"
                      >
                        {translateString(strings.newAssessment.exportTrainings)}
                      </button>
                    </p>
                  </header>
                </div>
                <Trainings addTraining={this.addTraining} />
              </div>
            )}
            {this.props.role === ADMIN && this.state.trainings.length > 0 && (
              <CustomTable
                columns={columns}
                data={this.state.trainings}
                loading={!!isFetching}
                manual // informs React Table that you'll be handling sorting and pagination server-side
                onFetchData={this.fetchData}
                filterable={false}
                filtered={false}
                defaultPageSize={25}
              />
            )}
          </section>
          <div className="buttons--wrapper">
            <button
              className="button button--primary"
              onClick={() => {
                Navigation.cancelAndGoBack(this);
              }}
            >
              {translateString(strings.table.cancel)}
            </button>
            <label
              className="button button--secondary"
              htmlFor="submit-form"
              tabIndex="0"
            >
              {translateString(strings.editEntity.save)}
            </label>
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  const {
    editedEntity,
    entityDetails,
    userData: { role_id: role },
  } = state;

  return {
    editedEntity,
    entityDetails,
    role,
  };
}
const mapDispatchToProps = {
  viewEntity,
  editEntity,
  generateTrainingsReport,
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EditEntity);

EditEntity.propTypes = {
  /** @ignore */
  history: PropTypes.object,
  /** Get Entity Data */
  viewEntity: PropTypes.func,
  /** Submit Changed for entity */
  editEntity: PropTypes.func,
  /** @ignore */
  entityCreated: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  /** @ignore */
  editedEntity: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  /** Role of logged user */
  role: PropTypes.number,
  /** @ignore */
  generateTrainingsReport: PropTypes.func,
  /** @ignore */
  match: PropTypes.object,
  /** @ignore */
  entityDetails: PropTypes.object,
};
