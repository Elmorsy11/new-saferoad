import * as Yup from "yup";

const numberValidation = (inputName, required, mustNumber) => {
  return Yup.number()
    .required(`${inputName} ${required}`)
    .typeError(`${inputName} ${mustNumber}`);
};

const stringValidation = (inputName, required) => {
  return Yup.string().required(`${inputName} ${required}`).trim();
};

export const AddDeviceValidation = (t) => {
  const required = t("is_required_key");
  return Yup.object().shape({
    SerialNumber: stringValidation(t("serial_number_key"), required),
  });
};

export const AddSimValidation = (t) => {
  const required = t("is_required_key");
  const mustNumber = t("must_be_number_key");

  return Yup.object().shape({
    simSerialNumber: stringValidation(t("serial_number_key"), required),
    phoneNumber: numberValidation(
      t("phone_number_key"),
      required,
      mustNumber
    ).min(0, t("phone_number_must_be_greater_than_0_key")),
  });
};
