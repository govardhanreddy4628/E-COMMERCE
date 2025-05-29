import * as yup from "yup";

//const nameRegex = /^[a-zA-Z\s]+$/;
const phoneNumberRegex = /^\d+$/;
const specialCharRegex = /[^a-zA-Z0-9]/;
//const emailRegex =/^[A-Za-z0-9_%+-]+(\.[A-Za-z0-9_%+-]+)*@[A-Za-z0-9-]+\.[A-Za-z]{2,}$/;


const phoneNumberValidation = () =>
  yup
    .string()
    .required("Phone Number is Required")
    .test(
      "no-special-characters",
      "Special characters are not allowed",
      //(value: any) => !value || !specialCharRegex.test(value)   !value is unnessasary as .required checking it already
      (value) =>  !specialCharRegex.test(value)
    )
    .test(
      "no-letters",
      "Phone number cannot contain letters",
      (value) => !/[a-zA-Z]/.test(value)
    )
    .test(
      "only-numbers",
      "Phone number must be a valid number",
      (value) => phoneNumberRegex.test(value)
    )
    .test(
      "length",
      "Phone number must be exactly 10 digits",
      (value) => value.length === 10
    )
    .test(
      "no-start-zero",
      "Phone number cannot start with 0",
      (value) =>  !value.startsWith("0")
    );


export const SignupSchema = yup.object().shape({
  name: yup.string().required("Required"),
  password: yup
    .string()
    .min(8, "Password should be of minimum 8 characters length")
    .max(50, "Too Long!")
    .required("Required"),
  email: yup.string().email("Invalid email").required("Required"),
  phone_number: phoneNumberValidation(),
  repeat_password: yup
    .string()
    .oneOf([yup.ref("password")], "Passwords must match")
    .required("Required"),
  terms_and_conditions: yup
    .boolean()
    .oneOf([true], "You must accept the terms and conditions")
    .required("You must accept the terms and conditions"),
});