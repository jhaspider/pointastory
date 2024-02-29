import Axios from "./axios_config";
import EndPoints from "./end_points";

const deleteStory = async (story_id) => {
  return Axios.delete(EndPoints.delete_story, { data: { story_id } })
    .then((response) => {
      return response;
    })
    .catch((error) => {
      return error;
    });
};

export default deleteStory;
