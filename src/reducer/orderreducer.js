export const initialState = {
  myOrder: null,
  myRestaurentOrder: null,
};

export const reducer = (state, action) => {
  switch (action.type) {
    case "PLACE_MY_ORDER":
      return {
        ...state,
        myOrder: action.payload,
      };
  }
};
