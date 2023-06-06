import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import "core-js/fn/object/keys";
import "core-js/fn/string/ends-with";
import "core-js/es6/array";
import "core-js/es6/number";
import "react-redux-toastr/lib/css/react-redux-toastr.min.css";
import "./styles/main.css";
import { App } from "./components";
import createStoreWithMiddleware from "./store";
// import reducers from './reducers';
// import registerServiceWorker from './registerServiceWorker';
import { unregister } from "./registerServiceWorker";

ReactDOM.render(
  <Provider store={createStoreWithMiddleware}>
    <App />
  </Provider>,
  document.getElementById("root")
);
unregister();
// registerServiceWorker();

export default createStoreWithMiddleware;
