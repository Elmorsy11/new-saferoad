import { useTranslation } from 'next-i18next';
import dynamic from 'next/dynamic';
import React from 'react'
import { Col } from 'react-bootstrap';
import Styles from "styles/Dashboard.module.scss";
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

export default function MonthlyPreventiveMaintenance() {
	const { t } = useTranslation("Dashboard");

	const chart = {
		series: [
			{
				name: t("Number_of_Vehicles"),
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

			/*grid: {
								row: {
										colors: ['#fff', '#f2f2f2']
								}
						},*/

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
					t("Change_Engine_Oil"),
					t("Change_Vehicle_Breaks"),
					t("Renew_Vehicle_License"),
					t("Vehicle_Wash"),
					t("Change_type"),
					t("Change_Gear_Oil"),
					t("Filter_Change"),
				],
				tickPlacement: "on",
			},
			yaxis: {
				title: {
					text: t("Number_of_Vehicles"),
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
								{t("Monthly_Preventive_Maintenance")}
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
