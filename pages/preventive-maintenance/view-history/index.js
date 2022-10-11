import React, { useState, useCallback, useMemo } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHistory } from "@fortawesome/free-solid-svg-icons";
// translation
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { Button, Card } from "react-bootstrap";
import Link from "next/link";
import AgGridDT from "components/AgGridDT";
import { viewHistory } from "services/preventiveMaintenance";
import { toast } from "react-toastify";

const ViewHistory = () => {
  const { t } = useTranslation("main");
  const [gridApi, setGridApi] = useState(null);
  const [gridColumnApi, setGridColumnApi] = useState(null);
  const [DataTable, setDataTable] = useState(null);

  // fecth all history data and set the Api of the AG grid table for export pdf
  const onGridReady = useCallback(async (params) => {
    try {
      const respond = await viewHistory();
      setDataTable(respond.result);
      setGridApi(params.api);
      setGridColumnApi(params.columnApi);
    } catch (error) {
      toast.error(error.response.data.message);
    }
  }, []);

  // the default setting of the AG grid table .. sort , filter , etc...
  const defaultColDef = useMemo(() => {
    return {
      sortable: true,
      flex: 1,
      resizable: true,
      filter: true,
      unSortIcon: true,
    };
  }, []);

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
      3: "By Working Hours",
    };
    return allData[params?.data?.PeriodType];
  };

  // change the value of Recurring that came from http reqeust to true/false
  const handleRecurring = (params) => {
    return params?.data?.Recurring ? "true" : "false";
  };

  // change the value of NotifyPeriod that came from http reqeust to its name
  const handleNotifyPeriod = (params) => {
    const allData = {
      1: "Percentage",
      2: "Value",
    };
    return allData[params?.data?.WhenPeriod];
  };

  // columns used in ag grid
  const columns = useMemo(
    () => [
      {
        headerName: `${t("Display_Name")}`,
        field: "DisplayName",
        minWidth: 200,
      },
      {
        headerName: `${t("Plate_Number")}`,
        field: "PlateNumber",
        minWidth: 150,
      },
      {
        headerName: `${t("Maintenance")}`,
        field: "MaintenanceType",
        minWidth: 150,
        valueGetter: handleMaintenanceType,
      },
      {
        headerName: `${t("Period_Type")}`,
        field: "PeriodType",
        minWidth: 140,
        valueGetter: handlePeriodType,
      },
      {
        headerName: `${t("Start_Value")}`,
        field: "StartValue",
        minWidth: 140,
      },
      {
        headerName: `${t("Maintenance_Due_Value")}`,
        field: "NextValue",
        minWidth: 200,
      },
      {
        headerName: `${t("Recurring")}`,
        field: "Recurring",
        minWidth: 120,
        valueGetter: handleRecurring,
      },
      {
        headerName: `${t("Notify_Period")}`,
        field: "NotifPeriod",
        minWidth: 150,
        valueGetter: handleNotifyPeriod,
      },
      {
        headerName: `${t("Notify_when_Value")}`,
        field: "WhenValue",
        minWidth: 180,
      },
      {
        headerName: `${t("Current_Value")}`,
        field: "CurrentValue",
        minWidth: 150,
      },
      {
        headerName: `${t("Original_Value")}`,
        field: "OrginalValue",
        minWidth: 160,
      },
    ],
    [t]
  );

  return (
    <div className="container-fluid">

      <Card>
        <Card.Body>
          <div className="d-flex justify-content-center justify-content-md-between flex-wrap">
            <div className="d-flex justify-content-center flex-wrap mb-4">
              <Link href="/preventive-maintenance" passHref>
                <Button
                  variant="primary p-1 d-flex align-items-center"
                  className="m-1"
                  style={{ fontSize: "13px" }}
                >
                  <FontAwesomeIcon
                    className="me-2"
                    icon={faHistory}
                    size="sm"
                  />
                  {t("Back")}
                </Button>
              </Link>
            </div>
          </div>

          <AgGridDT
            columnDefs={columns}
            rowData={DataTable}
            paginationNumberFormatter={function (params) {
              return params.value.toLocaleString();
            }}
            defaultColDef={defaultColDef}
            onGridReady={onGridReady}
            gridApi={gridApi}
            gridColumnApi={gridColumnApi}
          />
        </Card.Body>
      </Card>

    </div>
  );
};

export default ViewHistory;

// translation ##################################
export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["main"])),
    },
  };
}
// translation ##################################
