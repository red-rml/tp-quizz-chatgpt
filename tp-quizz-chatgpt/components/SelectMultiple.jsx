import styled from "@emotion/styled";
import { useRef, useState } from "react";
import Select, { components } from "react-select";

export function CustomSelect({
  className,
  options,
  isSearchable,
  placeholder,
  onChange,
  value,
  menuPlacement,
  isSelectAll,
  isDisabled,
}) {
  const [selectInput, setSelectInput] = useState("");
  const isAllSelected = useRef(false);
  const selectAllLabel = useRef("Tout sélectionner");
  const allOption = { value: "*", label: selectAllLabel.current };

  const filterOptions = (options2, input) =>
    isSelectAll
      ? options2.filter(({ label }) =>
          label.toLowerCase().includes(input.toLowerCase())
        ) ?? []
      : [];

  const filteredOptions = filterOptions(options, selectInput);
  const filteredSelectedOptions = filterOptions(value, selectInput);

  const Option = (props) => (
    <components.Option {...props}>
      {isSelectAll && (
        <>
          {props.value === "*" &&
          !isAllSelected.current &&
          filteredSelectedOptions.length > 0 ? (
            <input
              type="checkbox"
              ref={(input) => {
                if (input) input.indeterminate = true;
              }}
            />
          ) : (
            <input
              type="checkbox"
              checked={props.isSelected || isAllSelected.current}
              onChange={() => ""}
            />
          )}
        </>
      )}
      <label style={{ marginLeft: "5px" }}>{props.label}</label>
    </components.Option>
  );

  const Input = (props) => (
    <>
      {selectInput.length === 0 ? (
        <components.Input autoFocus={props.selectProps.menuIsOpen} {...props}>
          {props.children}
        </components.Input>
      ) : (
        <div style={{ border: "1px dotted gray" }}>
          <components.Input autoFocus={props.selectProps.menuIsOpen} {...props}>
            {props.children}
          </components.Input>
        </div>
      )}
    </>
  );

  const MultiValueLabel = (props) => {
    return (
      <StyledMultiValueLabel>
        <components.MultiValueLabel {...props} />
      </StyledMultiValueLabel>
    );
  };

  const customFilterOption = ({ value, label }, input) =>
    (value !== "*" && label.toLowerCase().includes(input.toLowerCase())) ||
    (value === "*" && filteredOptions.length > 0);

  const onInputChange = (inputValue, event) => {
    if (event.action === "input-change") setSelectInput(inputValue);
    else if (event.action === "menu-close" && selectInput !== "")
      setSelectInput("");
  };

  const handleChange = (selected) => {
    if (
      selected.length > 0 &&
      !isAllSelected.current &&
      (selected[selected.length - 1].value === allOption.value ||
        JSON.stringify(filteredOptions) === JSON.stringify(selected))
    )
      return onChange([
        ...(value ?? []),
        ...options.filter(
          ({ label }) =>
            label.toLowerCase().includes(selectInput.toLowerCase()) &&
            (value ?? []).filter((opt) => opt.label === label).length === 0
        ),
      ]);
    else if (
      selected.length > 0 &&
      selected[selected.length - 1].value !== allOption.value &&
      JSON.stringify(selected) !== JSON.stringify(filteredOptions)
    )
      return onChange(selected);
    else
      return onChange([
        ...value.filter(
          ({ label }) =>
            !label.toLowerCase().includes(selectInput.toLowerCase())
        ),
      ]);
  };

  if (isSelectAll && options.length !== 0) {
    isAllSelected.current =
      filteredSelectedOptions.length === filteredOptions.length;

    if (filteredSelectedOptions.length > 0) {
      if (filteredSelectedOptions.length === filteredOptions.length)
        selectAllLabel.current = `Tout désélectionner (${filteredOptions.length})`;
      else
        selectAllLabel.current = `${filteredSelectedOptions.length} / ${filteredOptions.length} sélectionnée(s)`;
    } else selectAllLabel.current = "Tout sélectionner";

    allOption.label = selectAllLabel.current;

    return (
      <div className={className}>
        <StyledSelect
          inputValue={selectInput}
          onInputChange={onInputChange}
          options={[allOption, ...options]}
          onChange={handleChange}
          filterOption={customFilterOption}
          menuPlacement={menuPlacement ?? "auto"}
          closeMenuOnSelect={false}
          tabSelectsValue={false}
          backspaceRemovesValue={false}
          hideSelectedOptions={false}
          blurInputOnSelect={false}
          isSearchable={isSearchable}
          isMulti
          placeholder={placeholder}
          components={{ MultiValueLabel, MultiValueRemove, Option, Input }}
          value={value}
          isDisabled={isDisabled}
        />
      </div>
    );
  }

  return (
    <div className={className}>
      <StyledSelect
        isSearchable={isSearchable}
        options={options}
        onChange={onChange}
        placeholder={placeholder}
        components={{ MultiValueLabel, MultiValueRemove, Option }}
        value={value}
        tabSelectsValue={false}
        hideSelectedOptions={true}
        backspaceRemovesValue={false}
        blurInputOnSelect={true}
        isDisabled={isDisabled}
      />
    </div>
  );
}

const MultiValueRemove = (props) => {
  return (
    <StyledMultiValueRemove>
      <components.MultiValueRemove {...props}>
        {props.children}
      </components.MultiValueRemove>
    </StyledMultiValueRemove>
  );
};

const StyledMultiValueRemove = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;

  color: black;
  text-align: center;

  font-family: Roboto;
  font-size: 14px;
  font-style: normal;
  font-weight: 500;
  line-height: 20px;
  letter-spacing: 0.1px;
  cursor: pointer;
`;

const StyledMultiValueLabel = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;

  color: black;
  text-align: center;

  font-family: Roboto;
  font-size: 14px;
  font-style: normal;
  font-weight: 500;
  line-height: 20px;
  letter-spacing: 0.1px;

  & * {
    color: black !important;
  }
`;

const StyledSelect = styled(Select)`
  cursor: pointer;

  & .css-1p3m7a8-multiValue {
    background-color: transparent;
    box-shadow: 0px 1px 3px 0px rgba(0, 0, 0, 0.3);
  }

  & .css-wsp0cs-MultiValueGeneric {
    color: black;
  }

  & .css-1hb7zxy-IndicatorsContainer,
  & .css-1nmdiq5-menu * {
    cursor: pointer;
  }

  & .css-1nmdiq5-menu {
    z-index: 999;
  }

  & .css-3w2yfm-ValueContainer {
    overflow: auto;
    flex-wrap: unset;
  }

  & .css-1p3m7a8-multiValue {
    min-width: unset;
  }
`;
