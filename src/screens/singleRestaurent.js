import React, { useEffect, useContext } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Dimensions,
} from "react-native";
import { Icon } from "react-native-elements";
import { RestaurentContext } from "../context/restaurentContext";
const { width, height } = Dimensions.get("window");
import Axios from "axios";
import BASE_URL from "../api";
const SingleRestaurent = ({ route, navigation }) => {
  const { state: resaurentState, dispatch: restaurentDispatch } = useContext(
    RestaurentContext
  );
  useEffect(() => {
    getSingleRestaurant();
  }, []);
  const user = JSON.parse(localStorage.getItem("user"));
  console.log(user);
  // const resturantId = user ? user.resturantId : null;
  const id = route.params ? route.params.id : "";
  const getSingleRestaurant = () => {
    if (!resaurentState.allRestaurent) {
      Axios.get(`${BASE_URL}/api/resturant/${id}/getOneResturant`)
        .then((res) => {
          console.log(res.data);
          const { resturant } = res.data;
          restaurentDispatch({ type: "ADD_RESTAURENT", payload: resturant });
        })
        .catch((err) => console.log(err));
    } else {
      restaurentDispatch({ type: "FILTER_RESTAURENT", payload: id });
    }
  };
  return (
    <View style={{ flex: 1, backgroundColor: "#ffffff" }}>
      {resaurentState.singleRestaurent ? (
        <View style={styles.div_1}>
          <View style={styles.div_2}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Icon
                name='angle-left'
                type='font-awesome-5'
                color='#757575'
                size={26}
                containerStyle={{
                  left: 15,
                }}
              />
            </TouchableOpacity>
            <Text style={styles.text_1}>MY RESTAURENT</Text>
            <TouchableOpacity>
              <Icon
                name='ellipsis-v'
                type='font-awesome-5'
                color='#757575'
                size={20}
                containerStyle={{
                  right: 15,
                }}
              />
            </TouchableOpacity>
          </View>
          <View style={styles.div_3}>
            <ScrollView style={styles.div_4}>
              <View>
                {resaurentState.singleRestaurent &&
                resaurentState.singleRestaurent[0] ? (
                  <Image
                    source={resaurentState.singleRestaurent[0].coverPic}
                    resizeMode='cover'
                    style={{
                      width: "100%",
                      height: 250,
                      borderBottomRightRadius: "40px",
                      borderBottomLeftRadius: "40px",
                      boxShadow: "0 4px 8px 0 #bdbdbd, 0 6px 20px 0 #bdbdbd",
                      elevation: 2,
                    }}
                  />
                ) : (
                  <ActivityIndicator
                    size='large'
                    color='#00ff00'
                    style={{
                      marginVertical: "auto",
                      marginHorizontal: "auto",
                    }}
                  />
                )}

                <View
                  style={{
                    position: "absolute",
                    flexDirection: "row",
                    bottom: 0,
                    height: 50,
                    width: 100,
                    borderBottomColor: "#ffffff",
                    backgroundColor: "#ffffff",
                    borderTopRightRadius: 40,
                    borderBottomLeftRadius: 40,
                    alignItems: "center",
                    justifyContent: "center",
                  }}>
                  {/* <Rating imageSize={20} readonly startingValue={item.rating} /> */}
                  <Icon
                    name='star'
                    type='font-awesome-5'
                    color='#424242'
                    size={20}
                    iconStyle={{
                      marginHorizontal: 10,
                    }}
                  />
                  <Text
                    style={{
                      fontSize: 18,
                      fontWeight: "600",
                      fontFamily: "Open Sans",
                      marginVertical: 10,
                    }}>
                    3.8
                  </Text>
                </View>
              </View>
              {resaurentState.singleRestaurent &&
              resaurentState.singleRestaurent[0] ? (
                <View>
                  <Text style={styles.text_2}>
                    {resaurentState.singleRestaurent &&
                      resaurentState.singleRestaurent[0].resturant_name}
                  </Text>
                  <View style={{ flexDirection: "row" }}>
                    <Text
                      style={{
                        marginLeft: 10,
                        marginTop: 10,
                        fontSize: 15,
                        color: "#757575",
                        letterSpacing: 1,
                        fontWeight: "500",
                        fontFamily: "Roboto Slab",
                      }}>
                      Quick Bites-
                    </Text>
                    <Text
                      style={{
                        marginTop: 10,
                        fontSize: 15,
                        color: "#757575",
                        fontWeight: "400",
                        letterSpacing: 1,
                        fontFamily: "Open Sans",
                      }}>
                      North Indian, Chiness, Thali
                    </Text>
                  </View>
                  <Text style={styles.text_4}>
                    {" "}
                    {resaurentState.singleRestaurent &&
                      resaurentState.singleRestaurent[0].address}
                  </Text>
                </View>
              ) : (
                <ActivityIndicator
                  size='large'
                  color='#00ff00'
                  style={{
                    marginVertical: "auto",
                    marginHorizontal: "auto",
                  }}
                />
              )}

              <View
                style={{
                  flexDirection: "row",
                  width: "100%",
                  height: 50,
                  marginTop: 10,
                  alignItems: "center",
                  justifyContent: "space-around",
                }}>
                <TouchableOpacity>
                  <Icon
                    name='comments'
                    type='font-awesome-5'
                    color='#757575'
                    size={20}
                  />
                </TouchableOpacity>
                <TouchableOpacity>
                  <Icon
                    name='share-alt'
                    type='font-awesome-5'
                    color='#757575'
                    size={20}
                  />
                </TouchableOpacity>
                <TouchableOpacity>
                  <Icon
                    name='flag'
                    type='font-awesome-5'
                    color='#757575'
                    size={20}
                  />
                </TouchableOpacity>
              </View>
              {resaurentState.singleRestaurent &&
              resaurentState.singleRestaurent[0] ? (
                <TouchableOpacity
                  style={styles.button_1}
                  onPress={() =>
                    navigation.navigate("Menu", {
                      id:
                        resaurentState.singleRestaurent &&
                        resaurentState.singleRestaurent[0]._id,
                    })
                  }>
                  <Icon
                    name='shopping-cart'
                    type='font-awesome-5'
                    color='#ffffff'
                    size={20}
                    containerStyle={{
                      marginVertical: 12,
                    }}
                  />
                  <Text style={styles.text_5}>Order Food Online</Text>
                  <Icon
                    name='angle-double-right'
                    type='font-awesome-5'
                    color='#ffffff'
                    size={20}
                    containerStyle={{
                      marginVertical: 12,
                    }}
                  />
                </TouchableOpacity>
              ) : (
                <ActivityIndicator
                  size='large'
                  color='#00ff00'
                  style={{
                    marginVertical: "auto",
                    marginHorizontal: "auto",
                  }}
                />
              )}
            </ScrollView>
          </View>
          <View
            style={{
              height: 50,
              width: "100%",
            }}></View>
        </View>
      ) : (
        <ActivityIndicator
          size='large'
          color='#00ff00'
          style={{
            marginVertical: "auto",
            marginHorizontal: "auto",
          }}
        />
      )}
    </View>
  );
};

