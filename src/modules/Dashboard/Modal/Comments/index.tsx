import { Divider } from "@mui/material";
import classes from "./style.module.less";
import Avatar from "@mui/material/Avatar";
import { useAppSelector } from "../../../../hooks/store";
import { useGetTaskCommetsQuery } from "../../../../services/comments";
import CircularProgress from "@mui/material/CircularProgress";
import { Comment } from "../../../../services/comments/types";

interface CommentPropType {
  limit?: number;
}

export default function Comments({ limit }: CommentPropType) {
  const { selectedTask } = useAppSelector((state) => state.dashboard);

  const { data, isLoading } = useGetTaskCommetsQuery({
    id: selectedTask?.id as number,
    params: limit ? `?page=1&items=${limit}` : "",
  });

  return (
    <>
      <p className={classes.title}>Comments</p>
      <Divider sx={{ m: 1 }} />

      <div className={classes.parent}>
        {isLoading ? (
          <center>
            <CircularProgress />
          </center>
        ) : (
          <>
            {data &&
              data.data.map((comment: Comment) => (
                <div className={classes.commentContainer} key={comment.id}>
                  <Avatar>
                    {comment.user.firstName[0].toLocaleUpperCase()}
                  </Avatar>
                  <span>
                    <p
                      className={classes.userName}
                    >{`${comment.user.firstName} ${comment.user.lastName}`}</p>
                    <p className={classes.time}>
                      {new Date(comment.createdAt).toDateString()}
                    </p>
                  </span>
                  <div className={classes.comment}>
                    <p>{comment.text}</p>
                  </div>
                </div>
              ))}
          </>
        )}
      </div>
    </>
  );
}
