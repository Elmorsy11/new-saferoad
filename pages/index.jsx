import React, { useEffect, useState } from "react";
import { Card, Col, Row } from "react-bootstrap";
import { useSelector } from "react-redux";
import dynamic from "next/dynamic";
import axios from "axios";

import { toast } from "react-toastify";
import { encryptName } from "helpers/encryptions";
import useStreamDataState from "hooks/useStreamDataState";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import Progress from "components/dashboard/Progress/index";
// Chart
import VehiclesStatusChart from "components/dashboard/Charts/VehiclesStatusChart";
import AverageUtilizationChart from "components/dashboard/Charts/AverageUtilizationChart";
import OverallFuelConsumptionChart from "components/dashboard/Charts/OverallFuelConsumptionChart";
import MonthlyPreventiveMaintenance from "components/dashboard/Charts/ MonthlyPreventiveMaintenance";
//  NextrepairplansTable
import NextrepairplansTable from "components/dashboard/NextrepairplansTable";
//  CardsForRates
import CardsForRates from "components/dashboard/CardsForRates";
const Google = dynamic(() => import("components/dashboard/google"), {
  ssr: false,
});

const Home = () => {
  const [DashboardData, setDashboardData] = useState({});
  const VehTotal = useSelector((state) => state.streamData.VehTotal);

  const { myMap } = useSelector((state) => state.mainMap);
  const { indexStreamLoader } = useStreamDataState();

  useEffect(() => {
    indexStreamLoader();

    // dashborad data
    const DashboardDataLocal = localStorage.getItem(
      encryptName("DashboardData")
    );
    let data = JSON.parse(DashboardDataLocal) ?? "{}";
    setDashboardData(data);
    (async () => {
      await axios
        .get(`dashboard/mainDashboard/home`)
        .then(({ data }) => {
          localStorage.setItem(
            encryptName("DashboardData"),
            JSON.stringify(data)
          );
          setDashboardData(data);
        })
        .catch((error) => {
          toast.error(error?.response?.data?.message);
        });
    })();
  }, []);
  return (
    <div className="p-3">
      <Row>
        {/* ############################  progress bars + Map  ############################################## */}
        <Col lg="6">
          <Row>
            <Progress VehTotal={VehTotal} />
          </Row>
        </Col>
        {/* map */}
        <Col lg="6">
          <Card style={{ height: "calc(100% - 2rem)", overflow: "hidden" }}>
            <Card.Body className="p-0 position-relative">
              {/* <Google /> */}
              <Google myMap={myMap} />
            </Card.Body>
          </Card>
        </Col>
      </Row>
      {/* ############################  Charts  ############################################## */}
      <Row>
        {/* charts part one */}
        <VehiclesStatusChart VehTotal={VehTotal} />

        {/* charts part two */}
        <AverageUtilizationChart />
      </Row>
      <Row>
        {/* chart part three */}
        <OverallFuelConsumptionChart />

        {/* chart part four */}
        <MonthlyPreventiveMaintenance />
      </Row>

      {/* ############################ cards for rates  ############################################## */}
      <Row>
        <CardsForRates data={DashboardData} />
      </Row>
      {/* ############################ table  ############################################## */}
      <Row>
        <NextrepairplansTable data={DashboardData} />
      </Row>
    </div>
  );
};

// translation ##################################
export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["main", "dashboard"])),
    },
  };
}
export default Home;

// translation ##################################
