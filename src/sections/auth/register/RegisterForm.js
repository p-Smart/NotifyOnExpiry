import { useState, useRef } from 'react';
import {useRouter} from 'next/router'
import { useFormik } from 'formik';
import * as Yup from 'yup';
import Link from 'next/link'
import axios from 'axios'
// @mui
import {Stack, IconButton, InputAdornment, TextField, Checkbox, Alert, Typography, Grid } from '@mui/material';
// components
import Iconify from '../../../components/iconify';
import CustomButton from '../../../components/Button';

// ----------------------------------------------------------------------

export default function RegisterForm() {
  const [regLoading, setRegLoading] = useState(false)
  const [regSuccess, setRegSuccess] = useState(false)
  const router = useRouter();
  const form = useRef(null);

  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (values, helpers) => {
    setRegLoading(true)
      let formData = new URLSearchParams(values).toString()
      // console.log(Array.from(formData.entries()))
      axios.post(`${process.env.NEXT_PUBLIC_API}/auth/register`, formData)
      .then( ({data}) => {
        if(!data.error && data.success && !data.emailExist && !data.telExist){
          setRegSuccess(true)
          setTimeout( () => {
            router.push('/login')
          }, 1000 )
          setRegLoading(false)
        }
        else{
          try{
            if(data.error){
              throw new Error(data.error.message)
            }
          }
          catch (err) {
            helpers.setStatus({ success: false });
            helpers.setErrors({ submit: err.message });
            helpers.setSubmitting(false);
            setRegLoading(false)
          }
        }
      } )
      .catch( (err) => {
          helpers.setStatus({ success: false });
          helpers.setErrors({ submit: err.message });
          helpers.setSubmitting(false);
          setRegLoading(false)
      } )
  }


  const formik = useFormik({
    initialValues: {
      fname: '',
      lname: '',
      tel: '',
      email: '',
      pass: '',
      submit: null
    },
    validationSchema: Yup.object({
      fname: Yup.string().required('First name is required'),
      lname: Yup.string().required('Last name is required'),
      email: Yup.string().email('Must be a valid email').max(255).required('Email is required'),
      tel: Yup.string().matches(/^\d{11}$/,"Phone number is not valid"),
      pass: Yup.string().min(8).required('Choose a password').matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*_])(?=.{8,})/,'Password must contain at least one uppercase letter, one lowercase letter, one number and a special character'),
    }),
    onSubmit: handleSubmit
  });

  return (
    <form
        ref={form}
        noValidate
        onSubmit={formik.handleSubmit}
    >
      {
        regSuccess && (
          <Alert
            color="success"
            severity="info"
            sx={{ mt: 3 }}
            style={{marginBottom:'10px'}}
            >
              <div>
                <b>Registration Successful</b>
              </div>
          </Alert>
        )
      }
      {/* <Stack spacing={3} sx={{ my: 3 }}>
        <TextField name="email" label="Email address" />

        <TextField
          name="password"
          label="Password"
          type={showPassword ? 'text' : 'password'}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                  <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </Stack> */}

      <Grid container spacing={3} >
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              error={!!(formik.touched.fname && formik.errors.fname)}
              // sx={{width: {sm: '50%'}}}
              helperText={formik.touched.fname && formik.errors.fname}
              label="First Name"
              name="fname"
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              value={formik.values.fname}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              error={!!(formik.touched.lname && formik.errors.lname)}
              helperText={formik.touched.lname && formik.errors.lname}
              label="Last Name"
              name="lname"
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              value={formik.values.lname}
            />
          </Grid>
          <Grid item xs={12} sm={12}>
            <TextField
            fullWidth
              error={!!(formik.touched.tel && formik.errors.tel)}
              helperText={formik.touched.tel && formik.errors.tel}
              label="Phone Number (Optional)"
              name="tel"
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              value={formik.values.tel}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
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
          </Grid>
          <Grid item xs={12}>
            <TextField
              name="pass"
              label="Password"
              fullWidth
              value={formik.values.pass}
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              error={!!(formik.touched.pass && formik.errors.pass)}
              helperText={formik.touched.pass && formik.errors.pass}
              type={showPassword ? 'text' : 'password'}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                      <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
        </Grid>
        {formik.errors.submit && (
          <Typography
            color="error"
            sx={{ mt: 3 }}
            variant="body2"
          >
            {formik.errors.submit}
          </Typography>
        )}
        <CustomButton
          fullWidth
          size="large"
          sx={{ mt: 3 }}
          type="submit"
          variant="contained"
          innerText={'Register'}
          isLoading={regLoading}
        />
      </form>
  );
}
