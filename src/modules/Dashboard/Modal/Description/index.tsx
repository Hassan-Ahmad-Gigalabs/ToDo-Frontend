import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import classes from "./style.module.less";
import { FormikValues } from "formik";

interface Formik {
  formik: FormikValues;
}

export default function Description({ formik }: Formik) {
  const quillModules = {
    clipboard: {
      matchVisual: false,
    },
  };

  return (
    <ReactQuill
      theme="snow"
      value={formik.values.description}
      onChange={(e) => formik.setFieldValue("description", e)}
      className={classes.editor}
      modules={quillModules}
    />
  );
}
