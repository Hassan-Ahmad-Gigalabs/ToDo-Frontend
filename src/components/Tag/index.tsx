import classes from "./style.module.less";

interface TagType {
  tag: { id: number; text: string };
}

export default function Tags({ tag }: TagType) {
  return (
    <div className={classes.tag}>
      <p className={classes.tagText}>{tag.text}</p>
    </div>
  );
}
