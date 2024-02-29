import Axios from "./axios_config";
import EndPoints from "./end_points";

const getStoryById = async (story_id) => {
  const params = { story_id };
  return Axios.get(EndPoints.getStoryById, { params })
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      return error;
    });
};

export default getStoryById;
