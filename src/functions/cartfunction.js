import BASE_URL from "../api";
import Axios from "axios";

const getCartItems = (id, cartDispatch) => {
  Axios.get(`${BASE_URL}/api/cart/${id}/getcart`)
    .then((res) => {
      const { cart } = res.data;
      console.log(cart);
      cartDispatch({ type: "ADD_CART_ITEMS", payload: cart });
    })
    .catch((err) => console.log(err));
};

const addTocart = (
  productId,
  price,
  userState,
  setOpen2,
  setLoading,
  user,
  cartDispatch,
  token,
  refreshtoken,
  setReplaceOrderReq,
  handleClose
) => {
  if (!userState.isLogin) {
    setOpen2(true);
  } else {
    setLoading(false);
    Axios.post(
      `${BASE_URL}/api/cart/${user._id}/addcart`,
      { productId, price },
      {
        headers: {
          // Authorization: `Bearer ${token}`,
          "x-token": token,
          "x-refresh-token": refreshtoken,
        },
      }
    )
      .then((res) => {
        const { newCart, success } = res.data;
        console.log(newCart, success);
        cartDispatch({ type: "ADD_TO_CART", payload: newCart });
        setLoading(true);
        if (setReplaceOrderReq !== undefined && handleClose !== undefined) {
          setReplaceOrderReq(true);
          handleClose();
        }
        getCartItems(user._id, cartDispatch);
      })
      .catch((err) => console.log(err));
  }
};

const removeFromCart = (
  productId,
  price,
  userState,
  setOpen2,
  setLoading,
  user,
  cartDispatch,
  token,
  refreshtoken
) => {
  if (!userState.isLogin) {
    setOpen2(true);
  } else {
    setLoading(false);
    Axios.post(
      `${BASE_URL}/api/cart/${user._id}/removeitem`,
      { productId, price },
      {
        headers: {
          // Authorization: `Bearer ${token}`,
          "x-token": token,
          "x-refresh-token": refreshtoken,
        },
      }
    )
      .then((res) => {
        const { cart } = res.data;
        cartDispatch({ type: "REMOVE_FROM_CART", payload: cart });
        setLoading(true);
        getCartItems(user._id, cartDispatch);
      })
      .catch((err) => console.log(err));
  }
};

export { getCartItems, addTocart, removeFromCart };
