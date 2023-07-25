import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Tag from "./Tag";
import Tabs from "./Tabs";
import { setModalState } from "../slice";
import { useAppDispatch, useAppSelector } from "../../../hooks/store";
import InputBase from "@mui/material/InputBase";
import classes from "./style.module.less";
import Status from "./Status";
import Assignee from "./Assignee";
import Comments from "./Comments";
import CommentsTab from "./CommentsTab";
import Description from "./Description";
import SubTasks from "./SubTasks";
import Attachment from "./Attachment";
import { useFormik } from "formik";
import * as yup from "yup";
import { TextField } from "@mui/material";
import {
  useAddTasksMutation,
  useDeleteTaskMutation,
  useUpdateTaskMutation,
} from "../../../services/tasks";
import DeleteIcon from "@mui/icons-material/Delete";
import Button from "@mui/material/Button";
import { useDebounce } from "../../../hooks/debounce";
import { useEffect } from "react";

export default function ModalComp() {
  const { selectedTask, selectedTab } = useAppSelector(
    (state) => state.dashboard
  );
  const edit = Boolean(selectedTask);
  const dispatch = useAppDispatch();
  const [addTask] = useAddTasksMutation();
  const [updateTask] = useUpdateTaskMutation();
  const [deleteTask] = useDeleteTaskMutation();

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: edit ? "90vw" : "400px",
    height: edit ? "80vh" : "180px",
    bgcolor: "background.paper",
    borderRadius: "10px",
    boxShadow: 24,
  };

  const validationSchema = yup.object({
    title: yup.string().required("Title is required"),
    description: yup.string(),
    assignee: yup.array(),
  });

  interface FormType {
    title: string;
    state: string;
    assignee: number[];
    tags: number[];
    description: string;
  }

  let initialValues: FormType = {
    title: selectedTask?.title ? selectedTask.title : "",
    state: selectedTask?.state ? selectedTask.state : "backlog",
    assignee: selectedTask?.assignees
      ? selectedTask?.assignees.map((u) => u.id)
      : [],
    tags: selectedTask?.tags ? selectedTask?.tags.map((t) => t.id) : [],
    description: selectedTask?.description ? selectedTask.description : "",
  };

  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      if (!edit) {
        const res = await addTask(values);
        if ("data" in res) dispatch(setModalState(false));
      }
    },
  });

  const debouncedName = useDebounce(formik.values.title, 500);
  const debouncedDescription = useDebounce(formik.values.description, 2000);

  async function updateTitle() {
    await updateTask({
      id: selectedTask?.id as number,
      body: { title: debouncedName },
    });
  }

  async function updateDescription() {
    await updateTask({
      id: selectedTask?.id as number,
      body: { description: debouncedDescription },
    });
  }

  async function handleDelete() {
    const res = await deleteTask(selectedTask?.id as number);
    if ("data" in res) dispatch(setModalState(false));
  }

  useEffect(() => {
    if (edit && debouncedName != "" && debouncedName != selectedTask?.title) {
      updateTitle();
    }

    if (
      edit &&
      debouncedDescription != "" &&
      debouncedDescription != selectedTask?.description
    ) {
      updateDescription();
    }

    return () => {};
  }, [debouncedName, debouncedDescription]);

  function Content({ tab }: { tab: number }) {
    switch (tab) {
      case 1:
        return <Description formik={formik} />;
      case 2:
        return <SubTasks />;
      case 3:
        return <Attachment />;
      case 4:
        return <CommentsTab />;

      default:
        break;
    }
  }

  return (
    <div>
      <Modal open onClose={() => dispatch(setModalState(false))}>
        <Box sx={style}>
          <form onSubmit={formik.handleSubmit} className={classes.container}>
            {edit ? (
              <>
                <div className={classes.detailsContainer}>
                  <div className={classes.buttons}>
                    <button
                      className={classes.button}
                      onClick={handleDelete}
                      type="button"
                    >
                      <DeleteIcon sx={{ height: 13 }} />
                    </button>
                  </div>
                  <InputBase
                    sx={{ flex: 1, fontSize: 20, mt: 2, maxHeight: "50px" }}
                    placeholder="Title of the task"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.title}
                    name="title"
                  />
                  <Status formik={formik} />
                  <Assignee formik={formik} />
                  <Tag formik={formik} />
                  <Comments limit={5} />
                </div>
                <div className={classes.tabsContainer}>
                  <Tabs />
                  <div className={classes.content}>
                    <Content tab={selectedTab} />
                  </div>
                </div>
              </>
            ) : (
              <div className={classes.createContainer}>
                <p className={classes.title}>Add Task</p>
                <TextField
                  sx={{ width: 350 }}
                  label="Title"
                  variant="outlined"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  name="title"
                />
                <span className={classes.actions}>
                  <Button
                    variant="text"
                    onClick={() => dispatch(setModalState(false))}
                  >
                    Cancel
                  </Button>
                  <Button variant="text" type="submit">
                    Add
                  </Button>
                </span>
              </div>
            )}
          </form>
        </Box>
      </Modal>
    </div>
  );
}
