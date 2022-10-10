import React from "react";
import { Card, Col, Table } from "react-bootstrap";
import Styles from "styles/Dashboard.module.scss";
import { useTranslation } from "next-i18next";

export default function Index({ data }) {
  const { t } = useTranslation("Dashboard");

  return (
    <>
      <Col sm="12">
        <Card>
          <Card.Header className="d-flex justify-content-between">
            <h4 className={"card-title " + Styles.head_title}>
              {t("Next_repair_plans")}
            </h4>
          </Card.Header>
          <Card.Body>
            <Table striped bordered hover responsive>
              <thead>
                <tr>
                  {[
                    t("#"),
                    t("Display_Name"),
                    t("Group_name"),
                    t("Maintenance_Type"),
                    t("Start_Value"),
                    t("Next_value"),
                    t("Period_Type"),
                  ]?.map((ele, i) => (
                    <th key={i}>{ele}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data?.Upcoming_Maintenance_Plans?.map((item, index) => (
                  <tr key={index}>
                    <td className="text-start">{index + 1}</td>
                    <td className="text-start">
                      {item?.DisplayName || "____"}
                    </td>
                    <td className="text-start">{item?.groupName || "____"}</td>
                    <td className="text-start">
                      {item?.MaintenanceType || "____"}
                    </td>
                    <td className="text-start">{item?.StartValue || "____"}</td>
                    <td className="text-start">{item?.PeriodType || "____"}</td>
                    <td className="text-start">{item?.NextValue || "____"}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Card.Body>
        </Card>
      </Col>
    </>
  );
}
