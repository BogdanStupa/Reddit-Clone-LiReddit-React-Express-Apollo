import React, { InputHTMLAttributes } from "react";
import { useField } from "formik";
import FormControl from "react-bootstrap/FormControl";
import FormLabel from "react-bootstrap/FormLabel";



type InputFieldProps = InputHTMLAttributes<HTMLInputElement>  & {
    label: string,
    marginTop?: number;
    name: string;
};


const InputField: React.FC<InputFieldProps> = (props: InputFieldProps) => {
    const [field, { error }] = useField(props);
    return (
        <div style={{
            marginTop:props.marginTop
        }}>
        <FormLabel htmlFor={props.name}>{props.label}</FormLabel>
        <FormControl
            isInvalid={Boolean(error?.length)}
            id={props.name}
            placeholder={props.placeholder}
            {...field}
        >
        </FormControl>
        <FormControl.Feedback type="invalid" >
            { error }
        </FormControl.Feedback> 
        </div>
    );
}

export default InputField;