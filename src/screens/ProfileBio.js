import React, { useEffect, useContext } from "react";
import {
  StyleSheet,
  Text,
  Image,
  View,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
} from "react-native";
import { Icon, Button } from "react-native-elements";
import { useNavigation } from "@react-navigation/native";
import { singleUser } from "../functions/userfunction";
import { AuthContext } from "../context/userContext";
const { width, height } = Dimensions.get("window");

const ProfileBio = ({ handleLogin }) => {
  const navigation = useNavigation();

  //GLOBAL USER-STATE SETUP
  const { state, dispatch } = useContext(AuthContext);

  //GET USER && TOKEN FROM LOCAL-STORAGE
  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user && user._id;
  const token = localStorage.getItem("token");
  const refreshtoken = localStorage.getItem("refresh-token");

  //GET SINGLE USER
  useEffect(() => {
    singleUser(userId, token, refreshtoken, dispatch);
  }, []);

  //LOG-OUT
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("refresh-token");
    dispatch({ type: "LOGOUT_USER" });
  };

  return (
    <View style={styles.container}>
      {state.user ? (
        <View
          style={{
            width: "100%",
            height: "95%",
            maxHeight: width <= 320 && height <= 500 ? 450 : 700,
          }}>
          <ScrollView style={styles.div_1}>
            <View style={styles.div_2}>
              <View style={styles.div_3}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                  <Icon
                    name='chevron-left'
                    type='font-awesome-5'
                    color='#517fa4'
                    size={20}
                    containerStyle={{
                      marginLeft: 25,
                    }}
                  />
                </TouchableOpacity>
                <TouchableOpacity onPress={logout}>
                  <Icon
                    name='cogs'
                    type='font-awesome-5'
                    color='#517fa4'
                    size={26}
                    containerStyle={{
                      marginRight: 25,
                    }}
                  />
                </TouchableOpacity>
              </View>
              <View style={styles.div_4}>
                <Text style={styles.text_1}>My Profile</Text>
              </View>
              <View style={styles.div_5}>
                <Image
                  style={styles.image_3}
                  source={{
                    uri: `https://www.winhelponline.com/blog/wp-content/uploads/2017/12/user.png`,
                  }}
                />
                <Text style={styles.text_2}>{state.user.username}</Text>
                <Text style={styles.text_3}>
                  Guildhall School of Music & Drama London, UK
                </Text>
              </View>
              <View style={styles.div_6}>
                <View style={styles.div_7}>
                  <View style={styles.div_8}>
                    <View style={{ marginTop: 30 }}>
                      <Text style={styles.text_4}>Followers</Text>
                      <Text
                        style={{
                          letterSpacing: 1,
                          color: "#263238",
                          fontWeight: "bold",
                          textShadow: "1px 0 #263238",
                        }}>
                        456
                      </Text>
                    </View>
                  </View>
                  <View style={styles.div_8}>
                    <View style={{ marginTop: 30 }}>
                      <Text style={styles.text_4}>Following</Text>
                      <Text
                        style={{
                          letterSpacing: 1,
                          color: "#263238",
                          fontWeight: "bold",
                          textShadow: "1px 0 #263238",
                        }}>
                        456
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
            </View>
            <View style={styles.div_9}>
              <View style={styles.div_10}>
                <TouchableOpacity
                  onPress={() => navigation.navigate("My-Order")}>
                  <Icon
                    raised
                    name='cart-arrow-down'
                    type='font-awesome-5'
                    color='#517fa4'
                    containerStyle={{
                      border: "1px solid #C9CCD1",
                      padding: "auto",
                      boxShadow: "1px 3px 6px 1px #C9CCD1",
                      elevation: 2,
                    }}
                  />
                </TouchableOpacity>

                <Text style={styles.text_2}>My Order</Text>
              </View>
              <View style={styles.div_10}>
                <TouchableOpacity>
                  <Icon
                    raised
                    name='receipt'
                    type='font-awesome-5'
                    color='#517fa4'
                    containerStyle={{
                      border: "1px solid #C9CCD1",
                      padding: "auto",
                      boxShadow: "1px 3px 6px 1px #C9CCD1",
                      elevation: 2,
                    }}
                  />
                </TouchableOpacity>

                <Text style={styles.text_2}>My Bill</Text>
              </View>
            </View>
            {state.user.role === "resturant-owner" ? (
              <Button
                title='View Business Profile'
                onPress={() =>
                  navigation.navigate("MyRestaurent", {
                    id: state.user.resturantId,
                  })
                }
                containerStyle={{
                  height: 50,
                  width: "90%",
                  paddingHorizontal: "auto",
                  marginHorizontal: "auto",
                  borderRadius: 20,
                  backgroundColor: "#29b6f6",
                  border: "1px solid #C9CCD1",
                  boxShadow: "1px 3px 6px 1px #C9CCD1",
                  elevation: 2,
                }}
                buttonStyle={{
                  height: 50,
                  borderRadius: 20,
                  backgroundColor: "#29b6f6",
                }}
                titleStyle={{
                  // marginVertical: "auto",
                  marginHorizontal: "auto",
                  fontWeight: "bold",
                  color: "#ffffff",
                  letterSpacing: 3,
                  fontSize: width <= 320 && height <= 500 ? 15 : 18,
                  textShadow: "1px 0 #ffffff",
                }}
              />
            ) : (
              <TouchableOpacity
                style={styles.button_1}
                onPress={() => navigation.navigate("BusinessForm")}>
                <Text
                  style={{
                    marginVertical: "auto",
                    marginHorizontal: "auto",
                    fontWeight: "bold",
                    color: "#ffffff",
                    letterSpacing: 3,
                    fontSize: 15,
                    textShadow: "1px 0 #ffffff",
                  }}>
                  Upgrade to business profile
                </Text>
              </TouchableOpacity>
            )}
            <View style={{ width: "100%", height: 40 }}></View>
          </ScrollView>
        </View>
      ) : (
        <ActivityIndicator
          size='large'
          color='#00ff00'
          style={{
            margin: "auto",
          }}
        />
      )}
    </View>
  );
};

