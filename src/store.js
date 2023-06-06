import reduxPromiseMiddleware from "redux-promise-middleware";
import { createStore, applyMiddleware, compose } from "redux";
import reducers from "./reducers";

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const initialState = {
  language: sessionStorage.getItem("language") || "ar",
  isAuthenticated: false,
  otp_sent: false,
  entities: { data: [] },
  selectedCampaignEntitiesList: []
};
const createStoreWithMiddleware = createStore(
  reducers,
  initialState,
  composeEnhancers(applyMiddleware(reduxPromiseMiddleware()))
);
export default createStoreWithMiddleware;
