import React from "react";

import Header from "./header";
import SubHeader from "./sub-header";
import Sidebar from "./sidebar";

import { useRouter } from "next/router";
const Layout = ({ children }) => {
  let router = useRouter();
  return (
    <>
      <Sidebar />
      <main className="main-content">
        <div className="position-relative">
          <Header />
          {!router.pathname.includes("track") &&
            !router.pathname.includes("map") &&
            !router.pathname.includes("history") && (
              <SubHeader pageName={router.pathname} />
            )}
        </div>
        <div
          className={
            "position-relative mt-n5 py-0 " +
            (!router.pathname.includes("track") && "content-inner")
          }
        >
          {children}
        </div>
      </main>
    </>
  );
};

export default Layout;
