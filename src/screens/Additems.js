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
import { Picker } from "@react-native-picker/picker";
import { Icon, Input, CheckBox, Image } from "react-native-elements";
import * as ImagePicker from "expo-image-picker";
import Axios from "axios";
import BASE_URL from "../api";
import { ProductContext } from "../context/productcontext";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";
// import { useNavigation } from "@react-navigation/native";
const { width, height } = Dimensions.get("window");
function Alert(props) {
  return <MuiAlert elevation={6} variant='filled' {...props} />;
}

const Additems = () => {
  // const navigation = useNavigation();
  const { dispatch: productDispatch } = useContext(ProductContext);
  const [sendImgReq, setSendImgReq] = useState(true);
  const [image, setImage] = useState(null);
  const [isVeg, setIsVeg] = useState(false);
  const [isNonVeg, setIsNonVeg] = useState(true);
  const [dishName, setDishName] = useState("");
  const [dishQuantity, setDishQuantity] = useState("");
  const [dishType, setDishType] = useState("Rice");
  const [dishPrice, setDishPrice] = useState("");
  const [aboutDish, setAboutDish] = useState("");
  const [open2, setOpen2] = useState(false);
  const [foodReq, setFoodReq] = useState(true);
  const handleClose2 = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen2(false);
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

  const user = JSON.parse(localStorage.getItem("user"));
  const resturantId = user && user.resturantId;
  const token = localStorage.getItem("token");
  const refreshtoken = localStorage.getItem("refresh-token");

  const addDish = () => {
    console.log(
      isVeg,
      isNonVeg,
      dishName,
      dishQuantity,
      dishType,
      dishPrice,
      aboutDish
    );
    setFoodReq(false);
    Axios.post(
      `${BASE_URL}/api/product/addproduct`,
      {
        name: dishName,
        description: aboutDish,
        resturantId,
        price: dishPrice,
        category: dishType,
        photo: image,
        veg: isVeg ? "Yes" : "No",
        quantity: dishQuantity,
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
        const { product } = res.data;
        console.log(product);
        productDispatch({
          type: "ADD_MY_RESTAURENT_PRODUCT",
          payload: product,
        });
        setDishName("");
        setDishPrice("");
        setDishQuantity("");
        setImage(null);
        setAboutDish("");
        setOpen2(true);
        setFoodReq(true);
        // navigation.navigate("User", { screen: "Profile" });
      })
      .catch((err) => console.log(err));
  };

  return (
    <View style={styles.container}>
      <View
        style={{
          width: "100%",
          height: "100%",
          maxHeight: width <= 320 && height <= 500 ? 450 : 600,
          paddingVertical: 20,
          paddingHorizontal: 5,
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
              <Icon
                name='plus'
                type='font-awesome-5'
                color='#9e9e9e'
                size={30}
                iconStyle={{
                  marginTop: 20,
                }}
              />
              <Text style={styles.text_1}>Add Product Image Here</Text>
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
              label='Name of your dish'
              value={dishName}
              onChangeText={(text) => setDishName(text)}
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
            <Picker
              selectedValue={dishType}
              onValueChange={(itemValue, itemIndex) => setDishType(itemValue)}
              style={{
                marginTop: 20,
                width: "95%",
                height: 40,
                borderRadius: 20,
                marginHorizontal: "auto",
                boxShadow: "1px 2px 4px 1px #C9CCD1",
                paddingVertical: 10,
                paddingHorizontal: 10,
                background: "#f5f5f5",
                border: "none",
                color: "#757575",
                fontWeight: "bold",
                letterSpacing: 2,
                fontSize: 15,
                fontFamily: `-apple-system, BlinkMacSystemFont, Segoe UI, Helvetica, Arial, sans-serif, Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol`,
              }}>
              <Picker.Item label='Rice' value='Rice' />
              <Picker.Item label='Noodles' value='Noodles' />
              <Picker.Item label='Tandoor' value='Tandoor' />
              <Picker.Item label='Fast Food' value='Fast Food' />
              <Picker.Item label='Mughlai' value='Mughlai' />
              <Picker.Item label='Chinese' value='Chinese' />
              <Picker.Item label='Thali' value='Thali' />
              <Picker.Item label='Cake' value='Cake' />
              <Picker.Item label='Desserts' value='Desert' />
              <Picker.Item label='Others...' value='Others' />
            </Picker>
            <Input
              label='Add Quantity'
              value={dishQuantity}
              onChangeText={(text) => setDishQuantity(text)}
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
              label='Price of your dish'
              value={dishPrice}
              onChangeText={(text) => setDishPrice(text)}
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
                marginVertical: 20,
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
              title='Veg'
              checked={isVeg}
              onPress={() => {
                setIsVeg(!isVeg);
                setIsNonVeg(!isNonVeg);
              }}
              containerStyle={
                {
                  // border: "none",
                }
              }
              fontFamily={`-apple-system, BlinkMacSystemFont, Segoe UI, Helvetica, Arial, sans-serif, Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol`}
            />
            <CheckBox
              title='Non-veg'
              checked={isNonVeg}
              onPress={() => {
                setIsVeg(!isVeg);
                setIsNonVeg(!isNonVeg);
              }}
              containerStyle={
                {
                  // border: "none",
                }
              }
              fontFamily={`-apple-system, BlinkMacSystemFont, Segoe UI, Helvetica, Arial, sans-serif, Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol`}
            />
            <Input
              label='Description of the dish'
              value={aboutDish}
              onChangeText={(text) => setAboutDish(text)}
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
          </View>
          {foodReq ? (
            <TouchableOpacity style={styles.button_1} onPress={addDish}>
              <Text
                style={{
                  color: "#ffffff",
                  textShadow: "1px 0 #ffffff",
                  letterSpacing: 3,
                  marginVertical: 10,
                }}>
                Add Dish
              </Text>
            </TouchableOpacity>
          ) : (
            <ActivityIndicator
              size='large'
              color='#00ff00'
              style={{
                margin: "auto",
              }}
            />
          )}
          <Snackbar open={open2} autoHideDuration={6000} onClose={handleClose2}>
            <Alert onClose={handleClose2} severity='success'>
              New food is added to menu
            </Alert>
          </Snackbar>
          <View style={{ width: "100%", height: 10 }}></View>
        </ScrollView>
      </View>
    </View>
  );
};

export default Additems;

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
    height: "20%",
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
    width: "80%",
    height: 40,
    borderRadius: 20,
    textAlign: "center",
    backgroundColor: "#29b6f6",
    boxShadow: "1px 3px 6px 1px #C9CCD1",
  },
});
