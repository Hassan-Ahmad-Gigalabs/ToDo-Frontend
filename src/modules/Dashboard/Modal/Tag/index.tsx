import { useState, MouseEvent, ChangeEvent, KeyboardEvent } from "react";
import classes from "./style.module.less";
import AddIcon from "@mui/icons-material/Add";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import MenuItem from "@mui/material/MenuItem";
import TagComp from "../../../../components/Tag";
import { useAddTagMutation, useGetTagsQuery } from "../../../../services/tags";
import { useAppSelector } from "../../../../hooks/store";
import { Tag } from "../../../../services/tags/types";
import { Checkbox, Divider, InputBase, Popover } from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { useUpdateTaskMutation } from "../../../../services/tasks";
import { FormikValues } from "formik";

interface Formik {
  formik: FormikValues;
}

export default function Status({ formik }: Formik) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const { selectedTask } = useAppSelector((state) => state.dashboard);
  const [tagField, setTagField] = useState<string>("");
  const [skip, setSkip] = useState<boolean>(true);

  const { data } = useGetTagsQuery(undefined, {
    skip,
  });
  const [addTag] = useAddTagMutation();
  const [updateTask] = useUpdateTaskMutation();

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
    if (skip) setSkip(false);
  };

  const handleChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(event.currentTarget.value);
    let newValue: number[] = [...formik.values.tags];
    if (newValue.findIndex((f) => f == value) == -1) newValue.push(value);
    else newValue = newValue.filter((f) => f != value);
    formik.setFieldValue("tags", newValue);
    await updateTask({
      id: selectedTask?.id as number,
      body: { tags: newValue },
    });
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  async function handleSubmit() {
    await addTag({ text: tagField });
  }

  const handleKeyPress = async (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      handleSubmit();
    }
  };

  return (
    <div className={classes.flex}>
      <LocalOfferIcon />
      <p className={classes.title}>Tags</p>
      <span onClick={handleClick} className={classes.icon}>
        <AddIcon />
      </span>
      <div className={classes.tagsContainer}>
        {(data
          ? data.filter(
              (tag) =>
                formik.values?.tags.findIndex((e: number) => e == tag.id) != -1
            )
          : (selectedTask?.tags as Tag[])
        ).map((tag) => (
          <TagComp tag={tag} key={tag.id} />
        ))}
      </div>

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
        <div className={classes.addTag}>
          <InputBase
            sx={{ ml: 1, flex: 1 }}
            placeholder="Add a new tag"
            inputProps={{ "aria-label": "search google maps" }}
            value={tagField}
            onChange={(e) => setTagField(e.currentTarget.value)}
            onKeyDown={handleKeyPress}
          />
          <span className={classes.addIcon}>
            <AddCircleOutlineIcon onClick={handleSubmit} />
          </span>
        </div>
        <Divider />
        {data &&
          data.map((tag) => (
            <MenuItem key={tag.id}>
              <Checkbox
                checked={
                  formik.values.tags.findIndex((f: number) => f == tag.id) != -1
                }
                onChange={handleChange}
                value={tag.id}
              />
              {tag.text}
            </MenuItem>
          ))}
      </Popover>
    </div>
  );
}
