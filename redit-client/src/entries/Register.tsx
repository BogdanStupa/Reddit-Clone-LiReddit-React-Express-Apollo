import React from 'react';
import { Form, Formik } from 'formik';
import { useMutation } from "urql";
import BoxContainer from "../containers/BoxContainer";
import constants from '../constants';
import Button from "react-bootstrap/Button";
import InputField from "../components/InputField";


interface IComponentProps {

};

const REGISTER_MUTATION = `mutation Register($username: String!, $password: String!){
    register (options: {
      username: $username,
      password: $password
    }){
      user{
        id,
        username,
        createdAt
      },
      errors{
        field,
        message
      }
    }
  }`;

const Register: React.FC<IComponentProps> = () => {
    const [, register] = useMutation(REGISTER_MUTATION);  
 
    return (
        <BoxContainer
            position="center"
            style={{
                marginTop: 50
            }}
            colMode
        >
            <h3>
                {constants.LABELS.SIGNUP.SIGNUP}
            </h3>
            <Formik
                initialValues={{
                    username: "",
                    password: "",
                    confirmPassword: ""
                }}
                onSubmit={(values) => {
                    console.log(values);
                    return register(values);
                }}
            >
                {
                    ({ isSubmitting }) => (        
                        <Form>
                            <InputField
                                name={"username"}
                                label={constants.LABELS.NAMES.USERNAME}
                                placeholder={constants.LABELS.NAMES.USERNAME}
                                marginTop={50}
                                type="text"
                            />
                            <InputField
                                name={"password"}
                                label={constants.LABELS.NAMES.PASSWORD}
                                placeholder={constants.LABELS.NAMES.PASSWORD}
                                marginTop={5}
                                type="password"
                            />
                            <InputField
                                name={"confirmPassword"}
                                label={constants.LABELS.NAMES.CONFIRM_PASSWORD}
                                placeholder={constants.LABELS.NAMES.CONFIRM_PASSWORD}
                                marginTop={5}
                                type="password"
                            />
                            <BoxContainer style={{marginTop: 15}} position="center">
                                <Button size="lg" variant="primary" type="submit" disabled={isSubmitting}>
                                    Submit
                                </Button>
                            </BoxContainer>
                        </Form>
                    )
                }
            </Formik>
        </BoxContainer>
    );
}

export default Register;