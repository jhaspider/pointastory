import React, { useEffect, useState } from "react";
import { getClosedStoryCount } from "../../data";
import { useUserContext } from "../../contexts/user_provider";

const useStoryCount = () => {
  const [story_count, setStoryCount] = useState(null);
  const { session_id } = useUserContext();
  useEffect(() => {
    if (session_id) {
      const fetchData = async () => {
        try {
          const response = await getClosedStoryCount();
          if (response && response.count > 0) setStoryCount(response.count);
        } catch (e) {}
      };

      fetchData();
    }
  }, [session_id]);
  return story_count;
};

const StoriesCounter = () => {
  const story_count = useStoryCount();
  return (
    <div className="w-full lg:w-[768px] px-4 mt-16 rounded-lg flex flex-col justify-center items-center self-center">
      {story_count && (
        <>
          <p className="sub-text">Stories Voted</p>
          <h2>{Math.floor(story_count).toLocaleString("en-US")}</h2>
        </>
      )}
    </div>
  );
};

export default StoriesCounter;
