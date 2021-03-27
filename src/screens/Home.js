import React, { useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  View,
  StyleSheet,
  Image,
  FlatList,
  Animated,
  Dimensions,
} from "react-native";
import Header from "./header";
import Restaurantlist from "./restaurantlist";
import Restaurantcard from "./restaurantcard";
import { icons } from "../constants";
const { width, height } = Dimensions.get("window");
const Home = ({ navigation }) => {
  const scrollX = new Animated.Value(0);
  const categoryData = [
    {
      id: 1,
      name: "Rice",
      icon: icons.rice_bowl,
    },
    {
      id: 2,
      name: "Noodles",
      icon: icons.noodle,
    },
    {
      id: 3,
      name: "Hot Dogs",
      icon: icons.hotdog,
    },
    {
      id: 4,
      name: "Salads",
      icon: icons.salad,
    },
    {
      id: 5,
      name: "Burgers",
      icon: icons.hamburger,
    },
    {
      id: 6,
      name: "Pizza",
      icon: icons.pizza,
    },
    {
      id: 7,
      name: "Snacks",
      icon: icons.fries,
    },
    {
      id: 8,
      name: "Sushi",
      icon: icons.sushi,
    },
    {
      id: 9,
      name: "Desserts",
      icon: icons.donut,
    },
    {
      id: 10,
      name: "Drinks",
      icon: icons.drink,
    },
  ];
  const [selectedCategory, setSelectedCategory] = useState(null);

  const onSelectCategory = (category) => {
    //filter restaurant
    let restaurantList = restaurantData.filter((a) =>
      a.categories.includes(category.id)
    );

    setRestaurants(restaurantList);

    setSelectedCategory(category);
  };

  const renderHeader = () => {
    return <Header />;
  };

  function renderMainCategories() {
    const images = [
      require("../assets/images/Benefits-of-the-online-food-ordering-system.png"),
      require("../assets/images/preview.jpg"),
    ];

    const renderItem = ({ item }) => {
      return (
        <Restaurantlist
          item={item}
          onSelectCategory={onSelectCategory}
          selectedCategory={selectedCategory}
        />
      );
    };

    return (
      <View
        style={{
          paddingHorizontal: 20,
          paddingVertical: 10,
          backgroundColor: "#ffffff",
          height: 300,
          flexGrow: 0,
        }}>
        <View
          style={{
            flexDirection: "row",
            height: "50%",
            maxHeight: "200px",
            width: "100%",
            marginTop: 10,
          }}>
          <Animated.ScrollView
            style={{
              width,
              height: "100%",
              boxShadow: "0px 4px 4px 0px #C9CCD1",
              elevation: 2,
              borderRadius: 30,
            }}
            horizontal
            pagingEnabled
            scrollEventThrottle={16}
            snapToAlignment='center'
            showsHorizontalScrollIndicator={false}
            onScroll={Animated.event(
              [{ nativeEvent: { contentOffset: { x: scrollX } } }],
              { useNativeDriver: false }
            )}>
            {images.map((item, idx) => (
              <Image
                key={idx}
                source={item}
                style={{
                  height: "100%",
                  width,
                  borderRadius: 10,
                  resizeMode: "cover",
                }}
              />
            ))}
          </Animated.ScrollView>
          {/* <ScrollView
            pagingEnabled
            horizontal
            onScroll={changePic}
            style={{ width, height: "100%" }}
            showsHorizontalScrollIndicator={false}
          >
            {images.map((item, idx) => (
              <Image
                key={idx}
                source={item}
                style={{
                  height: "100%",
                  width,
                  borderRadius: 10,
                  resizeMode: "cover",
                }}
              />
            ))}
          </ScrollView> */}
          {/* <View
            style={{
              width: "100%",
              position: "absolute",
              bottom: 0,
              justifyContent: "space-evenly",
              alignItems: "center",
              flexDirection: "row",
            }}
          >
            {images.map((i, idx) => (
              <Text
                key={idx}
                style={{ color: "#212121", border: "none", margin: 1 }}
              >
                ⚪
              </Text>
            ))}
          </View> */}
        </View>

        <FlatList
          data={categoryData}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => `${item.id}`}
          renderItem={renderItem}
          style={{ flexGrow: 0 }}
          contentContainerStyle={{
            marginTop: 5,
            paddingTop: 10,
            paddingBottom: 10,
            height: 120,
          }}
        />
      </View>
    );
  }

  return (
    <SafeAreaView
      style={{ backgroundColor: "#ffffff", marginBottom: 5, flex: 1 }}>
      {renderHeader()}
      <View
        style={{
          width: "100%",
          height: "80%",
          maxHeight: width <= 320 && height <= 500 ? 450 : 700,
        }}>
        <ScrollView style={styles.container}>
          {renderMainCategories()}
          <View
            style={{
              backgroundColor: "#ffffff",
              paddingHorizontal: 20,
              marginTop: 10,
              marginBottom: 180,
            }}>
            <Restaurantcard />
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
    maxHeight: 700,
  },
  shadow: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 1,
  },
});

export default Home;
