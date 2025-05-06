// reducers/authReducer.js
const initialState = {
  user: null,
  isAuthenticated: false,
};

const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case "SET_USER":
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
      };
    case "LOGOUT_USER":
      return {
        ...state,
        user: null,
        isAuthenticated: false,
      };
    case "RESET_STATE":
      return initialState; // Resets state completely to initial state
    default:
      return state;
  }
};

export default authReducer;
