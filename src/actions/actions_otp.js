import Api from "../utilities/api";

export const OTP_USER = {
  ROOT: "OTP_USER",
  PENDING: "OTP_USER_PENDING",
  REJECTED: "OTP_USER_REJECTED",
  FULFILLED: "OTP_USER_FULFILLED"
};

export function otpUser(data) {
  return { type: OTP_USER.ROOT, payload: Api.otpData(data) };
}

export function setOTPSentFalse() {
  return { type: OTP_USER.PENDING };
}
