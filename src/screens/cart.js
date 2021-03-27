import React, { useContext, useState } from "react";
import { CartContext } from "../context/cartContext";
import { AuthContext } from "../context/userContext";
import {
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { Icon } from "react-native-elements";
import { useNavigation } from "@react-navigation/native";
import MuiAlert from "@material-ui/lab/Alert";
import Snackbar from "@material-ui/core/Snackbar";
import Axios from "axios";
import BASE_URL from "../api";
// import { getCartItems } from "../functions/cartfunction";
const { width, height } = Dimensions.get("window");
function Alert(props) {
  return <MuiAlert elevation={6} variant='filled' {...props} />;
}

const Cart = () => {
  const navigation = useNavigation();
  const { state: cartState, dispatch: cartDispatch } = useContext(CartContext);
  const { state: userState } = useContext(AuthContext);

  const [open, setOpen] = useState(false);

  const token = localStorage.getItem("token");
  const refreshtoken = localStorage.getItem("refresh-token");
  const user = JSON.parse(localStorage.getItem("user"));

  const handleCheckout = (ResturantId) => {
    if (!userState.isLogin) {
      setOpen(true);
    } else {
      navigation.navigate("Home", {
        screen: "Location",
        params: { ResturantId },
      });
    }
  };
  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };
  const handleClose2 = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen2(false);
  };
  const removeWholeItem = (productId) => {
    if (!userState.isLogin) {
      setOpen(true);
    } else {
      Axios.post(
        `${BASE_URL}/api/cart/${user._id}/removewholeitem`,
        { productId },
        {
          headers: {
            "x-token": token,
            "x-refresh-token": refreshtoken,
          },
        }
      )
        .then((res) => {
          const { updatedCart } = res.data;
          if (updatedCart.cartItem.length === 0) {
            Axios.post(
              `${BASE_URL}/api/cart/deleteCart`,
              { cartId: cartState.cartItems._id },
              {
                headers: {
                  "x-token": token,
                  "x-refresh-token": refreshtoken,
                },
              }
            )
              .then(() => {
                cartDispatch({ type: "REMOVE_WHOLE_CART" });
              })
              .catch((err) => console.log(err));
          } else {
            cartDispatch({
              type: "REMOVE_FROM_CART",
              payload: updatedCart,
            });
          }
          console.log(updatedCart);
        })
        .catch((err) => console.log(err));
    }
  };
  const [open2, setOpen2] = useState(false);
  return (
    <View style={styles.div_1}>
      <View style={styles.div_1}>
        <View style={styles.div_2}>
          <Icon
            name='angle-left'
            type='font-awesome-5'
            color='#9e9e9e'
            size={26}
            onPress={() => navigation.goBack()}
            containerStyle={styles.image_1}
          />
          <Text style={styles.text_1}>MY CART</Text>
        </View>
        <View
          style={{
            width: "100%",
            height: "70%",
            maxHeight: width <= 320 && height <= 500 ? 400 : 500,
          }}>
          <ScrollView style={styles.div_3}>
            {cartState.cartItems !== null &&
              cartState.cartItems.cartItem &&
              cartState.cartItems.cartItem.map((item, idx) => (
                <View style={styles.div_5} key={idx}>
                  <Image
                    style={{
                      borderRadius: 10,
                      height: 70,
                      width: 70,
                      boxShadow: "1px 3px 6px 1px #C9CCD1",
                    }}
                    source={item.productId?.photo}
                  />
                  <View
                    style={{
                      marginHorizontal: "auto",
                      marginVertical: "auto",
                      width: "75%",
                      maxWidth: 1600,
                      height: 75,
                      // border: "1px solid black",
                    }}>
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        height: 45,
                        flexWrap: "wrap",
                      }}>
                      <Text
                        style={{
                          marginLeft: 15,
                          fontSize: 15,
                          color: "#9e9e9e",
                          fontWeight: "bold",
                          letterSpacing: 1,
                          fontFamily: "Open Sans",
                        }}>
                        {item.productId?.name} ({item.quantity})
                      </Text>
                      <TouchableOpacity
                        onPress={() => removeWholeItem(item.productId?._id)}>
                        <Icon
                          name='times'
                          type='font-awesome'
                          color='#9e9e9e'
                          size={20}
                        />
                      </TouchableOpacity>
                    </View>
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        //   marginTop: 20,
                      }}>
                      <Text
                        style={{
                          marginLeft: 15,
                          fontSize: 20,
                          color: "#424242",
                          fontWeight: "bold",
                          letterSpacing: 1,
                          fontFamily: "Open Sans",
                        }}>
                        ₹{item.price}
                      </Text>
                      <View
                        style={{
                          width: "50%",
                          flexDirection: "row",
                          justifyContent: "space-between",
                        }}>
                        <Text
                          style={{
                            fontWeight: "800",
                            color: "#81d4fa",
                            fontSize: 20,
                            fontFamily: "Chango",
                            letterSpacing: 3,
                          }}>
                          Treazer
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>
              ))}
          </ScrollView>
          <Snackbar
            open={open2}
            autoHideDuration={6000}
            onClose={handleClose2}
            style={{ bottom: 120 }}>
            <Alert onClose={handleClose2} severity='success'>
              Food has added to cart
            </Alert>
          </Snackbar>
          <Snackbar
            open={open}
            autoHideDuration={6000}
            onClose={handleClose}
            style={{ bottom: 120 }}>
            <Alert
              onClose={handleClose}
              severity='error'
              style={{ textAlign: "center" }}>
              You are not logged in!!! Log in first
            </Alert>
          </Snackbar>
        </View>
        <View style={styles.div_4}>
          <View>
            <Text
              style={{
                fontSize: 15,
                fontWeight: "700",
                color: "#424242",
                letterSpacing: 2,
                fontFamily: "Open Sans",
              }}>
              TOTAL
            </Text>
            <Text
              style={{
                fontSize: 20,
                fontWeight: "bold",
                color: "#64b5f6",
                letterSpacing: 2,
                textShadow: "1px 0 #64b5f6",
                fontFamily: "Open Sans",
              }}>
              ₹{cartState.cartItems.price}
            </Text>
          </View>
          <TouchableOpacity
            style={styles.button_1}
            onPress={() =>
              handleCheckout(
                cartState.cartItems.cartItem[0].productId.resturantId
              )
            }>
            <Text
              style={{
                color: "#ffffff",
                textShadow: "1px 0 #ffffff",
                letterSpacing: 2,
                fontFamily: "Open Sans",
                fontWeight: "600",
              }}>
              CHECKOUT
            </Text>
            <Icon
              name='arrow-right'
              type='font-awesome'
              color='#ffffff'
              size={20}
            />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default Cart;

