import { Formik, Field, Form } from 'formik';
import { TextField, Button, Grid, Typography, Box } from '@mui/material';
import * as Yup from 'yup';

// Validation schema using Yup
const SignupSchema = Yup.object().shape({
  username: Yup.string()
    .min(3, 'Username must be at least 3 characters')
    .max(15, 'Username must be less than 15 characters')
    .required('Username is required'),
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
  password: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Passwords must match')
    .required('Confirm Password is required'),
});

// Signup Form Component
const Signup = () => {
  return (
    <Grid container justifyContent="center" spacing={2} >
      <Grid item xs={12} sm={8} md={6} lg={4} xl={3}> {/* Apply breakpoints to Grid item */}
        <Box sx={{ mx: 'auto', mt: 4, padding: 3, border: '1px solid #ccc', borderRadius: 2 }}>
          <Typography variant="h5" gutterBottom align="center">
            Signup
          </Typography>

          <Formik
            initialValues={{
              username: '',
              email: '',
              password: '',
              confirmPassword: '',
            }}
            validationSchema={SignupSchema}
            onSubmit={(values, { setSubmitting }) => {
              setTimeout(() => {
                alert(JSON.stringify(values, null, 2));
                setSubmitting(false);
              }, 400);
            }}
          >
            {({ isSubmitting, touched, errors }) => (
              <Form>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Field
                      name="username"
                      label="Username"
                      as={TextField}
                      fullWidth
                      variant="filled"
                      helperText={touched.username && errors.username}
                      error={touched.username && Boolean(errors.username)}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <Field
                      name="email"
                      label="Email"
                      type="email"
                      as={TextField}
                      fullWidth
                      variant="outlined"
                      helperText={touched.email && errors.email}
                      error={touched.email && Boolean(errors.email)}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <Field
                      name="password"
                      label="Password"
                      type="password"
                      as={TextField}
                      required
                      fullWidth
                      variant="standard"
                      helperText={touched.password && errors.password}
                      error={touched.password && Boolean(errors.password)}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <Field
                      name="confirmPassword"
                      label="Confirm Password"
                      type="password"
                      as={TextField}
                      fullWidth
                      variant="outlined"
                      helperText={touched.confirmPassword && errors.confirmPassword}
                      error={touched.confirmPassword && Boolean(errors.confirmPassword)}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <Button
                      type="submit"
                      fullWidth
                      variant="contained"
                      color="primary"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? 'Submitting...' : 'Sign Up'}
                    </Button>
                  </Grid>
                </Grid>
              </Form>
            )}
          </Formik>
        </Box>
      </Grid>
    </Grid>
  );
};

export default Signup;
