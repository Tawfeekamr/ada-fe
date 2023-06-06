import React, { Component } from 'react';
import { Formik, Form, FieldArray } from 'formik';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { toastr } from 'react-redux-toastr';
import * as Yup from 'yup';
import PropTypes from 'prop-types';
import { strings, translateString } from '../../utilities';
import { MySelect, Loading, CustomTable } from '../../components';
import {
  getAssessors,
  submitCampaignAssessors,
  getPillars,
} from '../../actions';
import { DEEP_DIVE, LIGHT_TOUCH } from './AssessmentTypes';

class Assessors extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      assessorsValues: [],
      entitiesDD: [],
      entitiesLT: [],
    };
  }
  componentDidMount() {
    this.props.getAssessors({ paginate: false });
    this.props.getPillars(this.props.assessmentID);
  }
  fetchData = () => {};

  initializeColumns = entities => {
    const columns = [
      {
        Header: translateString(strings.header.entities),
        accessor: 'entity_id',
        sortable: false,
        Cell: row => {
          const val = row.original.entity_id;
          const name = entities.find(el => el.value === val).label;
          return name;
        },
      },
      {
        Header: translateString(strings.campaign.assessors),
        accessor: 'assessor',
        sortable: false,
        Cell: row => {
          if (row.original.assessment_type === DEEP_DIVE) {
            const val = row.original.assessor_id;
            const name = this.props.assessors.data.find(el => el.value === val)
              .label;

            return name;
          }
          return '';
        },
      },
      {
        Header: translateString(strings.pillars),
        accessor: 'pillars',
        sortable: false,
        Cell: row => {
          if (row.original.assessment_type === DEEP_DIVE) {
            const val = row.original.pillars;
            let names = '';
            val.forEach(el => {
              const name = el.label;
              names += `${name}, `;
            });
            return names.slice(0, -2);
          }
          return '';
        },
      },
      {
        Header: translateString(strings.type),
        accessor: 'type',
        sortable: false,
        Cell: row => {
          return row.original.assessment_type === LIGHT_TOUCH
            ? strings.assesmentType.lightTouch[this.props.language]
            : strings.assesmentType.deepDive[this.props.language];
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
                const valuesClone = this.state.assessorsValues.filter(
                  (item, index) => {
                    return index !== row.index;
                  }
                );
                this.setState({ newPillars: this.setNewPillars() });
                this.setState({ assessorsValues: valuesClone });
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
  setNewPillars = () => {
    let chosenPillars = [];
    this.state.assessorsValues.forEach(element => {
      chosenPillars = [...chosenPillars, ...element.pillars];
    });
    const newPillars = [...this.props.pillars.data[this.props.language]];
    chosenPillars.forEach(el => {
      const index = newPillars.indexOf(el);
      newPillars.splice(index, 1);
    });
    return newPillars;
  };
  getPillars = id => {
    const allPillars = [...this.props.pillars.data[this.props.language]];
    if (this.state.assessorsValues.length > 0) {
      this.state.assessorsValues.forEach(item => {
        if (item.entity_id === id) {
          item.pillars.forEach(p => {
            const foundPillar = allPillars.indexOf(p);
            allPillars.splice(foundPillar, 1);
          });
        }
      });
    }
    return allPillars;
  };

  getEntities(assessmentType) {
    const { entitiesList } = this.props;
    const entitiesUsage = {};
    const filteredEntities = [];

    entitiesList[this.props.language].forEach(entity => {
      entitiesUsage[entity.value] = 0;
    });
    this.state.assessorsValues.forEach(item => {
      if (item.assessment_type === LIGHT_TOUCH) {
        entitiesUsage[item.entity_id] = -1; // Is Light touch
      } else {
        entitiesUsage[item.entity_id] += item.pillars.length;
      }
    });
    entitiesList[this.props.language].forEach(entity => {
      if (assessmentType === DEEP_DIVE) {
        if (
          entitiesUsage[entity.value] !== this.props.pillars.data.en.length &&
          entitiesUsage[entity.value] !== -1
        ) {
          // return entities that have unassigned pillars and not assigned to LT
          filteredEntities.push(entity);
        }
      } else if (entitiesUsage[entity.value] === 0) {
        // return entities that have unassigned pillars and not assigned to LT
        filteredEntities.push(entity);
      }
    });
    return filteredEntities;
  }

  submitData() {
    const pillarsLength = this.props.pillars.data.en.length;
    const entitiesLength = this.props.entitiesList.en.length;
    const list = [];
    const selectedEntities = [];
    const deepDiveEntities = [];
    this.state.assessorsValues.forEach(item => {
      if (item.assessment_type === DEEP_DIVE) {
        //  hasDeepDiveAssessmentNumber += 1;
        deepDiveEntities.push(item.entity_id);
      }
      list.push(...item.pillars);
      selectedEntities.push(item.entity_id);
    });
    const uniquesEntityValues = selectedEntities.filter(
      (item, index, self) => self.indexOf(item) === index
    );
    const deepDiveUniqueValues = deepDiveEntities.filter(
      (item, index, self) => self.indexOf(item) === index
    );
    if (this.state.assessorsValues.length === 0) {
      this.setState({
        globalError: translateString(strings.campaign.needAssessors),
      });
    } else if (entitiesLength > uniquesEntityValues.length) {
      // need to assign all entites
      this.setState({
        globalError: translateString(strings.campaign.needEntities),
      });
    } else if (
      deepDiveUniqueValues.length > 0 &&
      list.length < pillarsLength * deepDiveUniqueValues.length
    ) {
      this.setState({
        globalError: translateString(strings.campaign.needAllAssessors),
      });
    } else {
      this.setState({ globalError: '' });
      const newArr = [...this.state.assessorsValues];
      let index = 0;
      newArr.forEach(el => {
        if (el.assessment_type === DEEP_DIVE) {
          const newPillars = el.pillars.map(element => {
            return element.value;
          });
          const newObj = Object.assign({}, el, {
            pillars: newPillars,
          });

          newArr[index] = newObj;
        } else {
          const newObj = Object.assign({}, el, {
            pillars: undefined,
            assessor_id: undefined,
          });
          newArr[index] = newObj;
        }
        index += 1;
      });
      this.props
        .submitCampaignAssessors(this.props.campaignID, {
          assessors: newArr,
        })
        .then(() => {
          toastr.success(translateString(strings.message.campaign));
          this.props.next();
        })
        .catch(err => {
          toastr.error(err.response.data.message);
          // TODO: either reset globalError to allow resubmitting or ..?
        });
    }
  }

  render() {
    const { pillars, assessors, language, entitiesList } = this.props;
    // const DD = 1;
    // const LT = 2;
    const types = {
      en: [
        {
          label: strings.assesmentType.deepDive.en,
          value: DEEP_DIVE,
        },
        {
          label: strings.assesmentType.lightTouch.en,
          value: LIGHT_TOUCH,
        },
      ],
      ar: [
        {
          label: strings.assesmentType.deepDive.ar,
          value: DEEP_DIVE,
        },
        {
          label: strings.assesmentType.lightTouch.ar,
          value: LIGHT_TOUCH,
        },
      ],
    };
    if (!pillars.data || !assessors.data) {
      return <Loading />;
    }
    const columns = this.initializeColumns(entitiesList[language]);

    return (
      <div className="campaign-form container">
        <Formik
          initialValues={{
            assessor_id: '',
            entity_id: '',
            pillars: [],
            assessment_type: '',
          }}
          onSubmit={(values, { resetForm }) => {
            // Should check assessor values
            const assessorsValuesClone = [...this.state.assessorsValues];
            let existingElement = false;
            assessorsValuesClone.forEach(item => {
              if (
                item.assessor_id === values.assessor_id &&
                item.entity_id === values.entity_id &&
                item.assessment_type === values.assessment_type
              ) {
                // check if only pillars are changed
                item.pillars = [...item.pillars, ...values.pillars]; // eslint-disable-line
                existingElement = true;
              }
            });
            if (existingElement) {
              this.setState({ assessorsValues: assessorsValuesClone });
            } else {
              this.setState({
                assessorsValues: [...this.state.assessorsValues, ...[values]],
              });
            }
            resetForm({
              assessor_id: '',
              entity_id: '',
              pillars: [],
              assessment_type: values.assessment_type,
            });
          }}
          validationSchema={() => {
            return Yup.object().shape({
              assessment_type: Yup.number().required(
                translateString(strings.errors.type)
              ),
              entity_id: Yup.number().required(
                translateString(strings.errors.entities)
              ),
              assessor_id: Yup.number().when(
                'assessment_type',
                (assessment_type, schema) => {  // eslint-disable-line
                  if (assessment_type === DEEP_DIVE) {  // eslint-disable-line
                    return schema.required(
                      translateString(strings.errors.assessors)
                    );
                  }
                  return schema;
                }
              ),
              pillars: Yup.array().when(
                'assessment_type',
                (assessment_type, schema) => {  // eslint-disable-line
                  if (assessment_type === DEEP_DIVE) {  // eslint-disable-line
                    return schema.required(
                      translateString(strings.errors.pillars)
                    );
                  }
                  return schema;
                }
              ),
            });
          }}
          render={({
            values,
            setFieldValue,
            isSubmitting,
            setFieldTouched,
            errors,
            touched,
          }) => {
            return (
              <Form>
                <div className="form-wrapper">
                  <FieldArray
                    name="assessors"
                    render={() => (
                      <div>
                        <fieldset
                          disabled={
                            this.getEntities(values.assessment_type).length ===
                            0
                          }
                        >
                          <div className="grid-wrapper grid--2">
                            <div className="form-group">
                              <MySelect
                                required
                                label={translateString(strings.header.entities)}
                                placeholder={translateString(
                                  strings.header.entities
                                )}
                                options={this.getEntities(
                                  values.assessment_type
                                )}
                                onChange={setFieldValue}
                                onBlur={setFieldTouched}
                                error={errors.entity_id}
                                value={values.entity_id}
                                name="entity_id"
                                id="entity_id"
                                touched={touched.entity_id}
                              />
                            </div>
                            <div className="form-group">
                              <MySelect
                                required
                                id="assessment_type"
                                name="assessment_type"
                                options={types[this.props.language]}
                                label={translateString(strings.type)}
                                placeholder={translateString(strings.type)}
                                onChange={(name, val) => {
                                  setFieldValue(name, val);
                                  if (val === LIGHT_TOUCH) {
                                    // Just to reset values when switching to Light touch
                                    setFieldValue('assessor_id', '');
                                    setFieldTouched('assessor_id', false);
                                    setFieldValue('pillars', []);
                                    setFieldTouched('pillars', false);
                                  }
                                }}
                                onBlur={setFieldTouched}
                                value={values.assessment_type}
                                error={errors.assessment_type}
                                touched={touched.assessment_type}
                              />
                            </div>
                          </div>
                          {values.assessment_type === DEEP_DIVE && (
                            <div className="grid-wrapper grid--2">
                              <div className="form-group">
                                <MySelect
                                  required
                                  label={translateString(
                                    strings.campaign.assessorsName
                                  )}
                                  placeholder={translateString(
                                    strings.campaign.assessorsName
                                  )}
                                  options={assessors.data}
                                  onChange={setFieldValue}
                                  onBlur={setFieldTouched}
                                  value={values.assessor_id}
                                  name="assessor_id"
                                  id="assessor_id"
                                  error={errors.assessor_id}
                                  touched={touched.assessor_id}
                                />
                              </div>
                              <div className="form-group">
                                <MySelect
                                  required
                                  multi={true}
                                  options={this.getPillars(values.entity_id)}
                                  label={translateString(strings.pillars)}
                                  placeholder={translateString(strings.pillars)}
                                  onChange={setFieldValue}
                                  onBlur={setFieldTouched}
                                  disabled={values.entity_id === ''}
                                  name="pillars"
                                  value={values.pillars}
                                  id="pillars"
                                  error={errors.pillars}
                                  touched={touched.pillars}
                                />
                              </div>
                            </div>
                          )}
                        </fieldset>
                        <button
                          type="submit"
                          className="button button--primary add"
                          disabled={
                            isSubmitting ||
                            this.getEntities(values.assessment_type).length ===
                              0
                          }
                        >
                          {translateString(strings.addAssessor)}
                        </button>
                      </div>
                    )}
                  />
                  {this.state.assessorsValues.length > 0 && (
                    <CustomTable
                      columns={columns}
                      data={this.state.assessorsValues}
                      manual
                      onFetchData={this.fetchData}
                      defaultPageSize={25}
                    />
                  )}
                </div>

                <div className="buttons--wrapper">
                  <Link to="/campaigns" className="button button--primary">
                    {translateString(strings.table.cancel)}
                  </Link>
                  <button
                    type="button"
                    className="button button--secondary"
                    disabled={this.state.globalError === ''}
                    onClick={() => {
                      this.submitData();
                    }}
                  >
                    {translateString(strings.campaign.save)}
                  </button>
                  <p className="global-error">{this.state.globalError}</p>
                </div>
              </Form>
            );
          }}
        />
      </div>
    );
  }
}

function mapStateToProps(state) {
  const { language, assessors, pillars } = state;
  return {
    language,
    assessors,
    pillars,
  };
}
const mapDispatchToProps = {
  getAssessors,
  getPillars,
  submitCampaignAssessors,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Assessors);

Assessors.propTypes = {
  entitiesList: PropTypes.object,
  next: PropTypes.func,
  getAssessors: PropTypes.func,
  getEntitiesNoPagination: PropTypes.func,
  language: PropTypes.string,
  assessments: PropTypes.array,
  getPillars: PropTypes.func,
  history: PropTypes.object,
  submitCampaignAssessors: PropTypes.func,
  campaignID: PropTypes.number,
  pillars: PropTypes.object,
  assessmentID: PropTypes.number,
  assessors: PropTypes.object,
  entities: PropTypes.object,
};