export default SingleRestaurent;

const styles = StyleSheet.create({
  div_1: {
    flex: 1,
    backgroundColor: "#ffffff",
    alignItems: "center",
  },
  div_2: {
    top: 0,
    width: "100%",
    height: "10%",
    backgroundColor: "#ffffff",
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 20,
    opacity: 0.5,
  },
  text_1: {
    textAlign: "center",
    width: 300,
    fontSize: 20,
    letterSpacing: 3,
    fontWeight: "bold",
    color: "#455a64",
    textShadow: "1px 0 #455a64",
    fontFamily: "Roboto Slab",
  },
  div_3: {
    width: "100%",
    height: "100%",
    maxHeight: width <= 320 && height <= 500 ? 380 : 500,
    backgroundColor: "#ffffff",
  },
  div_4: {
    width: "100%",
    backgroundColor: "#ffffff",
    padding: 10,
  },
  text_2: {
    marginHorizontal: 10,
    marginTop: 20,
    marginBottom: 10,
    fontSize: 20,
    fontWeight: "700",
    letterSpacing: 2,
    fontFamily: "Open Sans",
  },
  text_4: {
    marginLeft: 5,
    marginVertical: 5,
    fontSize: 16,
    color: "#263238",
    fontWeight: "600",
    letterSpacing: 1,
    fontFamily: "Roboto Slab",
  },
  text_5: {
    marginLeft: 10,
    marginVertical: 10,
    fontSize: width <= 320 && height <= 500 ? 15 : 20,
    color: "#ffffff",
    letterSpacing: 3,
    fontWeight: "700",
    fontFamily: "Open Sans",
    textShadow: "1px 0 #ffffff",
  },
  button_1: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    marginVertical: 10,
    marginHorizontal: "auto",
    width: "90%",
    // height: 50,
    height: width <= 320 && height <= 500 ? 40 : 50,
    backgroundColor: "#29b6f6",
    borderRadius: 10,
    boxShadow: "0 2px 4px 0 #bdbdbd, 0 3px 6px 0 #bdbdbd",

    // border: "1px solid black",
  },
});
