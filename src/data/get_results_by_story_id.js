import Axios from "./axios_config";
import EndPoints from "./end_points";

const getResultsByStoryId = async (story_id) => {
  const params = { story_id };
  return Axios.get(EndPoints.getResultsByStoryId, { params })
    .then((response) => {
      return response;
    })
    .catch((error) => {
      return error;
    });
};

export default getResultsByStoryId;
