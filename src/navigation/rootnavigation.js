import React, { useState, useEffect, useContext } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import { LocationContext } from "../context/locationcontext";
import loadable from "@loadable/component";
const Tabs = loadable(() => import("./tabs"));
import { Platform } from "react-native";
import Constants from "expo-constants";
import * as Location from "expo-location";
const Stack = createStackNavigator();
const Rootnavigation = () => {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  const { dispatch: locationDispatch } = useContext(LocationContext);

  useEffect(() => {
    (async () => {
      if (Platform.OS === "android" && !Constants.isDevice) {
        setErrorMsg(
          "Oops, this will not work on Snack in an Android emulator. Try it on your device!"
        );
        return;
      }
      let { status } = await Location.requestPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }

      let address = await Location.getCurrentPositionAsync({});
      setLocation(address);
      locationDispatch({
        type: "SET_LOCATION",
        payload: {
          latitude: address.coords.latitude,
          longitude: address.coords.longitude,
        },
      });
    })();
  }, []);

  let text = "Waiting..";
  if (errorMsg) {
    text = errorMsg;
  } else if (location) {
    text = JSON.stringify(location);
    console.log("location", text);
    localStorage.setItem("location", text);
  }
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
        initialRouteName={"Home"}>
        <Stack.Screen name='Home' component={Tabs} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Rootnavigation;
