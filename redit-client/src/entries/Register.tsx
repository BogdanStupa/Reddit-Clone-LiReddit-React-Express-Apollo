import React from 'react';
import { Form, Formik } from 'formik';
import BoxContainer from "../containers/BoxContainer";
import constants from '../constants';
import Button from "react-bootstrap/Button";
import InputField from "../components/InputField";
import { useRegisterMutation, UsernamePasswordInput } from '../generated/graphql';
import { toErrorMap } from '../utils/toErrorMap';
import { History } from "history"; 
import { withRouter } from 'react-router-dom';


interface IComponentProps {
    history: History; 
};


const Register: React.FC<IComponentProps> = ({ history }) => {
    const [register, ] = useRegisterMutation();  
    
    return (
        <BoxContainer
            position="center"
            style={{
                marginTop: 50
            }}
            colMode
        >
            <h3>
                {constants.LABELS.ROUTE_NAMES.SIGNUP}
            </h3>
            <Formik
                initialValues={{
                    username: "",
                    password: "",
                    confirmPassword: ""
                }}
                onSubmit={ async (values, { setErrors }) => {
                    if(values.password !== values.confirmPassword){
                        setErrors({
                            confirmPassword: "Must match to password"
                        });
                        return;
                    }
                    const response = await register({
                        variables: {
                            options:{ 
                                password: values.password,
                                username: values.username
                            } as UsernamePasswordInput
                        }
                    });
                    if(response.data?.register.errors){
                        setErrors(toErrorMap(response.data.register.errors));
                    }else if (response.data?.register.user){
                        history.push("/login");
                    }
                }}
            >
                {
                    ({ isSubmitting }) => (        
                        <Form>
                            <InputField
                                name={"username"}
                                label={constants.LABELS.FORM_NAMES.USERNAME}
                                placeholder={constants.LABELS.FORM_NAMES.USERNAME}
                                marginTop={50}
                                type="text"
                            />
                            <InputField
                                name={"password"}
                                label={constants.LABELS.FORM_NAMES.PASSWORD}
                                placeholder={constants.LABELS.FORM_NAMES.PASSWORD}
                                marginTop={5}
                                type="password"
                            />
                            <InputField
                                name={"confirmPassword"}
                                label={constants.LABELS.FORM_NAMES.CONFIRM_PASSWORD}
                                placeholder={constants.LABELS.FORM_NAMES.CONFIRM_PASSWORD}
                                marginTop={5}
                                type="password"
                            />
                            <BoxContainer style={{marginTop: 15}} position="center">
                                <Button variant="primary" type="submit" disabled={isSubmitting}>
                                    {constants.LABELS.ROUTE_NAMES.SIGNUP}
                                </Button>
                            </BoxContainer>
                        </Form>
                    )
                }
            </Formik>
        </BoxContainer>
    );
}

export default withRouter(Register);