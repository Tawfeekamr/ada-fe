import React from "react";
import { connect } from "react-redux";
import { Formik, Field, Form } from "formik";
import PropTypes from "prop-types";
import * as Yup from "yup";
import { toastr } from "react-redux-toastr";
import { MySelect, MyInputField, MyTextarea } from "../../components";
import { strings, translateString, Navigation } from "../../utilities";
import { inviteUser, getEntitiesNoAdvisor, getRoles } from "../../actions";
import {
  ADMIN,
  MASTER_ASSESSOR,
  ENTITY_COORDINATOR,
  ASSESSOR,
  ENTITY_ADVISOR,
  ENTITY_USER
} from "../../utilities/roles";

/**
 * Invite new users to system, viewed by Admin, EC and MA
 * @visibleName Invite Users
 */

class Invite extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    const { roles } = this.props;
    this.props.getEntitiesNoAdvisor();
    if (!(roles && roles.length)) {
      this.props.getRoles();
    }
  }
  getInitialRoleValue = role => {
    switch (role) {
      case MASTER_ASSESSOR:
        return ASSESSOR;
      case ENTITY_COORDINATOR:
        return ENTITY_USER;
      default:
        return "";
    }
  };

  render() {
    const { userRole: role, isLoading } = this.props;
    return (
      <div>
        <div className="form-container">
          <legend className="form-title">
            {role === ADMIN && translateString(strings.invite.newUser)}
            {role === MASTER_ASSESSOR &&
              translateString(strings.invite.newAssessor)}
            {role === ENTITY_COORDINATOR &&
              translateString(strings.invite.newEntityUser)}
          </legend>
          <Formik
            initialValues={{
              first_name: "",
              last_name: "",
              email: "",
              entities: [],
              role_id: this.getInitialRoleValue(role),
              notes: "",
              expertise_segment: ""
            }}
            validationSchema={Yup.lazy(values => {
              return Yup.object().shape({
                first_name: Yup.string().required(
                  translateString(strings.invite.errors.firstName)
                ),
                last_name: Yup.string().required(
                  translateString(strings.invite.errors.lastName)
                ),
                email: Yup.string()
                  .email(translateString(strings.invite.errors.emailInvalid))
                  .required(translateString(strings.invite.errors.email)),
                role_id:
                  role === MASTER_ASSESSOR || role === ENTITY_COORDINATOR
                    ? Yup.string()
                    : Yup.string().required(
                        translateString(strings.invite.errors.role)
                      ),
                entities:
                  values.role_id === ENTITY_ADVISOR
                    ? Yup.array().required(
                        translateString(strings.invite.errors.entities)
                      )
                    : Yup.array().notRequired(),
                expertise_segment:
                  values.role_id === ASSESSOR || role === MASTER_ASSESSOR
                    ? Yup.string().required(
                        translateString(strings.invite.errors.expertiseSegment)
                      )
                    : Yup.string().notRequired()
              });
            })}
            onSubmit={(values, { setSubmitting, setErrors }) => {
              /* eslint no-param-reassign: ["error", { "props": true, "ignorePropertyModificationsFor": ["values"] }] */
              setSubmitting(true);
              const body = { ...values };
              /*
                If the inviting user is a master assessor or an entity
                coordinator, both have only one type of users to invite.
                This is why we set the value of the invited user type to either
                the value passed from the API or a safe perdefined number
              */

              if (values.role_id === ENTITY_ADVISOR) {
                body.entities = values.entities.map(item => {
                  return item.value;
                });
              }
              this.props
                .inviteUser(body)
                .then(() => {
                  setSubmitting(false);
                  toastr.success(translateString(strings.message.user));
                  this.props.history.push("/users");
                })
                .catch(() => {
                  setSubmitting(false);
                  const errors = [];
                  Object.keys(this.props.userCreated.errors).forEach(key => {
                    // Eslint suggests destructuring in this assignment
                    errors[key] = this.props.userCreated.errors[key][0]; // eslint-disable-line
                  });
                  setErrors(errors);
                });
            }}
            render={({
              values,
              errors,
              touched,
              handleChange,
              handleBlur,
              setFieldValue,
              setFieldTouched,
              handleSubmit,
              isSubmitting
            }) => (
              <Form
                className="form-wrapper invite-form"
                onSubmit={handleSubmit}
              >
                <MyInputField
                  label={translateString(strings.invite.first_name)}
                  type="text"
                  name="first_name"
                  id="first_name"
                  placeholder={`${translateString(strings.invite.first_name)}*`}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.first_name}
                  touched={touched.first_name}
                  error={errors.first_name}
                />
                <MyInputField
                  label={translateString(strings.invite.last_name)}
                  type="text"
                  name="last_name"
                  id="last_name"
                  placeholder={`${translateString(strings.invite.last_name)}*`}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.last_name}
                  touched={touched.last_name}
                  error={errors.last_name}
                />
                <MyInputField
                  label={translateString(strings.invite.email)}
                  type="email"
                  name="email"
                  id="email"
                  placeholder={`${translateString(strings.invite.email)}*`}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.email}
                  touched={touched.email}
                  error={errors.email}
                />
                <div className="invite-extras">
                  <div>
                    <div hidden={role === 2 || role === 5}>
                      <MySelect
                        id="role_id"
                        required
                        className="custom-select"
                        name="role_id"
                        // The label is required to match the key used for the
                        // value to update the field value
                        label={translateString(strings.invite.roles)}
                        placeholder={`${translateString(
                          strings.invite.select
                        )}*`}
                        onChange={setFieldValue}
                        onBlur={setFieldTouched}
                        error={errors.role_id}
                        touched={touched.role_id}
                        options={this.props.roles || []}
                        value={values.role_id}
                      />
                    </div>
                    {values.role_id === 4 && (
                      <MySelect
                        id="entities"
                        multi={true}
                        required
                        // The label is required to match the key used for the
                        // value to update the field value
                        label={translateString(strings.invite.entities)}
                        onChange={setFieldValue}
                        placeholder={`${translateString(
                          strings.invite.select
                        )}*`}
                        onBlur={setFieldTouched}
                        error={errors.entities}
                        touched={touched.entities}
                        options={this.props.entitiesNoAdvisorList}
                        values={values.entities}
                      />
                    )}
                    {(values.role_id === 3 || role === 2) && (
                      <div className="form-item">
                        <MyTextarea
                          className="english"
                          label={translateString(
                            strings.invite.expertise_segment
                          )}
                          name="expertise_segment"
                          id="expertise_segment"
                          placeholder={translateString(
                            strings.invite.expertise_segment
                          )}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          value={values.expertise_segment}
                        />
                      </div>
                    )}
                    <div className="form-item">
                      <Field
                        component="textarea"
                        name="notes"
                        id="notes"
                        label={translateString(strings.invite.notes)}
                        placeholder={translateString(strings.invite.notes)}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.notes}
                      />
                    </div>
                  </div>
                </div>
                <div className="buttons--wrapper">
                  <button
                    onClick={() => {
                      Navigation.cancelAndGoBack(this);
                    }}
                    disabled={isSubmitting || isLoading}
                    type="button"
                    className="button button--primary not-submitting"
                  >
                    {translateString(strings.invite.cancel)}
                  </button>
                  <button
                    className="button button--secondary"
                    type="submit"
                    disabled={isSubmitting}
                  >
                    {translateString(strings.invite.invite)}
                  </button>
                </div>
              </Form>
            )}
          />
        </div>
      </div>
    );
  }
}
function mapStateToProps(state) {
  const { userCreated, isLoading } = state;
  const entitiesNoAdvisorList = state.entitiesNoAdvisor.list[state.language];
  const roles = state.roles.list[state.language];

  return {
    userCreated,
    entitiesNoAdvisorList,
    roles,
    isLoading
  };
}
const mapDispatchToProps = {
  inviteUser,
  getEntitiesNoAdvisor,
  getRoles
};
export default connect(mapStateToProps, mapDispatchToProps)(Invite);

Invite.propTypes = {
  /** @ignore */
  history: PropTypes.object,
  /** Invited Users */
  inviteUser: PropTypes.func,
  /** Get all roles in system */
  getRoles: PropTypes.func,
  /** Get entitied that have no Advisor */
  getEntitiesNoAdvisor: PropTypes.func,
  /** List of entities without EA */
  entitiesNoAdvisorList: PropTypes.array,
  /** List of roles */
  roles: PropTypes.array,
  /** @ignore */
  userCreated: PropTypes.object,
  /** Current role of logged in user */
  userRole: PropTypes.number.isRequired
};
