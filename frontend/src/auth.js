const key_token = "TOKEN";
const key_uid = "USER_ID";
const key_login_ts = "LOGIN_TS";
const key_te = "TOKEN_EXPI";
export const login = ({ token, userId, tokenExp }) => {
  localStorage.setItem(key_token, token);
  localStorage.setItem(key_uid, userId);
  localStorage.setItem(key_te, tokenExp);
};
export const logout = () => {
  localStorage.removeItem(key_token);
};
export const getAuth = () => {
  return {
    token: localStorage.getItem(key_token) || "",
    userId: localStorage.getItem(key_uid) || "",
    tokenExp: Number(localStorage.getItem(key_te)) || 0
  };
};
export const isLogin = () => {
  const cts = new Date().getTime();
  const sts = Number(localStorage.getItem(key_login_ts) || 0);
  const dur = cts - sts;
  return !!localStorage.getItem(key_token) && dur < 24 * 60 * 60 * 1000;
};
export const updateExp = () => {
  const cts = new Date().getTime();
  localStorage.setItem(key_login_ts, cts);
};
export const storageListener = () => {
  window.onstorage = evt => {
    console.log("storage", evt);
  };
};
