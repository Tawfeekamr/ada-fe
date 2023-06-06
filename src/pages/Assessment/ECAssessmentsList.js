import React, { Component } from 'react';
import { connect } from 'react-redux';
import AssessmentsList from './AssessmentsList';
import CurrentAssessment from './CurrentAssessment';
/**
 * Show lists of assessments of currently active campaign for EC.
 * In addition to the option to view assessment
 * @visibleName Entity Coordinator Assessments List
 */
class ECAssessmentsList extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div>
        <section className="table-wrapper single-row">
          <CurrentAssessment />
        </section>
        <section className="table-wrapper">
          <AssessmentsList />
        </section>
      </div>
    );
  }
}

function mapStateToProps() {
  return {};
}
const mapDispatchToProps = {};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ECAssessmentsList);
