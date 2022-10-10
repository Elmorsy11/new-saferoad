import React, { useCallback, useEffect, useState } from "react";
import { Card, Col, Row } from "react-bootstrap";

import axios from "axios";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

const Google = dynamic(() => import("components/dashboard/google"), {
  ssr: false,
});

import Progress from "components/dashboard/Progress/index";

// Chart Components
import VehiclesStatusChart from "components/dashboard/Charts/VehiclesStatusChart";
import AverageUtilizationChart from "components/dashboard/Charts/AverageUtilizationChart";
import OverallFuelConsumptionChart from "components/dashboard/Charts/OverallFuelConsumptionChart";
import MonthlyPreventiveMaintenance from "components/dashboard/Charts/ MonthlyPreventiveMaintenance";

// import NextrepairplansTable
import NextrepairplansTable from "components/dashboard/NextrepairplansTable";

// import CardsForRates
import CardsForRates from "components/dashboard/CardsForRates";

import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { encryptName } from "helpers/encryptions";
import useStreamDataState from "hooks/useStreamDataState";
import dynamic from "next/dynamic";

const Home = () => {
  const [DashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const {
    streamData: { VehTotal },
  } = useSelector((state) => state);
  const { myMap } = useSelector((state) => state.mainMap);

  const { indexStreamLoader } = useStreamDataState();
  useEffect(() => {
    indexStreamLoader();
  }, []);
  const UpdateLocalData = (data) => {
    localStorage.setItem(encryptName("DashboardData"), JSON.stringify(data));
    setDashboardData(data);
  };

  const fetchDashboardData = useCallback(async () => {
    await axios
      .get(`dashboard/mainDashboard/home`)
      .then(({ data }) => {
        setLoading(false);
        UpdateLocalData(data);
      })
      .catch((error) => {
        setLoading(false);
        toast.error(error?.response?.data?.message);
      });
  }, []);

  useEffect(() => {
    const DashboardDataLocal = localStorage.getItem(
      encryptName("DashboardData")
    );
    if (DashboardDataLocal) {
      setDashboardData(JSON.parse(DashboardDataLocal) ?? "{}");
      fetchDashboardData();
    } else {
      fetchDashboardData();
    }
  }, [fetchDashboardData]);
  return (
    <div className="p-3">
      <Row>
        {/* ############################  progress bars + Map  ############################################## */}
        <Col lg="6">
          <Row>
            <Progress loading={loading} VehTotal={VehTotal} />
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
      ...(await serverSideTranslations(locale, ["Dashboard", "main"])),
    },
  };
}
export default Home;

// translation ##################################
