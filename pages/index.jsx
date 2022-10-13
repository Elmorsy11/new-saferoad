import React, { useCallback, useEffect, useState } from "react";
import { Card, Col, Row } from "react-bootstrap";

import axios from "axios";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useLoadScript } from "@react-google-maps/api";

const Google = dynamic(() => import("components/dashboard/google"), {
  ssr: false,
});

import Progress from "components/dashboard/Progress/index";

// Chart Component
import VehiclesStatusChart from "components/dashboard/Charts/VehiclesStatusChart";
import AverageUtilizationChart from "components/dashboard/Charts/AverageUtilizationChart";
import AverageSpeedAndDistanceChart from "components/dashboard/Charts/AverageSpeedAndDistanceChart";
import OverallPreventiveMaintenance from "components/dashboard/Charts/OverallPreventiveMaintenance";

// import NextrepairplansTable
import NextrepairplansTable from "components/dashboard/NextrepairplansTable";

// import CardsForRates
import CardsForRates from "components/dashboard/CardsForRates";

import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import useStreamDataState from "hooks/useStreamDataState";
import dynamic from "next/dynamic";

const Home = () => {
  const [DashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [speedChartData, setSpeedChartData] = useState([]);
  const [preventiveChartData, setPreventiveChartData] = useState([]);
  const [averageUtilizationChart, setAverageUtilizationChart] = useState([]);

  const {
    streamData: { VehTotal },
  } = useSelector((state) => state);
  const { myMap } = useSelector((state) => state.mainMap);

  // progress count up wait till loading
  useEffect(() => {
    const timer = setTimeout(() => {
      if (Object.keys(VehTotal).length > 0) {
        setLoading(false);
      }
    }, 1500);
    return () => clearTimeout(timer);
  }, [VehTotal]);
  useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
    libraries: ["places"],
  });

  const { indexStreamLoader } = useStreamDataState();
  useEffect(() => {
    // fetch Overall Preventive Maintenance chart data
    const fetchPreventiveData = async () => {
      try {
        const respond = await axios.get(`dashboard/mainDashboard/home`);
        setPreventiveChartData(respond.data.allMaintenance);
      } catch (error) {
        toast.error(error?.response?.data?.message);
      }
    };
    fetchPreventiveData();
    //
    indexStreamLoader();
  }, []);

  // top and low rated drivers
  useEffect(() => {
    const fetchData = async () => {
      if (localStorage.getItem("DashboardData")) {
        const TopWorstData = JSON.parse(localStorage.getItem("DashboardData"));
        setDashboardData(TopWorstData);
      }
      await axios
        .get(`dashboard/mainDashboard/topWorst`)
        .then(({ data }) => {
          setDashboardData(data);
          localStorage.setItem("DashboardData", JSON.stringify(data));
        })
        .catch((error) => {
          toast.error(error?.message);
        });
    };
    fetchData();
  }, []);

  // fetch Average Utilization chart data
  const fetchAverageUtilization = useCallback(async () => {
    if (localStorage.getItem("averageUtilizationChart")) {
      const UtilizationChart = JSON.parse(
        localStorage.getItem("averageUtilizationChart")
      );
      setAverageUtilizationChart(UtilizationChart);
    }
    try {
      const respond = await axios.get(`dashboard/mainDashboard/avgUtlization`);
      setAverageUtilizationChart(respond.data.avgUtlizations);
      localStorage.setItem(
        "averageUtilizationChart",
        JSON.stringify(respond.data.avgUtlizations)
      );
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  }, []);

  // fetch Average Utilization chart data
  useEffect(() => {
    fetchAverageUtilization();
  }, [fetchAverageUtilization]);

  // fetch Overall average speed chart data
  const fetchSpeedData = useCallback(async () => {
    if (localStorage.getItem("speedChart")) {
      const speedChart = JSON.parse(localStorage.getItem("speedChart"));
      setSpeedChartData(speedChart);
    }
    try {
      const respond = await axios.get(`dashboard/mainDashboard/fuel`);
      setSpeedChartData(respond.data.fuelConsumptions);
      localStorage.setItem(
        "speedChart",
        JSON.stringify(respond.data.fuelConsumptions)
      );
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  }, []);

  // fetch Overall average speed chart data
  useEffect(() => {
    fetchSpeedData();
  }, [fetchSpeedData]);

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
        <AverageUtilizationChart data={averageUtilizationChart} />
      </Row>
      <Row>
        {/* chart part three */}
        <AverageSpeedAndDistanceChart data={speedChartData} />

        {/* chart part four */}
        <OverallPreventiveMaintenance data={preventiveChartData} />
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
      locale: locale,
      ...(await serverSideTranslations(locale, ["main", "dashboard"])),
    },
  };
}
export default Home;

// translation ##################################
