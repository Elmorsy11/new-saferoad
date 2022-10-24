import React,{useMemo} from "react";
import { Card, Col } from "react-bootstrap";
import Styles from "styles/Dashboard.module.scss";
import { useTranslation } from "next-i18next";
import AgGridDT from "components/AgGridDT";

export default function Index({ data }) {
  const { t } = useTranslation("Dashboard");

    // change the value of MaintenanceType that came from http reqeust to its name
    const handleMaintenanceType = (params) => {
      const allData = {
        1: "Engine Oil Change",
        2: "Change Vehicle Brakes",
        3: "Vehicle License Renew",
        4: "Vehicle Wash",
        5: "Tires Change",
        6: "Transmission Oil Change",
        7: "Filter Change",
        8: "Others",
      };
      return allData[params?.data?.MaintenanceType];
    };
  
    // change the value of PeriodType that came from http reqeust to its name
    const handlePeriodType = (params) => {
      const allData = {
        1: "By Mileage",
        2: "By Fixed Date",
        4: "By Working Hours",
      };
      return allData[params.data.PeriodType];
    };

    // the default setting of the AG grid table .. sort , filter , etc...
    const defaultColDef = useMemo(() => {
      return {
        sortable: true,
        flex: 1,
        resizable: true,
        filter: true,
      };
    }, []);

  const columns = useMemo(
    () => [
      {
        headerName: `${t("Display_Name")}`,
        field: "DisplayName",
        minWidth: 170,
        sortable: true,
        unSortIcon: true,
      },
      {
        headerName: `${t("Group_Name")}`,
        field: "groupName",
        minWidth: 150,
        sortable: true,
        unSortIcon: true,
      },
      {
        headerName: `${t("Maintenance")}`,
        field: "MaintenanceType",
        valueGetter: handleMaintenanceType,
        minWidth: 150,
        sortable: true,
        unSortIcon: true,
      },
      {
        headerName: `${t("Next_Value")}`,
        field: "NextValue",
        minWidth: 140,
        unSortIcon: true,
      },
      {
        headerName: `${t("Period_Type")}`,
        field: "PeriodType",
        minWidth: 150,
        sortable: true,
        unSortIcon: true,
        valueGetter: handlePeriodType,
      },
    ],
    [t]
  );

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
          <AgGridDT
                rowHeight={65}
                columnDefs={columns}
                rowData={data}
                paginationNumberFormatter={function (params) {
                  return params.value.toLocaleString();
                }}
                defaultColDef={defaultColDef}
                footer={false}
              />
          </Card.Body>
        </Card>
      </Col>
    </>
  );
}