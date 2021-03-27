export const initialState = {
  latitude: null,
  longitude: null,
};

export const reducer = (state, action) => {
  if (action.type === "SET_LOCATION") {
    return {
      ...state,
      latitude: action.payload.latitude,
      longitude: action.payload.longitude,
    };
  }
};
