import Axios from "./axios_config";
import EndPoints from "./end_points";

const registerStory = async (story_number, board_id) => {
  const base_location = window.location.href;
  return Axios.post(EndPoints.registerStory, { story_number, board_id, url: base_location })
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      return error;
    });
};

export default registerStory;
