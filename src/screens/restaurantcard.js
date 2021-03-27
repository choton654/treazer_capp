import React, { useEffect, useContext } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Icon } from "react-native-elements";
import Axios from "axios";
import BASE_URL from "../api";
import { RestaurentContext } from "../context/restaurentContext";
import { LazyLoadImage } from "react-lazy-load-image-component";
const Restaurantcard = () => {
  const navigation = useNavigation();
  const { state: restaurentState, dispatch: restaurentDispatch } = useContext(
    RestaurentContext
  );
  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user && user._id;
  useEffect(() => {
    getAllRestaurent();
  }, []);
  const getAllRestaurent = () => {
    Axios.get(`${BASE_URL}/api/resturant/getAllResturant`)
      .then((res) => {
        console.log(res.data);
        const { resturants } = res.data;
        restaurentDispatch({ type: "GET_ALL_RESTAURENT", payload: resturants });
      })
      .catch((err) => console.log(err));
  };
  return restaurentState.allRestaurent ? (
    restaurentState.allRestaurent.map((item, idx) => (
      <TouchableOpacity
        key={idx}
        style={{ marginBottom: 20 }}
        onPress={() => {
          if (userId && item._id.toString() === userId.toString()) {
            navigation.navigate("MyRestaurant", {
              id: item._id,
            });
          } else {
            navigation.navigate("Restaurant", {
              id: item._id,
            });
          }
        }}>
        {/* Image */}
        <View
          style={{
            marginBottom: 0,
          }}>
          <LazyLoadImage
            src={item.coverPic}
            resizemode='cover'
            effect='blur'
            style={{
              width: "100%",
              height: 200,
              borderTopRightRadius: 20,
              borderTopLeftRadius: 20,
              boxShadow: "0 4px 8px 0 #C9CCD1, 0 6px 20px 0 #C9CCD1",
              elevation: 2,
            }}
          />

          <View
            style={{
              position: "absolute",
              flexDirection: "row",
              bottom: 0,
              height: 50,
              width: 100,
              borderBottomColor: "#ffffff",
              backgroundColor: "#ffffff",
              borderTopRightRadius: 20,
              borderTopLeftRadius: 20,
              alignItems: "center",
              justifyContent: "center",
            }}>
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
              3.6
            </Text>
          </View>
        </View>

        {/* Restaurant Info */}
        <View
          style={{
            alignItems: "center",
            width: "100%",
            paddingHorizontal: 20,
            paddingVertical: 10,
            marginTop: 0,
            marginBottom: 10,
            flexDirection: "column",
            marginHorizontal: "auto",
            borderTopColor: "#ffffff",
            borderBottomRightRadius: 20,
            borderBottomLeftRadius: 20,
            backgroundColor: "#ffffff",
            boxShadow: "0 4px 8px 0 #C9CCD1",
            elevation: 2,
          }}>
          <Text
            style={{
              textAlign: "center",
              color: "#263238",
              fontSize: 20,
              letterSpacing: 1,
              fontWeight: "bold",
              fontFamily: "Roboto Slab",
              marginVertical: 10,
            }}>
            {item.resturant_name}
          </Text>
        </View>
      </TouchableOpacity>
    ))
  ) : (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}>
      <ActivityIndicator
        size='large'
        color='#1e88e5'
        style={{ marginHorizontal: 20 }}
      />
      {/* <Loading /> */}
    </View>
  );
};

export default Restaurantcard;

const styles = StyleSheet.create({});
