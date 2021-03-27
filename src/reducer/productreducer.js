export const initialState = {
  restaurentProducts: null,
  myrestaurentProducts: [],
  error: null,
};

export const reducer = (state, action) => {
  switch (action.type) {
    case "GET_RESTAURENT_PRODUCTS":
      return {
        ...state,
        restaurentProducts: action.payload,
      };
    case "ADD_MY_RESTAURENT_PRODUCT":
      return {
        ...state,
        myrestaurentProducts: [...state.myrestaurentProducts, action.payload],
      };
    case "GET_MY_RESTAURENT_PRODUCTS":
      return {
        ...state,
        myrestaurentProducts: action.payload,
      };
    case "FILTER_RESTAURENT":
      return {
        ...state,
        singleRestaurent: state.allRestaurent.filter(
          (item) => item._id.toString() === action.payload.toString()
        ),
      };
    case "ADD_ADDRESS":
      return {
        ...state,
        user: action.payload,
      };
    case "USER_ERROR":
      return {
        ...state,
        error: action.payload,
      };
    default:
      break;
  }
};
