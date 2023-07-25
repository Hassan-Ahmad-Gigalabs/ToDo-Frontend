// import * as React from "react";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import { useGetTasksQuery } from "../../../services/tasks";
import { Task } from "../../../services/tasks/types";
import AssignmentIcon from "@mui/icons-material/Assignment";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import CircularProgress from "@mui/material/CircularProgress";
import classes from "./style.module.less";
import Tag from "../../../components/Tag";
import { useAppDispatch } from "../../../hooks/store";
import { setModalState, setTask } from "../slice";
import Fab from "@mui/material/Fab";
import AddIcon from "@mui/icons-material/Add";

export default function BasicModal() {
  const dispatch = useAppDispatch();
  const { data, isLoading, isError } = useGetTasksQuery();

  return (
    <div className={classes.listContainer}>
      <span className={classes.fab}>
        <Fab
          color="primary"
          aria-label="add"
          onClick={() => {
            dispatch(setTask(null));
            dispatch(setModalState(true));
          }}
        >
          <AddIcon />
        </Fab>
      </span>
      <div className={classes.list}>
        <p className={classes.title}>Tasks</p>
        <div className={classes.cardsContainer}>
          {isLoading ? (
            <CircularProgress />
          ) : isError ? (
            <p>Failed to fetch tasks</p>
          ) : (
            <>
              {data &&
                data.map((task: Task) => {
                  let time = new Date(task.createdAt);
                  let timeString = `${time.getDate()} ${time.toLocaleString(
                    "default",
                    { month: "long" }
                  )}`;
                  return (
                    <div
                      className={classes.card}
                      key={task.id}
                      onClick={() => {
                        dispatch(setTask(task));
                        dispatch(setModalState(true));
                      }}
                    >
                      <p className={classes.cardTitle}>{task.title}</p>
                      <div className={classes.tagsWrapper}>
                        <LocalOfferIcon
                          className={classes.icon}
                          sx={{ height: "15px" }}
                        />
                        <div className={classes.tagsContainer}>
                          {task.tags.map((tag) => (
                            <Tag tag={tag} key={tag.id} />
                          ))}
                        </div>
                      </div>
                      <div className={classes.taskAndTime}>
                        {task.numberOfChildren ? (
                          <span className={classes.flex}>
                            <AssignmentIcon
                              className={classes.icon}
                              sx={{ height: "17px" }}
                            />
                            <p>+{task.numberOfChildren}</p>
                          </span>
                        ) : (
                          <div className={classes.hide}>.</div>
                        )}
                        <span className={classes.flex}>
                          <CalendarTodayIcon
                            className={classes.icon}
                            sx={{ height: "17px" }}
                          />
                          <p>{timeString}</p>
                        </span>
                      </div>
                    </div>
                  );
                })}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
