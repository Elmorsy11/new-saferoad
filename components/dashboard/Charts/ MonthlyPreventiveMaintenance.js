import { useTranslation } from 'next-i18next';
import dynamic from 'next/dynamic';
import React from 'react'
import { Col } from 'react-bootstrap';
import Styles from "styles/Dashboard.module.scss";
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

export default function MonthlyPreventiveMaintenance() {
	const { t } = useTranslation("dashboard");

	const chart = {
		series: [
			{
				name: t("number_of_vehicles_key"),
				data: [94, 80, 94, 80, 94, 80, 94],
			},
		],
		options: {
			chart: {
				fontFamily: "Cairo, sans-serif",

				height: 245,
				type: "bar",
				toolbar: {
					show: false,
				},
				sparkline: {
					enabled: false,
				},
			},
			plotOptions: {
				bar: {
					borderRadius: 10,
					columnWidth: "30%",
				},
			},
			dataLabels: {
				enabled: false,
			},
			stroke: {
				width: 0,
			},
			xaxis: {
				labels: {
					minHeight: 100,
					rotate: -45,
					style: {
						fontSize: ".5rem",
						fontWeight: "bold",
					},
				},
				categories: [
					t("change_engine_oil_key"),
					t("change_vehicle_breaks_key"),
					t("renew_vehicle_license_key"),
					t("vehicle_wash_key"),
					t("change_type_key"),
					t("change_gear_oil_key"),
					t("filter_change_key"),
				],
				tickPlacement: "on",
			},
			yaxis: {
				title: {
					text: t("number_of_vehicles_key"),
				},
			},
			fill: {
				colors: ["#246c66"],
				type: "gradient",
				gradient: {
					shade: "light",
					type: "horizontal",
					shadeIntensity: 0.25,
					gradientToColors: ["#4bc7d2"],
					inverseColors: true,
					opacityFrom: 0.85,
					opacityTo: 0.85,
					stops: [50, 0, 100],
				},
			},
		},
	};
	return (
		<>
			<Col lg="6">
				<div className="card">
					<div className="card-header d-flex justify-content-between flex-wrap">
						<div className="header-title">
							<h4 className={"card-title " + Styles.head_title}>
								{t("monthly_preventive_maintenance_key")}
							</h4>
						</div>
					</div>
					<div className="card-body">
						<Chart
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
