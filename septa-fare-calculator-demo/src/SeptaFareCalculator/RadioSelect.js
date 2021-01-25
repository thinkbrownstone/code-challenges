import PropTypes from "prop-types";

const RadioSelect = ({ onChange, value, options, id, legend }) => {
  const renderOptions = (options) => {
    return options.map((option) => {
      return (
        <>
          <input
            className="radioButton"
            value={option.value}
            checked={value === option.value}
            type="radio"
            name={option.text}
            id={option.text}
            onChange={(e) => onChange(e)}
          />
          <label className="radioLabel" for={option.text}>
            {option.text}
          </label>
        </>
      );
    });
  };
  return (
    <>
      <legend>{legend}</legend>
      <div id={id} className="radioSelect">
        {renderOptions(options)}
      </div>
    </>
  );
};

RadioSelect.propTypes = {
  options: PropTypes.array,
  id: PropTypes.string,
  legend: PropTypes.string,
  onChange: PropTypes.func,
  value: PropTypes.string,
};

export default RadioSelect;
