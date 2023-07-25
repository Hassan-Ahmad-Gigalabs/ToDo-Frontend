import classes from "./style.module.less";
import { useAppSelector } from "../../../../hooks/store";
import { useState, useRef, RefObject, ChangeEvent } from "react";
import {
  useRemoveMutation,
  useUploadMutation,
} from "../../../../services/tasks";
import CloseIcon from "@mui/icons-material/Close";
import { keys } from "../../../../keys";
import {
  TransformWrapper,
  TransformComponent,
  ReactZoomPanPinchRef,
} from "react-zoom-pan-pinch";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import ZoomInIcon from "@mui/icons-material/ZoomIn";
import ZoomOutIcon from "@mui/icons-material/ZoomOut";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import DeleteIcon from "@mui/icons-material/Delete";
import { Divider } from "@mui/material";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import DescriptionIcon from "@mui/icons-material/Description";
import DownloadIcon from "@mui/icons-material/Download";

export default function CustomizedInputBase() {
  interface List {
    images: string[];
    videos: string[];
    others: string[];
  }

  const { selectedTask } = useAppSelector((state) => state.dashboard);
  const [image, setImage] = useState<string | null>(null);
  const [video, setVideo] = useState<string | null>(null);
  const [other, setOther] = useState<string | null>(null);
  const [filesList, setFilesList] = useState(generateList());
  const fileInputRef: RefObject<HTMLInputElement> =
    useRef<HTMLInputElement>(null);

  const [upload] = useUploadMutation();
  const [remove] = useRemoveMutation();

  function generateList() {
    let list: List = {
      images: [],
      videos: [],
      others: [],
    };
    for (const e of selectedTask?.uploads as string[]) {
      let ext = getFileExtension(e);
      if (ext == "jpeg" || ext == "jpg" || ext == "png") {
        list.images.push(e);
      } else if (ext == "mp4") {
        list.videos.push(e);
      } else {
        list.others.push(e);
      }
    }
    return list;
  }

  const handleFileInputChange = async (e: ChangeEvent<HTMLInputElement>) => {
    if (e?.target?.files?.length) {
      const file = e.target.files[0];
      const formData = new FormData();
      formData.append("file", file);
      formData.append("id", `${selectedTask?.id}`);
      const res = await upload(formData);
      if ("data" in res) {
        let ext = getFileExtension(res?.data?.file);
        let newList = { ...filesList };
        if (ext == "jpeg" || ext == "jpg" || ext == "png") {
          newList.images.push(res?.data?.file);
        } else if (ext == "mp4") {
          newList.videos.push(res?.data?.file);
        } else {
          newList.others.push(res?.data?.file);
        }
        setFilesList(newList);
      }
    }
  };

  const handleClick = () => {
    if (fileInputRef?.current) fileInputRef.current.click();
  };

  function getFileExtension(filename: string) {
    const parts = filename.split(".");
    const extension = parts[parts.length - 1];
    return extension.toLowerCase(); // Convert to lowercase for consistency
  }

  async function removeItem(file: string) {
    const res = await remove({
      id: selectedTask?.id as number,
      file,
    });

    if ("data" in res) {
      let ext = getFileExtension(res?.data?.file);
      let newList = { ...filesList };
      if (ext == "jpeg" || ext == "jpg" || ext == "png") {
        newList.images = newList.images.filter((e) => e != res?.data?.file);
      } else if (ext == "mp4") {
        newList.videos = newList.videos.filter((e) => e != res?.data?.file);
      } else {
        newList.others = newList.others.filter((e) => e != res?.data?.file);
      }
      setFilesList(newList);
      setImage(null);
      setVideo(null);
      setOther(null);
    }
  }

  const transformComponentRef = useRef<ReactZoomPanPinchRef | null>(null);

  interface Transform {
    zoomIn(): void;
    zoomOut(): void;
    resetTransform(): void;
  }

  const Controls = ({ zoomIn, zoomOut, resetTransform }: Transform) => (
    <div className={classes.buttons}>
      <button
        className={classes.button}
        onClick={() => removeItem(image as string)}
      >
        <DeleteIcon sx={{ height: 20 }} />
      </button>
      <button className={classes.button} onClick={() => zoomIn()}>
        <ZoomInIcon sx={{ height: 20 }} />
      </button>
      <button className={classes.button} onClick={() => zoomOut()}>
        <ZoomOutIcon sx={{ height: 20 }} />
      </button>
      <button className={classes.button} onClick={() => resetTransform()}>
        <RestartAltIcon sx={{ height: 20 }} />
      </button>
      <button className={classes.button} onClick={() => setImage(null)}>
        <CloseIcon sx={{ height: 20 }} />
      </button>
    </div>
  );

  return (
    <div
      className={classes.flex}
      style={{ height: image || video ? "100%" : "" }}
    >
      {other ? (
        <>
          <div className={classes.buttons}>
            <button
              className={classes.button}
              onClick={() => removeItem(other)}
            >
              <DeleteIcon sx={{ height: 20 }} />
            </button>
            <button
              className={classes.button}
              onClick={() => {
                window.open(`${keys.baseUrl}/${other}`, "_blank");
              }}
            >
              <DownloadIcon sx={{ height: 20 }} />
            </button>
            <button className={classes.button} onClick={() => setOther(null)}>
              <CloseIcon sx={{ height: 20 }} />
            </button>
          </div>
          <div className={classes.open}>
            <DescriptionIcon sx={{ color: "grey" }} fontSize="large" />
          </div>
        </>
      ) : null}
      {video ? (
        <>
          <div className={classes.buttons}>
            <button
              className={classes.button}
              onClick={() => removeItem(video)}
            >
              <DeleteIcon sx={{ height: 20 }} />
            </button>
            <button className={classes.button} onClick={() => setVideo(null)}>
              <CloseIcon sx={{ height: 20 }} />
            </button>
          </div>
          <div className={classes.open}>
            <video src={`${keys.baseUrl}/${video}`} controls />
          </div>
        </>
      ) : null}
      {image ? (
        <TransformWrapper
          initialScale={1}
          initialPositionX={0}
          initialPositionY={0}
          ref={transformComponentRef}
        >
          {(utils) => (
            <>
              <Controls {...utils} />
              <TransformComponent>
                <div className={classes.open}>
                  <img
                    src={`${keys.baseUrl}/${image}`}
                    className={classes.openedImg}
                    id="imgZoom"
                  />
                </div>
              </TransformComponent>
            </>
          )}
        </TransformWrapper>
      ) : null}
      {!image && !video && !other ? (
        <>
          <input
            type="file"
            ref={fileInputRef}
            style={{ display: "none" }}
            onChange={handleFileInputChange}
          />
          <button
            className={classes.buttonAdd}
            onClick={handleClick}
            type="button"
          >
            <FileUploadIcon sx={{ height: 20 }} />
          </button>
          <div className={classes.width}>
            <p>Images</p>
            <Divider />
            <div className={classes.flex}>
              {filesList.images.map((attachment) => (
                <div
                  className={classes.attachmentContainer}
                  onClick={() => setImage(attachment)}
                  key={attachment}
                >
                  <img
                    src={`${keys.baseUrl}/${attachment}`}
                    className={classes.img}
                  />
                  <p className={classes.name}>{attachment}</p>
                </div>
              ))}
            </div>
            <p>Videos</p>
            <Divider />
            <div className={classes.flex}>
              {filesList.videos.map((attachment) => {
                return (
                  <div
                    className={classes.attachmentContainer}
                    onClick={() => setVideo(attachment)}
                    key={attachment}
                  >
                    <div className={classes.video}>
                      <PlayArrowIcon sx={{ color: "white" }} />
                    </div>
                    <p className={classes.name}>{attachment}</p>
                  </div>
                );
              })}
            </div>
            <p>Others</p>
            <Divider />
            <div className={classes.flex}>
              {filesList.others.map((attachment) => {
                return (
                  <div
                    className={classes.attachmentContainer}
                    onClick={() => setOther(attachment)}
                    key={attachment}
                  >
                    <div className={classes.other}>
                      <DescriptionIcon
                        sx={{ color: "grey" }}
                        fontSize="large"
                      />
                    </div>
                    <p className={classes.name}>{attachment}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
}
