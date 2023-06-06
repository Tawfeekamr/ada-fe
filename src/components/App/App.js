import React from "react";
import jwtDecode from "jwt-decode";
import { BrowserRouter as Router } from "react-router-dom";
import { Helmet } from "react-helmet";
import PropTypes from "prop-types";
import ReduxToastr from "react-redux-toastr";
import { connect } from "react-redux";
import * as moment from "moment";
import "moment/locale/ar";
import { Header } from "../index";
import { getUserData, setAuthenticated, toggleLanguage } from "../../actions";
import {
  strings,
  translateString,
  getLanguage,
  ADMIN,
  MASTER_ASSESSOR,
  ENTITY_ADVISOR,
  ENTITY_COORDINATOR,
  ENTITY_USER,
  ASSESSOR
} from "../../utilities";
import {
  AdminRoutes,
  MasterAssessorRoutes,
  EntityCoordinatorRoutes,
  EntityUserRoutes,
  GuestRoutes,
  AssessorRoutes
} from "../Routes/index";
import EntityAdvisorRoutes from "../Routes/EntityAdvisorRoutes";

/**
 * The entry point component to the system that detects the role and initiates the routes.
 */
class App extends React.PureComponent {
  constructor(props) {
    super(props);
    this.isAuthenticated = this.isAuthenticated.bind(this);
  }

  componentDidMount() {
    const token = sessionStorage.getItem("token");
    const { userData } = this.props;
    if (token !== null && !userData.id) {
      this.props.getUserData();
    }
  }

  isAuthenticated() {
    return this.props.isAuthenticated;
  }

  static getRole() {
    const token = sessionStorage.getItem("token");
    let role;
    if (token !== null) {
      role = jwtDecode(token).role_id;
    }
    /*
      Roles
        1.
          Title: Admin.
          Menu:
            1. List Entities
            2. List Users
          Can:
            1. View list / create users
            2. View list / create / delete entities.
          Defult page: Users list
        2.
          Title: Master Assessor.
          Menu:
            1. List Entities
            2. List Users, add Entity Coordinator
            3. List Assessments
            4. List Campaigns
          Can:
            1. View list / create users of type assessor
            2. View list of entities.
            3. View list / create assessment.
            4. View list / create campaign.
          Defult page: Assessments list
        3.
          Title: Assessor
        4.
          Title: Advisor
        5.
          Title: Entity Coordinator
          Menu:
            1. View Assessment
            2. List Users
          Can:
            1. Answer assessment
        6.
          Title: Entity User
          Can:
            1. Answer assessment pillar

    */
    return role;
  }

  initializeRoutes = () => {
    const role = App.getRole();
    switch (role) {
      case ADMIN:
        return <AdminRoutes isAuthenticated={this.isAuthenticated} />;
      case MASTER_ASSESSOR:
        return <MasterAssessorRoutes isAuthenticated={this.isAuthenticated} />;
      case ASSESSOR:
        return <AssessorRoutes isAuthenticated={this.isAuthenticated} />;
      case ENTITY_ADVISOR:
        return <EntityAdvisorRoutes isAuthenticated={this.isAuthenticated} />;
      case ENTITY_COORDINATOR:
        return (
          <EntityCoordinatorRoutes isAuthenticated={this.isAuthenticated} />
        );
      case ENTITY_USER:
        return <EntityUserRoutes isAuthenticated={this.isAuthenticated} />;
      default:
        return <GuestRoutes />;
    }
  };
  render() {
    const role = App.getRole();
    moment.locale(getLanguage());
    const {
      language,
      isAuthenticated,
      loggedIn,
      userData,
      toggleLanguage: _toggleLanguage
    } = this.props;
    return (
      <div>
        <ReduxToastr
          timeOut={7000}
          newestOnTop={false}
          preventDuplicates
          position="top-center"
          options={{
            showCloseButton: false
          }}
          transitionIn="fadeIn"
          transitionOut="fadeOut"
        />
        <Helmet>
          <html lang={language} dir={language === "ar" ? "rtl" : "ltr"} />
          <title>{translateString(strings.title)}</title>
        </Helmet>
        <Router>
          <div className="App">
            {isAuthenticated && (
              <Header
                userRole={role}
                loggedIn={loggedIn}
                language={language}
                userData={userData}
                toggleLanguage={_toggleLanguage}
              />
            )}
            {this.initializeRoutes()}
          </div>
        </Router>
      </div>
    );
  }
}
function mapStateToProps(state) {
  return {
    loggedIn: state.loggedIn,
    userData: state.userData,
    language: state.language,
    isAuthenticated: state.isAuthenticated
  };
}
const mapDispatchToProps = {
  getUserData,
  setAuthenticated,
  toggleLanguage
};

export default connect(mapStateToProps, mapDispatchToProps)(App);

App.propTypes = {
  initialRoutes: PropTypes.array,
  loggedIn: PropTypes.object,
  setAuthenticated: PropTypes.func,
  isAuthenticated: PropTypes.bool,
  userData: PropTypes.object,
  getUserData: PropTypes.func,
  language: PropTypes.string,
  toggleLanguage: PropTypes.func
};
