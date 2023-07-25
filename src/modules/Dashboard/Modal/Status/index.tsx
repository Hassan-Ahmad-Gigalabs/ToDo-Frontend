import { useState, MouseEvent, ChangeEvent } from "react";
import classes from "./style.module.less";
import ViewColumnIcon from "@mui/icons-material/ViewColumn";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import MenuItem from "@mui/material/MenuItem";
import Radio from "@mui/material/Radio";
import { useUpdateTaskMutation } from "../../../../services/tasks";
import { useAppSelector } from "../../../../hooks/store";
import { Popover } from "@mui/material";
import { FormikValues } from "formik";

interface Formik {
  formik: FormikValues;
}

export default function Status({ formik }: Formik) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const { selectedTask } = useAppSelector((state) => state.dashboard);
  const [updateTask] = useUpdateTaskMutation();

  const statuses = [
    { label: "Backlog", value: "backlog" },
    { label: "Not Started", value: "notStarted" },
    { label: "In Progress", value: "inProgress" },
    { label: "Ready for Testing", value: "readyForTest" },
    { label: "Testing", value: "testing" },
    { label: "Completed", value: "completed" },
    { label: "On Hold", value: "onHold" },
  ];

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleChange = async (event: ChangeEvent<HTMLInputElement>) => {
    formik.setFieldValue("state", event.currentTarget.value);
    setAnchorEl(null);
    await updateTask({
      id: selectedTask?.id as number,
      body: { state: event.currentTarget.value },
    });
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div className={classes.flex}>
      <ViewColumnIcon />
      <p className={classes.stateText}>
        {statuses.find((f) => f?.value == formik?.values?.state)?.label}
      </p>
      <span onClick={handleClick} className={classes.icon}>
        <KeyboardArrowDownIcon />
      </span>
      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
      >
        {statuses.map((status) => (
          <MenuItem key={status.label}>
            <Radio
              checked={formik.values.state == status.value}
              onChange={handleChange}
              value={status.value}
              name="radio-buttons"
              inputProps={{ "aria-label": "A" }}
            />
            {status.label}
          </MenuItem>
        ))}
      </Popover>
    </div>
  );
}