export default ProfileBio;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  div_1: {
    marginTop: "30px",
    marginHorizontal: "auto",
    borderRadius: 20,
    width: "90%",
    backgroundColor: "#ffffff",
    boxShadow: "0 4px 8px 0 #cfd8dc, 0 6px 20px 0 #cfd8dc",
  },
  div_2: {
    width: "100%",
    height: 350,
    borderRadius: 20,
    boxShadow: "0 2px 4px 0 #cfd8dc, 0 3px 10px 0 #cfd8dc",
    elevation: 2,
  },
  div_3: {
    height: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 40,
    marginBottom: 10,
    width: "100%",
    letterSpacing: 2,
  },
  div_4: {
    marginVertical: 10,
    width: "100%",
    height: 30,
  },
  div_5: {
    width: "100%",
    height: 130,
    alignItems: "center",
  },
  div_6: {
    width: "100%",
    height: 100,
    alignItems: "center",
  },
  div_7: {
    width: "70%",
    height: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  div_8: {
    textAlign: "center",
    alignItems: "center",
    height: 20,
  },
  div_9: {
    flexDirection: "row",
    width: "100%",
    padding: 20,
    justifyContent: "space-around",
  },
  div_10: {
    textAlign: "center",
  },
  text_1: {
    marginLeft: 25,
    fontWeight: "bold",
    letterSpacing: 3,
    fontSize: 20,
    fontFamily: "Open Sans",
    color: "#455a64",
    textShadow: "1px 0 #455a64",
  },
  text_2: {
    marginTop: 15,
    marginBottom: 10,
    fontWeight: "bold",
    letterSpacing: 2,
    fontSize: 15,
    fontFamily: "Open Sans",
    color: "#455a64",
    textShadow: "1px 0 #455a64",
  },
  text_3: {
    textAlign: "center",
    width: "70%",
    fontWeight: "bold",
    fontFamily: "Open Sans",
    color: "#b0bec5",
  },
  text_4: {
    // marginVertical: "auto",
    marginHorizontal: "auto",
    fontWeight: "400",
    fontFamily: "Open Sans",
    color: "#b0bec5",
    textShadow: "1px 0 #b0bec5",
    letterSpacing: 2,
  },
  span_1: {
    letterSpacing: 1,
    marginLeft: 15,
    color: "#263238",
    fontWeight: "bold",
    textShadow: "1px 0 #263238",
  },
  image_1: {
    marginLeft: 20,
    height: 15,
    width: 15,
    backgroundColor: "#ffffff",
  },
  image_2: {
    marginRight: 20,
    height: 15,
    width: 15,
    backgroundColor: "#ffffff",
  },
  image_3: { width: 50, height: 50, marginTop: 10 },
  button_1: {
    height: 50,
    width: "90%",
    paddingHorizontal: "auto",
    marginHorizontal: "auto",
    borderRadius: 20,
    backgroundColor: "#29b6f6",
    border: "1px solid #C9CCD1",
    boxShadow: "1px 3px 6px 1px #C9CCD1",
    elevation: 2,
  },
});
