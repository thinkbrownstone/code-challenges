import { connect } from 'react-redux';
import React, { PropTypes } from 'react';

class Dropdown extends React.Component {

  render() {
    const { values, name, onChange, info, activeValue } = this.props;
    return (
        <div>
          {this.props.children}
          <select
            onChange={(evt) => {
              onChange(name, evt.target.value);
            }}>
            {
              values.map(item =>
                <option key={item.name} value={item.value}>{item.name}</option>
              )
            }
          </select>
          {
            Object.keys(info).map((item) => {
              // assuming the info object doesn't get ridiculously large
              if (item === activeValue) {
                return (
                  <span key={'info_'.concat(activeValue)}
                  className="help-text">
                  {info[item]}
                  </span>
                );
              }
              return '';
            })
          }
        </div>
    );
  }
}

Dropdown.propTypes = {
  values: PropTypes.array.isRequired,
};

const mapStateToProps = state => ({
  info: state.data.info,
});

export default connect(mapStateToProps, {})(Dropdown);
