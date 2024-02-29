import Axios from "./axios_config";
import EndPoints from "./end_points";

const getAllStories = async (board_id) => {
  const params = { board_id };
  return Axios.get(EndPoints.getAllStories, { params })
    .then((response) => {
      return response;
    })
    .catch((error) => {
      return error;
    });
};

export default getAllStories;
