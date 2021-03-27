import React, { useState, useContext, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
} from "react-native";
const { width, height } = Dimensions.get("window");
import { Icon, Button, ListItem, CheckBox } from "react-native-elements";
import { useNavigation } from "@react-navigation/native";
import { RestaurentContext } from "../context/restaurentContext";
import { ProductContext } from "../context/productcontext";
import { AuthContext } from "../context/userContext";
import { CartContext } from "../context/cartContext";
import BASE_URL from "../api";
import Axios from "axios";
import FoodDialog from "./foodDialog";
import MuiAlert from "@material-ui/lab/Alert";
import Snackbar from "@material-ui/core/Snackbar";
import LinearProgress from "@material-ui/core/LinearProgress";
import Slide from "@material-ui/core/Slide";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogTitle from "@material-ui/core/DialogTitle";
import { addTocart, removeFromCart } from "../functions/cartfunction";
function Alert(props) {
  return <MuiAlert elevation={6} variant='filled' {...props} />;
}
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction='up' ref={ref} {...props} />;
});
const Foodlist = ({ route }) => {
  const navigation = useNavigation();

  // FOOD DIALOG SETUP
  const [dialog, setDialog] = useState(false);
  const handleDialogClose = () => {
    setDialog(!dialog);
  };

  //GLOBAL STATE SET-UP
  const { state: restaurentState } = useContext(RestaurentContext);
  const { state: productState, dispatch: productDispatch } = useContext(
    ProductContext
  );
  const { state: userState } = useContext(AuthContext);
  const { state: cartState, dispatch: cartDispatch } = useContext(CartContext);

  //LOCAL VERIABLE FROM GLOBAL STATE
  const singleProduct =
    productState.restaurentProducts && productState.restaurentProducts[0];
  const singleRestaurent =
    restaurentState.singleRestaurent && restaurentState.singleRestaurent[0];

  //LOCAL STATE-SETUP
  const [isChecked, setIsChecked] = useState(singleRestaurent.isOpened);
  const [sendReq, setSendReq] = useState(true);
  const [sendFoodReq, setSendFoodReq] = useState(true);
  const [loading, setLoading] = useState(true);

  // LOCALSTORAGE USER AND TOKEN
  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");
  const refreshtoken = localStorage.getItem("refresh-token");
  const resturantId = user ? user.resturantId : null;
  const id = route.params ? route.params.id : null;

  //SNACKBAR SETUP
  const [open, setOpen] = useState(false);
  const [open2, setOpen2] = useState(false);

  const handleClose = () => {
    setOpen(false);
  };

  const handleClose2 = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen2(false);
  };

  useEffect(() => {
    if (
      !singleProduct ||
      singleRestaurent._id.toString() !== singleProduct.resturantId.toString()
    ) {
      getRestaurentProduct();
    }
  }, []);

  //GET RESTAURENT PRODUCT
  const getRestaurentProduct = () => {
    setSendFoodReq(false);
    Axios.post(`${BASE_URL}/api/product/getProductByCategory`, {
      resturantId: id,
    })
      .then((res) => {
        const { products } = res.data;
        console.log(products);
        productDispatch({
          type: "GET_RESTAURENT_PRODUCTS",
          payload: products,
        });
        setSendFoodReq(true);
      })
      .catch((err) => console.log(err));
  };

  //OPEN OR CLOSE RESTAURENT
  const openClose = () => {
    if (!userState.isLogin) {
      setOpen2(true);
    } else {
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
          restaurentState.myRestaurent
            ? (restaurentState.myRestaurent[0].isOpened = !restaurentState
                .myRestaurent[0].isOpened)
            : null;
          setSendReq(true);
          setIsChecked(!isChecked);
        })
        .catch((err) => console.log(err));
    }
  };

  //ADD ITEMS TO CART
  const [foodWantToAddId, setFoodWantToAddId] = useState("");
  const [foodWantToAddPrice, setFoodWantToAddPrice] = useState("");

  const addItem = (productId, price, ResturantId) => {
    if (!userState.isLogin) {
      setOpen2(true);
    } else {
      let existingRestaurent = null;
      if (
        cartState.cartItems === null ||
        cartState.cartItems.cartItem.length === 0
      ) {
        addTocart(
          productId,
          price,
          userState,
          setOpen2,
          setLoading,
          user,
          cartDispatch,
          token,
          refreshtoken
        );
      } else if (
        cartState.cartItems !== null &&
        cartState.cartItems.cartItem.length > 0
      ) {
        existingRestaurent = cartState.cartItems.cartItem.find(
          (item) =>
            item.productId.resturantId.toString() === ResturantId.toString()
        );
      }
      if (existingRestaurent) {
        console.log("restaurent found");
        addTocart(
          productId,
          price,
          userState,
          setOpen2,
          setLoading,
          user,
          cartDispatch,
          token,
          refreshtoken
        );
      } else if (cartState.cartItems !== null) {
        setFoodWantToAddId(productId);
        setFoodWantToAddPrice(price);
        setDialog(true);
        console.log(productId, price);
      }
    }
  };

  //REMOVE SINGLE CART ITEM
  const [dialog2, setDialog2] = useState(false);
  const handleDialogClose2 = () => {
    setDialog2(false);
  };
  const removeItem = (productId, price) => {
    if (cartState.cartItems.quantity === 1) {
      setDialog2(true);
      console.log("1");
    } else {
      removeFromCart(
        productId,
        price,
        userState,
        setOpen2,
        setLoading,
        user,
        cartDispatch,
        token,
        refreshtoken
      );
    }
  };

  const handleOrder = (ResturantId, productId, price) => {
    if (!userState.isLogin) {
      setOpen2(true);
    } else {
      let existingRestaurent = null;
      if (
        cartState.cartItems === null ||
        cartState.cartItems.cartItem.length === 0
      ) {
        addTocart(
          productId,
          price,
          userState,
          setOpen2,
          setLoading,
          user,
          cartDispatch,
          token,
          refreshtoken
        );
        if (!userState.isLogin) {
          setOpen2(true);
        } else {
          navigation.navigate("Home", {
            screen: "Location",
            params: { ResturantId },
          });
        }
      } else if (
        cartState.cartItems !== null &&
        cartState.cartItems.cartItem.length > 0
      ) {
        existingRestaurent = cartState.cartItems.cartItem.find(
          (item) =>
            item.productId.resturantId.toString() === ResturantId.toString()
        );
      }
      if (existingRestaurent) {
        console.log("restaurent found");
        addTocart(
          productId,
          price,
          userState,
          setOpen2,
          setLoading,
          user,
          cartDispatch,
          token,
          refreshtoken
        );
        if (!userState.isLogin) {
          setOpen2(true);
        } else {
          navigation.navigate("Home", {
            screen: "Location",
            params: { ResturantId },
          });
        }
      } else if (cartState.cartItems !== null) {
        setFoodWantToAddId(productId);
        setFoodWantToAddPrice(price);
        setDialog(true);
        console.log(productId, price);
      }
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
              fontWeight: "600",
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
          height: "65%",
          maxHeight: width <= 320 && height <= 500 ? 400 : 500,
        }}>
        {sendFoodReq &&
        productState.restaurentProducts &&
        productState.restaurentProducts.length > 0 ? (
          <ScrollView style={styles.div_3}>
            {productState.restaurentProducts.map((l, i) => (
              <View
                key={i}
                style={{
                  justifyContent: "space-between",
                  width: "100%",
                  flexDirection: "row",
                  padding: 20,
                  boxShadow: "0 2px 4px 0 #bdbdbd, 0 3px 10px 0 #bdbdbd",
                }}>
                <ListItem.Content
                  style={{
                    height: 150,
                    justifyContent: "space-between",
                  }}>
                  <ListItem.Title
                    style={{
                      fontFamily: "Open Sans",
                      fontSize: 15,
                      fontWeight: 700,
                      // marginBottom: 10,
                    }}>
                    {l.name}
                  </ListItem.Title>
                  <ListItem.Subtitle
                    style={{
                      fontFamily: "Open Sans",
                      fontSize: 18,
                      fontWeight: 600,
                      // marginBottom: 10,
                    }}>
                    ₹{l.price}
                  </ListItem.Subtitle>
                  <Button
                    title='ORDER NOW'
                    onPress={() => handleOrder(l.resturantId, l._id, l.price)}
                    disabled={!isChecked ? true : false}
                    titleStyle={{
                      fontSize: 12,
                      textShadow: "1px 0 #ffffff",
                      fontWeight: "400",
                      letterSpacing: 3,
                      fontFamily: "Open Sans",
                    }}
                    containerStyle={{
                      marginVertical: 10,
                      width: "80%",
                      // marginHorizontal: "auto",
                      borderRadius: 10,
                      border: "none",
                      boxShadow: "3px 4px 6px #C9CCD1",
                    }}
                    buttonStyle={{
                      width: "100%",
                      height: 30,
                      marginHorizontal: "auto",
                    }}
                  />
                </ListItem.Content>{" "}
                <View
                  style={{
                    width: "40%",
                    height: 150,
                  }}>
                  <Image
                    source={l.photo}
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

                  {loading ? (
                    cartState.cartItems === null ||
                    cartState.cartItems.cartItem.length === 0 ? (
                      <View style={styles.div_4}>
                        <Button
                          title='A D D'
                          disabled={!isChecked ? true : false}
                          onPress={() => {
                            addItem(l._id, l.price, l.resturantId);
                            setOpen(true);
                          }}
                          titleStyle={{
                            fontSize: 18,
                            fontWeight: "bold",
                            letterSpacing: 2,
                            marginLeft: 10,
                            fontFamily: "Open Sans",
                            color: "#8bc34a",
                          }}
                          containerStyle={{
                            marginVertical: 5,
                            width: "100%",
                            marginHorizontal: "auto",
                            border: "none",
                            backgroundColor: "#ffffff",
                          }}
                          buttonStyle={{
                            width: "100%",
                            height: 30,
                            marginHorizontal: "auto",
                            backgroundColor: "#ffffff",
                          }}
                        />
                      </View>
                    ) : (
                      cartState.cartItems.cartItem.map((item, idx) =>
                        item.productId._id.toString() === l._id.toString() ? (
                          <View style={styles.div_4} key={idx}>
                            <Button
                              onPress={() => {
                                removeItem(l._id, l.price);
                                setOpen(true);
                              }}
                              disabled={!isChecked ? true : false}
                              disabledStyle={{
                                backgroundColor: "#ffffff",
                              }}
                              icon={
                                <Icon
                                  name='window-minimize'
                                  type='font-awesome'
                                  color='#9e9e9e'
                                  size={15}
                                  iconStyle={{
                                    color: "#8bc34a",
                                  }}
                                />
                              }
                              buttonStyle={{
                                backgroundColor: "#ffffff",
                              }}
                            />
                            <Text
                              style={{
                                height: 25,
                                border: "none",
                                paddingTop: 5,
                                paddingBottom: 5,
                                fontSize: 18,
                                fontWeight: 900,
                                color: "#9e9e9e",
                                fontFamily: "Open Sans",
                              }}>
                              {item.quantity}
                            </Text>
                            <Button
                              onPress={() => {
                                setOpen(true);
                                addItem(l._id, l.price, l.resturantId);
                              }}
                              disabled={!isChecked ? true : false}
                              disabledStyle={{
                                backgroundColor: "#ffffff",
                              }}
                              icon={
                                <Icon
                                  name='plus'
                                  type='font-awesome'
                                  color='#9e9e9e'
                                  size={15}
                                  containerStyle={{
                                    marginTop: 5,
                                  }}
                                  iconStyle={{
                                    color: "#8bc34a",
                                  }}
                                />
                              }
                              buttonStyle={{
                                backgroundColor: "#ffffff",
                              }}
                            />
                          </View>
                        ) : (
                          <View style={styles.div_4}>
                            <Button
                              title='A D D'
                              disabled={!isChecked ? true : false}
                              onPress={() => {
                                addItem(l._id, l.price, l.resturantId);
                                setOpen(true);
                              }}
                              titleStyle={{
                                fontSize: 18,
                                fontWeight: "bold",
                                marginLeft: 10,
                                letterSpacing: 2,
                                fontFamily: "Open Sans",
                                color: "#8bc34a",
                              }}
                              containerStyle={{
                                marginVertical: 5,
                                width: "100%",
                                marginHorizontal: "auto",
                                border: "none",
                                backgroundColor: "#ffffff",
                              }}
                              buttonStyle={{
                                width: "100%",
                                height: 30,
                                marginHorizontal: "auto",
                                backgroundColor: "#ffffff",
                              }}
                            />
                          </View>
                        )
                      )
                    )
                  ) : (
                    <LinearProgress />
                  )}
                </View>
                <FoodDialog
                  itemId={foodWantToAddId}
                  itemPrice={foodWantToAddPrice}
                  setOpen2={setOpen2}
                  setLoading={setLoading}
                  open={dialog}
                  handleClose={handleDialogClose}
                  Transition={Transition}
                  addTocart={addTocart}
                  removeFromCart={removeFromCart}
                />
                <Dialog
                  open={dialog2}
                  TransitionComponent={Transition}
                  keepMounted
                  aria-labelledby='alert-dialog-slide-title'
                  aria-describedby='alert-dialog-slide-description'>
                  <DialogTitle>
                    <Text>You have one item left in cart...</Text>
                    <Text>Do Want to remove it?</Text>
                  </DialogTitle>
                  <DialogActions>
                    <Button title='Y E S' />
                    <Button title='N O' onPress={handleDialogClose2} />
                  </DialogActions>
                </Dialog>
              </View>
            ))}
          </ScrollView>
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
      <Snackbar
        open={open2}
        autoHideDuration={6000}
        onClose={handleClose2}
        style={{ bottom: 50 }}>
        <Alert onClose={handleClose2} severity='error'>
          You are not logged in!
        </Alert>
      </Snackbar>
      {open && cartState.cart && (
        <Snackbar
          open={open}
          onClose={handleClose}
          style={{ width: "95%", bottom: 50 }}>
          <Alert
            onClose={handleClose}
            severity='success'
            style={{ width: "100%" }}>
            <View
              style={{
                width: 250,
                flexDirection: "row",
                justifyContent: "space-between",
              }}>
              <View
                style={{
                  width: "65%",
                  flexDirection: "row",
                  alignItems: "center",
                  textAlign: "center",
                  justifyContent: "space-evenly",
                }}>
                <Text
                  style={{
                    fontFamily: "Open Sans",
                    fontSize: 15,
                    color: "#ffffff",
                    fontWeight: "600",
                    marginHorizontal: 10,
                  }}>
                  {cartState.cart.quantity} items
                </Text>
                <Text style={{ color: "#ffffff" }}>|</Text>
                <Text
                  style={{
                    fontFamily: "Open Sans",
                    fontSize: 15,
                    color: "#ffffff",
                    fontWeight: "600",
                    marginHorizontal: 10,
                  }}>
                  ₹{cartState.cart.price}
                </Text>
              </View>
              <View style={{ width: "35%", flexDirection: "row-reverse" }}>
                <TouchableOpacity>
                  <Icon
                    name='shopping-cart'
                    type='font-awesome'
                    color='#9e9e9e'
                    size={26}
                    containerStyle={{
                      marginRight: 10,
                    }}
                    iconStyle={{
                      color: "#ffffff",
                    }}
                  />
                </TouchableOpacity>
              </View>
            </View>
          </Alert>
        </Snackbar>
      )}
    </View>
  );
};

export default Foodlist;

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
    letterSpacing: 3,
    color: "#455a64",
    fontWeight: "bold",
    textShadow: "1px 0 #455a64",
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
