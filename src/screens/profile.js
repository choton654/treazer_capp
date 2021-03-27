import React, { useState, useContext } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { Icon, Input, Button, Image } from "react-native-elements";
import SwipeableDrawer from "@material-ui/core/SwipeableDrawer";
import { useNavigation } from "@react-navigation/native";
import { AuthContext } from "../context/userContext";
import {
  handleLogin,
  verifyPhone,
  handleSignup,
} from "../functions/userfunction";
import MuiAlert from "@material-ui/lab/Alert";
import Snackbar from "@material-ui/core/Snackbar";
function Alert(props) {
  return <MuiAlert elevation={6} variant='filled' {...props} />;
}
const Profile = () => {
  const navigation = useNavigation();
  const [sendReq, setSendReq] = useState(true);
  //GLOBAL STATE SETUP
  const { dispatch } = useContext(AuthContext);

  //LOCAL STATE SETUP
  const [drawer, setDrawer] = useState(false);
  const [drawer_2, setDrawer_2] = useState(false);

  // LOGIN STATE SETUP
  const [phoneNo, setPhoneNo] = useState("");
  const [password, setPassword] = useState("");
  const [phoneerror, setPhoneError] = useState("");
  const [passerror, setPassError] = useState("");

  // SIGNUP STATE SETUP
  const [username, setUsername] = useState("");
  const [phoneNo_2, setPhoneNo_2] = useState("");
  const [password_2, setPassword_2] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [verifycode, setverifycode] = useState("");
  const [OTPid, setOTPid] = useState(null);
  const [signedIn, setSignedIn] = useState("");
  //SIGNUP ERROR STATE
  const [usernameError, setUsernameError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPassError, setConfirmPassError] = useState("");
  const [phoneError, setPhoneError2] = useState("");
  const [OTPerror, setOTPerror] = useState("");

  // EVENTS
  const toggleDrawer = () => {
    setDrawer(!drawer);
  };
  const toggleDrawer_2 = () => {
    setDrawer_2(!drawer_2);
  };
  const [open, setOpen] = useState(false);
  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  // LOGIN
  const login = () => {
    handleLogin(
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
    );
  };

  // VERIFY PHONE NUMBER
  const phoneCheck = () => {
    verifyPhone(
      phoneNo_2,
      setOTPid,
      username,
      password_2,
      confirmPassword,
      setUsernameError,
      setPasswordError,
      setConfirmPassError,
      setPhoneError2
    );
  };

  // SIGNUP
  const signup = () => {
    handleSignup(
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
      setUsernameError,
      setPasswordError,
      setConfirmPassError,
      setPhoneError,
      setOTPerror,
      setOpen,
      setSignedIn
    );
  };

  return (
    <View style={{ flex: 1 }}>
      <View style={{ flex: 1, flexDirection: "column" }}>
        <View
          style={{
            flex: 1,
            flexDirection: "column",
            height: "100%",
            maxHeight: "100%",
            width: "100%",
            margin: "auto",
          }}>
          <View style={styles.container}>
            <Text
              style={{
                marginLeft: 10,
                color: "#cfd8dc",
                textShadow: "2px 0 #cfd8dc",
                letterSpacing: "2px",
                fontWeight: "bold",
                fontSize: 50,
                fontFamily: "Chango",
              }}>
              FOOD
            </Text>
            <View style={{ flexDirection: "row" }}>
              <Text
                style={{
                  marginLeft: 10,
                  color: "#cfd8dc",
                  textShadow: "2px 0 #cfd8dc",
                  letterSpacing: "2px",
                  fontWeight: "bold",
                  fontSize: 50,
                  fontFamily: "Chango",
                }}>
                FOR
              </Text>
              <View
                style={{
                  width: 100,
                  height: 100,
                  backgroundColor: "#ffffff",
                  borderRadius: 50,
                  marginLeft: 20,
                  alignItems: "center",
                  boxShadow: "3px 4px 6px #C9CCD1",
                }}>
                <Image
                  source={{
                    uri:
                      "https://st4.depositphotos.com/18657574/21328/v/600/depositphotos_213280278-stock-illustration-fast-food-icon-vector-isolated.jpg",
                  }}
                  style={{
                    width: 80,
                    height: 80,
                    marginTop: 10,
                    marginLeft: 5,
                    borderRadius: 25,
                  }}
                />
              </View>
            </View>

            <Text
              style={{
                marginLeft: 10,
                color: "#cfd8dc",
                textShadow: "2px 0 #cfd8dc",
                letterSpacing: "2px",
                fontWeight: "bold",
                fontSize: 50,
                fontFamily: "Chango",
              }}>
              LIVE
            </Text>
          </View>
          <View style={styles.profile}>
            <View
              style={{
                width: "80%",
                marginHorizontal: "auto",
                textAlign: "center",
              }}>
              <Text style={styles.text}>ACCOUNT</Text>
              <Text
                style={{
                  fontSize: "12px",
                  letterSpacing: 1,
                  fontWeight: "400",
                  fontFamily: "Open Sans",
                  marginBottom: 10,
                }}>
                Login/Create Account quickly to manage orders{" "}
              </Text>
            </View>
            <TouchableOpacity style={styles.button} onPress={toggleDrawer}>
              <Text
                style={{
                  color: "#ffffff",
                  fontWeight: "600",
                  fontFamily: "Open Sans",
                  letterSpacing: 4,
                  marginVertical: "auto",
                  fontSize: 17,
                }}>
                Login
              </Text>
            </TouchableOpacity>
            <Text
              style={{
                marginVertical: "20px",
                fontFamily: "Open Sans",
                fontSize: "15px",
                fontWeight: "600",
              }}>
              Don't have an account?{" "}
              <TouchableOpacity onPress={toggleDrawer_2}>
                <Text
                  style={{
                    color: "#00e676",
                    fontWeight: "700",
                    fontFamily: "Open Sans",
                  }}>
                  Signup Here
                </Text>
              </TouchableOpacity>
            </Text>
          </View>
        </View>
        <View>
          <SwipeableDrawer
            anchor='bottom'
            open={drawer}
            onClose={toggleDrawer}
            onOpen={toggleDrawer}>
            <View style={styles.drawer}>
              <View
                style={{
                  marginVertical: 10,
                  marginLeft: 20,
                }}>
                <Text
                  style={{
                    fontSize: 15,
                    fontWeight: "700",
                    letterSpacing: 2,
                    fontFamily: "Roboto Slab",
                  }}>
                  LOGIN
                </Text>
                <Text
                  style={{
                    fontSize: 12,
                    fontWeight: "400",
                    letterSpacing: 2,
                    fontFamily: "Open Sans",
                  }}>
                  Enter your phone number to proceed
                </Text>
              </View>

              <Input
                type='tel'
                value={phoneNo}
                onChangeText={(text) => {
                  setPhoneNo(text);
                  setPhoneError("");
                  setPassError("");
                }}
                placeholder='+91'
                label='10 digit mobile number'
                errorMessage={phoneerror}
                labelStyle={{
                  marginLeft: 15,
                  fontSize: 12,
                  fontWeight: "400",
                  letterSpacing: 1,
                  fontFamily: "Open Sans",
                }}
                containerStyle={{
                  marginTop: 15,
                  width: "100%",
                  marginHorizontal: "auto",
                }}
                inputContainerStyle={{
                  marginTop: 5,
                }}
                inputContainerStyle={{
                  width: "95%",
                  marginHorizontal: "auto",
                }}
              />
              <Input
                secureTextEntry={true}
                value={password}
                onChangeText={(text) => {
                  setPassword(text);
                  setPhoneError("");
                  setPassError("");
                }}
                placeholder='password'
                label='Enter your password'
                errorMessage={passerror}
                labelStyle={{
                  marginLeft: 15,
                  fontSize: 12,
                  fontWeight: "400",
                  letterSpacing: 1,
                  fontFamily: "Open Sans",
                }}
                containerStyle={{
                  marginTop: 10,
                  width: "100%",
                  marginHorizontal: "auto",
                }}
                inputContainerStyle={{
                  marginTop: 5,
                }}
                inputContainerStyle={{
                  width: "95%",
                  marginHorizontal: "auto",
                }}
              />
              {sendReq ? (
                <Button
                  onPress={login}
                  title='LOG IN'
                  raised
                  buttonStyle={{
                    backgroundColor: "#4fc3f7",
                    borderRadius: 10,
                  }}
                  containerStyle={{
                    marginVertical: 10,
                    width: "90%",
                    marginHorizontal: "auto",
                    borderRadius: 10,
                    border: "none",
                    boxShadow: "3px 4px 6px #C9CCD1, -3px -4px 6px #ffffff",
                  }}
                  titleStyle={{
                    fontSize: 15,
                    textShadow: "1px 0 #ffffff",
                    fontWeight: "400",
                    letterSpacing: 3,
                    fontFamily: "Roboto Slab",
                  }}
                />
              ) : (
                <View style={{ marginTop: 20 }}>
                  <ActivityIndicator size='large' color='#4fc3f7' />
                </View>
              )}
            </View>
          </SwipeableDrawer>
        </View>
        <View>
          <SwipeableDrawer
            anchor='bottom'
            open={drawer_2}
            onClose={toggleDrawer_2}
            onOpen={toggleDrawer_2}>
            <View style={styles.drawer_2}>
              <View
                style={{
                  width: "90%",
                  flexDirection: "row",
                  justifyContent: "space-between",
                  marginVertical: 10,
                  marginLeft: 20,
                }}>
                <View>
                  <Text
                    style={{
                      fontSize: 15,
                      fontWeight: "700",
                      letterSpacing: 2,
                      fontFamily: "Roboto Slab",
                    }}>
                    SIGN UP
                  </Text>
                  <Text
                    style={{
                      fontSize: 12,
                      fontWeight: "400",
                      letterSpacing: 2,
                      fontFamily: "Open Sans",
                    }}>
                    Enter your credentials to proceed
                  </Text>
                </View>
                <TouchableOpacity onPress={toggleDrawer_2}>
                  <Icon
                    name='times'
                    type='font-awesome'
                    color='#9e9e9e'
                    size={20}
                  />
                </TouchableOpacity>
              </View>
              <Input
                value={username}
                onChangeText={(text) => {
                  setUsername(text);
                  // setError("");
                }}
                placeholder='username'
                label='Enter your username'
                errorMessage={usernameError}
                labelStyle={{
                  marginLeft: 15,
                  fontSize: 12,
                  fontWeight: "400",
                  letterSpacing: 1,
                  fontFamily: "Open Sans",
                }}
                containerStyle={{
                  marginTop: 10,
                  width: "100%",
                  marginHorizontal: "auto",
                }}
                inputContainerStyle={{
                  marginTop: 5,
                }}
                inputContainerStyle={{
                  width: "95%",
                  marginHorizontal: "auto",
                }}
              />{" "}
              <Input
                secureTextEntry={true}
                value={password_2}
                onChangeText={(text) => {
                  setPassword_2(text);
                  // setError("");
                }}
                placeholder='password'
                label='Enter your password'
                errorMessage={passwordError}
                labelStyle={{
                  marginLeft: 15,
                  fontSize: 12,
                  fontWeight: "400",
                  letterSpacing: 1,
                  fontFamily: "Open Sans",
                }}
                containerStyle={{
                  marginTop: 10,
                  width: "100%",
                  marginHorizontal: "auto",
                }}
                inputContainerStyle={{
                  marginTop: 5,
                }}
                inputContainerStyle={{
                  width: "95%",
                  marginHorizontal: "auto",
                }}
              />
              <Input
                secureTextEntry={true}
                value={confirmPassword}
                onChangeText={(text) => {
                  setConfirmPassword(text);
                  // setError("");
                }}
                placeholder='confirm password'
                label='Re-type password'
                errorMessage={confirmPassError}
                labelStyle={{
                  marginLeft: 15,
                  fontSize: 12,
                  fontWeight: "400",
                  letterSpacing: 1,
                  fontFamily: "Open Sans",
                }}
                containerStyle={{
                  marginTop: 10,
                  width: "100%",
                  marginHorizontal: "auto",
                }}
                inputContainerStyle={{
                  marginTop: 5,
                }}
                inputContainerStyle={{
                  width: "95%",
                  marginHorizontal: "auto",
                }}
              />
              <Input
                type='tel'
                value={phoneNo_2}
                onChangeText={(text) => {
                  setPhoneNo_2(text);
                  // setError("");
                }}
                placeholder='+91'
                label='10 digit mobile number'
                errorMessage={phoneError}
                labelStyle={{
                  marginLeft: 15,
                  fontSize: 12,
                  fontWeight: "400",
                  letterSpacing: 1,
                  fontFamily: "Open Sans",
                }}
                containerStyle={{
                  marginTop: 15,
                  width: "100%",
                  marginHorizontal: "auto",
                }}
                inputContainerStyle={{
                  marginTop: 5,
                }}
                inputContainerStyle={{
                  width: "95%",
                  marginHorizontal: "auto",
                }}
                rightIcon={
                  <Button
                    onPress={phoneCheck}
                    title='send OTP'
                    buttonStyle={{
                      width: 100,
                      height: 40,
                      backgroundColor: "#4fc3f7",
                      borderRadius: 10,
                    }}
                    containerStyle={{
                      width: 100,
                      marginRight: 10,
                      borderRadius: 10,
                      boxShadow: "1px 2px 3px #C9CCD1",
                    }}
                  />
                }
              />
              <Input
                value={verifycode}
                onChangeText={(text) => {
                  setverifycode(text);
                  // setError("");
                }}
                placeholder='OTP code'
                label='Enter your OTP'
                errorMessage={OTPerror}
                labelStyle={{
                  marginLeft: 15,
                  fontSize: 12,
                  fontWeight: "400",
                  letterSpacing: 1,
                  fontFamily: "Open Sans",
                }}
                containerStyle={{
                  marginTop: 10,
                  width: "100%",
                  marginHorizontal: "auto",
                }}
                inputContainerStyle={{
                  marginTop: 5,
                }}
                inputContainerStyle={{
                  width: "95%",
                  marginHorizontal: "auto",
                }}
              />
              <Button
                onPress={signup}
                title='SIGN UP'
                disabled={OTPid === null ? true : false}
                buttonStyle={{
                  backgroundColor: "#4fc3f7",
                  borderRadius: 10,
                }}
                containerStyle={{
                  marginVertical: 10,
                  width: "90%",
                  marginHorizontal: "auto",
                  borderRadius: 10,
                  border: "none",
                  boxShadow: "3px 4px 6px #C9CCD1",
                }}
                titleStyle={{
                  fontSize: 15,
                  textShadow: "1px 0 #ffffff",
                  fontWeight: "400",
                  letterSpacing: 3,
                  fontFamily: "Open Sans",
                }}
              />
            </View>
            {open && (
              <Snackbar
                open={open}
                autoHideDuration={6000}
                onClose={handleClose}>
                <Alert
                  onClose={handleClose}
                  severity='success'
                  style={{ textAlign: "center" }}>
                  {signedIn}
                </Alert>
              </Snackbar>
            )}
          </SwipeableDrawer>
        </View>
      </View>
    </View>
  );
};

