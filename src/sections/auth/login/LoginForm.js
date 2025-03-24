import { useState, useRef } from "react";
import { useRouter } from "next/router";
import { useFormik } from "formik";
import * as Yup from "yup";
// @mui
import {
  Link,
  Stack,
  IconButton,
  InputAdornment,
  TextField,
  Checkbox,
  Typography,
  Alert,
} from "@mui/material";
import CustomButton from "src/components/Button";
// components
import Iconify from "../../../components/iconify";
import axios from "axios";

// ----------------------------------------------------------------------

export default function LoginForm() {
  const router = useRouter();
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginSuccess, setLoginSuccess] = useState(false);
  const form = useRef(null);

  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (values, helpers) => {
    setLoginLoading(true);
    let formData = new URLSearchParams(values).toString();
    axios
      .post(`${process.env.NEXT_PUBLIC_API}/auth/login`, formData)
      .then(({ data }) => {
        if (!data.error && data.success) {
          setLoginSuccess(true);
          setLoginLoading(false);
          router.push("/dashboard");
        } else {
          try {
            if (data.error) {
              throw new Error(data.error.message);
            }
          } catch (err) {
            helpers.setStatus({ success: false });
            helpers.setErrors({ submit: err.message });
            helpers.setSubmitting(false);
            setLoginLoading(false);
          }
        }
      })
      .catch((err) => {
        helpers.setStatus({ success: false });
        helpers.setErrors({ submit: err.message });
        helpers.setSubmitting(false);
        setLoginLoading(false);
      });
  };

  const formik = useFormik({
    initialValues: {
      email: "",
      pass: "",
      submit: null,
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email("Must be a valid email")
        .max(255)
        .required("Email is required"),
      pass: Yup.string().max(255).required("Password is required"),
    }),
    onSubmit: handleSubmit,
  });

  return (
    <form ref={form} noValidate onSubmit={formik.handleSubmit}>
      <Stack spacing={3}>
        {loginSuccess && (
          <Alert
            color="success"
            severity="info"
            sx={{ mt: 3 }}
            style={{ marginBottom: "10px" }}
          >
            <div>
              <b>Login Successful</b>
            </div>
          </Alert>
        )}
        <TextField
          color="error"
          error={!!(formik.touched.email && formik.errors.email)}
          fullWidth
          helperText={formik.touched.email && formik.errors.email}
          label="Email Address"
          name="email"
          onBlur={formik.handleBlur}
          onChange={formik.handleChange}
          type="email"
          value={formik.values.email}
        />

        <TextField
          color="error"
          error={!!(formik.touched.pass && formik.errors.pass)}
          fullWidth
          helperText={formik.touched.pass && formik.errors.pass}
          label="Password"
          name="pass"
          onBlur={formik.handleBlur}
          onChange={formik.handleChange}
          value={formik.values.pass}
          type={showPassword ? "text" : "password"}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={() => setShowPassword(!showPassword)}
                  edge="end"
                >
                  <Iconify
                    icon={showPassword ? "eva:eye-fill" : "eva:eye-off-fill"}
                  />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </Stack>

      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{ my: 2 }}
      >
        {/* <Checkbox name="remember" label="Remember me" /> */}
        <Link variant="subtitle2" color="error" underline="hover">
          Forgot password?
        </Link>
      </Stack>

      {formik.errors.submit && (
        <Typography color="error" sx={{ mt: 3 }} variant="body2">
          {formik.errors.submit}
        </Typography>
      )}
      <CustomButton
        fullWidth
        size="large"
        sx={{ mt: 3 }}
        type="submit"
        variant="contained"
        innerText={"Sign in"}
        isLoading={loginLoading}
      />
    </form>
  );
}
