import { useTranslation } from 'next-i18next';
import dynamic from 'next/dynamic';
import React from 'react'
import { Col } from 'react-bootstrap';
import Styles from "styles/Dashboard.module.scss";
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

export default function OverallFuelConsumptionChart() {
	const { t } = useTranslation("Dashboard");

	const chart = {
		series: [
			{
				name: t("Fuel_Consumption"),
				type: "column",
				data: [1702, 131, 942, 852, 648, 835, 932, 1231, 1386, 84],
			},
			{
				name: t("Mileage"),
				type: "line",
				data: [
					26391, 2034, 14608, 13219, 10085, 12955, 14478, 19081, 21490, 1303,
				],
			},
		],
		options: {
			chart: {
				fontFamily: "Cairo, sans-serif",
				height: 350,
				type: "line",
				style: {
					fontSize: ".5rem",
					fontWeight: "bold",
				},
				toolbar: {
					show: false,
				},
				sparkline: {
					enabled: false,
				},
			},
			stroke: {
				width: [0, 2],
			},
			dataLabels: {
				enabled: true,
				enabledOnSeries: [1],
				style: {
					fontSize: ".55rem",
				},
			},

			labels: [
				t("Jan"),
				t("Feb"),
				t("Mar"),
				t("Apr"),
				t("May"),
				t("Jun"),
				t("Jul"),
				t("Aug"),
				t("Sep"),
				t("Oct"),
			],
			colors: ["#246c66", "#3e84b8"],

			yaxis: [
				{
					title: {
						text: t("Fuel_Consumption"),
					},
					labels: {
						show: true,
						minWidth: 10,
						maxWidth: 10,
						style: {
							colors: "#8A92A6",
						},
						offsetX: 0,
					},
				},
				{
					opposite: true,
					title: {
						text: t("Mileage"),
					},
				},
			],
		},
	};
	return (
		<>
			<Col lg="6">
				<div className="card">
					<div className="card-header d-flex justify-content-between flex-wrap">
						<div className="header-title">
							<h4 className={"card-title " + Styles.head_title}>
								{t("Overall_Fuel_Consumption")}
							</h4>
						</div>
					</div>
					<div className="card-body">
						<Chart
							options={chart.options}
							series={chart.series}
							type="line"
							height="245"
						/>
					</div>
				</div>
			</Col>
		</>
	)
}
