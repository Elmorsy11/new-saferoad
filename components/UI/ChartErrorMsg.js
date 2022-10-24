import { useTranslation } from "next-i18next";
import React from "react";
const EmptyMess = ({ msg = "OOPS!_NO_DATA_FOUND." }) => {
  const { t } = useTranslation("main");
  
  return (
    <>
      <div
        style={{ height: "245px" }}
        className="d-flex align-items-center justify-content-center fs-4 text-black-50"
      >
        {t(msg)}
      </div>
    </>
  );
};
export default EmptyMess;
