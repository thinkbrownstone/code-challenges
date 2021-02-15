import React from 'react'

function InputBox(props) {
    return (
        <fieldset>
            <label htmlFor={props.question}>{props.label}</label><br />
            <input type={props.type} name={props.question} value={props.value} onChange={props.onChange}/>
        </fieldset>
    )
}

export default InputBox
