const customStyles = {
  control: (provided, state) => ({
    ...provided,
    borderRadius: "0.75rem",
    borderWidth: "2px",
    borderColor: state.isFocused ? "#06b6d4" : "#22d3ee",
    boxShadow: "none",
    backgroundColor: "white",
    color: "#06b6d4",
    "&:hover": {
      borderColor: "#06b6d4",
    },
  }),
  placeholder: (provided) => ({
    ...provided,
    color: "#06b6d4",
  }),
  singleValue: (provided) => ({
    ...provided,
    color: "#06b6d4",
  }),
  menu: (provided) => ({
    ...provided,
    borderRadius: "0.75rem",
    overflow: "hidden",
  }),
  option: (provided, state) => ({
    ...provided,
    backgroundColor: state.isFocused ? "#e0f7fa" : "white",
    color: "#0e7490",
    padding: "0.5rem 1rem",
  }),
};

export default customStyles;
