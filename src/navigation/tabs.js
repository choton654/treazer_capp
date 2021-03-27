import React, { useContext, useEffect } from "react";
import { View, TouchableOpacity } from "react-native";
import { Icon, Badge } from "react-native-elements";
import {
  createBottomTabNavigator,
  BottomTabBar,
} from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import { AuthContext } from "../context/userContext";
import { CartContext } from "../context/cartContext";
import Svg, { Path } from "react-native-svg";
// import { isIphoneX } from "react-native-iphone-x-helper";
import loadable from "@loadable/component";
const Home = loadable(() => import("../screens/Home"));
const Profile = loadable(() => import("../screens/profile"));
const ProfileBio = loadable(() => import("../screens/ProfileBio"));
const Cart = loadable(() => import("../screens/cart"));
const Additems = loadable(() => import("../screens/Additems"));
const Notification = loadable(() => import("../screens/notification"));
const Foodlist = loadable(() => import("../screens/foodlist"));
const SingleRestaurent = loadable(() => import("../screens/singleRestaurent"));
const Businessform = loadable(() => import("../screens/businessform"));
const MyRestaurent = loadable(() => import("../screens/myrestaurent"));
const Myrestaurentfoodlist = loadable(() =>
  import("../screens/myrestaurentfoodlist")
);
const OrderDelivery = loadable(() => import("../screens/OrderDelivery"));
const MapPage = loadable(() => import("../screens/map"));
const Emptycartscreen = loadable(() => import("../screens/emptycartscreen"));
const Emptyfoodaddscreen = loadable(() =>
  import("../screens/emptyfoodaddscreen")
);
const Orderist = loadable(() => import("../screens/orderist"));

import { getCartItems } from "../functions/cartfunction";
const Tab = createBottomTabNavigator();
const HomeStack = createStackNavigator();
const ProfileStack = createStackNavigator();
const CartStack = createStackNavigator();
const FoodFormStack = createStackNavigator();

const HomeStackScreen = () => {
  return (
    <HomeStack.Navigator
      screenOptions={{
        headerShown: false,
      }}
      initialRouteName={"Index"}>
      <HomeStack.Screen name='Index' component={Home} />
      <HomeStack.Screen name='Menu' component={Foodlist} />
      <HomeStack.Screen name='Restaurant' component={SingleRestaurent} />
      <HomeStack.Screen name='Location' component={OrderDelivery} />
      <HomeStack.Screen name='UserLocation' component={MapPage} />
    </HomeStack.Navigator>
  );
};

const ProfileStackScreen = () => {
  const { state } = useContext(AuthContext);
  return (
    <ProfileStack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      {!state.isLogin ? (
        <ProfileStack.Screen name='Login' component={Profile} />
      ) : (
        <ProfileStack.Screen name='Profile' component={ProfileBio} />
      )}
      <ProfileStack.Screen name='BusinessForm' component={Businessform} />
      <ProfileStack.Screen name='MyRestaurent' component={MyRestaurent} />
      <ProfileStack.Screen name='My-Menu' component={Myrestaurentfoodlist} />
      <ProfileStack.Screen name='My-Order' component={Orderist} />
    </ProfileStack.Navigator>
  );
};

const CartStackScreen = () => {
  const { state, dispatch } = useContext(CartContext);
  const user = JSON.parse(localStorage.getItem("user"));
  const id = user && user._id;
  useEffect(() => {
    if (id !== null) {
      getCartItems(id, dispatch);
    }
  }, [id]);
  return (
    <CartStack.Navigator
      screenOptions={{
        headerShown: false,
      }}
      initialRouteName={"Cart-Item"}>
      {state &&
      state.cartItems !== null &&
      state.cartItems.cartItem.length !== 0 &&
      state.cartItems.userId.toString() === id.toString() ? (
        <CartStack.Screen name='Cart-Item' component={Cart} />
      ) : (
        <CartStack.Screen name='Empty-Cart' component={Emptycartscreen} />
      )}
    </CartStack.Navigator>
  );
};

