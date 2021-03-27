import React from "react";
import { Text, View, TouchableOpacity } from "react-native";
import Searchbar from "./searchbar";
import { useNavigation } from "@react-navigation/native";
import { Icon } from "react-native-elements";
const Header = () => {
  const navigation = useNavigation();
  return (
    <View style={{ flexDirection: "column", backgroundColor: "#ffffff" }}>
      <View
        style={{
          coureser: "pointer",
          flexDirection: "row",
          height: 50,
          backgroundColor: "white",
        }}>
        <View
          style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
          <View
            style={{
              width: "70%",
              height: "100%",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 20,
            }}>
            <Text
              style={{
                fontWeight: "800",
                color: "#4A5568",
                fontSize: 30,
                fontFamily: "Chango",
                letterSpacing: 5,
              }}>
              <i>Treazer</i>{" "}
            </Text>
          </View>
        </View>

        <TouchableOpacity
          onPress={() => navigation.navigate("UserLocation")}
          style={{
            width: 50,
            paddingRight: 20,
            justifyContent: "center",
          }}>
          <Icon
            name='map-marker-alt'
            type='font-awesome-5'
            color='#424242'
            size={24}
          />
        </TouchableOpacity>
      </View>
      <View
        style={{
          marginBottom: 5,
          width: "100%",
          background: "none",
        }}>
        <Searchbar />
      </View>
    </View>
  );
};

export default Header;

// const styles = StyleSheet.create({});
