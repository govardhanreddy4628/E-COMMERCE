import React from 'react'
import { Field, Form, Formik } from 'formik';
import { Box, TextField, Typography } from '@mui/material';
import * as yup from "yup";
import InputTextFieldUI from '../ui/textField';

interface FormValues {
  name: string;
  password: string;
  email: string;
  phone_number: string;
  repeat_password: string;
  country_code: string;
  terms_and_conditions: boolean;
}

const FormikComponent = () => {

  const REQUIRED = "Required";
  //const nameRegex = /^[a-zA-Z\s]+$/;
  //const phoneNumberRegex = /^\d+$/;
  const specialCharRegex = /[^a-zA-Z0-9]/;
  //const emailRegex =/^[A-Za-z0-9_%+-]+(\.[A-Za-z0-9_%+-]+)*@[A-Za-z0-9-]+\.[A-Za-z]{2,}$/;

  const initialState: FormValues = {
    name: "",
    password: "",
    email: "",
    phone_number: "",
    repeat_password: "",
    country_code: "",
    terms_and_conditions: false,
  }

  const phoneNumberValidation = () =>

    yup.string().required(REQUIRED).test(
      "no special characters", "should not contain special characters", (value: any) => !value || !specialCharRegex.test(value))
      .test("no-letters", "Phone number cannot contain letters", (value: any) => !value || !/[a-zA-Z]/.test(value))



  const validationSchema = yup.object().shape({
    name: yup.string().required(REQUIRED),
    email: yup.string().required(REQUIRED).email("Invalid Email"),
    password: yup.string().required(REQUIRED).min(5).max(15),
    phone_number: phoneNumberValidation(),
    terms_and_conditions: yup.boolean()
      .oneOf([true], "You must accept the terms and conditions")
      .required("You must accept the terms and conditions"),
    repeat_password: yup.string().required(REQUIRED).oneOf([yup.ref("password")])
  })

  return (
    <Formik initialValues={initialState} validationSchema={validationSchema} enableReinitialize validateOnMount onSubmit={() => { }}>
      {(formik) => {
        return (
          <Box sx={{ width: "50%", height: "100vh", margin: "auto", alignContent: "center", justifyContent: "center", }}>
            <Form>
              <Box><Typography component="h1">SignUp Form</Typography></Box>
              <div>
                <InputTextFieldUI
                  name="name"
                  type="text"
                  label="Name"
                  variant="filled"
                  color="primary"     
                  size="small"
                  formik={formik}
                 
                />
              </div>
              <div>
                <InputTextFieldUI
                  name="email"
                  type="email"
                  label="Email"
                  variant="outlined"
                  color="primary"     
                  size="small"
                  formik={formik}
                  
                />
              </div>
              <div>
                <InputTextFieldUI
                  name="password"
                  type="password"
                  label="password"
                  variant="outlined"
                  color="primary"     
                  size="small"
                  formik={formik}
                />
              </div>
              <div>
                <InputTextFieldUI
                  name="repeat_password"
                  type="password"
                  label="Repeat Password"
                  variant="outlined"
                  color="primary"     
                  size="small"
                  formik={formik}
                  
                />
              </div>
              <div>
                <button type="submit" disabled={formik.isSubmitting}>
                  Submit
                </button>
              </div>
            </Form>
          </Box>


        )
      }}
    </Formik>
  )
}

export default FormikComponent
