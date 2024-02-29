import Axios from "./axios_config";
import EndPoints from "./end_points";

const createBoard = async () => {
  return Axios.post(EndPoints.createBoard)
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      return error;
    });
};

export default createBoard;
