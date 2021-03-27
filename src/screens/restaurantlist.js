import React from "react";
import { StyleSheet, Text, View, TouchableOpacity, Image } from "react-native";

const Restaurantlist = ({ item, selectedCategory }) => {
  return (
    <TouchableOpacity
      style={{
        padding: 10,
        paddingBottom: 20,
        backgroundColor: selectedCategory?.id === item.id ? "#616161" : "white",
        borderRadius: 30,
        alignItems: "center",
        justifyContent: "center",
        marginRight: 10,
        marginLeft: 10,
        boxShadow: "0px 4px 4px 0px #C9CCD1, 0px 0px 2px #C9CCD1",
        elevation: 2,
      }}
      // onPress={() => onSelectCategory(item)}
    >
      <View
        style={{
          width: 50,
          height: 50,
          borderRadius: 25,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor:
            selectedCategory?.id === item.id ? "#ffffff" : "#e0e0e0",
          boxShadow:
            selectedCategory?.id === item.id
              ? "3px 3px 3px #212121"
              : "3px 3px 3px #C9CCD1",
          elevation: 2,
        }}>
        <Image
          source={item.icon}
          resizeMode='contain'
          style={{
            width: 30,
            height: 30,
          }}
        />
      </View>

      <Text
        style={{
          marginTop: 10,
          color: selectedCategory?.id === item.id ? "#ffffff" : "black",
          fontWeight: "600",
        }}>
        {item.name}
      </Text>
    </TouchableOpacity>
  );
};

export default Restaurantlist;

const styles = StyleSheet.create({});
