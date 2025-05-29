import { Button, Grid, TextField } from "@mui/material";
import { Field, FieldArray, Form, Formik } from "formik";
// import * as Yup from "Yup";

export default function FormikFieldArray() {
  const initialValues = {
    firstName: "",
    lastName: "",
    fullName: "",
    email: "",
    phoneNumbers: [""],
  };

  // const validationSchema = Yup.Object({});

  const validateEmail = (value) => {
    let error;
    if (!value) {
      error = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(value)) {
      error = "Invalid email address";
    }
    return error;
  };

  const validateField = (values) => {
    const errors = {};

    // Validate Email field
    errors.email = validateEmail(values.email);

    // Add validation logic for other fields if needed
    if (!values.firstName) {
      errors.firstName = "First name is required";
    }

    if (!values.lastName) {
      errors.lastName = "Last name is required";
    }

    if (!values.fullName) {
      errors.fullName = "Full name is required";
    }

    return errors;
  };

  const handleSubmit = () => {};

  return (
    <Formik
      initialValues={initialValues}
      validate={validateField}
      onSubmit={handleSubmit}
      validateOnMount={false}
    >
      {(formik) => (
        <Form
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "100vh",
            width: "100%",
          }}
        >
          <Grid
            container
            spacing={2}
            justifyContent="center"
            alignItems="center"
          >
            {console.log(formik) || null}
            {console.log(formik.values) || null}
            <Grid item xs={6} sm={6} md={6} lg={6} xl={6}>
              <Field
                as={TextField}
                name="firstName"
                placeholder="enter firstName"
                label="firstName"
                variant="outlined"
                fullWidth
                error={Boolean(
                  formik.errors.firstName && formik.touched.firstName
                )}
                helperText={formik.errors.firstName && formik.touched.firstName}
              ></Field>
            </Grid>
            <Grid item xs={6} sm={6} md={6} lg={6} xl={6}>
              <Field
                as={TextField}
                name="lastName"
                placeholder="enter lastName"
                label="lastName"
                variant="outlined"
                fullWidth
                error={Boolean(
                  formik.errors.lastName && formik.touched.lastName
                )}
                helperText={formik.errors.lastName && formik.touched.lastName}
              ></Field>
            </Grid>
            <Grid item xs={6} sm={6} md={6} lg={6} xl={6}>
              <Field
                as={TextField}
                name="fullName"
                placeholder="enter fullName"
                label="fullName"
                variant="outlined"
                fullWidth
                error={Boolean(
                  formik.errors.fullName && formik.touched.fullName
                )}
                helperText={formik.errors.fullName && formik.touched.fullName}
              ></Field>
            </Grid>
            <Grid item xs={6} sm={6} md={6} lg={6} xl={6}>
              <Field name="email">
                {(props) => {
                  const { field, form, meta } = props;
                  console.log(form);
                  console.log(field);
                  return (
                    <TextField
                      {...field} // Spread the field props like value, onChange, onBlur
                      label="Email"
                      variant="outlined"
                      fullWidth
                      error={Boolean(meta.touched && meta.error)} // Show error if touched and error exists
                      helperText={meta.touched && meta.error ? meta.error : ""} // Show error message if touched
                    />
                  );
                }}
              </Field>
            </Grid>
            <Grid>
              <FieldArray name="phoneNumbers">
                {(props) => {
                  const { push, remove, form } = props;
                  console.log(form);
                  const { phoneNumbers } = form.values;
                  return (
                    <>
                      {phoneNumbers.map((phoneNumber, index) => (
                        <div key={index}>
                          <TextField
                            name={`phoneNumbers[${index}]`}
                            label="Phone Number"
                            value={phoneNumber}
                            onChange={(e) => {
                              form.setFieldValue(
                                `phoneNumbers[${index}]`,
                                e.target.value
                              );
                            }}
                            fullWidth
                          />
                          {phoneNumbers.length > 1 && (
                            <Button
                              type="button"
                              disabled={phoneNumbers.length < 2}
                              onClick={() =>
                                phoneNumbers.length > 1 && remove(index)
                              }
                            >
                              Remove
                            </Button>
                          )}
                        </div>
                      ))}
                      <Button
                        type="button"
                        disabled={phoneNumbers.length === 3}
                        onClick={() => phoneNumbers.length < 3 && push("")}
                      >
                        Add Phone Number
                      </Button>
                    </>
                  );
                }}
              </FieldArray>
            </Grid>
          </Grid>
        </Form>
      )}
    </Formik>
  );
}
