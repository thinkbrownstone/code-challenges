import PropTypes from "prop-types";

const Input = ({ label, type, value, onChange, id }) => {
  return (
    <>
      <label htmlfor={id}>{label}</label>
      <input
        className="septa-input"
        id={id}
        onChange={(e) => onChange(e)}
        type={type}
        value={value}
      ></input>
    </>
  );
};

Input.propTypes = {
  lable: PropTypes.string,
  type: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func,
  id: PropTypes.string,
};

export default Input;
