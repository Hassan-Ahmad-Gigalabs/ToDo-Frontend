import { InputBase } from "@mui/material";
import classes from "./style.module.less";
import { useAppSelector } from "../../../../hooks/store";
import { useAddCommentMutation } from "../../../../services/comments";
import CommentIcon from "@mui/icons-material/Comment";
import Comments from "../Comments";
import { KeyboardEvent, useState } from "react";

export default function CommentsTab() {
  const { selectedTask } = useAppSelector((state) => state.dashboard);
  const [commentValue, setCommentValue] = useState<string>("");

  const [addComment] = useAddCommentMutation();

  const handleKeyPress = async (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      let res = await addComment({
        text: commentValue,
        userId: 2,
        taskId: selectedTask?.id as number,
      });
      if ("data" in res) setCommentValue("");
    }
  };

  return (
    <div className={classes.main}>
      <Comments />
      <div className={classes.addComment}>
        <CommentIcon />
        <InputBase
          sx={{ flex: 1 }}
          placeholder="Add Comment"
          value={commentValue}
          onChange={(e) => setCommentValue(e.currentTarget.value)}
          onKeyDown={handleKeyPress}
        />
      </div>
    </div>
  );
}
