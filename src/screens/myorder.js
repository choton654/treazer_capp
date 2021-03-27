import React, { useEffect, useContext, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  ScrollView,
  SafeAreaView,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { Image } from "react-native-elements";
import BASE_URL from "../api";
import Axios from "axios";
import { OrderContext } from "../context/ordercontext";
import { ProductContext } from "../context/productcontext";
const { width, height } = Dimensions.get("window");
const Myorder = () => {
  const { state: orderState, dispatch: orderDispatch } = useContext(
    OrderContext
  );
  const { state: productState, dispatch: productDispatch } = useContext(
    ProductContext
  );
  const [orderReq, setOrderReq] = useState(true);
  useEffect(() => {
    getOrder();
  }, []);

  const token = localStorage.getItem("token");
  const refreshtoken = localStorage.getItem("refresh-token");
  const getOrder = () => {
    if (orderState.myOrder === null) {
      setOrderReq(false);
      Axios.get(`${BASE_URL}/api/order/getorder`, {
        headers: {
          // Authorization: `Bearer ${token}`,
          "x-token": token,
          "x-refresh-token": refreshtoken,
        },
      })
        .then((res) => {
          const { order } = res.data;
          if (order.length !== 0) {
            orderDispatch({ type: "PLACE_MY_ORDER", payload: order });
          }
          console.log(order);
          setOrderReq(true);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };
  const renderItem = ({ item }) => {
    // let renderOrderProduct;
    // let foundProduct;
    // if (productState.restaurentProducts) {
    //   foundProduct = productState.restaurentProducts?.find((prod) =>
    //     prod._id.toString() === item.product._id.toString() ? prod : item
    //   );
    //   renderOrderProduct = foundProduct;
    // } else {
    //   renderOrderProduct = {
    //     photo: item.product.photo,
    //     name: item.product.name,
    //     price: item.product.price,
    //     _id: item.product._id,
    //   };
    // }

    // console.log(foundProduct);
    return (
      <View style={styles.v2}>
        <Image
          source={{ uri: item.product.photo }}
          style={{
            width: 150,
            height: 100,
            borderRadius: 10,
          }}
        />
        <View
          style={{ width: 100, height: 100, justifyContent: "space-evenly" }}>
          <Text
            style={{
              width: "100%",
              fontSize: 15,
              fontWeight: "600",
              fontFamily: "Open Sans",
              textAlign: "center",
            }}>
            {item.product.name}
          </Text>
          <Text
            style={{
              width: "100%",
              fontSize: 15,
              fontWeight: "600",
              fontFamily: "Open Sans",
              textAlign: "center",
            }}>
            ₹{item.product.price}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#ffffff",
      }}>
      <Text
        style={{
          width: "100%",
          textAlign: "center",
          justifyContent: "center",
          fontSize: 18,
          fontWeight: "600",
          color: "#90a4ae",
          letterSpacing: 3,
          fontFamily: "Open Sans",
        }}>
        My Orders
      </Text>
      <View
        style={{
          flex: 1,
          width: "100%",
          height: width <= 320 && height <= 500 ? 280 : 400,
          maxHeight: width <= 320 && height <= 500 ? 380 : 500,
          backgroundColor: "#ffffff",
          // border: "1px solid black",
        }}>
        {orderReq ? (
          <ScrollView
            style={{
              width: "100%",
              backgroundColor: "#ffffff",
            }}>
            {orderState.myOrder && orderState.myOrder.length > 0 ? (
              orderState.myOrder.map((order) => (
                <SafeAreaView style={styles.v1}>
                  <FlatList
                    data={order.orderItems}
                    renderItem={renderItem}
                    keyExtractor={(item) => item._id}
                    showsHorizontalScrollIndicator={true}
                    style={{ width: "100%" }}
                  />
                </SafeAreaView>
              ))
            ) : orderState.myOrder ? (
              <SafeAreaView style={styles.v1}>
                <FlatList
                  data={orderState.myOrder.orderItems}
                  renderItem={renderItem}
                  keyExtractor={(item) => item._id}
                  showsHorizontalScrollIndicator={true}
                  style={{ width: "100%" }}
                />
              </SafeAreaView>
            ) : (
              <View
                style={{
                  height: 300,
                  alignItems: "center",
                  justifyContent: "center",
                  marginVertical: "auto",
                }}>
                <Text
                  style={{
                    textAlign: "Center",
                    fontSize: 30,
                    letterSpacing: 3,
                    fontWeight: "700",
                    fontFamily: "Open Sans",
                    color: "#eeeeee",
                  }}>
                  You have no orders!!!
                </Text>
              </View>
            )}
          </ScrollView>
        ) : (
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
            }}>
            <ActivityIndicator
              size='large'
              color='#039be5'
              style={{
                marginVertical: "auto",
                marginHorizontal: 30,
              }}
            />
          </View>
        )}
      </View>
    </View>
  );
};

export default Myorder;

const styles = StyleSheet.create({
  v1: {
    width: "90%",
    height: 150,
    marginHorizontal: "auto",
    marginVertical: 20,
    backgroundColor: "#eeeeee",
    borderRadius: 20,
    alignItems: "center",
    boxShadow: "1px 3px 6px 1px #C9CCD1",
  },
  v2: {
    width: "90%",
    height: "90%",
    marginVertical: 20,
    marginHorizontal: "auto",
    flexDirection: "row",
    justifyContent: "space-between",
  },
});
