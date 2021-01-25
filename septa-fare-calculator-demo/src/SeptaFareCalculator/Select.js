import PropTypes from "prop-types";

const Select = ({ label, options, onChange, id }) => {
  const renderOptions = (options) => {
    return options.map((option, index) => {
      return (
        <option className="septaOption" key={index} value={option.value}>
          {option.text}
        </option>
      );
    });
  };

  return (
    <>
      <label htmlFor={id}>{label}</label>
      <select className="septa-input" id={id} onChange={(e) => onChange(e)}>
        {renderOptions(options)}
      </select>
    </>
  );
};

Select.propTypes = {
  label: PropTypes.string,
  options: PropTypes.array,
  onChange: PropTypes.func,
  id: PropTypes.string,
};

export default Select;
