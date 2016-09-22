import { connect } from 'react-redux';
import React, { PropTypes } from 'react';

class Radio extends React.Component {

  render() {
    const { values, name, activeValue, info, onChange } = this.props;
    return (
      <div>
        {this.props.children}
        {
          values.map(item =>
            <div key={item.value}>
            <label htmlFor={item.value}>{item.name}</label>
              <input
              id={item.value}
              checked = {item.value === activeValue}
              value={item.value}
              name={name}
              onChange={(evt) => { onChange(name, evt.target.value); }}
              type="radio">
              </input>

            </div>
          )
        }
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

Radio.propTypes = {
  values: PropTypes.array.isRequired,
};

const mapStateToProps = state => ({
  info: state.data.info,
});

export default connect(mapStateToProps, {})(Radio);