const styles = StyleSheet.create({
  div_1: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  div_2: {
    padding: 10,
    flexDirection: "row",
    // justifyContent: "space-evenly",
    alignItems: "center",
    width: "100%",
    height: "10%",
    backgroundColor: "#ffffff",
    // border: "1px solid green",
  },
  image_1: {
    marginLeft: 20,
    marginTop: 5,
    backgroundColor: "#ffffff",
  },
  text_1: {
    // marginHorizontal: "auto",
    // fontSize: 25,
    // letterSpacing: 3,
    // color: "#9e9e9e",
    // fontWeight: "bold",
    // fontFamily: "Roboto Slab",
    // textShadow: "2px 0 #9e9e9e",
    textAlign: "center",
    width: 300,
    fontSize: 20,
    letterSpacing: 3,
    fontWeight: "bold",
    color: "#9e9e9e",
    // fontFamily: "Roboto Slab",
    fontFamily: "Chango",
  },
  div_3: {
    width: "100%",
    marginHorizontal: "auto",
  },
  div_4: {
    paddingVertical: 20,
    flex: 1,
    width: "100%",
    height: "20%",
    maxHeight: 100,
    bottom: 0,
    flexDirection: "row",
    paddingHorizontal: 20,
    justifyContent: "space-between",
    // border: "1px solid black",
  },
  div_5: {
    flexDirection: "row",
    padding: 15,
    width: "95%",
    height: 110,
    border: "1px solid #29b6f6",
    marginVertical: 8,
    borderRadius: 10,
    elevation: 2,
    marginHorizontal: "auto",
    backgroundColor: "#e3f2fd",
    boxShadow: "3px 3px 6px 1px #eeeeee",
  },
  button_1: {
    alignItems: "center",
    borderRadius: 5,
    height: 40,
    width: 150,
    backgroundColor: "#64b5f6",
    flexDirection: "row",
    justifyContent: "space-evenly",
    boxShadow: "1px 3px 6px 1px #C9CCD1",
  },
});
