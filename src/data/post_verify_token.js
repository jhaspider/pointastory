import Axios from "./axios_config";
import EndPoints from "./end_points";

const verifyToken = async (token) => {
  return Axios.post(EndPoints.verifyToken, { token })
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      return error;
    });
};

export default verifyToken;
