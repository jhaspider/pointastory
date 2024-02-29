import Axios from "./axios_config";
import EndPoints from "./end_points";

const getStoriesByBoard = async (board_id, type = "active") => {
  const params = { board_id, type };
  return Axios.get(EndPoints.get_stories_by_board, { params })
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      return error;
    });
};

export default getStoriesByBoard;
