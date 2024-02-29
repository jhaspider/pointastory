import React from "react";
import ExistingBoardStories from "../existing_board";
import NewStories from "../stories/new_stories";
import StoriesCounter from "../stories/stories_counter";
import { useUserContext } from "../../contexts/user_provider";
import HeaderFooterLayout from "../../components/layouts/header_footer_layout";

const Startup = () => {
  const { session_id } = useUserContext();

  return (
    <HeaderFooterLayout>
      {session_id && <ExistingBoardStories />}
      {session_id && <NewStories />}
      {session_id && <StoriesCounter />}
    </HeaderFooterLayout>
  );
};

export default Startup;
