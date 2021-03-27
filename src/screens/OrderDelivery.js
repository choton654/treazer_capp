import mapboxgl from "mapbox-gl/dist/mapbox-gl-csp";
import React, { useEffect, useRef, useState, useContext } from "react";
import { StyleSheet, View, ScrollView, ActivityIndicator } from "react-native";
import { Input, Button } from "react-native-elements";
import { CartContext } from "../context/cartContext";
import { OrderContext } from "../context/ordercontext";
import { LocationContext } from "../context/locationcontext";
// import { useNavigation } from "@react-navigation/native";
// eslint-disable-next-line import/no-webpack-loader-syntax
import MapboxWorker from "worker-loader!mapbox-gl/dist/mapbox-gl-csp-worker";
import Paymentform from "./paymentform";
import MuiAlert from "@material-ui/lab/Alert";
import Snackbar from "@material-ui/core/Snackbar";
import Slide from "@material-ui/core/Slide";
import "./site.css";
import Axios from "axios";
import BASE_URL from "../api";
function Alert(props) {
  return <MuiAlert elevation={6} variant='filled' {...props} />;
}
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction='up' ref={ref} {...props} />;
});
mapboxgl.workerClass = MapboxWorker;
mapboxgl.accessToken =
  "pk.eyJ1IjoidHJlYXplciIsImEiOiJja2xxYXJsZmgwMmJwMnBtaXR0M25leTY5In0.Iaj3HteMWU5ZQWCniy4KRA";