const FoodFormStackScreen = () => {
  const { state } = useContext(AuthContext);
  const user = JSON.parse(localStorage.getItem("user"));
  const restaurentId = user ? user.resturantId : undefined;
  return (
    <FoodFormStack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      {!state.isLogin || restaurentId === undefined ? (
        <FoodFormStack.Screen
          name='Emptyfoodaddscreen'
          component={Emptyfoodaddscreen}
        />
      ) : (
        <FoodFormStack.Screen name='AddFood' component={Additems} />
      )}
    </FoodFormStack.Navigator>
  );
};
const TabBarCustomButton = ({ accessibilityState, children, onPress }) => {
  var isSelected = accessibilityState.selected;

  if (isSelected) {
    return (
      <View style={{ flex: 1, alignItems: "center" }}>
        <View style={{ flexDirection: "row", position: "absolute", top: 0 }}>
          <Svg width={75} height={0} viewBox='0 0 75 0'>
            <Path
              d='M75.2 0v61H0V0c4.1 0 7.4 3.1 7.9 7.1C10 21.7 22.5 33 37.7 33c15.2 0 27.7-11.3 29.7-25.9.5-4 3.9-7.1 7.9-7.1h-.1z'
              fill='#ffffff'
            />
          </Svg>
        </View>
        <TouchableOpacity
          style={{
            top: -22.5,
            justifyContent: "center",
            alignItems: "center",
            width: 50,
            height: 50,
            borderRadius: 25,
            backgroundColor: "#00A7FF",
          }}
          onPress={onPress}>
          {children}
        </TouchableOpacity>
      </View>
    );
  } else {
    return (
      <TouchableOpacity
        style={{
          flex: 1,
          height: 49,
          backgroundColor: "white",
        }}
        activeOpacity={1}
        onPress={onPress}>
        {children}
      </TouchableOpacity>
    );
  }
};

const CustomTabBar = (props) => {
  return <BottomTabBar {...props.props} />;
};

const Tabs = () => {
  const { state: cartState, dispatch } = useContext(CartContext);

  return (
    <Tab.Navigator
      tabBarOptions={{
        showLabel: false,
        style: {
          position: "absolute",
          left: 0,
          bottom: 0,
          right: 0,
          borderTopWidth: 0,
          backgroundColor: "transparent",
          elevation: 0,
        },
      }}
      tabBar={(props) => <CustomTabBar props={props} />}>
      <Tab.Screen
        name='Home'
        component={HomeStackScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <Icon
              solid={true}
              name='house-user'
              type='font-awesome-5'
              color={`${focused ? "#ffffff" : "#00A7FF"}`}
              size={26}
            />
          ),
          tabBarButton: (props) => <TabBarCustomButton {...props} />,
        }}
      />

      <Tab.Screen
        name='Cart'
        component={CartStackScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <View>
              <Icon
                solid={true}
                name='shopping-basket'
                type='font-awesome-5'
                color={`${focused ? "#ffffff" : "#00A7FF"}`}
                size={26}
              />
              {cartState && cartState.cartItems && (
                <Badge
                  status='error'
                  value={cartState.cartItems.cartItem.length}
                  containerStyle={{ position: "absolute", top: -4, right: -4 }}
                />
              )}
            </View>
          ),
          tabBarButton: (props) => <TabBarCustomButton {...props} />,
        }}
      />
      <Tab.Screen
        name='AddItem'
        component={FoodFormStackScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <Icon
              name='plus-square'
              type='font-awesome-5'
              color={`${focused ? "#ffffff" : "#00A7FF"}`}
              size={30}
            />
          ),
          tabBarButton: (props) => <TabBarCustomButton {...props} />,
        }}
      />
      <Tab.Screen
        name='Notification'
        component={Notification}
        options={{
          tabBarIcon: ({ focused }) => (
            <Icon
              solid={true}
              name='bell'
              type='font-awesome-5'
              color={`${focused ? "#ffffff" : "#00A7FF"}`}
              size={26}
            />
          ),
          tabBarButton: (props) => <TabBarCustomButton {...props} />,
        }}
      />

      <Tab.Screen
        name='User'
        component={ProfileStackScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <Icon
              solid={true}
              name='user-alt'
              type='font-awesome-5'
              color={`${focused ? "#ffffff" : "#00A7FF"}`}
              size={26}
            />
          ),
          tabBarButton: (props) => <TabBarCustomButton {...props} />,
        }}
      />
    </Tab.Navigator>
  );
};

export default Tabs;
