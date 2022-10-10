import React from "react";
import { Card, Col, Table } from "react-bootstrap";
import Styles from "styles/Dashboard.module.scss";
import { useTranslation } from "next-i18next";

export default function Index({ data }) {
  const { t } = useTranslation("dashboard");

  return (
    <>
      <Col sm="12">
        <Card>
          <Card.Header className="d-flex justify-content-between">
            <h4 className={"card-title " + Styles.head_title}>
              {t("next_repair_plans_key")}
            </h4>
          </Card.Header>
          <Card.Body>
            <Table striped bordered hover responsive>
              <thead>
                <tr>
                  {[
                    "#",
                    t("display_name_key"),
                    t("group_name_key"),
                    t("maintenance_type_key"),
                    t("start_value_key"),
                    t("next_value_key"),
                    t("period_type_key"),
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
