import { useTranslation } from 'next-i18next';
import dynamic from 'next/dynamic';
import React from 'react'
import { Col } from 'react-bootstrap';
import Styles from "styles/Dashboard.module.scss";
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

export default function AverageUtilizationChart() {
	const { t } = useTranslation("dashboard");

	const chart = {
		series: [
			{
				name: t("day_events_key"),
				data: [30, 50, 35, 60, 40],
			},
			{
				name: t("night_events_key"),
				data: [40, 50, 55, 50, 30],
			},
		],
		options: {
			chart: {
				fontFamily: "Cairo , sans-serif",
				stacked: true,
				toolbar: {
					show: false,
				},
			},
			colors: ["#246c66", "#4bc7d2"],
			plotOptions: {
				bar: {
					horizontal: false,
					columnWidth: "28%",
					endingShape: "rounded",
					borderRadius: 5,
				},
			},
			legend: {
				show: false,
			},
			dataLabels: {
				enabled: false,
			},
			stroke: {
				show: true,
				width: 2,
				colors: ["transparent"],
			},
			xaxis: {
				categories: [
					"2021-10-04",
					"2021-10-03",
					"2021-10-02",
					"2021-10-01",
					"2021-09-30",
				],
				labels: {
					minHeight: 20,
					maxHeight: 20,
					style: {
						colors: "#8A92A6",
						fontSize: ".5rem",
						fontWeight: "bold",
					},
				},
			},
			yaxis: {
				title: {
					text: "",
				},
				labels: {
					minWidth: 19,
					maxWidth: 19,
					style: {
						colors: "#8A92A6",
					},
				},
			},
			fill: {
				opacity: 1,
			},
			tooltip: {
				y: {
					formatter: function (val) {
						return ` ${val} ${t("events_key")}`;
					},
				},
			},
		},


	};
	return (
		<>
			<Col md="12" xl="6">
				<div className="card" style={{ height: "calc(100% - 2rem)" }}>
					<div className="card-header d-flex justify-content-between flex-wrap">
						<div className="header-title">
							<h4 className={"card-title " + Styles.head_title}>
								{t("average_utilization_key")}
							</h4>
						</div>
					</div>
					<div className="card-body">
						<Chart
							className="d-activity"
							options={chart.options}
							series={chart.series}
							type="bar"
							height="245"
						/>
					</div>
				</div>
			</Col>
		</>
	)
}
