import React, { useMemo, useState, useCallback } from "react";
import { Col, Card } from "react-bootstrap";
import {
  FontAwesomeIcon,
  faFileDownload,
} from "@fortawesome/react-fontawesome";
import { faPlus, faFileCsv, faRandom } from "@fortawesome/free-solid-svg-icons";
// translation
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Link from "next/link";
import {
  fetchAllAssignedDevices,
  fetchAllUnAssignedDevices,
  PostDevicesBulk,
  deleteDevice,
  updateDevice,
  fitchUnassignedVehicles,
} from "services/management/DeviceManagement.js";
import Model from "components/UI/Model";
import DeleteModal from "components/UI/DeleteModal";
import AgGridDT from "components/AgGridDT";
import HideActions from "hooks/HideActions";
import { toast } from "react-toastify";
import Edit from "components/management/DeviceManagement/Edit";
import Bulk from "components/management/Bulk";
import AddDeviceToSim from "components/management/DeviceManagement/AddDeviceToSim"

// when click in download template in bulk, excel data will downloaded
const excelData = [
  {
    SerialNumber: "",
    DeviceType: "",
    Number: "",
    LeftLetter: "",
    MiddleLetter: "",
    RightLetter: "",
    SequenceNumber: "",
    PlateType: "",
  },
];