export default Profile;

const styles = StyleSheet.create({
  container: {
    height: "55%",
    width: "100%",
    flexDirection: "column-reverse",
    backgroundColor: "#eceff1",
  },
  profile: {
    alignItems: "center",
    backgroundColor: "#ffffff",
    flexDirection: "column",
    height: "45%",
    width: "100%",
  },
  logo: {
    // marginHorizontal: "auto",
    justifyContent: "center",
    alignItems: "center",
    marginVertical: "auto",
    marginHorizontal: "auto",
    height: "70px",
    width: "70px",
    borderRadius: 175,
    backgroundColor: "#424242",
  },
  text2: {
    marginVertical: "auto",
    marginHorizontal: "auto",
    letterSpacing: 3,
    fontSize: 15,
    fontWeight: "bold",
  },
  button: {
    height: 40,
    width: "80%",
    textAlign: "center",
    borderRadius: 10,
    backgroundColor: "#4fc3f7",
    boxShadow: "3px 4px 6px #C9CCD1, -3px -4px 6px #ffffff",
    elevation: 2,
    textTransform: "uppercase",
  },
  text: {
    marginVertical: "20px",
    marginHorizontal: "auto",
    letterSpacing: 3,
    fontSize: 20,
    fontWeight: "bold",
    fontFamily: "Open Sans",
  },
  drawer: {
    width: "100%",
    height: 320,
    borderRadius: 10,
  },
  drawer_2: {
    width: "100%",
    height: 600,
    borderRadius: 10,
  },
});
