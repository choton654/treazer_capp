import React, { useContext, useState } from "react";
import { StyleSheet, Text, View, ActivityIndicator } from "react-native";
import { Button } from "react-native-elements";
import SwipeableDrawer from "@material-ui/core/SwipeableDrawer";
import { CartContext } from "../context/cartContext";
import { AuthContext } from "../context/userContext";
import { Alert, AlertTitle } from "@material-ui/lab";
import Axios from "axios";
import BASE_URL from "../api";
const FoodDialog = ({
  itemId,
  itemPrice,
  open,
  handleClose,
  addTocart,
  setLoading,
  setOpen2,
}) => {
  const { state: cartState, dispatch: cartDispatch } = useContext(CartContext);
  const { state: userState } = useContext(AuthContext);
  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");
  const refreshtoken = localStorage.getItem("refresh-token");
  const [replaceOrderReq, setReplaceOrderReq] = useState(true);
  const removeWholeItem = () => {
    setReplaceOrderReq(false);
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
      .then((res) => {
        cartDispatch({ type: "REMOVE_WHOLE_CART" });
        addTocart(
          itemId,
          itemPrice,
          userState,
          setOpen2,
          setLoading,
          user,
          cartDispatch,
          token,
          refreshtoken,
          setReplaceOrderReq,
          handleClose
        );
      })
      .catch((err) => console.log(err));
  };
  return (
    <View>
      <SwipeableDrawer
        anchor='bottom'
        open={open}
        onOpen={handleClose}
        style={{
          backgroundColor: "#eceff1",
        }}>
        <View>
          <View
            style={{
              width: "100%",
              height: 200,
              justifyContent: "center",
              alignItems: "center",
              boxShadow: "1px 3px 6px 1px #C9CCD1",
            }}>
            <Alert
              severity='warning'
              style={{
                display: "flex",
                flexDirection: "column",
                width: "100%",
                height: 200,
                padding: 20,
                textAlign: "center",
                justifyContent: "center",
                alignItems: "center",
                boxShadow: "1px 3px 6px 1px #C9CCD1",
              }}>
              <AlertTitle>Warning</AlertTitle>
              <Text
                style={{
                  textAlign: "center",
                  fontSize: 15,
                  letterSpacing: 1,
                  paddingVertical: 10,
                  color: "#f57f17",
                  fontWeight: "400",
                  textShadow: "1px 0 #f57f17",
                  fontFamily: "Open Sans",
                }}>
                You can only order from one restaurent at a time...
              </Text>
              <Text
                style={{
                  textAlign: "center",
                  fontSize: 15,
                  letterSpacing: 1,
                  color: "#f57f17",
                  fontWeight: "400",
                  textShadow: "1px 0 #f57f17",
                  fontFamily: "Open Sans",
                }}>
                Your cart already has food from another restaurent...
              </Text>
              <Text
                style={{
                  textAlign: "center",
                  fontSize: 15,
                  letterSpacing: 1,
                  color: "#bf360c",
                  fontWeight: "400",
                  textShadow: "1px 0 #bf360c",
                  fontFamily: "Roboto Slab",
                }}>
                Do you Want to Replace with new one?
              </Text>
            </Alert>
          </View>
          {replaceOrderReq ? (
            <View
              style={{
                height: 150,
                width: "100%",
                justifyContent: "space-evenly",
                marginVertical: 10,
              }}>
              <Button
                title='Y E S'
                onPress={removeWholeItem}
                titleStyle={{
                  fontSize: 15,
                  textShadow: "1px 0 #ffffff",
                  fontWeight: "700",
                  letterSpacing: 3,
                  fontFamily: "Open Sans",
                }}
                containerStyle={{
                  marginVertical: 10,
                  width: "80%",
                  marginHorizontal: "auto",
                  borderRadius: 10,
                  border: "none",
                  boxShadow: "3px 4px 6px #C9CCD1",
                }}
                buttonStyle={{
                  width: "100%",
                  height: 40,
                  marginHorizontal: "auto",
                }}
              />
              <Button
                title='N O'
                onPress={handleClose}
                titleStyle={{
                  fontSize: 15,
                  textShadow: "1px 0 #ffffff",
                  fontWeight: "700",
                  letterSpacing: 3,
                  fontFamily: "Open Sans",
                }}
                containerStyle={{
                  marginVertical: 10,
                  width: "80%",
                  marginHorizontal: "auto",
                  borderRadius: 10,
                  border: "none",
                  boxShadow: "3px 4px 6px #C9CCD1",
                }}
                buttonStyle={{
                  width: "100%",
                  height: 40,
                  marginHorizontal: "auto",
                }}
              />
            </View>
          ) : (
            <View
              style={{
                height: 150,
                width: "100%",
              }}>
              <ActivityIndicator
                size='large'
                color='#00ff00'
                style={{
                  margin: "auto",
                }}
              />
            </View>
          )}
        </View>
      </SwipeableDrawer>
    </View>
  );
};

export default FoodDialog;

const styles = StyleSheet.create({});
