// actions/authActions.js
export const setUser = (user) => ({
  type: "SET_USER",
  payload: user,
});

export const logoutUser = () => ({
  type: "LOGOUT_USER",
});

export const resetState = () => ({
  type: "RESET_STATE",
});
