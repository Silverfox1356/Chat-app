import axios from "axios";
import { host } from "./APIRoutes";

// Axios instance that automatically skips ngrok's browser warning page
const apiClient = axios.create();

if (host.includes("ngrok-free.app")) {
  apiClient.defaults.headers.common["ngrok-skip-browser-warning"] = "true";
}

export default apiClient;
