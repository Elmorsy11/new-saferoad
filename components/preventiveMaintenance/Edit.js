import { faCheck, faSpinner, faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRouter } from "next/router";
import { Button, Card, Row } from "react-bootstrap";
import { toast } from "react-toastify";
import { useEffect, useCallback, useState } from "react";
import { Formik, Form } from "formik";
import {
  fitchPreventiveForEdit,
  updatePreventive,
} from "services/preventiveMaintenance/index";
import Input from "components/formik/Input";
import ReactSelect from "components/formik/ReactSelect/ReactSelect";
import Checkbox from "components/formik/Checkbox";
import { editPreventiveMaintenanceValidation } from "helpers/yupValidations";
import Progress from "components/Progress";

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

const Edit = ({
  id,
  model,
  modelButtonMsg,
  onModelButtonClicked,
  icon,
  className,
  handleModel,
  updateTable
}) => {
  const router = useRouter();
  const [selectedVehicles, setSelectedVehicles] = useState([]);
  const [periodType, setPeriodType] = useState("");
  const [fixedDateCase, setFixedDateCase] = useState(false);
  const [notifyType, setNotifyType] = useState("");
  const [valueNotifyType, setValueNotifyType] = useState(false);
  const [loading, setloading] = useState(false);
  const [loadingPage, setLoadingPage] = useState(false);
  const [Data, setData] = useState({});
  const [percentageValue, setPercentageValue] = useState("");
  const [maintenanceDueValue, setMaintenanceDueValue] = useState("");
  const [whenValue, setWhenValue] = useState("");
  const [startValue, setStartValue] = useState("");
  const [nextValue, setNextValue] = useState("");

  // fetch maintenance data
  useEffect(() => {
    (async () => {
      try {
        setLoadingPage(true);
        const respond = await fitchPreventiveForEdit(id);
        setLoadingPage(false);
        setFixedDateCase(respond?.result[0].PeriodType === 2 ? true : false);
        setData(respond?.result[0]);
        setSelectedVehicles(respond?.result);
        setPeriodType(respond?.result[0].PeriodType);
      } catch (error) {
        toast.error(error?.response?.data?.message);
        setLoadingPage(false);
      }
    })();
  }, [id]);

  // minimum date used in date inputs
  const minDate = new Date().toISOString().slice(0, 10);

  // helper func to make Mileage and working hours logic
  const periodTypeFunc = useCallback(
    (vehiclesData) => {
      setStartValue(
        vehiclesData?.length === 1 ? vehiclesData[0]?.StartValue : 0
      );

      setNextValue(
        vehiclesData?.length === 1
          ? +vehiclesData[0]?.StartValue + +maintenanceDueValue
          : 0
      );

      if (notifyType === "1") {
        setValueNotifyType(false);
        setWhenValue(
          vehiclesData?.length === 1
            ? +vehiclesData[0]?.StartValue +
            +maintenanceDueValue * (+percentageValue / 100)
            : 0
        );
      } else if (notifyType === "2") {
        setValueNotifyType(true);
      }
    },
    [notifyType, percentageValue, maintenanceDueValue]
  );

  // set values of inputs
  useEffect(() => {
    if (Object.keys(Data).length > 1) {
      // conditions of period Type equal to Mileage or WorkingHours
      if (periodType === 1 || periodType === 3) {
        periodTypeFunc(selectedVehicles);
        // conditions of period Type equal to fixed date
      } else if (periodType === 2) {
        const today = new Date().toISOString().slice(0, 10);
        setStartValue(today);
        setNextValue(maintenanceDueValue);
      }
    }
  }, [periodTypeFunc, Data, selectedVehicles, periodType, maintenanceDueValue]);

  const initialValues = {
    vehicleName: Data?.DisplayName,
    MaintenanceType: optionsMaintenanceType.filter(
      (option) => option.value === Data.MaintenanceType
    )[0]?.label,
    PeriodType: optionsPeriodType.filter(
      (option) => option.value === Data.PeriodType
    )[0]?.label,
    StartValue: Data.StartValue,
    MaintenanceDueValue: fixedDateCase
      ? Data.NextValue
      : Data.NextValue - Data.StartValue,
    NextValue: Data.NextValue,
    NotifyByEmail: Data.NotifyByEmail,
    Recurring: Data.Recurring ? ["1"] : [],
    NotifyByPush: Data.NotifyByPush ? ["true"] : [],
    NotifMessage: Data.NotifMessage,
    WhenPeriod: `${Data.WhenPeriod}`,
    PercentageValue: fixedDateCase
      ? 0
      : ((Data.WhenValue - Data.StartValue) * 100) /
      (Data.NextValue - Data.StartValue),
    WhenValue: Data.WhenValue,
  };

  const getFormData = (values) => {
    setNotifyType(values.WhenPeriod);
    setMaintenanceDueValue(values.MaintenanceDueValue);
    setPercentageValue(values.PercentageValue);
  };

  const onSubmit = async (data) => {
    const MaintenanceType = optionsMaintenanceType?.filter(
      (type) => type.label === data.MaintenanceType
    )[0]?.value;
    const PeriodType = optionsPeriodType?.filter(
      (type) => type.label === data.PeriodType
    )[0]?.value;

    const submitedData = {
      ...data,
      Recurring: data.Recurring.length === 1 ? 1 : 0,
      NotifyByPush: data.NotifyByPush.length === 1 ? 1 : 0,
      MaintenanceType,
      PeriodType,
      NextValue: fixedDateCase
        ? `${data.MaintenanceDueValue}`
        : `${data.NextValue}`,
      StartValue: `${data.StartValue}`,
      WhenValue: `${data.WhenValue}`,
      MaintenanceDueValue: `${data.MaintenanceDueValue}`,
      VehicleID: Data.VehicleID,
      WhenPeriod: +notifyType,
      NotifyBySMS: null,
      IsNotified: null,
    };

    setloading(true);
    try {
      const respond = await updatePreventive(id, submitedData);
      toast.success(respond.result);
      router.push("/preventive-maintenance");
      setloading(false);
      if (model) {
        handleModel();
        updateTable()
      }
    } catch (error) {
      toast.error(error?.response?.data?.message);
      setloading(false);
    }
  };

  return (
    <div className="container-fluid">
      {loadingPage ? <Progress /> : (
        <Card className="mb-1">
          {!model && (
            <Card.Header className="h3">Update Maintenance Plan</Card.Header>
          )}
          <Card.Body className={`${className}`}>
            <Formik
              initialValues={initialValues}
              validationSchema={editPreventiveMaintenanceValidation(
                fixedDateCase,
                minDate,
                startValue,
                nextValue
              )}
              onSubmit={onSubmit}
            >
              {(formik) => {
                setTimeout(() => getFormData(formik.values), 0);
                return (
                  <Form>
                    <Row>
                      <Input
                        placeholder="Vehicle Name"
                        label="Vehicle Name"
                        name="vehicleName"
                        type="text"
                        className={"col-12 col-md-6 col-lg-4 mb-3"}
                        disabled={true}
                      />

                      <Input
                        placeholder="Select Maintenance Type"
                        label="Maintenance Type"
                        name="MaintenanceType"
                        type="text"
                        className={"col-12 col-md-6 col-lg-4 mb-3"}
                        disabled={true}
                      />

                      <Input
                        placeholder="Select Period Type"
                        label="Period Type"
                        name="PeriodType"
                        type="text"
                        className={"col-12 col-md-6 col-lg-4 mb-3"}
                        disabled={true}
                      />

                      {!(selectedVehicles?.length > 1) && !fixedDateCase && (
                        <Input
                          placeholder="Start Value"
                          label="Start Value"
                          name="StartValue"
                          type="number"
                          className={"col-12 col-md-6 col-lg-4 mb-3"}
                          disabled={true}
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

                      {!(selectedVehicles?.length > 1) && !fixedDateCase && (
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

                      <Row className="d-flex  justify-content-start ms-2 my-2">
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
                        className={`col-12 col-md-6 col-lg-4 mb-3`}
                        options={optionsNotifyPeriod}
                        label={"Notify Period"}
                        name="WhenPeriod"
                        isDisabled={fixedDateCase ? true : false}
                        isSearchable={true}
                      />

                      {!valueNotifyType && !fixedDateCase && (
                        <Input
                          type="number"
                          name="PercentageValue"
                          label="Percentage Value"
                          placeholder="Percentage Value"
                          className={"col-12 col-md-6 col-lg-4 mb-3"}
                          onFocus={(event) => event.target.select()}
                        />
                      )}

                      {!(selectedVehicles?.length > 1) || fixedDateCase ? (
                        <Input
                          type={fixedDateCase ? "date" : "number"}
                          name="WhenValue"
                          label="Notify when Value"
                          placeholder="Notify when Value"
                          className={"col-12 col-md-6 col-lg-4 mb-3"}
                          disabled={
                            valueNotifyType || fixedDateCase ? false : true
                          }
                          min={fixedDateCase ? minDate : 0}
                          onFocus={(event) => event.target.select()}
                          value={
                            !fixedDateCase &&
                            !valueNotifyType &&
                            (formik.values.WhenValue = whenValue)
                          }
                        />
                      ) : null}
                    </Row>
                    <div className="w-25 d-flex flex-wrap flex-md-nowrap">
                      {model && (
                        <Button
                          className="px-3 py-2 text-nowrap me-3 ms-0  mb-md-0"
                          type="button"
                          onClick={onModelButtonClicked}
                        >
                          {modelButtonMsg}
                          {
                            <FontAwesomeIcon
                              className="mx-2"
                              icon={icon}
                              size="sm"
                            />
                          }
                        </Button>
                      )}
                      <Button
                        type="submit"
                        disabled={loading || selectedVehicles.length === 0}
                        className="px-3 py-2 text-nowrap me-3 ms-0  mb-md-0"
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
                        onClick={() => {
                          if (model) {
                            handleModel();
                          } else {
                            router.push("/preventive-maintenance");
                          }
                        }}
                      >
                        <FontAwesomeIcon
                          className="mx-2"
                          icon={faTimes}
                          size="sm"
                        />
                        Cancle
                      </Button>
                    </div>
                  </Form>
                );
              }}
            </Formik>
          </Card.Body>
        </Card>
      )}
    </div>
  );
};

export default Edit;
