import { OTP_USER } from "../actions";

export default function(
  state = {
    isFetching: false,
    otp_sent: false
  },
  action
) {
  let newState;
  switch (action.type) {
    case OTP_USER:
    case OTP_USER.FULFILLED:
      newState = Object.assign({}, state, {
        otp_sent: action.payload.status === 200,
        ...action.payload.data
      });

      break;
    case OTP_USER.PENDING:
      newState = Object.assign({}, state, {
        otp_sent: false
      });
      break;
    case OTP_USER.REJECTED:
      newState = Object.assign({}, state, {
        otp_sent: false,
        error: action.payload.response.data.message
      });
      break;
    default:
      newState = state;
  }
  return newState;
}
