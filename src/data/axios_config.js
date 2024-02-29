import axios from "axios";
import settings from "../settings.json";

class RemoteError extends Error {
  constructor(status, code, message) {
    super(message);

    this.status = status;
    this.code = code;
    this.message = message;
  }
}

let config = {
  baseURL: settings.apiBaseUrl,
  timeout: 3000,
};

let session_id = "";
const setAxiosHeader = (new_session_id) => {
  session_id = new_session_id;
};

const instance = axios.create(config);
instance.interceptors.request.use(function (config) {
  if (session_id) config.headers["x-session-key"] = session_id;
  return config;
});

// Add a response interceptor
instance.interceptors.response.use(
  function (response) {
    return response;
  },
  function (error) {
    let status, code, message;
    if (error.response) {
      status = error.response?.status || 0;
      code = error.response?.data?.code || "E001";
      message = error.response?.data?.message || error.response?.data || "Unknown error occured...";
    } else if (error.request) {
      status = 0;
      code = "X001";
      message = "Could not connect to server. Try later.";
    } else {
      status = 0;
      code = "X001";
      message = error.message;
    }
    return Promise.reject(new RemoteError(status, code, message));
  }
);

export { instance as default, setAxiosHeader };
