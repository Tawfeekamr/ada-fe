import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { getAssessments, getEcAssessments } from "../../actions";
import { strings, translateString } from "../../utilities";
import ActiveAssessmentsFilter from "./ActiveAssessmentsFilter";
import PreviousAssessmentsTable from "./PreviousAssessmentsTable";
/**
 * Shows List of Assessments, where user view assessment for his assigned active campaign.
 * This view is the entry point for Assessor and Entity Advisor.
 * User can view the assessments of inactive campaigns
 * @visibleName Active Assessments List
 */
class ActiveAssessments extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  goToPage = path => {
    this.props.history.push(path);
  };
  render() {
    return (
      <section>
        <div className="container">
          <h1 className="visually-hidden">
            {translateString(strings.assessments)}
          </h1>
          <ActiveAssessmentsFilter goToPage={this.goToPage} />
          <PreviousAssessmentsTable />
        </div>
      </section>
    );
  }
}
function mapStateToProps(state) {
  return {
    assessments: state.assessmentsPaginated,
    inActiveCampaignAssessments: state.inactiveAssessments,
    language: state.language,
    role: state.userData.role_id,
    ...state.flags
  };
}
const mapDispatchToProps = {
  getAssessments,
  getEcAssessments
};

export default connect(mapStateToProps, mapDispatchToProps)(ActiveAssessments);

ActiveAssessments.propTypes = {
  /** @ignore */
  history: PropTypes.object
};
