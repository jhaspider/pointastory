import Axios from "./axios_config";
import EndPoints from "./end_points";

const endVote = async (story_id) => {
  return Axios.post(EndPoints.endVote, { story_id })
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      return error;
    });
};

export default endVote;
