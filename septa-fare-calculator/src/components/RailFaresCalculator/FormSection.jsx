import React from 'react'
import PropTypes from 'prop-types'

import './FormSection.scss'

const FormSection = ({ title, children }) => (
    <div className="form-section-comp">
        <h3>{title}</h3>
        <div>{children}</div>
    </div>
)

FormSection.propTypes = {
    children: PropTypes.any.isRequired,
}

export default FormSection