import React, { InputHTMLAttributes } from "react";
import { useField } from "formik";
import FormControl from "react-bootstrap/FormControl";
import FormLabel from "react-bootstrap/FormLabel";



type InputFieldProps = InputHTMLAttributes<HTMLInputElement>  & {
    label: string,
    marginTop?: number;
    name: string;
};


const InputField: React.FC<InputFieldProps> = ({
    label,
    marginTop,
    size: _,
    ...props
}) => {
    const [field, { error }] = useField(props);
    return (
        <div style={{
            marginTop: marginTop
        }}>
        <FormLabel htmlFor={props.name}>{label}</FormLabel>
        <FormControl
            isInvalid={Boolean(error?.length)}
            id={props.name}
            {...field}
            {...props}
        >
        </FormControl>
        <FormControl.Feedback type="invalid" >
            { error }
        </FormControl.Feedback> 
        </div>
    );
}

export default InputField;