const ManageDevices = () => {
  const { t } = useTranslation("management");
  // assigned devices
  const [assignedDevices, setAssignedDevices] = useState(null);
  const [assignedGridApi, setAssignedGridApi] = useState(null);
  const [assignedGridColumnApi, setAssignedGridColumnApi] = useState(null);

  // unassigned devices
  const [unassignedDevices, setUnassignedDevices] = useState(null);
  const [unassignedGridApi, setUnassignedGridApi] = useState(null);
  const [unassignedGridColumnApi, setUnassignedGridColumnApi] = useState(null);

  // bulk
  const [bulkModel, setBulkModel] = useState(false);
  const [bulkLoading, setBulkLoading] = useState(false);

  // assign device to vehicle
  const [assignDeviceModel, setAssignDeviceModel] = useState(false);
  const [assignDeviceObj, setAssignDeviceObj] = useState({});
  const [assignDeviceModelLoading, setAssignDeviceModelLoading] =
    useState(false);
  const [vehiclesData, setVehiclesData] = useState(null);
  const [rowSelected, setRowSelected] = useState("");
  const [gridApi, setGridApi] = useState(null);
  const [gridColumnApi, setGridColumnApi] = useState(null);
  const [selectedPage, setSelectedPage] = useState("");

  // unassign Device from vehicle
  const [unassignDeviceModel, setUnassignDeviceModel] = useState(false);
  const [unassignDeviceObj, setUnassignDeviceObj] = useState({});
  const [unassignDeviceModelLoading, setUnassignDeviceModelLoading] =
    useState(false);

  // assign SIM to device
  const [assignSIMModel, setAssignSIMModel] = useState(false);
  const [assignSIMToDeviceObj, setAssignSIMToDeviceObj] = useState({});

  // unassign SIM from device
  const [unassignSIMModel, setUnassignSIMModel] = useState(false);
  const [unassignSIMObj, setUnassignSIMObj] = useState({});
  const [unassignSIMModelLoading, setUnassignSIMModelLoading] = useState(false);

  // edit
  const [editModalShow, setEditModalShow] = useState(false);
  const [editId, setEditId] = useState("");

  // delete
  const [showModalDelete, setShowModalDelete] = useState(false);
  const [deleteId, setDeleteId] = useState("");
  const [loadingDelete, setLoadingDelete] = useState();


  // fetch Assigned vehicles data
  const onAssigndGridReady = useCallback(async (params) => {
    try {
      const respond = await fetchAllAssignedDevices();
      setAssignedDevices(respond.result);
      setAssignedGridApi(params.api);
      setAssignedGridColumnApi(params.columnApi);
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  }, []);

  // fetch unassigned vehicles data
  const onUnassigndGridReady = useCallback(async (params) => {
    try {
      const respond = await fetchAllUnAssignedDevices();
      setUnassignedDevices(respond.unAssignedDevices);
      setUnassignedGridApi(params.api);
      setUnassignedGridColumnApi(params.columnApi);
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  }, []);

  //fetch vehicle Data
  const onGridReady = useCallback(async (params) => {
    try {
      const respond = await fitchUnassignedVehicles();
      setVehiclesData(respond.unAssingedVehs);
      setGridApi(params?.api);
      setGridColumnApi(params?.columnApi);
    } catch (error) {
      toast.error(error.response.data?.message);
    }
  }, []);

  // bulk submitted function
  const bulkDataHandler = async (data) => {
    setBulkLoading(true);
    try {
      const respond = await PostDevicesBulk(data);
      setBulkLoading(false);
      setBulkModel(false);
      toast.success("Bulk added successfully");
    } catch (error) {
      toast.error(error.response.data?.message);
      setBulkLoading(false);
    }
  };

  // delete model
  const onDelete = async () => {
    setLoadingDelete(true);
    try {
      const respond = await deleteDevice(deleteId);
      setUnassignedDevices((prev) =>
        prev.filter((ele) => ele.DeviceID !== deleteId)
      );
      toast.success(respond.message);
      setLoadingDelete(false);
      setShowModalDelete(false);
    } catch (error) {
      toast.error(error.response.data?.message);
      setLoadingDelete(false);
      setShowModalDelete(false);
    }
  };

  // assign device to vehicle
  const assignDeviceToVehicle = async () => {
    const submitData = {
      ...assignDeviceObj,
      VehicleID: rowSelected.VehicleID,
    };
    setAssignDeviceModelLoading(true);
    try {
      const respond = await updateDevice(assignDeviceObj.DeviceID, submitData);
      setAssignDeviceModelLoading(false);
      toast.success(respond.message);
      setAssignDeviceModel(false);
      onAssigndGridReady();
      onUnassigndGridReady();
    } catch (error) {
      toast.error(error.response.data?.message);
      setAssignDeviceModelLoading(false);
    }
  };

  // unassign device from vehicle
  const unassignDeviceToVehicle = async () => {
    const submitData = {
      ...unassignDeviceObj,
      VehicleID: null,
    };
    setUnassignDeviceModelLoading(true);
    try {
      const respond = await updateDevice(
        unassignDeviceObj.DeviceID,
        submitData
      );
      setUnassignDeviceModelLoading(false);
      toast.success(respond.message);
      unassignDeviceModel(false);
      onAssigndGridReady();
      onUnassigndGridReady();
    } catch (error) {
      toast.error(error.response.data?.message);
      setUnassignDeviceModelLoading(false);
    }
  };

  // unassign Sim from device
  const unassignSIMToDevice = async () => {
    const submitData = {
      ...unassignSIMObj,
      simID: null,
    };
    setUnassignSIMModelLoading(true);
    try {
      const respond = await updateDevice(unassignSIMObj.DeviceID, submitData);
      setUnassignSIMModelLoading(false);
      toast.success(respond.message);
      unassignSIMModel(false);
      onAssigndGridReady();
      onUnassigndGridReady();
    } catch (error) {
      toast.error(error.response.data?.message);
      setUnassignSIMModelLoading(false);
    }
  };

  // column for assigned devices
  const columnsAssigned = useMemo(
    () => [
      {
        headerName: `${t("serial_number_key")}`,
        field: "SerialNumber",
        minWidth: 150,
        sortable: true,
        unSortIcon: true,
        cellRenderer: (params) => {
          return (
            <>
              <div>{params.value}</div>
              <div className="d-flex justify-content-start gap-1 options flex-wrap">
                <span
                  onClick={() => {
                    setEditId(params.data.DeviceID);
                    setEditModalShow(true);
                  }}
                  className=""
                >
                  {t("edit_key")}
                </span>
                {params.data.simID ? (
                  <span
                    onClick={() => {
                      setUnassignSIMModel(true);
                      setUnassignSIMObj(params.data);
                    }}
                    className=""
                  >
                    | {t("unassign_sim_cards_key")}
                  </span>
                ) : (
                  <span
                    onClick={() => {
                      setAssignSIMModel(true);
                      setAssignSIMToDeviceObj(params.data)
                    }}
                    className=""
                  >
                    | {t("assign_sim_cards_key")}
                  </span>
                )}
                <span
                  onClick={() => {
                    setUnassignDeviceModel(true);
                    setUnassignDeviceObj(params.data);
                  }}
                  className=""
                >
                  | {t("unassign_device_key")}
                </span>
              </div>
            </>
          );
        },
      },
      {
        headerName: `${t("device_type_key")}`,
        field: "DeviceType",
        minWidth: 150,
        sortable: true,
        unSortIcon: true,
      },
      {
        headerName: `${t("vehicle_plate_number_key")}`,
        field: "PlateNumber",
        minWidth: 150,
        sortable: true,
        unSortIcon: true,
      },
    ],
    [t]
  );

  // column for unassigned devices
  const columnsUnassigned = useMemo(
    () => [
      {
        headerName: `${t("device_serial_number_key")}`,
        field: "SerialNumber",
        minWidth: 150,
        sortable: true,
        unSortIcon: true,
        cellRenderer: (params) => {
          return (
            <>
              <div>{params.value}</div>
              <div className="d-flex justify-content-start gap-1 options flex-wrap">
                <span
                  onClick={() => {
                    setEditId(params.data.DeviceID);
                    setEditModalShow(true);
                  }}
                  className=""
                >
                  {t("edit_key")}
                </span>
                <span
                  onClick={() => {
                    setShowModalDelete(true);
                    setDeleteId(params.data.DeviceID);
                  }}
                  className=""
                >
                  | {t("delete_key")}
                </span>
                {params.data.simID ? (
                  <span
                    onClick={() => {
                      setUnassignSIMModel(true);
                      setUnassignSIMObj(params.data);
                    }}
                    className=""
                  >
                    | {t("unassign_sim_cards_key")}
                  </span>
                ) : (
                  <span
                    onClick={() => {
                      setAssignSIMModel(true)
                      setAssignSIMToDeviceObj(params.data)
                    }}
                    className=""
                  >
                    | {t("assign_sim_cards_key")}
                  </span>
                )}
                <span
                  onClick={() => {
                    setAssignDeviceModel(true);
                    setAssignDeviceObj(params.data);
                  }}
                  className=""
                >
                  | {t("assign_device_key")}
                </span>
              </div>
            </>
          );
        },
      },
      {
        headerName: `${t("device_type_key")}`,
        field: "DeviceType",
        minWidth: 120,
        unSortIcon: true,
      },
    ],
    [t]
  );

  // func pass selected vehicle to ag grid when open vehciles list
  const onFirstDataRendered = useCallback(
    (e) => {
      e.api.paginationGoToPage(selectedPage);
    },
    [selectedPage]
  );

  // columns for ag grid
  const vehiclesColumns = useMemo(
    () => [
      {
        headerName: `${t("select_key")}`,
        field: "Select",
        maxWidth: 70,
        sortable: false,
        unSortIcon: false,
        checkboxSelection: true,
        filter: false,
      },
      {
        headerName: `${t("display_name_key")}`,
        field: "DisplayName",
      },
      {
        headerName: `${t("plate_number_key")}`,
        field: "PlateNumber",
      },
      {
        headerName: `${t("manufacturing_year_key")}`,
        field: "MakeYear",
      },
      {
        headerName: `${t("group_name_key")}`,
        field: "GroupName",
      },
    ],
    [t]
  );

  const defaultColDef = useMemo(() => {
    return {
      sortable: true,
      flex: 1,
      resizable: true,
      filter: true,
    };
  }, []);

  return (
    <div className="container-fluid">
      <Col sm="12">
        <Card className="h-100">
          <Card.Header className="d-flex justify-content-between">
            <div className="w-100 header-title d-flex justify-content-between align-items-center p-3 flex-column flex-md-row">
              <div>
                <Link
                  href="/management/device-management/add/add-device"
                  passHref
                >
                  <button
                    type="button"
                    className="btn btn-primary  px-3 py-2 me-3 mb-2"
                  >
                    <FontAwesomeIcon className="me-2" icon={faPlus} size="sm" />
                    {t("add_device_key")}
                  </button>
                </Link>
                <button
                  type="button"
                  className="btn btn-primary  px-3 py-2 me-3 mb-2"
                  onClick={() => {
                    setBulkModel(true);
                  }}
                >
                  <FontAwesomeIcon
                    className="me-2"
                    icon={faFileCsv}
                    size="sm"
                  />
                  {t("add_bulk_of_devices_key")}
                </button>
                <button
                  type="button"
                  className="btn btn-primary  px-3 py-2 me-3 mb-2"
                  disabled={true}
                >
                  <FontAwesomeIcon className="me-2" icon={faRandom} size="sm" />
                  {t("transfer_device_to_account_key")}
                </button>
              </div>
            </div>
          </Card.Header>
          <Card.Body>
            <AgGridDT
              columnDefs={columnsAssigned}
              rowData={assignedDevices}
              paginationNumberFormatter={function (params) {
                return params.value.toLocaleString();
              }}
              defaultColDef={defaultColDef}
              onGridReady={onAssigndGridReady}
              gridApi={assignedGridApi}
              gridColumnApi={assignedGridColumnApi}
              onCellMouseOver={(e) =>
                (e.event.path[1].dataset.test = "showActions")
              }
              onCellMouseOut={HideActions}
            />
          </Card.Body>
        </Card>
      </Col>

      {/* ================== second table  ===================== */}
      <Col sm="12">
        <Card className="h-100">
          <nav className="navbar navbar-dark navbar-lg shadow rounded p-3">
            <h3>{t("unassigned_devices_key")}</h3>
          </nav>
          <Card.Body>
            <AgGridDT
              columnDefs={columnsUnassigned}
              rowData={unassignedDevices}
              paginationNumberFormatter={function (params) {
                return params.value.toLocaleString();
              }}
              defaultColDef={defaultColDef}
              onGridReady={onUnassigndGridReady}
              gridApi={unassignedGridApi}
              gridColumnApi={unassignedGridColumnApi}
              onCellMouseOver={(e) =>
                (e.event.path[1].dataset.test = "showActions")
              }
              onCellMouseOut={HideActions}
            />

            <DeleteModal
              show={showModalDelete}
              loading={loadingDelete}
              title={t("are_you_sure?_key")}
              description={t("are_you_sure_you_want_to_delete_this_device?_key")}
              confirmText={t("yes,_delete_it!_key")}
              cancelText={t("no,_cancel_key")}
              onConfirm={onDelete}
              onCancel={() => {
                setShowModalDelete(false);
              }}
            />

            {/* Edit Model */}
            <Model
              header={t("update_device_information_key")}
              show={editModalShow}
              onHide={() => setEditModalShow(false)}
              updateButton={t("update_key")}
              footer={false}
              size={"lg"}
              className={"mt-5"}
            >
              <Edit
                handleModel={() => {
                  setEditModalShow(false);
                }}
                editId={editId}
                updateAssignedTable={onAssigndGridReady}
                updateUnassignedTable={onUnassigndGridReady}
              />
            </Model>

            {/* Bulk Model */}
            <Model
              header={t("add_devices_bulk_key")}
              show={bulkModel}
              onHide={() => setBulkModel(false)}
              updateButton={t("update_key")}
              footer={false}
              size={"xl"}
              className={"mt-5"}
            >
              <Bulk
                excelData={excelData}
                handleModel={() => {
                  setBulkModel(false);
                }}
                modelButtonMsg={t("download_template_key")}
                icon={faFileDownload}
                fileName={"DevicesPatch"}
                bulkRequest={bulkDataHandler}
                loading={bulkLoading}
              />
            </Model>

            {/* assign device to vehicle Model */}
            <Model
              header={t("assign_device_to_vehicle_key")}
              show={assignDeviceModel}
              onHide={() => setAssignDeviceModel(false)}
              updateButton={t("assign_key")}
              size={"xl"}
              className={"mt-5"}
              onUpdate={assignDeviceToVehicle}
              disabled={rowSelected ? assignDeviceModelLoading : true}
            >
              <AgGridDT
                rowHeight={"auto"}
                columnDefs={vehiclesColumns}
                rowData={vehiclesData}
                rowSelection={"single"}
                paginationPageSize={10}
                defaultColDef={defaultColDef}
                onGridReady={onGridReady}
                onSelectionChanged={(e) => {
                  setSelectedPage(e.api.paginationProxy.currentPage);
                  setRowSelected([...e.api.getSelectedRows()][0]);
                }}
                onFirstDataRendered={onFirstDataRendered}
                gridApi={gridApi}
                gridColumnApi={gridColumnApi}
                footer={false}
              />
            </Model>

            {/* unassign device from vehicle Model */}
            <Model
              header={t("unassign_device_key")}
              show={unassignDeviceModel}
              onHide={() => setUnassignDeviceModel(false)}
              updateButton={t("unassign_key")}
              size={"xl"}
              className={"mt-5"}
              onUpdate={unassignDeviceToVehicle}
              disabled={unassignDeviceModelLoading}
            >
              <h4 className="text-center">
                {t("are_you_sure_you_want_to_unassign_this_device?_key")}
              </h4>
            </Model>

            {/* assign SIM to device */}
            <Model
              header={t("assign_SIM_card_to_device_key")}
              show={assignSIMModel}
              onHide={() => setAssignSIMModel(false)}
              updateButton={t("assign_key")}
              size={"xl"}
              className={"mt-5"}
              footer={false}
            >
              <AddDeviceToSim
                handleModel={() => {
                  setAssignSIMModel(false);
                }}
                deviceData={assignSIMToDeviceObj}
                updateAssignedTable={onAssigndGridReady}
                updateUnassignedTable={onUnassigndGridReady}
              />
            </Model>

            {/* unassign SIM from device */}
            <Model
              header={t("unassign_SIM_card_key")}
              show={unassignSIMModel}
              onHide={() => setUnassignSIMModel(false)}
              updateButton={t("unassign_key")}
              size={"xl"}
              className={"mt-5"}
              onUpdate={unassignSIMToDevice}
              disabled={unassignSIMModelLoading}
            >
              <h4 className="text-center">
                {t("are_you_sure_you_want_to_unassign_this_SIM_card?_key")}
              </h4>
            </Model>
          </Card.Body>
        </Card>
      </Col>
    </div>
  );
};

export default ManageDevices;

// translation ##################################
export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["management", "main"])),
    },
  };
}

// translation ##################################