export default function OrderDelivery({ route }) {
  // const navigation = useNavigation();
  const { state: cartState, dispatch: cartDispatch } = useContext(CartContext);
  const { dispatch: orderDispatch } = useContext(OrderContext);
  const { state: locationState } = useContext(LocationContext);

  //LOCAL STATE SETUP
  const [houseNo, setHouseNo] = useState("");
  const [landmark, setLandmark] = useState("");
  const [usererror, setuserError] = useState("");
  const [restaurentError, setrestaurentError] = useState("");
  const [locationError, setlocationError] = useState("");
  const [landmarkError, setlandmarkError] = useState("");
  const [houseError, sethouseError] = useState("");
  const [cartError, setcartError] = useState("");
  const [orderSuccess, setOrderSuccess] = useState("");
  const [open, setOpen] = useState(false);
  const [open2, setOpen2] = useState(false);
  const [orderReq, setOrderReq] = useState(true);

  //PAYMENT DRAWER SETUP
  const [paymentOpen, setPaymentHandle] = useState(false);
  const handlePaymentClose = () => {
    setPaymentHandle(false);
  };

  const handleClose2 = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen2(false);
  };
  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };
  const mapContainer = useRef();
  // const location = JSON.parse(localStorage.getItem("location"));
  const token = localStorage.getItem("token");
  const refreshtoken = localStorage.getItem("refresh-token");
  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user ? user._id : "";

  const resturantId = route.params ? route.params.ResturantId : "";
  const [lng, setLng] = useState(locationState.longitude);
  const [lat, setLat] = useState(locationState.latitude);
  const [zoom, setZoom] = useState(9);

  useEffect(() => {
    const map = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v11",
      center: [lng, lat],
      zoom: zoom,
    });
    const nav = new mapboxgl.NavigationControl();
    map.addControl(nav);

    // if (location) {
    //   setLng(location.coords.longitude);
    //   setLat(location.coords.latitude);
    // }
    map.on("move", () => {
      setLng(map.getCenter().lng.toFixed(4));
      setLat(map.getCenter().lat.toFixed(4));
      setZoom(map.getZoom().toFixed(2));
    });

    map.addControl(
      new mapboxgl.GeolocateControl({
        positionOptions: {
          enableHighAccuracy: true,
        },
        trackUserLocation: true,
      })
    );
    return () => map.remove();
  }, []);

  const [responseError, setResponseError] = useState("");

  const makeOrder = () => {
    const cartItems = cartState?.cartItems?.cartItem.map(
      (item) => item.productId._id
    );
    const cartId = cartState?.cartItems?._id;
    console.log({
      cartId: cartState?.cartItems?._id,
      cartItems,
      price: cartState?.cartItems?.price,
      userId,
      resturantId,
      longitude: lng,
      latitude: lat,
      landmark: landmark,
      flatNo: houseNo,
    });
    if (!userId) {
      setuserError("Login First");
      setOpen2(true);
    } else if (!resturantId) {
      setrestaurentError("You have to order from a registered restaurent");
      setOpen2(true);
    } else if (!lng || !lat) {
      setlocationError(
        "!!OOPS... you have to select location before making order"
      );
      setOpen2(true);
    } else if (!landmark) {
      // setPaymentHandle(true);
      setlandmarkError(
        "!!OOPS... you have to select a landmark before making order"
      );
      setOpen2(true);
    } else if (!houseNo) {
      sethouseError(
        "!!OOPS... you have to select a house No. before making order"
      );
      setOpen2(true);
    } else if (!cartState.cartItems && cartId) {
      setcartError("you have to visit cart then checkout to make orders.");
      setOpen2(true);
    } else {
      setOrderReq(false);
      Axios.post(
        `${BASE_URL}/api/order/createorder`,
        {
          cartId: cartState?.cartItems?._id,
          cartItems,
          price: cartState?.cartItems?.price,
          userId,
          resturantId,
          longitude: lng,
          latitude: lat,
          landmark: landmark,
          flatNo: houseNo,
        },
        {
          headers: {
            "x-token": token,
            "x-refresh-token": refreshtoken,
          },
        }
      )
        .then((res) => {
          const { message, success } = res.data;
          Axios.get(`${BASE_URL}/api/order/getorder`, {
            headers: {
              "x-token": token,
              "x-refresh-token": refreshtoken,
            },
          })
            .then((response) => {
              const { order } = response.data;
              if (order.length !== 0) {
                orderDispatch({ type: "PLACE_MY_ORDER", payload: order });
                cartDispatch({ type: "CLEAR_CART" });
                success === true
                  ? setOrderSuccess(message)
                  : setOrderSuccess("Can't Place order");
                setHouseNo("");
                setLandmark("");
                setOrderReq(true);
                setOpen(true);
              }
            })
            .catch((err) => {
              console.log(err);
            });
          setPaymentHandle(true);
        })
        .catch((err) => {
          let txtmsg, successmsg;
          if (err.response && err.response.data) {
            const { message, success } = err.response.data;
            txtmsg = message;
            successmsg = success;
          }
          if (!successmsg) {
            setResponseError(
              "Can't Make order.. Check your cart and make order"
            );
            setOpen2(true);
            setOrderReq(true);
          }
          console.log(txtmsg, successmsg);
          console.log(err);
        });
    }
  };

  return (
    // eslint-disable-next-line react-native/no-inline-styles
    <View
      style={{
        flex: 1,
        backgroundColor: "#ffffff",
      }}>
      <View style={styles.v1}>
        <div className='sidebar'>
          Longitude: {lng} | Latitude: {lat} | Zoom: {zoom}
        </div>
        <div className='map-container' ref={mapContainer} />
      </View>
      <View style={styles.v2}>
        <ScrollView style={styles.v3}>
          <Input
            type='text'
            value={houseNo}
            onChangeText={(text) => {
              setHouseNo(text);
              setlandmarkError("");
              sethouseError("");
            }}
            placeholder='give your Flat No./House No.'
            label='House No.'
            errorMessage={houseError}
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
            type='text'
            value={landmark}
            onChangeText={(text) => {
              setLandmark(text);
              setlandmarkError("");
              sethouseError("");
            }}
            placeholder='give a nearest landmark'
            label='Nearest Landmark'
            errorMessage={landmarkError}
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
          {orderReq ? (
            <Button
              onPress={makeOrder}
              title='GIVE YOUR ORDER'
              raised
              buttonStyle={{
                backgroundColor: "#81d4fa",
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
            <View style={{ marginTop: 10 }}>
              <ActivityIndicator
                size='large'
                color='#00ff00'
                style={{
                  margin: "auto",
                }}
              />
            </View>
          )}

          <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
            <Alert
              onClose={handleClose}
              severity='success'
              style={{ textAlign: "center" }}>
              {orderSuccess}
            </Alert>
          </Snackbar>

          <Snackbar open={open2} autoHideDuration={6000} onClose={handleClose2}>
            <Alert
              onClose={handleClose2}
              severity='error'
              style={{ textAlign: "center" }}>
              {usererror
                ? usererror
                : restaurentError
                ? restaurentError
                : cartError
                ? cartError
                : locationError
                ? locationError
                : landmarkError
                ? landmarkError
                : houseError
                ? houseError
                : responseError}
            </Alert>
          </Snackbar>
        </ScrollView>
        <Paymentform
          open={paymentOpen}
          Transition={Transition}
          handleClose={handlePaymentClose}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  v2: {
    width: "100%",
    height: "40%",
  },
  v1: {
    width: "100%",
    height: "50%",
  },
  v3: {
    width: "100%",
    padding: 10,
    backgroundColor: "#ffffff",
  },
});
