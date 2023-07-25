import Paper from "@mui/material/Paper";
import InputBase from "@mui/material/InputBase";
import AssignmentIcon from "@mui/icons-material/Assignment";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import classes from "./style.module.less";
import { useAppSelector } from "../../../../hooks/store";
import { KeyboardEvent, useState } from "react";
import { useAddTasksMutation } from "../../../../services/tasks";
import { Task } from "../../../../services/tasks/types";

export default function CustomizedInputBase() {
  const { selectedTask } = useAppSelector((state) => state.dashboard);
  const [title, setTitle] = useState<string>("");
  const [subTasks, setSubTasks] = useState<Task[]>(
    selectedTask?.children as Task[]
  );

  const [addTask] = useAddTasksMutation();

  const handleKeyPress = async (event: KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === "Enter") {
      handleAdd();
    }
  };

  async function handleAdd() {
    const res = await addTask({
      title,
      state: "backlog",
      parentId: selectedTask?.id as number,
    });
    if ("data" in res)
      setSubTasks((prev) => {
        return [...prev, res?.data];
      });
    setTitle("");
  }

  return (
    <div className={classes.main}>
      <div className={classes.addContainer}>
        <Paper
          sx={{
            p: "2px 4px",
            display: "flex",
            alignItems: "center",
            flex: 1,
          }}
        >
          <AssignmentIcon sx={{ m: "10px", color: "grey" }} />
          <InputBase
            sx={{ ml: 1, flex: 1 }}
            placeholder="Title of the sub-task"
            value={title}
            onChange={(e) => setTitle(e.currentTarget.value)}
          />
        </Paper>
        <button
          className={classes.button}
          onClick={handleAdd}
          onKeyDown={handleKeyPress}
        >
          Add sub-task
        </button>
      </div>
      <span className={classes.subTaskContainer}>
        {subTasks.map((task) => (
          <div key={task.id} className={classes.pill}>
            <span className={classes.flex}>
              <AssignmentIcon sx={{ height: 16 }} />
              <p className={classes.title}>{task.title}</p>
            </span>
            <span className={classes.flex}>
              <p className={classes.title}>{task.state}</p>
              <ArrowDropDownIcon sx={{ height: 16 }} />
            </span>
          </div>
        ))}
      </span>
    </div>
  );
}
