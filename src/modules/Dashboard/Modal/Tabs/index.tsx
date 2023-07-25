import { useAppDispatch, useAppSelector } from "../../../../hooks/store";
import { setTab } from "../../slice";
import classes from "./style.module.less";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import DescriptionIcon from "@mui/icons-material/Description";
import CommentIcon from "@mui/icons-material/Comment";
import AssignmentIcon from "@mui/icons-material/Assignment";

export default function Tabs() {
  const { selectedTab } = useAppSelector((state) => state.dashboard);
  const dispatch = useAppDispatch();

  const tabs = [
    { id: 1, icon: DescriptionIcon, title: "Description" },
    { id: 2, icon: AssignmentIcon, title: "Sub Tasks" },
    { id: 3, icon: AttachFileIcon, title: "Attachments" },
    { id: 4, icon: CommentIcon, title: "Comments" },
  ];

  return (
    <div className={classes.container}>
      {tabs.map((tab, i) => (
        <div
          className={classes.tabs}
          key={tab.id}
          onClick={() => dispatch(setTab(tab.id))}
          style={{
            color: selectedTab == tab.id ? "white" : "grey",
            background: selectedTab == tab.id ? "black" : "white",
            border: selectedTab == tab.id ? "black" : "",
            borderRadius: i + 1 == tabs.length ? "0 10px 0 0" : "",
          }}
        >
          <tab.icon />
          <p className={classes.tabTitle}>{tab.title}</p>
        </div>
      ))}
    </div>
  );
}
