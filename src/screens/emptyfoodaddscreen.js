import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Image, Button } from "react-native-elements";
const Emptyfoodaddscreen = () => {
  const navigation = useNavigation();
  return (
    <View style={{ flex: 1, backgroundColor: "#ffffff" }}>
      <View
        style={{
          justifyContent: "center",
          alignItems: "center",
          height: "100%",
        }}>
        <Image
          source={{
            // uri: "https://wallpaper.dog/large/20399371.jpg",
            uri:
              "https://thumbs.dreamstime.com/z/boy-who-eating-nutritious-food-milk-fruit-cartoon-188286828.jpg",
          }}
          style={{
            marginBottom: 10,
            width: 200,
            height: 200,
            resizeMode: "cover",
          }}
        />
        <Text
          style={{
            marginTop: 20,
            marginBottom: 10,
            fontSize: 15,
            letterSpacing: 1,
            fontWeight: "600",
            fontFamily: "Open Sans",
          }}>
          !!OOPS YOU ARE NOT LOGGED IN
        </Text>
        <Text
          style={{
            marginTop: 10,
            color: "#90a4ae",
            fontSize: 13,
            letterSpacing: 1,
            fontWeight: "400",
            fontFamily: "Open Sans",
          }}>
          Login first
        </Text>
        <Text
          style={{
            marginBottom: 10,
            color: "#90a4ae",
            fontSize: 13,
            letterSpacing: 1,
            fontWeight: "400",
            fontFamily: "Open Sans",
          }}>
          to create dish for your customers
        </Text>
        <Button
          onPress={() => navigation.navigate("User", { screen: "Login" })}
          title='LOGIN FIRST'
          type='outline'
          buttonStyle={{
            backgroundColor: "#ffffff",
            borderRadius: 10,
          }}
          containerStyle={{
            marginVertical: 10,
            width: "70%",
            marginHorizontal: "auto",
            borderRadius: 10,
            border: "none",
            boxShadow: "3px 4px 6px #C9CCD1, -3px -4px 6px #ffffff",
          }}
          titleStyle={{
            fontSize: 13,
            textShadow: "1px 0 #ffffff",
            fontWeight: "600",
            letterSpacing: 3,
            fontFamily: "Roboto Slab",
          }}
        />
      </View>
    </View>
  );
};

export default Emptyfoodaddscreen;

const styles = StyleSheet.create({});
