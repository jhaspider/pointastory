import Axios from "./axios_config";
import EndPoints from "./end_points";

const addNewHost = async (host_id, board_id) => {
  return Axios.post(EndPoints.add_host_to_board, { host_id, board_id })
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      return error;
    });
};

export default addNewHost;
