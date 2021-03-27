import BASE_URL from "../api";
import Axios from "axios";
const singleUser = (userId, token, refreshtoken, dispatch) => {
  Axios.get(`${BASE_URL}/api/user/${userId}/profile`, {
    headers: {
      // Authorization: `Bearer ${token}`,
      "x-token": token,
      "x-refresh-token": refreshtoken,
    },
  })
    .then((res) => {
      const { user } = res.data;
      localStorage.setItem("user", JSON.stringify(user));
      dispatch({ type: "USER_PROFILE", payload: user });
    })
    .catch((err) => console.log(err));
};
const handleLogin = (
  phoneNo,
  password,
  dispatch,
  setPhoneNo,
  setPassword,
  toggleDrawer,
  navigation,
  setSendReq,
  setPhoneError,
  setPassError
) => {
  console.log(phoneNo);
  setSendReq(false);
  Axios.post(`${BASE_URL}/api/user/login`, { phone: phoneNo, password })
    .then((res) => {
      console.log(res.data);
      const { user, token, refreshtoken } = res.data;
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("token", token);
      localStorage.setItem("refresh-token", refreshtoken);
      setPhoneNo("");
      setPassword("");
      setSendReq(true);
      toggleDrawer();
      dispatch({ type: "ADD_USER", payload: user });
      //   navigation.navigate("My Profile");
    })
    .catch((err) => {
      const error = err.response && err.response.data;
      setSendReq(true);
      if (error && error.phone) {
        setPhoneError(error.phone);
        // console.log(error.phone);
      }
      if (error && error.password) {
        setPassError(error.password);
      }
    });
};

const verifyPhone = (
  phoneNo_2,
  setOTPid,
  username,
  password_2,
  confirmPassword,
  setUsernameError,
  setPasswordError,
  setConfirmPassError,
  setPhoneError
) => {
  if (!username) {
    setUsernameError("Username is missing");
  } else if (!password_2) {
    setPasswordError("Password is missing");
  } else if (!confirmPassword) {
    setConfirmPassError("Please re-type password");
  } else if (!phoneNo_2 || phoneNo_2.length !== 10) {
    setPhoneError("Please enter 10 digit phone no.");
  } else {
    Axios.post(`${BASE_URL}/api/user/verifymobile`, { phone: phoneNo_2 })
      .then((res) => {
        const { id } = res.data;
        setOTPid(id);
      })
      .catch((err) => {
        console.log(err);
      });
  }
};
const handleSignup = (
  username,
  phoneNo_2,
  password_2,
  confirmPassword,
  verifycode,
  OTPid,
  setUsername,
  setPassword_2,
  setConfirmPassword,
  setverifycode,
  setPhoneNo_2,
  setOTPid,
  setOTPerror,
  setOpen,
  setSignedIn
) => {
  // console.log(username, phoneNo_2, password_2, confirmPassword, verifycode);
  if (
    username !== "" ||
    phoneNo_2 !== "" ||
    password_2 !== "" ||
    confirmPassword !== "" ||
    verifycode !== "" ||
    OTPid !== null ||
    password_2 === confirmPassword
  ) {
    Axios.post(`${BASE_URL}/api/user/signup`, {
      username,
      password: password_2,
      phone: phoneNo_2,
      OTP_code: verifycode,
      id: OTPid,
    })
      .then((res) => {
        const { user, success } = res;
        console.log(user);
        setSignedIn(success);
        setUsername("");
        setPassword_2("");
        setConfirmPassword("");
        setverifycode("");
        setPhoneNo_2("");
        setOTPid("");
        setOpen(true);
      })
      .catch((err) => {
        const error = err.response && err.response.data.err;
        console.log(error);
      });
  } else {
    setOTPerror("Fill all the fields");
  }
};
export { singleUser, handleLogin, verifyPhone, handleSignup };
