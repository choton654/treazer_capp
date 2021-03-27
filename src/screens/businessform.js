import React, { useState, useContext } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Dimensions,
} from "react-native";
import { Icon, Input, CheckBox, Image } from "react-native-elements";
import * as ImagePicker from "expo-image-picker";
import Axios from "axios";
import BASE_URL from "../api";
import { RestaurentContext } from "../context/restaurentContext";
import { AuthContext } from "../context/userContext";
import { useNavigation } from "@react-navigation/native";
const { width, height } = Dimensions.get("window");

const Businessform = () => {
  const { dispatch: restaurentDispatch } = useContext(RestaurentContext);
  const { state: userState } = useContext(AuthContext);
  const navigation = useNavigation();
  const [sendReq, setSendReq] = useState(true);
  const [sendImgReq, setSendImgReq] = useState(true);

  // FORM DATA
  const [selfDelivery, setSelfDelivery] = useState(false);
  const [treazerDelivery, setTreazerDelivery] = useState(true);
  const [image, setImage] = useState(null);
  const [storeName, setStoreName] = useState("");
  const [storeLocation, setStoreLocation] = useState("");
  const [pinCode, setPinCode] = useState("");
  const [phoneNo, setPhoneNo] = useState("");
  const [deliveryPrice, setDeliveryPrice] = useState("");
  const addRestaurent = () => {
    console.log(
      storeName,
      storeLocation,
      pinCode,
      phoneNo,
      selfDelivery,
      treazerDelivery,
      deliveryPrice
      // image
    );

    const token = localStorage.getItem("token");
    const refreshtoken = localStorage.getItem("refresh-token");

    setSendReq(false);
    Axios.post(
      `${BASE_URL}/api/resturant/addresturant`,
      {
        resturant_name: storeName,
        address: storeLocation,
        pinCode,
        phone: phoneNo,
        coverPic: image,
        deliveryPrice,
        deliveryType: selfDelivery && "self",
      },
      {
        headers: {
          // Authorization: `Bearer ${token}`,
          "x-token": token,
          "x-refresh-token": refreshtoken,
        },
      }
    )
      .then((res) => {
        console.log(res.data);
        const { resturant } = res.data;
        restaurentDispatch({ type: "ADD_MY_RESTAURENT", payload: resturant });
        if (userState.user) {
          userState.user.role = "resturant-owner";
        }
        setStoreName("");
        setPhoneNo("");
        setStoreLocation("");
        setPinCode("");
        setImage(null);
        setDeliveryPrice("");
        setSendReq(true);
        navigation.navigate("User", {
          screen: "MyRestaurent",
          params: { id: resturant._id },
        });
      })
      .catch((err) => console.log(err));
  };
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
      base64: true,
    });
    console.log(result);
    if (!result.cancelled) {
      let data = {
        file: result.uri,
        upload_preset: "treazer",
        api_key: 224248336432978,
      };
      setSendImgReq(false);
      fetch("https://api.cloudinary.com/v1_1/toton007/image/upload", {
        body: JSON.stringify(data),
        headers: {
          "content-type": "application/json",
        },
        method: "POST",
      })
        .then((res) => res.json())
        .then((data) => {
          console.log(data.secure_url);
          setImage(data.secure_url);
          setSendImgReq(true);
        })
        .catch((err) => {
          console.log(err);
          alert("An Error Occured While Uploading");
        });
    }
  };

  return (
    <View style={styles.container}>
      <View
        style={{
          width: "100%",
          height: "95%",
          maxHeight: width <= 320 && height <= 500 ? 450 : 600,
          // paddingVertical: 20,
          // paddingHorizontal: 5,
          // maxHeight: "95%",
        }}>
        <ScrollView style={styles.div_1}>
          {image ? (
            <View>
              <Image
                source={{ uri: image }}
                containerStyle={{
                  width: "95%",
                  marginHorizontal: "auto",
                  height: 180,
                  borderRadius: 20,
                  boxShadow: "1px 3px 6px 1px #C9CCD1",
                  resizeMode: "contain",
                }}
              />
              <View
                style={{
                  position: "absolute",
                  flexDirection: "row",
                  right: 0,
                  background: "none",
                  width: 30,
                  marginRight: 20,
                  marginTop: 15,
                  height: 30,
                  alignItems: "center",
                  justifyContent: "center",
                }}>
                <TouchableOpacity onPress={() => setImage(null)}>
                  <Icon
                    name='times-circle'
                    type='font-awesome-5'
                    color='#ffffff'
                    size={26}
                    iconStyle={{
                      marginHorizontal: 10,
                    }}
                  />
                </TouchableOpacity>
              </View>
            </View>
          ) : sendImgReq ? (
            <TouchableOpacity style={styles.div_2} onPress={pickImage}>
              <View>
                <Icon
                  name='plus'
                  type='font-awesome-5'
                  color='#9e9e9e'
                  size={30}
                  iconStyle={{
                    marginTop: 20,
                  }}
                />
                <Text style={styles.text_1}>Add Cover Image Here</Text>
              </View>
            </TouchableOpacity>
          ) : (
            <View style={styles.div_2}>
              <ActivityIndicator
                size='large'
                color='#00ff00'
                style={{
                  margin: "auto",
                }}
              />
            </View>
          )}

          <View>
            <Input
              type='text'
              label='Store Name'
              value={storeName}
              onChangeText={(text) => setStoreName(text)}
              inputContainerStyle={{
                paddingHorizontal: 10,
                boxShadow: "1px 2px 4px 1px #C9CCD1",
                borderRadius: 20,
                height: 40,
              }}
              labelStyle={{
                paddingLeft: 10,
                marginVertical: 10,
              }}
              containerStyle={{
                marginTop: 20,
                width: "100%",
                marginHorizontal: "auto",
              }}
              inputStyle={{
                letterSpacing: 2,
                fontSize: 15,
                fontFamily: `-apple-system, BlinkMacSystemFont, Segoe UI, Helvetica, Arial, sans-serif, Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol`,
              }}
            />
            <Input
              type='text'
              label='Store Location'
              value={storeLocation}
              onChangeText={(text) => setStoreLocation(text)}
              multiline
              numberOfLines={4}
              inputContainerStyle={{
                paddingHorizontal: 10,
                boxShadow: "1px 2px 4px 1px #C9CCD1",
                borderRadius: 20,
                height: 85,
              }}
              labelStyle={{
                paddingLeft: 10,
                marginVertical: 10,
              }}
              containerStyle={{
                marginTop: 20,
                width: "100%",
                marginHorizontal: "auto",
              }}
              inputStyle={{
                letterSpacing: 2,
                fontSize: 15,
                fontFamily: `-apple-system, BlinkMacSystemFont, Segoe UI, Helvetica, Arial, sans-serif, Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol`,
              }}
            />
            <Input
              type='number'
              label='PIN Code'
              value={pinCode}
              onChangeText={(text) => setPinCode(text)}
              inputContainerStyle={{
                paddingHorizontal: 10,
                boxShadow: "1px 2px 4px 1px #C9CCD1",
                borderRadius: 20,
                height: 40,
              }}
              labelStyle={{
                paddingLeft: 10,
                marginVertical: 10,
              }}
              containerStyle={{
                marginTop: 20,
                width: "100%",
                marginHorizontal: "auto",
              }}
              inputStyle={{
                letterSpacing: 2,
                fontSize: 15,
                fontFamily: `-apple-system, BlinkMacSystemFont, Segoe UI, Helvetica, Arial, sans-serif, Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol`,
              }}
            />
            <Input
              type='tel'
              label='Phone No.'
              value={phoneNo}
              onChangeText={(text) => setPhoneNo(text)}
              inputContainerStyle={{
                paddingHorizontal: 10,
                boxShadow: "1px 2px 4px 1px #C9CCD1",
                borderRadius: 20,
                height: 40,
              }}
              labelStyle={{
                paddingLeft: 10,
                marginVertical: 10,
              }}
              containerStyle={{
                marginTop: 20,
                width: "100%",
                marginHorizontal: "auto",
              }}
              inputStyle={{
                letterSpacing: 2,
                fontSize: 15,
                fontFamily: `-apple-system, BlinkMacSystemFont, Segoe UI, Helvetica, Arial, sans-serif, Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol`,
              }}
            />
            <CheckBox
              title='Self Delivery'
              checked={selfDelivery}
              onPress={() => {
                setSelfDelivery(!selfDelivery);
                setTreazerDelivery(!treazerDelivery);
              }}
              containerStyle={{
                border: "none",
              }}
              fontFamily={`-apple-system, BlinkMacSystemFont, Segoe UI, Helvetica, Arial, sans-serif, Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol`}
            />
            <Input
              type='text'
              label='Add Quantity'
              value={deliveryPrice}
              onChangeText={(text) => setDeliveryPrice(text)}
              inputContainerStyle={{
                paddingHorizontal: 10,
                boxShadow: "1px 2px 4px 1px #C9CCD1",
                borderRadius: 20,
                height: 40,
                width: "100%",
                marginTop: 10,
              }}
              labelStyle={{
                paddingLeft: 10,
                // marginVertical: 10,
              }}
              containerStyle={{
                display: `${selfDelivery ? "block" : "none"}`,
                width: "50%",
                marginHorizontal: 20,
              }}
              inputStyle={{
                width: "50%",
                letterSpacing: 2,
                fontSize: 15,
                fontFamily: `-apple-system, BlinkMacSystemFont, Segoe UI, Helvetica, Arial, sans-serif, Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol`,
              }}
            />
            <CheckBox
              title='Treazer Delivery'
              checked={treazerDelivery}
              onPress={() => {
                setSelfDelivery(!selfDelivery);
                setTreazerDelivery(!treazerDelivery);
              }}
              containerStyle={{
                border: "none",
              }}
            />
          </View>
          {sendReq ? (
            <TouchableOpacity style={styles.button_1} onPress={addRestaurent}>
              <Text
                style={{
                  color: "#ffffff",
                  textShadow: "1px 0 #ffffff",
                  letterSpacing: 3,
                  marginVertical: 10,
                }}>
                Upgrade to business profile
              </Text>
            </TouchableOpacity>
          ) : (
            // <Backdrop className={classes.backdrop} open={sendReq}>
            //   <CircularProgress color="inherit" />
            // </Backdrop>
            <ActivityIndicator size='large' color='#00ff00' />
          )}

          <View
            style={{
              width: "100%",
              height: 10,
            }}></View>
        </ScrollView>
      </View>
    </View>
  );
};

export default Businessform;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#ffffff",
    flex: 1,
  },
  div_1: {
    marginHorizontal: "auto",
    marginVertical: 20,
    width: "95%",
    backgroundColor: "#fafafa",
    borderRadius: 20,
    padding: 10,
    boxShadow: "1px 2px 2px 1px #C9CCD1, -1px -2px 2px 1px #C9CCD1",
  },
  div_2: {
    width: "95%",
    marginHorizontal: "auto",
    height: 180,
    backgroundColor: "#eeeeee",
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
    borderRadius: 20,
    boxShadow: "1px 3px 6px 1px #C9CCD1",
  },
  text_1: {
    marginVertical: 10,
    color: "#9e9e9e",
    letterSpacing: 1,
    fontSize: 20,
    textShadow: "1px 0 #e0e0e0",
  },
  button_1: {
    marginHorizontal: "auto",
    marginVertical: 20,
    width: "100%",
    height: 40,
    borderRadius: 20,
    textAlign: "center",
    backgroundColor: "#29b6f6",
    boxShadow: "1px 3px 6px 1px #C9CCD1",
  },
});

// "expo-image-picker": "~9.2.0",
