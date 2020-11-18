import React from 'react';
import { Form, Formik } from 'formik';
import BoxContainer from "../containers/BoxContainer";
import constants from '../constants';
import Button from "react-bootstrap/Button";
import InputField from "../components/InputField";
import { useLoginMutation } from '../generated/graphql';
import { toErrorMap } from '../utils/toErrorMap';
import { History } from "history";
import { withRouter } from 'react-router-dom';
import { useApolloClient } from '@apollo/client';


interface IComponentProps {
    history: History
};

const Register: React.FC<IComponentProps> = ({ history }) => {
    const [login, ] = useLoginMutation();  
    const client = useApolloClient();

    return (
        <BoxContainer
            position="center"
            style={{
                marginTop: 50
            }}
            colMode
        >
            <h3>
                {constants.LABELS.ROUTE_NAMES.LOGIN}
            </h3>
            <Formik
                initialValues={{
                    username: "",
                    password: ""
                }}
                onSubmit={ async (values, { setErrors }) => {
                    const response = await login({
                        variables: {
                            options: values
                        }
                    });
                    if(response.data?.login.errors){
                        setErrors(toErrorMap(response.data.login.errors));
                    }else if(response.data?.login.user){
                        await client.resetStore();
                        history.push("/");
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
                            <BoxContainer style={{marginTop: 15}} position="center">
                                <Button variant="primary" type="submit" disabled={isSubmitting}>
                                    {constants.LABELS.ROUTE_NAMES.LOGIN}
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