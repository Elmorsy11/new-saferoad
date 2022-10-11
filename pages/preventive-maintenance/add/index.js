import { faCheck, faSpinner, faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRouter } from "next/router";
import { Button, Card, Row } from "react-bootstrap";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { toast } from "react-toastify";
import { useEffect, useCallback, useState } from "react";
import useStreamDataState from "hooks/useStreamDataState";
import { encryptName } from "helpers/encryptions";
import { Formik, Form } from "formik";
import { addPreventiveMaintenanceValidation } from "helpers/yupValidations";
import React from "react";
import Input from "components/formik/Input";
import ReactSelect from "components/formik/ReactSelect/ReactSelect";
import Checkbox from "components/formik/Checkbox";
import { addNewPreventive } from "services/preventiveMaintenance";
import Link from "next/link";

//data of react select
const optionsMaintenanceType = [
  {
    value: 1,
    label: "Engine Oil Change",
  },
  {
    value: 2,
    label: "Change Vehicle Brakes",
  },
  {
    value: 3,
    label: "Vehicle License Renew",
  },
  {
    value: 4,
    label: "Vehicle Wash",
  },
  {
    value: 5,
    label: "Tires Change",
  },
  {
    value: 6,
    label: "Transmission Oil Change",
  },
  {
    value: 7,
    label: "Filter Change",
  },
  {
    value: 8,
    label: "Others",
  },
];
const optionsPeriodType = [
  {
    value: 1,
    label: "By Mileage",
  },
  {
    value: 2,
    label: "By Fixed Date",
  },
  {
    value: 3,
    label: "By Working Hours",
  },
];
const optionsNotifyPeriod = [
  {
    value: "1",
    label: "Percentage",
  },
  {
    value: "2",
    label: "Value",
  },
];

