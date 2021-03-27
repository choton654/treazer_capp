export const initialState = {
  singleRestaurent: null,
  myRestaurent: null,
  allRestaurent: null,
  error: null,
};

export const reducer = (state, action) => {
  switch (action.type) {
    case "ADD_RESTAURENT":
      return {
        ...state,
        singleRestaurent: action.payload,
      };
    case "GET_ALL_RESTAURENT":
      return {
        ...state,
        allRestaurent: action.payload,
      };
    case "ADD_MY_RESTAURENT":
      return {
        ...state,
        myRestaurent: action.payload,
        allRestaurent: [...state.allRestaurent, action.payload],
      };
    case "ADD_ONLY_MY_RESTAURENT":
      return {
        ...state,
        myRestaurent: action.payload,
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
