import React from "react";
import Rootnavigation from "./src/navigation/rootnavigation";
import { UserContextProvider } from "./src/context/userContext";
import { RestaurentContextProvider } from "./src/context/restaurentContext";
import { ProductContextProvider } from "./src/context/productcontext";
import { CartContextProvider } from "./src/context/cartContext";
import { LocationContextProvider } from "./src/context/locationcontext";
import { OrderContextProvider } from "./src/context/ordercontext";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StylesProvider } from "@material-ui/styles";

export default function App() {
  return (
    <StylesProvider injectFirst>
      <SafeAreaProvider>
        <OrderContextProvider>
          <LocationContextProvider>
            <CartContextProvider>
              <ProductContextProvider>
                <RestaurentContextProvider>
                  <UserContextProvider>
                    <Rootnavigation />
                  </UserContextProvider>
                </RestaurentContextProvider>
              </ProductContextProvider>
            </CartContextProvider>
          </LocationContextProvider>
        </OrderContextProvider>
      </SafeAreaProvider>
    </StylesProvider>
  );
}
