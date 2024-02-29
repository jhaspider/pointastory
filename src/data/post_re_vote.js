import Axios from "./axios_config";
import EndPoints from "./end_points";

const reVote = async (story_id) => {
  return Axios.post(EndPoints.reVote, { story_id })
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      return error;
    });
};

export default reVote;
