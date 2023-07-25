import { useState, MouseEvent, ChangeEvent } from "react";
import classes from "./style.module.less";
import Avatar from "@mui/material/Avatar";
import AvatarGroup from "@mui/material/AvatarGroup";
import AddIcon from "@mui/icons-material/Add";
import PersonAddAltIcon from "@mui/icons-material/PersonAddAlt";
import SearchIcon from "@mui/icons-material/Search";
import MenuItem from "@mui/material/MenuItem";
import Checkbox from "@mui/material/Checkbox";
import { useGetUsersQuery } from "../../../../services/users";
import { Divider, InputBase, Popover } from "@mui/material";
import { useDebounce } from "../../../../hooks/debounce";
import { useAppSelector } from "../../../../hooks/store";
import { useUpdateTaskMutation } from "../../../../services/tasks";
import { User } from "../../../../services/users/types";
import { FormikValues } from "formik";

interface Formik {
  formik: FormikValues;
}

export default function Status({ formik }: Formik) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [search, setSearch] = useState<string>("");
  const [skip, setSkip] = useState<boolean>(true);
  const debouncedSearchTerm = useDebounce(search, 500);
  const { selectedTask } = useAppSelector((state) => state.dashboard);

  const { data } = useGetUsersQuery(undefined, {
    skip,
  });
  const [updateTask] = useUpdateTaskMutation();

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
    if (skip) setSkip(false);
  };

  const handleChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(event.currentTarget.value);
    let newValue = [...formik.values.assignee];
    if (newValue.findIndex((f) => f == value) == -1) newValue.push(value);
    else newValue = newValue.filter((f) => f != value);
    formik.setFieldValue("assignee", newValue);
    await updateTask({
      id: selectedTask?.id as number,
      body: { assignees: newValue },
    });
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  function searchFilter(data: User[]) {
    if (debouncedSearchTerm == "") return data;
    else
      return data.filter((user) =>
        `${user.firstName} ${user.lastName}`
          .toLowerCase()
          .includes(debouncedSearchTerm.toLowerCase())
      );
  }

  return (
    <div className={classes.flex}>
      <PersonAddAltIcon />
      <p className={classes.title}>Assignees</p>
      <span onClick={handleClick} className={classes.icon}>
        <AddIcon />
      </span>
      <span className={classes.avatarGroup}>
        <AvatarGroup max={3}>
          {(data
            ? data.filter(
                (user) =>
                  formik.values?.assignee.findIndex(
                    (e: number) => e == user.id
                  ) != -1
              )
            : (selectedTask?.assignees as User[])
          ).map((user) => (
            <Avatar key={user.id}>
              {user.firstName[0].toLocaleUpperCase()}
            </Avatar>
          ))}
        </AvatarGroup>
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
        <div className={classes.search}>
          <InputBase
            sx={{ ml: 1, flex: 1 }}
            placeholder="Search Assignees"
            inputProps={{ "aria-label": "search google maps" }}
            value={search}
            onChange={(e) => setSearch(e.currentTarget.value)}
          />
          <SearchIcon />
        </div>
        <Divider />
        {data &&
          searchFilter(data).map((user) => (
            <MenuItem key={user.id}>
              <Checkbox
                checked={
                  formik.values.assignee.findIndex(
                    (f: number) => f == user.id
                  ) != -1
                }
                onChange={handleChange}
                value={user.id}
              />
              <Avatar
                alt={`${user.firstName} ${user.lastName}`}
                src={""}
                sx={{ height: "30px", width: "30px", mr: 1 }}
              />
              {`${user.firstName} ${user.lastName}`}
            </MenuItem>
          ))}
      </Popover>
    </div>
  );
}
