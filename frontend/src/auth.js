const key_token = "TOKEN";
const key_uid = "USER_ID";
const key_te = "TOKEN_EXPI";
export const login = ({ token, userId, tokenExp }) => {
  localStorage.setItem(key_token, token);
  localStorage.setItem(key_uid, userId);
  localStorage.setItem(key_te, tokenExp);
};
export const getAuth = () => {
  return {
    token: localStorage.getItem(key_token) || "",
    userId: localStorage.getItem(key_uid) || "",
    tokenExp: Number(localStorage.getItem(key_te)) || 0
  };
};
export const isLogin = () => {
  return !!localStorage.getItem("TOKEN");
};
export const authListener = () => {
  window.onstorage = evt => {
    console.log(evt);
  };
};
