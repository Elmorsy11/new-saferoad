import {
  faCar,
  faCheck,
  faSpinner,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRouter } from "next/router";
import React, { useMemo, useState, useCallback } from "react";
import { Button, Card, Col, Row, Form } from "react-bootstrap";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { toast } from "react-toastify";
import Model from "components/UI/Model";
import AgGridDT from "components/AgGridDT";
import { useTranslation } from "next-i18next";
import { Formik } from "formik";
import Input from "components/formik/Input";
import ReactSelect from "components/formik/ReactSelect/ReactSelect";
import { addEditOperateDriver } from "helpers/yupValidations";
import nationalities from "public/dummyData/nationalities.json";
import {
  fitchUnassignedVehicles,
  addDriver,
  addVehicleToDriver,
} from "services/driversManagement";

export default function Index() {
  const router = useRouter();
  const [vehiclesData, setVehiclesData] = useState(null);
  const [rowSelected, setRowSelected] = useState("");
  const { t } = useTranslation("driversManagement");
  const [vehiclePlateNumber, setVehiclePlateNumber] = useState("");
  const [modalShow, setModalShow] = useState(false);
  const [loading, setloading] = useState(false);
  const [gridApi, setGridApi] = useState(null);
  const [gridColumnApi, setGridColumnApi] = useState(null);
  const [selectedPage, setSelectedPage] = useState("");

  //fetch vehicle Data
  const onGridReady = useCallback(async (params) => {
    try {
      const respond = await fitchUnassignedVehicles();
      setVehiclesData(respond.unAssingedVehs);
      setGridApi(params?.api);
      setGridColumnApi(params?.columnApi);
    } catch (error) {
      toast.error(error.response.data.message);
    }
  }, []);

  // func pass selected vehicle to ag grid when open vehciles list
  const onFirstDataRendered = useCallback(
    (e) => {
      e.api.paginationGoToPage(selectedPage);
      e.api.forEachNode((node) =>
        node.setSelected(
          !!node.data && node.data.PlateNumber === vehiclePlateNumber
        )
      );
    },
    [vehiclePlateNumber, selectedPage]
  );

  // columns for ag grid
  const columns = useMemo(
    () => [
      {
        headerName: `${t("Select")}`,
        field: "Select",
        maxWidth: 70,
        sortable: false,
        unSortIcon: false,
        checkboxSelection: true,
        filter: false,
      },
      {
        headerName: `${t("Vehicle ID")}`,
        field: "VehicleID",
      },
      {
        headerName: `${t("Vehicle Name")}`,
        field: "DisplayName",
      },
      {
        headerName: `${t("Plate Name")}`,
        field: "PlateNumber",
      },
      {
        headerName: `${t("Manufacturing Year")}`,
        field: "MakeYear",
      },
      {
        headerName: `${t("Group Name")}`,
        field: "GroupName",
      },
    ],
    [t]
  );

  //the setting of the AG grid table .. sort , filter , etc...
  const defaultColDef = useMemo(() => {
    return {
      sortable: true,
      flex: 1,
      resizable: true,
      filter: true,
    };
  }, []);

  // make min birthday is 17 years old from today
  const date = new Date().setFullYear(new Date().getFullYear() - 17);
  const maxLicenceBirthDate = new Date(date).toISOString().slice(0, 10);

  //make min licence expire Date is today
  const minLicenceExDate = new Date().toISOString().slice(0, 10);

  const getFormData = (values) => {
    setVehiclePlateNumber(values.SelectedVehiclePlateNumber);
  };

  const initialValues = {
    FirstName: "",
    LastName: "",
    DateOfBirth: "",
    Nationality: "",
    PhoneNumber: "",
    Email: "",
    DLNumber: "",
    DLExpirationDate: "",
    Department: "",
    RFID: "",
    Image: "",
    SelectedVehiclePlateNumber: "",
    IdentityNumber: "",
    DateOfBirthHijri: "",
    MobileNumber: "",
  };

  const onSubmit = async (data) => {
    const submitData = {
      ...data,
      DLClass: "1",
      StartTime: "2017-08-23T00:00:00.000Z",
      EndTime: "2017-08-23T00:00:00.000Z",
      UDID: "1",
      WorkingDays: "h",
      ASPNetID: null,
      IsDeleted: 0,
      EmployeeID: "12121212",
      DateOfJoin: "2018-01-31T00:00:00.000Z",
      AccountID: 1,
      referencKey: null,
    };

    setloading(true);
    try {
      const respond = await addDriver(submitData);
      toast.success("Driver Add Successfully.");
      if (submitData.SelectedVehiclePlateNumber) {
        try {
          await addVehicleToDriver(
            respond.driver[0][0],
            rowSelected.VehicleID
          );
          toast.success("Vehicle Assigned Successfully");
          setloading(false);
        } catch (error) {
          setloading(false);
          toast.error(`Error: ${error?.response.data.message}`);
        }
      }
      setloading(false);
      router.push("/drivers-management");
    } catch (error) {
      setloading(false);
      toast.error(`Error: ${error?.response.data.message}`);
    }
  };

  return (
    <>
      <Card>
        <Card.Header className="h3">Add New Driver</Card.Header>
        <Card.Body>
          <Formik
            initialValues={initialValues}
            validationSchema={addEditOperateDriver(t)}
            onSubmit={onSubmit}
          >
            {(formik) => {
              setTimeout(() => getFormData(formik.values), 0);
              return (
                <Form onSubmit={formik.handleSubmit}>
                  <Row>
                    <Col md={12}>
                      <Row>
                        <Input
                          placeholder="First Name"
                          label="First Name"
                          name="FirstName"
                          type="text"
                          className={"col-12 col-md-6 col-lg-4 mb-3"}
                        />

                        <Input
                          placeholder="Last Name"
                          label="Last Name"
                          name="LastName"
                          type="text"
                          className={"col-12 col-md-6 col-lg-4 mb-3"}
                        />

                        <Input
                          placeholder="Date Of Birth"
                          label="Date Of Birth"
                          name="DateOfBirth"
                          type="date"
                          min="1900-01-01"
                          max={`${maxLicenceBirthDate}`}
                          className={"col-12 col-md-6 col-lg-4 mb-3"}
                        />

                        <ReactSelect
                          options={nationalities}
                          label="Nationality"
                          name="Nationality"
                          placeholder={"Select Driver Nationality"}
                          className={"col-12 col-md-6 col-lg-4 mb-3"}
                        />

                        <Input
                          placeholder="Phone Number"
                          label="Phone Number"
                          name="PhoneNumber"
                          type="number"
                          className={"col-12 col-md-6 col-lg-4 mb-3"}
                          min={0}
                        />

                        <Input
                          placeholder="Email Address"
                          label="Email"
                          name="Email"
                          type="email"
                          className={"col-12 col-md-6 col-lg-4 mb-3"}
                        />

                        <Input
                          placeholder="Licence Number"
                          label="Licence Number"
                          name="DLNumber"
                          type="number"
                          min={0}
                          className={"col-12 col-md-6 col-lg-4 mb-3"}
                        />

                        <Input
                          placeholder="Licence Expiration Date"
                          label="Licence Expiration Date"
                          name="DLExpirationDate"
                          type="date"
                          className={"col-12 col-md-6 col-lg-4 mb-3"}
                          min={`${minLicenceExDate}`}
                        />

                        <Input
                          placeholder="Department"
                          label="Department"
                          name="Department"
                          type="text"
                          className={"col-12 col-md-6 col-lg-4 mb-3"}
                        />

                        <Input
                          placeholder="RFID"
                          label="RFID"
                          name="RFID"
                          type="text"
                          className={"col-12 col-md-6 col-lg-4 mb-3"}
                        />

                        <Form.Group
                          controlId="formFile"
                          className="col-12 col-md-6 col-lg-4 mb-3"
                        >
                          <Form.Label>Upload Image</Form.Label>
                          <Form.Control
                            className="border-primary"
                            type="file"
                            name="Image"
                            onChange={(event) => {
                              formik.setFieldValue(
                                "Image",
                                event.currentTarget.files[0]
                              );
                            }}
                          />
                        </Form.Group>

                        <Input
                          placeholder="Selected Vehicle Plate Number"
                          label="Selected Vehicle Plate Number"
                          name="SelectedVehiclePlateNumber"
                          type="text"
                          disabled={true}
                          className={"col-12 col-md-6 col-lg-4 mb-3"}
                        />

                        <h4>WASL Integration (Optional)</h4>
                        <Input
                          placeholder="Identity Number"
                          label="Identity Number"
                          name="IdentityNumber"
                          type="text"
                          className={"col-12 col-md-6 col-lg-4 mb-3"}
                        />

                        <Input
                          placeholder="Date Of Birth Hijri"
                          label="Date Of Birth Hijri"
                          name="DateOfBirthHijri"
                          type="text"
                          className={"col-12 col-md-6 col-lg-4 mb-3"}
                        />

                        <Input
                          placeholder="Mobile Number"
                          label="Mobile Number"
                          name="MobileNumber"
                          type="number"
                          min={0}
                          className={"col-12 col-md-6 col-lg-4 mb-3"}
                        />
                      </Row>
                    </Col>
                  </Row>
                  <Model
                    header={"Vehicles List"}
                    show={modalShow}
                    onHide={() => setModalShow(false)}
                    onUpdate={() => {
                      setModalShow(false);
                      formik.setFieldValue(
                        "SelectedVehiclePlateNumber",
                        rowSelected.PlateNumber
                      );
                    }}
                    disabled={rowSelected ? false : true}
                    updateButton={"Assign to Driver"}
                  >
                    <AgGridDT
                      rowHeight={"auto"}
                      columnDefs={columns}
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
                    />
                  </Model>
                  <Row>
                    <div className="w-25 d-flex flex-wrap flex-md-nowrap">
                      <Button
                        className="px-3 py-2 text-nowrap me-3 mb-2 mb-md-0"
                        onClick={(e) => {
                          e.preventDefault();
                          setModalShow(true);
                        }}
                      >
                        <FontAwesomeIcon
                          className="me-2"
                          icon={faCar}
                          size="sm"
                        />
                        Assign Vehicle to Driver
                      </Button>
                      <Button
                        type="submit"
                        disabled={loading}
                        className="px-3 py-2 text-nowrap me-3 mb-2 mb-md-0"
                      >
                        {!loading ? (
                          <FontAwesomeIcon
                            className="mx-2"
                            icon={faCheck}
                            size="sm"
                          />
                        ) : (
                          <FontAwesomeIcon
                            className="mx-2 fa-spin"
                            icon={faSpinner}
                            size="sm"
                          />
                        )}
                        Save
                      </Button>
                      <Button
                        className="px-3 py-2 text-nowrap me-3 ms-0"
                        onClick={(e) => {
                          e.preventDefault();
                          router.push("/drivers-management");
                        }}
                      >
                        <FontAwesomeIcon
                          className="mx-2"
                          icon={faTimes}
                          size="sm"
                        />
                        Cancel
                      </Button>
                    </div>
                  </Row>
                </Form>
              );
            }}
          </Formik>
        </Card.Body>
      </Card>
    </>
  );
}

// translation ##################################
export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["driversManagement", "main"])),
    },
  };
}
// translation ##################################
