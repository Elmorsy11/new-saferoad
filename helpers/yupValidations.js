import * as Yup from "yup";

const numberValidation = (inputName) => {
  return Yup.number()
    .required(`${inputName} is required`)
    .typeError(`${inputName} must be a number`);
};

const emailValidation = () => {
  return Yup.string()
    .email("Invalid email address")
    .required("Email is required")
    .trim();
};

const stringValidation = (inputName) => {
  return Yup.string().required(`${inputName} is required`).trim();
};

const dateValidation = (inputName) => {
  return Yup.date()
    .required(`${inputName} is required`)
    .typeError(`${inputName} must be a date`);
};

export const addPreventiveMaintenanceValidation = (
  fixedDateCase,
  minDate,
  startValue,
  nextValue,
  selectedVehiclesData
) => {
  return Yup.object().shape({
    selectedVehicles: Yup.array()
      .required("Please select a vehicle")
      .min(1, "Selected vehicles field must have at least 1 vehicle"),
    MaintenanceType: stringValidation("Maintenance Type"),
    PeriodType: stringValidation("Period Type"),
    StartValue: numberValidation("Start Value"),
    MaintenanceDueValue: fixedDateCase
      ? dateValidation("Maintenance Due Value").min(
          new Date(Date.now() - 86400000),
          `Maintenance Due Value field must be later than or equal to ${minDate}`
        )
      : numberValidation("Maintenance Due Value").min(
          0,
          "Maintenance Due Value must be greater than or equal to 0"
        ),
    NextValue: numberValidation("Next Value"),
    NotifyByEmail: emailValidation(),
    NotifMessage: stringValidation("Notify Message"),
    WhenPeriod: stringValidation("Notify Period"),
    PercentageValue: Yup.number().when("PeriodType", {
      is: "2",
      then: Yup.number().notRequired(),
      otherwise: Yup.number().when("WhenPeriod", {
        is: "2",
        then: Yup.number().notRequired(),
        otherwise: numberValidation("Percentage Value")
          .min(1, "Percentage Value must be greater than or equal to 1")
          .max(100, "Percentage Value must be less than or equal to 100"),
      }),
    }),
    WhenValue: fixedDateCase
      ? dateValidation("Notify when Value")
          .min(
            new Date(Date.now() - 86400000),
            `Notify when Value field must be later than or equal to ${minDate}`
          )
          .max(
            nextValue ? new Date(nextValue) : new Date(),
            `Notify when Value field must be at earlier than or equal Maintenance Due Value`
          )
      : selectedVehiclesData.length > 1
      ? Yup.number().notRequired()
      : numberValidation("Notify when Value")
          .min(
            startValue,
            "Notify when Value must be greater than or equal to start value"
          )
          .max(
            nextValue,
            "Notify when Value must be less than or equal to next value"
          ),
  });
};

export const editPreventiveMaintenanceValidation = (
  fixedDateCase,
  minDate,
  startValue,
  nextValue
) => {
  return Yup.object().shape({
    vehicleName: stringValidation("Vehicle Name"),
    MaintenanceType: stringValidation("Maintenance Type"),
    PeriodType: stringValidation("Period Type"),
    StartValue: fixedDateCase
      ? dateValidation("Start Value")
      : numberValidation("Start Value"),
    MaintenanceDueValue: fixedDateCase
      ? dateValidation("Maintenance Due Value").min(
          new Date(Date.now() - 86400000),
          `Maintenance Due Value field must be later than or equal to ${minDate}`
        )
      : numberValidation("Maintenance Due Value").min(
          0,
          "Maintenance Due Value must be greater than or equal to 0"
        ),
    NextValue: fixedDateCase
      ? dateValidation("Next Value")
      : numberValidation("Next Value"),
    NotifyByEmail: emailValidation(),
    NotifMessage: stringValidation("Notify Message"),
    WhenPeriod: stringValidation("Notify Period"),
    PercentageValue: Yup.number().when("PeriodType", {
      is: "By Fixed Date",
      then: Yup.number().notRequired(),
      otherwise: Yup.number().when("WhenPeriod", {
        is: "2",
        then: Yup.number().notRequired(),
        otherwise: numberValidation("Percentage Value")
          .min(1, "Percentage Value must be greater than or equal to 1")
          .max(100, "Percentage Value must be less than or equal to 100"),
      }),
    }),
    WhenValue: fixedDateCase
      ? dateValidation("Notify when Value")
          .min(
            new Date(Date.now() - 86400000),
            `Notify when Value field must be later than or equal to ${minDate}`
          )
          .max(
            nextValue ? new Date(nextValue) : new Date(),
            `Notify when Value field must be at earlier than or equal Maintenance Due Value`
          )
      : numberValidation("Notify when Value")
          .min(
            startValue,
            "Notify when Value must be greater than or equal to start value"
          )
          .max(
            nextValue,
            "Notify when Value must be less than or equal to next value"
          ),
  });
};

export const addEditOperateDriver = Yup.object().shape({
  FirstName: stringValidation("First Name").matches(
    /^([a-zA-Z]+\s)*[a-zA-Z]+$/,
    "First Name must not have numbers"
  ),
  LastName: stringValidation("Last Name").matches(
    /^([a-zA-Z]+\s)*[a-zA-Z]+$/,
    "Last Name must not have numbers"
  ),
  DateOfBirth: dateValidation("Date Of Birth"),
  Nationality: stringValidation("Nationality"),
  PhoneNumber: numberValidation("Phone Number"),
  Email: emailValidation(),
  DLNumber: numberValidation("Licence Number").min(
    0,
    "Licence Number must be greater than or equal to 0"
  ),
  DLExpirationDate: dateValidation("Licence Expiration Date"),
  Department: stringValidation("Department"),
  RFID: stringValidation("RFID"),
});
