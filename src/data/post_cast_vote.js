import Axios from "./axios_config";
import EndPoints from "./end_points";

const castVote = async (story_id, story_point, player) => {
  return Axios.post(EndPoints.castVote, { story_id, story_point, player })
    .then((response) => {
      return response;
    })
    .catch((error) => {
      return error;
    });
};

export default castVote;
