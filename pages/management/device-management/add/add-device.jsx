import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes, faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { Button, Card, Col, Row, Form } from "react-bootstrap";
import { toast } from "react-toastify";
// import { useTranslation } from "next-i18next";
import { Formik } from "formik";
import Input from "components/formik/Input";
import ReactSelect from "components/formik/ReactSelect/ReactSelect";
import { fetchDeviceTypes } from "services/management/DeviceManagement";
import { AddDeviceValidation } from "helpers/yup-validations/management/DeviceManagement";
import { addDevice } from "lib/slices/addNewDevice";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "next-i18next";
import Spinner from "components/UI/Spinner";

const AddDevice = () => {
  const router = useRouter();
  const [loadingPage, setLoadingPage] = useState(true);
  const [allDeviceTypesOptions, setAllDeviceTypesOptions] = useState([]);
  const dispatch = useDispatch();
  const { device } = useSelector((state) => state.addNewDevice);
  const { t } = useTranslation("management");

  useEffect(() => {
    (async () => {
      setLoadingPage(true);
      try {
        const respond = await fetchDeviceTypes();
        setAllDeviceTypesOptions(
          respond?.allDeviceTypes?.map((ele) => {
            return { value: ele.ID, label: ele.DeviceType };
          })
        );
      } catch (error) {
        toast.error(error.response.data?.message);
      }
      setLoadingPage(false);
    })();
  }, []);

  // options for sim provider for react select
  const statusOptions = [
    { value: 0, label: t("used_key") },
    { value: 1, label: t("ready_to_use_key") },
    { value: 2, label: t("returned_key") },
    { value: 3, label: t("deffected_key") },
  ];

  const onSubmit = async (data) => {
    dispatch(addDevice(data));
    router.push("/management/device-management/add/add-sim");
  };

  const initialValues = {
    SerialNumber: device.SerialNumber ? device.SerialNumber : "",
    DeviceTypeID: device.DeviceTypeID ? device.DeviceTypeID : 1,
    Status: device.Status ? device.Status : 0,
  };

  return (
    <div className="container-fluid">
      {loadingPage && <Spinner />}
      {allDeviceTypesOptions.length > 0 && (
        <Card>
          <Card.Body>
            <Formik
              initialValues={initialValues}
              validationSchema={AddDeviceValidation(t)}
              onSubmit={onSubmit}
            >
              {(formik) => {
                return (
                  <Form onSubmit={formik.handleSubmit}>
                    <Row>
                      <Col className="mx-auto" md={6}>
                        <Row>
                          <h4 className="mb-3">{t("add_a_new_device_key")}</h4>
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
                        </Row>
                      </Col>
                    </Row>
                    <Row>
                      <Col className="mx-auto" md={6}>
                        <div className="w-25 d-flex flex-wrap flex-md-nowrap">
                          <Button
                            type="submit"
                            className="px-3 py-2 text-nowrap me-3 mb-2 mb-md-0"
                          >
                            <FontAwesomeIcon
                              className="mx-2"
                              icon={faArrowRight}
                              size="sm"
                            />
                            {t("next_key")}
                          </Button>
                          <Button
                            className="px-3 py-2 text-nowrap me-3 ms-0"
                            onClick={() => {
                              router.push("/management/device-management");
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

export default AddDevice;

// translation ##################################
export async function getServerSideProps(context) {
  return {
    props: {
      ...(await serverSideTranslations(context.locale, ["main", "management"])),
    },
  };
}
// translation ##################################
