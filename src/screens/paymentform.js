import React from "react";
import { StyleSheet, Text, View } from "react-native";
import Dialog from "@material-ui/core/Dialog";
import { PricingCard, Button } from "react-native-elements";
import Axios from "axios";
import BASE_URL from "../api";
const Paymentform = ({ open, Transition, handleClose }) => {
  const handlePay = () => {
    const amount = 100;
    Axios.post(`${BASE_URL}/api/order/payment`, { amount })
      .then((res) => {
        console.log(res.data);
        const options = {
          description: "Credits towards consultation",
          image: "https://i.imgur.com/3g7nmJC.png",
          currency: res.data.currency,
          key: "rzp_test_CDdnUrt3mxVUy5",
          amount: res.data.amount,
          name: "Acme Corp",
          order_id: res.data.order_id, //Replace this with an order_id created using Orders API. Learn more at https://razorpay.com/docs/api/orders.
          prefill: {
            email: "gaurav.kumar@example.com",
            contact: "9191919191",
            name: "Gaurav Kumar",
          },
          theme: { color: "#53a20e" },
        };
        const rzp1 = new Razorpay(options);
        rzp1
          .open(options)
          .then((data) => {
            // handle success
            alert(`Success: ${data.razorpay_payment_id}`);
          })
          .catch((error) => {
            // handle failure
            console.log(error);
            alert(`Error: ${error.code} | ${error.description}`);
          });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      TransitionComponent={Transition}
      keepMounted
      style={{ border: "2px solid black" }}>
      <PricingCard
        color='#4f9deb'
        title='Free'
        price='$0'
        info={["1 User", "Basic Support", "All Core Features"]}
        button={
          <Button
            onPress={handlePay}
            title='PAY ONLINE'
            raised
            buttonStyle={{
              backgroundColor: "#4fc3f7",
              width: "100%",
              borderRadius: 10,
            }}
            containerStyle={{
              marginVertical: 10,
              width: "100%",
              marginHorizontal: "auto",
              borderRadius: 10,
              border: "none",
              boxShadow: "3px 4px 6px #C9CCD1, -3px -4px 6px #ffffff",
            }}
            titleStyle={{
              fontSize: 12,
              textShadow: "1px 0 #ffffff",
              fontWeight: "400",
              letterSpacing: 3,
              fontFamily: "Roboto Slab",
            }}
          />
        }
      />
    </Dialog>
  );
};

export default Paymentform;

const styles = StyleSheet.create({});
