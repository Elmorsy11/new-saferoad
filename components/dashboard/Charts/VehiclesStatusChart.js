import { useTranslation } from 'next-i18next';
import dynamic from 'next/dynamic';
import React from 'react'
import { Col } from 'react-bootstrap';
import Styles from "styles/Dashboard.module.scss";
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

export default function VehiclesStatusChart({ VehTotal }) {
	const { t } = useTranslation("dashboard");
	const Offline = VehTotal.offlineVehs || 0;
	const Idleing = VehTotal.idlingVehs || 0;
	const Running = VehTotal.RunningVehs || 0;
	const Stopped = VehTotal.stoppedVehs || 0;
	const OverStreetSpeed = VehTotal.osspeedVehs || 0;
	const OverSpeed = VehTotal.ospeedVehs || 0;
	const invalidLocations = VehTotal.invalidVehs || 0;

	const chart = {
		series: [
			Offline,
			Idleing,
			Running,
			Stopped,
			OverStreetSpeed,
			OverSpeed,
			invalidLocations,
		],
		options: {

			chart: {
				fontFamily: "Cairo, sans-serif",
				type: "radialBar",
				redrawOnParentResize: true,
			},
			plotOptions: {
				radialBar: {
					offsetY: 0,
					startAngle: 0,
					endAngle: 360,
					track: {
						show: true,
						startAngle: undefined,
						endAngle: undefined,
						background: "#ddd",
						strokeWidth: "97%",
						opacity: 0.2,
						margin: 5,
						dropShadow: {
							enabled: false,
						},
					},

					hollow: {
						margin: 5,
						size: "30%",
						background: "transparent",
						image: undefined,
					},
					dataLabels: {
						colors: ["#585858"],
						name: {
							show: false,
						},

						value: {
							fontSize: "1.5rem",
							show: true,
							offsetY: 9,
							color: "#585858",
						},
					},
				},
			},
			colors: [
				"#c1c1c1",
				"#7668f2",
				"#26c6da",
				"#272727",
				"#f05959",
				"#f2bf59",
				"#70ea6b",
			],
			labels: [
				t("offline_key"),
				t("idling_key"),
				t("running_key"),
				t("stopped_key"),
				t("over_street_speed_key"),
				t("over_speed_key"),
				t("invalid_locations_key"),
			],
			legend: {
				show: true,
				floating: false,
				fontSize: "12rem",
				position: "right",
				labels: {
					useSeriesColors: false,
					colors: ["#585858"],
				},
				formatter: function (seriesName, opts) {
					return seriesName + ":  " + opts.w.globals.series[opts.seriesIndex];
				},
				markers: {
					size: 0,
				},
				itemMargin: {
					vertical: 5,
				},
			},
			responsive: [
				{
					breakpoint: 480,
					options: {
						legend: {
							position: "bottom",
						},
					},
				},
			],
		},

	};
	return (
		<>
			<Col md="12" xl="6">
				<div className="card">
					<div className="card-header d-flex justify-content-between flex-wrap">
						<div className="header-title">
							<h4 className={"card-title " + Styles.head_title}>
								{t("vehicles_status_key")}
							</h4>
						</div>
					</div>
					<div className="card-body">
						<Chart
							options={chart?.options}
							series={chart?.series}
							type="radialBar"
							height="300"
						/>
					</div>
				</div>
			</Col>
		</>
	)
}
