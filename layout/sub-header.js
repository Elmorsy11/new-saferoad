import React, { useEffect, useState } from "react";
import { Row, Col, Container } from "react-bootstrap";
import { useTranslation } from "next-i18next";
import Image from "next/image";
const SubHeader = ({ pageName = "" }) => {
  const { t } = useTranslation("main");

  const [state, setState] = useState("");
  useEffect(() => {
    switch (pageName) {
      case "/":
        setState("dashboard_key");
        break;
      default:
        setState("");
        break;
    }
  }, [pageName]);
  return (
    <>
      <div className="iq-navbar-header" style={{ height: "153px" }}>
        <Container fluid className=" iq-container">
          <Row>
            <Col md="12">
              <div className="d-flex justify-content-between flex-wrap">
                <div>
                  <h1>{t(state)}</h1>
                </div>
                <div className="d-flex align-items-center">
                </div>
              </div>
            </Col>
          </Row>
        </Container>
        {/* {{!-- rounded-bottom if not using animation --}} */}
        <div className="iq-header-img">
          <Image
            quality={100}
            layout="fill"
            src="/assets/images/top-header.jpg"
            alt="header"
            className="img-fluid w-100 h-100 animated-scaleX"
          />
        </div>
      </div>
    </>
  );
};

export default SubHeader;
