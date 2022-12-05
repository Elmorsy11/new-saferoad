import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faSpinner, faTimes } from "@fortawesome/free-solid-svg-icons";
import { Button, Card, Col, Row, Form } from "react-bootstrap";
import { toast } from "react-toastify";
// import { useTranslation } from "next-i18next";
import { Formik } from "formik";
import Input from "components/formik/Input";
import ReactSelect from "components/formik/ReactSelect/ReactSelect";
import { AddDeviceValidation } from "helpers/yup-validations/management/DeviceManagement";
import {
  fetchDeviceTypes,
  fetchSingleDevice,
  fetchAllUnAssignedSimCardData,
  updateDevice,
} from "services/management/DeviceManagement";
import Spinner from "components/UI/Spinner";
import { useTranslation } from "next-i18next";

const EditDevice = ({
  editId,
  updateAssignedTable,
  updateUnassignedTable,
  handleModel,
}) => {
  const { t } = useTranslation("management");
  const [loading, setLoading] = useState(false);
  const [loadingPage, setLoadingPage] = useState(true);
  const [allDeviceTypesOptions, setAllDeviceTypesOptions] = useState([]);
  const [unAssignedSimCardsOptions, setUnAssignedSimCardsOptions] = useState(
    []
  );
  const [deviceData, setDeviceData] = useState({});
  const [disableInputs, setDisableInputs] = useState(false);
  const [serialNumberInput, setSerialNumberInput] = useState("");
  const [phoneNumberInput, setPhoneNumberInput] = useState("");
  const [chosenType, setChosenType] = useState("");

  useEffect(() => {
    (async () => {
      setLoadingPage(true);
      try {
        // fetch device data
        const fetchDevice = await fetchSingleDevice(editId);
        let device = fetchDevice.result[0];
        setDeviceData(device);
        // fetch device types for select
        const fetchDevTypes = await fetchDeviceTypes();
        setAllDeviceTypesOptions(
          fetchDevTypes?.allDeviceTypes?.map((ele) => {
            return { value: ele.ID, label: ele.DeviceType };
          })
        );
        // fetch unAssignedSimCards for select
        const fetchUnAssignedSimCardsData =
          await fetchAllUnAssignedSimCardData();
        const unAssignedSimcards = fetchUnAssignedSimCardsData.result.map(
          (ele) => {
            return {
              value: ele.SimSerialNumber,
              label: ele.PhoneNumber,
              provID: ele.ProviderID,
            };
          }
        );
        setUnAssignedSimCardsOptions([
          {
            value: device.SimSerialNumber,
            label: device.PhoneNumber,
            provID: device.ProviderID,
          },
          ...unAssignedSimcards,
        ]);
      } catch (error) {
        toast.error(error.response.data?.message);
      }
      setLoadingPage(false);
    })();
  }, [editId]);

  // options for sim provider for react select
  const statusOptions = [
    { value: 0, label: t("used_key") },
    { value: 1, label: t("ready_to_use_key") },
    { value: 2, label: t("returned_key") },
    { value: 3, label: t("deffected_key") },
  ];

  // options for sim provider for react select
  const simProviderOptions = [
    { value: 1, label: t("mobily_key") },
    { value: 2, label: t("STC_key") },
    { value: 3, label: t("zain_key") },
    { value: 4, label: t("lebara_key") },
  ];

  const onSubmit = async (data) => {
    const submitData = {
      ...deviceData,
      ...data,
      ProviderID: chosenType ? chosenType : data.ProviderID,
    };
    setLoading(true);
    try {
      const respond = await updateDevice(editId, submitData);
      setLoading(false);
      toast.success(respond.message);
      handleModel();
      updateAssignedTable();
      updateUnassignedTable();
    } catch (error) {
      toast.error(error.response.data?.message);
      setLoading(false);
    }
  };

  const initialValues = {
    SerialNumber: deviceData.SerialNumber,
    DeviceTypeID: deviceData.DeviceTypeID,
    Status: deviceData.Status,
    SimSerialNumber: deviceData.SimSerialNumber,
    PhoneNumber: deviceData.PhoneNumber,
    ProviderID: deviceData.ProviderID,
    simSelected: deviceData.SimSerialNumber,
  };

  const getFormData = (values) => {
    setDisableInputs(true);
    setSerialNumberInput(values.simSelected[0]?.label);
    setPhoneNumberInput(values.simSelected[0]?.value);
    setChosenType(values.simSelected[0]?.provID);
  };

  return (
    <div className="container-fluid">
      {loadingPage && <Spinner />}
      {Object.keys(deviceData).length > 0 &&
        allDeviceTypesOptions.length > 0 &&
        unAssignedSimCardsOptions.length > 0 && (
          <Card className="py-0 mb-2">
            <Card.Body className="py-0">
              <Formik
                initialValues={initialValues}
                validationSchema={AddDeviceValidation}
                onSubmit={onSubmit}
              >
                {(formik) => {
                  setTimeout(() => getFormData(formik.values), 0);
                  return (
                    <Form onSubmit={formik.handleSubmit}>
                      <Row>
                        <Col className="mx-auto" md={12}>
                          <Row>
                            <h4 className="mb-3">{t("edit_device_key")}</h4>
                            <Input
                              placeholder={t("serial_number_key")}
                              label={t("serial_number_key")}
                              name="SerialNumber"
                              type="text"
                              className={"col-6 mb-3"}
                              onFocus={(event) => event.target.select()}
                            />

                            <ReactSelect
                              options={allDeviceTypesOptions}
                              label={t("device_type_key")}
                              placeholder={t("select_device_type_key")}
                              name="DeviceTypeID"
                              className={"col-6 mb-3"}
                              isSearchable={true}
                            />

                            <ReactSelect
                              options={statusOptions}
                              label={t("status_key")}
                              placeholder={t("select_status_key")}
                              name="Status"
                              className={"col-12 mb-3"}
                              isSearchable={true}
                            />

                            <h4 className="mb-3">{t("edit_SIM_card_key")}</h4>
                            <ReactSelect
                              options={unAssignedSimCardsOptions}
                              label={t("select_a_SIM_card_key")}
                              placeholder={t("select_a_SIM_card_key")}
                              name="simSelected"
                              className={"col-12 mb-3"}
                              isSearchable={true}
                              isObject={true}
                            />

                            <Input
                              placeholder={t("serial_number_key")}
                              label={t("serial_number_key")}
                              name="simSerialNumber"
                              type="text"
                              className={"col-6 mb-3"}
                              disabled={disableInputs ? true : false}
                              onFocus={(event) => event.target.select()}
                              value={
                                (formik.values.simSerialNumber =
                                  serialNumberInput
                                    ? serialNumberInput
                                    : deviceData.SimSerialNumber)
                              }
                            />

                            <Input
                              placeholder={t("phone_number_key")}
                              label={t("phone_number_key")}
                              name="phoneNumber"
                              type="text"
                              className={"col-6 mb-3"}
                              disabled={disableInputs ? true : false}
                              onFocus={(event) => event.target.select()}
                              value={
                                (formik.values.phoneNumber = phoneNumberInput
                                  ? phoneNumberInput
                                  : deviceData.PhoneNumber)
                              }
                            />

                            <ReactSelect
                              options={simProviderOptions}
                              label={t("SIM_provider_key")}
                              placeholder={t("select_SIM_provider_key")}
                              name="ProviderID"
                              className={"col-12 mb-3"}
                              isSearchable={true}
                              isDisabled={disableInputs ? true : false}
                              value={
                                chosenType
                                  ? simProviderOptions.find(
                                      (option) => option.value === chosenType
                                    )
                                  : simProviderOptions.find(
                                      (option) =>
                                        option.value ===
                                        formik.values.ProviderID
                                    )
                              }
                            />
                          </Row>
                        </Col>
                      </Row>
                      <Row>
                        <Col className="mx-auto" md={12}>
                          <div className="w-25 d-flex flex-wrap flex-md-nowrap">
                            <Button
                              type="submit"
                              className="px-3 py-2 text-nowrap me-3 mb-2 mb-md-0"
                              disabled={loading}
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
                              {t("save_key")}
                            </Button>
                            <Button
                              className="px-3 py-2 text-nowrap me-3 ms-0"
                              onClick={() => {
                                handleModel();
                              }}
                            >
                              <FontAwesomeIcon
                                className="mx-2"
                                icon={faTimes}
                                size="sm"
                              />
                              {t("cancel_key")}
                            </Button>
                          </div>
                        </Col>
                      </Row>
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

export default EditDevice;
