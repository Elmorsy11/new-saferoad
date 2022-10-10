import React from "react";
import { Card, Col } from "react-bootstrap";
import Styles from "../../../styles/Dashboard.module.scss";
import { useTranslation } from "next-i18next";
import Stars from "../Stars";
// import avatars1 from "/assets/images/avatars/01.png";
// import avatars2 from "/assets/images/741407.png";
import Link from "next/link";

export default function Index({ data }) {
  const topRatedDrivers = data?.topRatedDrivers;
  const BadRatedDrivers = data?.BadRatedDrivers;
  const { t } = useTranslation("Dashboard");
  return (
    <>
      {/* #######################  Drivers  ####################  */}
      {/* Top Drivers */}
      <Col md="6" lg="3">
        <Link href="/Driver">
          <a>
            <Card>
              <Card.Header className="d-flex justify-content-center align-items-center">
                <div className="header-title  text-center">
                  <h4 className={"card-title " + Styles.head_title}>
                    {t("Top_Drivers")}
                  </h4>
                </div>
              </Card.Header>
              <Card.Body>
                <Stars
                  name={
                    topRatedDrivers
                      ? topRatedDrivers[0]?.DriverName
                      : "DriverName"
                  }
                  imgSrc={"/assets/images/avatars/01.png"}
                  imgAlt={"one"}
                  starsCount={
                    topRatedDrivers ? topRatedDrivers[0]?.Rate / 2 : 5
                  }
                />
                <Stars
                  name={
                    topRatedDrivers
                      ? topRatedDrivers[1]?.DriverName
                      : "DriverName"
                  }
                  imgSrc={"/assets/images/avatars/01.png"}
                  imgAlt={"two"}
                  starsCount={
                    topRatedDrivers ? topRatedDrivers[1]?.Rate / 2 : 5
                  }
                />
              </Card.Body>
            </Card>
          </a>
        </Link>
      </Col>
      {/* Worst Drivers */}
      <Col md="6" lg="3">
        <Link href="/Driver">
          <a>
            <Card>
              <Card.Header className="d-flex justify-content-center align-items-center">
                <div className="header-title  text-center">
                  <h4 className={"card-title " + Styles.head_title}>
                    {t("Worst_Drivers")}
                  </h4>
                </div>
              </Card.Header>
              <Card.Body>
                <Stars
                  name={
                    BadRatedDrivers
                      ? BadRatedDrivers[0]?.DriverName
                      : "DriverName"
                  }
                  imgSrc={"/assets/images/avatars/01.png"}
                  imgAlt={"one"}
                  starsCount={1}
                />
                <Stars
                  name={
                    BadRatedDrivers
                      ? BadRatedDrivers[1]?.DriverName
                      : "DriverName"
                  }
                  imgSrc={"/assets/images/avatars/01.png"}
                  imgAlt={"two"}
                  starsCount={1}
                />
              </Card.Body>
            </Card>
          </a>
        </Link>
      </Col>
      {/* #######################  Vehicles  ####################  */}
      {/* Top Utilized Vehicles */}
      <Col md="6" lg="3">
        <Link href="/vehiclesdahboard">
          <a>
            <Card>
              <Card.Header className="d-flex justify-content-center align-items-center">
                <div className="header-title  text-center">
                  <h4 className={"card-title " + Styles.head_title}>
                    {t("Top_Utilized_Vehicles")}
                  </h4>
                </div>
              </Card.Header>
              <Card.Body>
                <Stars
                  name="Vehicle name 1"
                  imgSrc={"/assets/images/741407.png"}
                  imgAlt={"one"}
                  starsCount={5}
                />
                <Stars
                  name="Vehicle name 2"
                  imgSrc={"/assets/images/741407.png"}
                  imgAlt={"tow"}
                  starsCount={1}
                />
              </Card.Body>
            </Card>
          </a>
        </Link>
      </Col>
      {/* Worst Utilized Vehicles */}
      <Col md="6" lg="3">
        <Link href="/vehiclesdahboard">
          <a>
            <Card>
              <Card.Header className="d-flex justify-content-center align-items-center">
                <div className="header-title text-center">
                  <h4 className={"card-title " + Styles.head_title}>
                    {t("Worst_Utilized_Vehicles")}
                  </h4>
                </div>
              </Card.Header>
              <Card.Body>
                <Stars
                  name="Vehicle name 1"
                  imgSrc={"/assets/images/741407.png"}
                  imgAlt={"one"}
                  starsCount={2}
                />
                <Stars
                  name="Vehicle name 2"
                  imgSrc={"/assets/images/741407.png"}
                  imgAlt={"tow"}
                  starsCount={3}
                />
              </Card.Body>
            </Card>
          </a>
        </Link>
      </Col>
    </>
  );
}
