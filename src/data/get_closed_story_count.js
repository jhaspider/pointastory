import Axios from "./axios_config";
import EndPoints from "./end_points";

const getClosedStoryCount = async () => {
  return Axios.get(EndPoints.get_closed_stories_count)
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      return error;
    });
};

export default getClosedStoryCount;
