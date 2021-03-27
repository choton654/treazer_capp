import React, { useState, useContext, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { Icon, ListItem, CheckBox } from "react-native-elements";
// import { images } from "../constants";
import { useNavigation } from "@react-navigation/native";
import { RestaurentContext } from "../context/restaurentContext";
import { ProductContext } from "../context/productcontext";
import BASE_URL from "../api";
import Axios from "axios";

const Myrestaurentfoodlist = ({ route }) => {
  const { state: restaurentState } = useContext(RestaurentContext);
  const { state: productState, dispatch: productDispatch } = useContext(
    ProductContext
  );

  const singleRestaurent =
    restaurentState.myRestaurent && restaurentState.myRestaurent.length > 0
      ? restaurentState.myRestaurent[0]
      : restaurentState.myRestaurent;
  const [isChecked, setIsChecked] = useState(singleRestaurent.isOpened);
  const [sendReq, setSendReq] = useState(true);

  const navigation = useNavigation();
  const user = JSON.parse(localStorage.getItem("user"));
  console.log(user);
  const token = localStorage.getItem("token");
  const refreshtoken = localStorage.getItem("refresh-token");
  const resturantId = user ? user.resturantId : null;
  const id = route.params ? route.params.id : resturantId;
  const openClose = () => {
    setSendReq(false);
    Axios.post(
      `${BASE_URL}/api/resturant/openresturant`,
      { resturantId: id },
      {
        headers: {
          // Authorization: `Bearer ${token}`,
          "x-token": token,
          "x-refresh-token": refreshtoken,
        },
      }
    )
      .then((res) => {
        const { resturant } = res.data;
        console.log(resturant);
        singleRestaurent.isOpened = !singleRestaurent.isOpened;
        restaurentState.allRestaurent.map((item) => {
          item._id.toString() === resturantId.toString()
            ? (item.isOpened = !item.isOpened)
            : item;
        });
        setSendReq(true);
        setIsChecked(!isChecked);
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    if (id) {
      getRestaurentProduct();
    }
  }, [id]);
  const getRestaurentProduct = () => {
    if (
      productState.myrestaurentProducts &&
      productState.myrestaurentProducts.length === 0
    ) {
      Axios.post(`${BASE_URL}/api/product/getProductByCategory`, {
        resturantId: id,
      })
        .then((res) => {
          const { products } = res.data;
          console.log(products);
          productDispatch({
            type: "GET_MY_RESTAURENT_PRODUCTS",
            payload: products,
          });
        })
        .catch((err) => console.log(err));
    }
  };

  return (
    <View style={styles.div_1}>
      <View style={styles.div_2}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon
            name='angle-left'
            type='font-awesome-5'
            color='#757575'
            size={26}
            containerStyle={{
              marginLeft: 5,
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
              marginRight: 5,
            }}
          />
        </TouchableOpacity>
      </View>
      <View style={styles.div_5}>
        <View
          style={{
            flexDirection: "row",
            marginTop: 8,
          }}>
          <Icon name='star' type='font-awesome-5' color='#424242' size={15} />
          <Text
            style={{
              fontFamily: "Open Sans",
              fontSize: 15,
              fontWeight: "400",
              color: "#424242",
              marginLeft: 5,
            }}>
            4.6
          </Text>
        </View>
        <View style={{ textAlign: "center", marginLeft: 10, marginTop: 5 }}>
          {isChecked ? (
            <View style={{ flexDirection: "row" }}>
              <Icon
                name='clock'
                type='font-awesome-5'
                color='#424242'
                size={15}
              />
              <Text
                style={{
                  fontFamily: "Roboto Slab",
                  fontSize: 12,
                  fontWeight: "700",
                  color: "#616161",
                  marginLeft: 5,
                }}>
                33 mins
              </Text>
            </View>
          ) : (
            <Text
              style={{
                fontFamily: "Roboto Slab",
                fontSize: 12,
                fontWeight: "700",
                color: "#e53935",
              }}>
              Closed
            </Text>
          )}

          <Text
            style={{
              fontFamily: "Open Sans",
              fontSize: 12,
              fontWeight: "400",
              color: "#607d8b",
            }}>
            For Delivery
          </Text>
        </View>
        {!resturantId || resturantId.toString() !== id.toString() ? (
          <View
            style={{
              justifyContent: "center",
              alignItems: "center",
              marginRight: 10,
            }}>
            <Icon
              name='exclamation-circle'
              type='font-awesome-5'
              color='#ec407a'
              size={18}
            />
            <Text
              style={{
                fontSize: 12,
                fontWeight: "600",
                fontFamily: "Open Sans",
                color: "#607d8b",
              }}>
              Not Authorized
            </Text>
          </View>
        ) : (
          <View>
            {sendReq ? (
              <CheckBox
                title='Taking orders'
                checked={isChecked}
                onPress={openClose}
                fontFamily='Open Sans'
                containerStyle={{
                  backgroundColor: "#eeeeee",
                  border: "none",
                  width: 80,
                  padding: 0,
                  marginVertical: "auto",
                }}
              />
            ) : (
              <ActivityIndicator
                size='small'
                color='#039be5'
                style={{
                  marginVertical: "auto",
                  marginHorizontal: 30,
                }}
              />
            )}
          </View>
        )}
      </View>
      <View
        style={{
          width: "100%",
          height: "80%",
          maxHeight: 500,
          // border: "1px solid black",
        }}>
        <ScrollView style={styles.div_3}>
          {productState.myrestaurentProducts &&
          productState.myrestaurentProducts.length !== 0 ? (
            productState.myrestaurentProducts.map((item, idx) => (
              <ListItem bottomDivider key={idx}>
                <ListItem.Content
                  style={{ height: 150, justifyContent: "space-evenly" }}>
                  <ListItem.Title
                    style={{
                      fontFamily: "Open Sans",
                      fontSize: 15,
                      fontWeight: "700",
                      // marginBottom: 10,
                    }}>
                    {item.name}
                  </ListItem.Title>
                  <ListItem.Subtitle
                    style={{
                      fontFamily: "Open Sans",
                      fontSize: 18,
                      fontWeight: "600",
                      // marginBottom: 10,
                    }}>
                    ₹{item.price}
                  </ListItem.Subtitle>
                </ListItem.Content>{" "}
                <View style={{ width: "40%", height: 150 }}>
                  <Image
                    source={item.photo}
                    style={{
                      filter: `${
                        isChecked ? "grayscale(0%)" : "grayscale(100%)"
                      }`,
                      height: 100,
                      width: "100%",
                      marginTop: 10,
                      borderRadius: 5,
                      boxShadow: "3px 3px 6px 1px #bdbdbd",
                    }}
                  />
                </View>
              </ListItem>
            ))
          ) : (
            <View
              style={{
                width: "80%",
                height: 350,
                margin: "auto",
                justifyContent: "center",
                alignItem: "center",
              }}>
              <ActivityIndicator
                size='large'
                color='#00ff00'
                style={{
                  marginVertical: "auto",
                  marginHorizontal: "auto",
                }}
              />
            </View>
          )}
        </ScrollView>

        <View style={{ width: "100%", height: 60 }}></View>
      </View>
    </View>
  );
};

export default Myrestaurentfoodlist;

const styles = StyleSheet.create({
  div_1: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  div_2: {
    flexDirection: "row",
    width: "100%",
    height: "10%",
    backgroundColor: "#ffffff",
    top: 0,
    justifyContent: "space-around",
    paddingVertical: 20,
    opacity: 0.5,
  },
  image_1: {
    marginLeft: 20,
    height: 15,
    width: 15,
    backgroundColor: "#ffffff",
  },
  text_1: {
    marginHorizontal: 20,
    fontSize: 20,
    letterSpacing: 2,
    fontWeight: "bold",
    color: "#263238",
    textShadow: "1px 0 #263238",
    fontFamily: "Roboto Slab",
  },
  div_3: {
    width: "100%",
    marginHorizontal: "auto",
  },
  div_4: {
    position: "absolute",
    bottom: 0,
    marginHorizontal: 15,
    marginBottom: 25,
    width: 100,
    height: 40,
    flexDirection: "row",
    justifyContent: "space-evenly",
    borderRadius: 5,
    boxShadow: "2px 2px 4px 1px #bdbdbd",
    // border: "1px solid black",
    backgroundColor: "#ffffff",
  },
  div_5: {
    flexDirection: "row",
    padding: 15,
    width: "95%",
    height: 70,
    marginVertical: 8,
    borderRadius: 10,
    marginHorizontal: "auto",
    backgroundColor: "#eeeeee",
    boxShadow: "3px 3px 6px 1px #eeeeee",
    justifyContent: "space-between",
  },
  button_1: {
    alignItems: "center",
    borderRadius: 5,
    height: 40,
    width: 150,
    backgroundColor: "#9575cd",
    flexDirection: "row",
    justifyContent: "space-evenly",
    boxShadow: "1px 3px 6px 1px #C9CCD1",
  },
});
