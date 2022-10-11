import React from "react";
import Select from "react-select";

const SelectField = (props) => {
  const { options, field, form, isMulti, ...rest } = props;
  return (
    <Select
      options={options}
      name={field.name}
      value={
        options
          ? isMulti
            ? options.filter((option) => field.value.indexOf(option.value) >= 0)
            : options.find((option) => option.value === field.value)
          : isMulti  
          ? []
          : ""
      }
      onChange={(options) => {
        form.setFieldValue(
          field.name,
          isMulti ? options?.map((item) => item.value) : options.value
        );
      }}
      onBlur={field.onBlur}
      isMulti={isMulti}
      {...rest}
    />
  );
};

export default SelectField;