const FormikAdd = () => {
  const router = useRouter();
  const [vehicles, setVehicles] = useState([]);
  const [selectedVehicles, setSelectedVehicles] = useState([]);
  const [selectedVehiclesData, setSelectedVehiclesData] = useState([]);
  const [periodType, setPeriodType] = useState("");
  const [fixedDateCase, setFixedDateCase] = useState(false);
  const [notifyType, setNotifyType] = useState("");
  const [valueNotifyType, setValueNotifyType] = useState(false);
  const [maintenanceDueValue, setMaintenanceDueValue] = useState("");
  const [startValue, setStartValue] = useState([]);
  const [nextValue, setNextValue] = useState("");
  const [whenValue, setWhenValue] = useState("");
  const [percentageValue, setPercentageValue] = useState("");

  const [valueNotifyPeriodError, setValueNotifyPeriodError] = useState(false);

  const [loading, setloading] = useState(false);

  // minimum date used in date inputs
  const minDate = new Date().toISOString().slice(0, 10);

  // update localstorage with new vehicles data
  const { indexStreamLoader } = useStreamDataState();
  useEffect(() => {
    indexStreamLoader();
  }, []);

  // helper func to make Mileage and working hours logic
  const periodTypeFunc = useCallback(
    (vehiclesData, vehiclesDataType, type) => {
      setStartValue(
        vehiclesData?.length === 1
          ? [vehiclesData[0]?.[`${type}`]]
          : vehiclesData?.length > 1
            ? vehiclesDataType
            : 0
      );

      setNextValue(
        vehiclesData?.length === 1
          ? [vehiclesData[0]?.[`${type}`] + +maintenanceDueValue]
          : vehiclesData?.length > 1
            ? vehiclesDataType.map((vehicle) => vehicle + +maintenanceDueValue)
            : 0
      );

      if (notifyType === "1") {
        setValueNotifyType(false);
        setWhenValue(
          vehiclesData?.length === 1
            ? [
              vehiclesData[0]?.[`${type}`] +
              +maintenanceDueValue * (+percentageValue / 100),
            ]
            : vehiclesData?.length > 1
              ? vehiclesDataType.map(
                (vehicle) =>
                  vehicle + +maintenanceDueValue * (+percentageValue / 100)
              )
              : 0
        );
        // delete Value Notify Period Error if Percentage selected
        setValueNotifyPeriodError(false);
      } else if (notifyType === "2") {
        setValueNotifyType(true);
      }
      setFixedDateCase(false);
    },
    [notifyType, percentageValue, maintenanceDueValue]
  );

  // fetch all vehicles data form local storage
  useEffect(() => {
    const userData =
      localStorage.getItem(encryptName("userData")) &&
      JSON.parse(localStorage.getItem(encryptName("userData")) || {});
    setVehicles(userData?.vehData);

    // add selected vehciles to state
    const vehiclesData = userData?.vehData?.filter((driver) =>
      selectedVehicles.includes(driver.VehicleID)
    );
    setSelectedVehiclesData(vehiclesData);

    const vehiclesMileage = vehiclesData?.map((vehicle) => vehicle.Mileage);
    const vehiclesHours = vehiclesData?.map((vehicle) => vehicle.WorkingHours);

    // conditions of period Type equal to Mileage
    if (periodType === 1) {
      periodTypeFunc(vehiclesData, vehiclesMileage, "Mileage");
      // conditions of period Type equal to WorkingHours
    } else if (periodType === 3) {
      periodTypeFunc(vehiclesData, vehiclesHours, "WorkingHours");
      // conditions of period Type equal to Fixed DAte
    } else if (periodType === 2) {
      setFixedDateCase(true);
      const today = new Date().toISOString().slice(0, 10);
      setStartValue(today);
      setNextValue(maintenanceDueValue);
    }
  }, [selectedVehicles, periodType, periodTypeFunc, maintenanceDueValue]);

  // vehicles options to select a vehicle or more
  const vehiclesOptions = vehicles?.map((vehicle) => {
    return {
      value: vehicle?.VehicleID,
      label: vehicle?.DisplayName,
    };
  });

  const initialValues = {
    selectedVehicles: [],
    MaintenanceType: 1,
    PeriodType: 1,
    StartValue: 0,
    MaintenanceDueValue: "",
    NextValue: 0,
    NotifyByEmail: "",
    Recurring: [],
    NotifyByPush: [],
    NotifMessage: "",
    WhenPeriod: "1",
    PercentageValue: "",
    WhenValue: "",
  };

  const getFormData = (values) => {
    setSelectedVehicles(values.selectedVehicles);
    setPeriodType(values.PeriodType);
    setNotifyType(values.WhenPeriod);
    setMaintenanceDueValue(values.MaintenanceDueValue);
    setPercentageValue(values.PercentageValue);
    if (values.PeriodType === 2) {
      setWhenValue(values.WhenValue);
    }
    if (notifyType === "2") {
      setWhenValue(values.WhenValue);
    }
  };

  const onSubmit = async (data) => {
    const StartValue =
      startValue?.length > 1 && typeof startValue !== "string"
        ? [...startValue]
        : startValue;
    const NextValue =
      nextValue?.length > 1 && typeof nextValue !== "string"
        ? [...nextValue]
        : nextValue;
    const WhenValue =
      whenValue?.length > 1 && typeof whenValue !== "string"
        ? [...whenValue]
        : whenValue;
    const VehicleId = data?.selectedVehicles;

    const Vehicles = VehicleId?.map((id, index) => {
      return {
        vehicleId: id,
        StartValue: periodType === 2 ? StartValue : StartValue[index],
        NextValue: periodType === 2 ? NextValue : NextValue[index],
        WhenValue:
          periodType === 2
            ? WhenValue
            : notifyType === "2"
              ? WhenValue
              : WhenValue[index],
      };
    });

    const submitedData = {
      MaintenanceDueValue: data.MaintenanceDueValue,
      NotifMessage: data.NotifMessage,
      NotifyByEmail: data.NotifyByEmail,
      PercentageValue: data.PercentageValue,
      Vehicles,
      Recurring: data.Recurring.length === 1 ? 1 : 0,
      NotifyByPush: data.NotifyByPush.length === 1 ? 1 : 0,
      MaintenanceType: data.MaintenanceType,
      PeriodType: data.PeriodType,
      NotifyPeriod: data.WhenPeriod,
      WhenPeriod: data.WhenPeriod,
      NotifyBySMS: null,
      IsNotified: null,
    };

    // validation when select more than one vehicle and select value option in period type
    if (selectedVehicles.length > 1 && notifyType === "2" && periodType !== 2) {
      setValueNotifyPeriodError(true);
      return;
    }
    setValueNotifyPeriodError(false);

    setloading(true);
    try {
      const respond = await addNewPreventive(submitedData);
      toast.success(respond.result);
      setloading(false);
      router.push("/preventive-maintenance");
    } catch (error) {
      toast.error(error.response.data.message);
      setloading(false);
    }
  };

  return (
    <>
      <Card>
        <Card.Header className="h3">Add Maintenance Plan</Card.Header>
        <Card.Body>
          <Formik
            initialValues={initialValues}
            validationSchema={addPreventiveMaintenanceValidation(
              fixedDateCase,
              minDate,
              startValue,
              nextValue,
              selectedVehiclesData
            )}
            onSubmit={onSubmit}
          >
            {(formik) => {
              setTimeout(() => getFormData(formik.values), 0);
              return (
                <Form>
                  <Row>
                    <ReactSelect
                      options={vehiclesOptions}
                      label="Select vehicles"
                      name="selectedVehicles"
                      placeholder={"Select vehicles"}
                      className={"col-12 col-md-6 col-lg-4 mb-3"}
                      isSearchable={true}
                      isMulti={true}
                    />

                    <ReactSelect
                      options={optionsMaintenanceType}
                      label="Maintenance Type"
                      name="MaintenanceType"
                      placeholder={"Select Maintenance Type"}
                      className={"col-12 col-md-6 col-lg-4 mb-3"}
                      isSearchable={true}
                    />

                    <ReactSelect
                      options={optionsPeriodType}
                      label="Period Type"
                      name="PeriodType"
                      placeholder={"Select Period Type"}
                      className={"col-12 col-md-6 col-lg-4 mb-3"}
                      isSearchable={true}
                    />

                    {!(selectedVehiclesData?.length > 1) && !fixedDateCase && (
                      <Input
                        placeholder="Start Value"
                        label="Start Value"
                        name="StartValue"
                        type="number"
                        className={"col-12 col-md-6 col-lg-4 mb-3"}
                        disabled={true}
                        value={(formik.values.StartValue = startValue)}
                      />
                    )}

                    <Input
                      placeholder="Maintenance Due Value"
                      label="Maintenance Due Value"
                      name="MaintenanceDueValue"
                      type={fixedDateCase ? "date" : "number"}
                      className={"col-12 col-md-6 col-lg-4 mb-3"}
                      min={fixedDateCase ? minDate : 0}
                      onFocus={(event) => event.target.select()}
                    />

                    {!(selectedVehiclesData?.length > 1) && !fixedDateCase && (
                      <Input
                        placeholder="Next Value"
                        label="Next Value"
                        name="NextValue"
                        type="number"
                        className={"col-12 col-md-6 col-lg-4 mb-3"}
                        disabled={true}
                        value={(formik.values.NextValue = nextValue)}
                      />
                    )}

                    <Input
                      type="email"
                      name="NotifyByEmail"
                      label="Email Address"
                      placeholder="Email Address"
                      className={"col-12 col-md-6 col-lg-4 mb-2"}
                    />

                    <Row className="d-flex  justify-content-start my-2">
                      <Checkbox
                        name="Recurring"
                        option={{
                          value: "1",
                          key: "Recurring",
                        }}
                        className={"col-6 col-lg-3"}
                        disabled={fixedDateCase ? true : false}
                      />
                      <Checkbox
                        className="col-6 col-lg-3"
                        name="NotifyByPush"
                        option={{
                          value: "true",
                          key: "Notify By Push",
                        }}
                      />
                    </Row>

                    <Row>
                      <Input
                        type="text"
                        name="NotifMessage"
                        label="Notify Message"
                        placeholder="Notify Message"
                        className={"col-12 col-md-6 col-lg-4 mb-3"}
                      />
                    </Row>

                    <ReactSelect
                      placeholder="Select Notify Period"
                      className={`col-12 col-md-6 col-lg-4 ${valueNotifyPeriodError ? "" : "mb-3"
                        } `}
                      options={
                        selectedVehiclesData?.length > 1
                          ? [optionsNotifyPeriod[0]]
                          : optionsNotifyPeriod
                      }
                      label={"Notify Period"}
                      name="WhenPeriod"
                      isDisabled={fixedDateCase ? true : false}
                      isSearchable={true}
                    />
                    {valueNotifyPeriodError && (
                      <span
                        className="mb-3"
                        style={{ color: "red", fontSize: "12px" }}
                      >
                        Please select percentage
                      </span>
                    )}

                    {!valueNotifyType && !fixedDateCase && (
                      <Input
                        type="number"
                        name="PercentageValue"
                        label="Percentage Value"
                        placeholder="Percentage Value"
                        className={"col-12 col-md-6 col-lg-4 mb-3"}
                      />
                    )}

                    {!(selectedVehiclesData?.length > 1) || fixedDateCase ? (
                      <Input
                        type={fixedDateCase ? "date" : "number"}
                        name="WhenValue"
                        label="Notify when Value"
                        placeholder="Notify when Value"
                        className={"col-12 col-md-6 col-lg-4 mb-3"}
                        disabled={
                          valueNotifyType || fixedDateCase ? false : true
                        }
                        value={
                          !fixedDateCase &&
                          !valueNotifyType &&
                          (formik.values.WhenValue = whenValue)
                        }
                        min={fixedDateCase ? minDate : 0}
                      />
                    ) : null}
                  </Row>
                  <div className="w-25 d-flex flex-wrap flex-md-nowrap">
                    <Button
                      type="submit"
                      disabled={loading || selectedVehicles.length === 0}
                      className="px-3 py-2 text-nowrap me-3 ms-0  mb-2 mb-md-0"
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
                      className="px-3 py-2 text-nowrap me-3 ms-0 "

                    >
                      <Link href="/preventive-maintenance" passHref>
                        <div>
                          <FontAwesomeIcon
                            className="mx-2"
                            icon={faTimes}
                            size="sm"
                          />
                          Cancle
                        </div>

                      </Link>
                    </Button>
                  </div>
                </Form>
              );
            }}
          </Formik>
        </Card.Body>
      </Card>
    </>
  );
};

export default FormikAdd;

// translation ##################################
export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["main"])),
    },
  };
}
// translation ##################################
