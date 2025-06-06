// The API server can be customized by setting the environment variable
// `REACT_APP_CUSTOM_SERVER_URL` when building the React application.
// This allows the frontend to talk to a server exposed via a public URL
// (for example when using ngrok).  Create a `.env` file in the `public`
// directory with `REACT_APP_CUSTOM_SERVER_URL=<your server url>` if you
// need to override the default localhost URL.
export const host =
  process.env.REACT_APP_CUSTOM_SERVER_URL || "http://localhost:5000";
export const loginRoute = `${host}/api/auth/login`;
export const registerRoute = `${host}/api/auth/register`;
export const logoutRoute = `${host}/api/auth/logout`;
export const setAvatarRoute = `${host}/api/auth/setavatar`;


export const allUsersRoute = `${host}/api/auth/allusers`;
export const sendMessageRoute = `${host}/api/messages/addmsg`;
export const recieveMessageRoute = `${host}/api/messages/getmsg`;
