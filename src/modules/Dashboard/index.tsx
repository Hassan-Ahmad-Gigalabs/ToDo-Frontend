import { lazy, Suspense } from "react";
const Modal = lazy(() => import("./Modal"));
const List = lazy(() => import("./List"));
import classes from "./style.module.less";
import { useAppSelector } from "../../hooks/store";

export default function BasicModal() {
  const { modalOpen } = useAppSelector((state) => state.dashboard);
  return (
    <div className={classes.container}>
      {modalOpen ? (
        <Suspense>
          <Modal />
        </Suspense>
      ) : null}
      <Suspense>
        <List />
      </Suspense>
    </div>
  );
}
