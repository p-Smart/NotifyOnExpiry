import { Box,Typography, Alert, Card, Button, CardActions, CardContent, CardHeader, Divider, TextField, MenuItem, InputAdornment, SvgIcon, IconButton,Unstable_Grid2 as Grid} from '@mui/material'
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios'
import { useEffect, useState, useRef } from 'react';
import CustomButton from 'src/components/Button';
import { MobileDatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import dayjs, {Dayjs} from 'dayjs'
import Iconify from '../../../components/iconify';
import { customSort } from 'src/components/customSort';


const ManualProductAdd = () => {
    const [prodAddedSuccessful, setProdAddedSuccessful] = useState(false)
    const [loading, setLoading] = useState(false)
    const [prodCount, setProdCount] = useState(1)
    const [error, setError] = useState('')
    const fieldsCountRange = customSort(['5', '10', '15', '20', '30', '40', '50', '100', prodCount.toString()])
    const form = useRef(null)
    const [successMessage, setSuccessMessage] = useState('')
    const formFieldDefaultData = {
      prod_name: '',
      prod_add_date: dayjs(null),
      prod_exp_date: dayjs(null),
    }

    function validateFormData(formData) {
        for (let i = 0; i < formData.length; i++) {
          const { prod_add_date, prod_exp_date, prod_name } = formData[i];
      
          if (typeof prod_name !== 'string' || prod_name.trim() === '') {
            return `Invalid Product Name in Product ${i+1}. Please provide a non-empty string.`;
          }
          if (!(prod_add_date instanceof Date)) {
            return `Invalid Date in Product ${i+1}. Please provide a valid date.`;
          }
      
          if (!(prod_exp_date instanceof Date)) {
            return `Invalid Date in Product ${i+1}. Please provide a valid date.`;
          }
        }
        return null;
    }



    const [formFields, setFormFields] = useState(Array.from({ length: prodCount }, () => (formFieldDefaultData)))
    
      const handleFormChange = (event, index) => {
        const isEvent = (event && typeof event === 'object' && typeof event?.stopPropagation === 'function')
        let data = [...formFields];
        if (isEvent){
            data[index][event.target.name] = event.target.value;
        }else{
            data[index][event.key] = event.value;
        }
        
        setFormFields(data);
      }
    
      const addFields = () => {
        let object = {
            prod_name: '',
            prod_add_date: dayjs(null),
            prod_exp_date: dayjs(null),
        }
        setFormFields([...formFields, object])
      }
    
      const removeFields = (index) => {
        let data = [...formFields];
        data.splice(index, 1)
        setFormFields(data)
      }

      const handleAddMultipleFields = (e) => {
        const fields = parseInt(e.target.value);

        setFormFields(prevFormFields => {
            const updatedFormFields = [];

            for (let i = 0; i < fields; i++) {
            const object = {
                prod_name: '',
                prod_add_date: dayjs(null),
                prod_exp_date: dayjs(null),
            };
            updatedFormFields.push(object);
            }

            return [...prevFormFields, ...updatedFormFields];
        });
      }



      const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true)
        const formValidated = validateFormData(formFields)

        if(!formValidated){

          try{
            const {data} = await axios.post(`${process.env.NEXT_PUBLIC_API}/user/products/add-product`, formFields)
            if(data?.success){
              setSuccessMessage(data?.message)
              setProdAddedSuccessful(true)
              form.current.scrollIntoView({ behavior: 'smooth' });
              setFormFields([formFieldDefaultData])
              
              setTimeout(()=>{
                setProdAddedSuccessful(false)
              }, 3000)
            }
            else{
              setError(response.data.error.message);
            }
          }
          catch(err){
            setError(err.message)
          }
          finally{
            setLoading(false)
          }
        }
        else{
            setError(formValidated)
            setLoading(false)
        }

        
      }

    useEffect(() => {
        setProdCount(formFields.length)
    })



    return(
        <form
        noValidate
        ref={form}
        onSubmit={handleSubmit}
        >
        <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Box sx={{ m: -1.5, mt: 3 }}>
        {
              prodAddedSuccessful && (
              <Grid xs={12}>
                <Alert
                    color="success"
                    severity="info"
                    sx={{ mt: 3 }}
                    style={{marginBottom:'10px'}}
                    >
                      <div>
                        <b>{successMessage}</b>
                      </div>
                </Alert>
              </Grid>
              )
        }
        {
            formFields.map((form, index) => (
            
            <Grid
            container
            spacing={3}
            key={index}
            >
            <Grid xs={12} sx={{ marginBottom: -2 }}>
            <Typography variant="subtitle1">
                {`Product ${index+1}`}
            </Typography>
            </Grid>
              <Grid xs={12} md={3.5}>
                <TextField
                //   error={!!(formik.touched.products?.[index]?.prod_name && formik.errors.products?.[index]?.prod_name)}
                  fullWidth
                //   helperText={formik.touched.products?.[index]?.prod_name && formik.errors.products?.[index]?.prod_name}
                  label="Product Name"
                  name={`prod_name`}
                  required
                  onChange={event => handleFormChange(event, index)}
                //   onBlur={formik.handleBlur}
                  value={form.prod_name}
                />
              </Grid>
              <Grid
                xs={12}
                md={3.5}
              >
                <MobileDatePicker
                // disableFuture
                fullWidth
                label="Date Added to Inventory"
                name="prod_add_date"
                required
                value={form.prod_add_date}
                openTo="year"
                views={['year', 'month', 'day']}
                onChange={date => handleFormChange({key: 'prod_add_date', value: date.toDate()}, index)}
                componentsProps={{ textField: {
                    error: false,
                    // onBlur: formik.handleBlur,
                    // helperText: formik.touched.prod_add_date && formik.errors.prod_add_date,
                    fullWidth: true
                    } }}
                />
              </Grid>
              <Grid
                xs={12}
                md={3.5}
              >
                <MobileDatePicker
                // disablePast
                label="Expiry Date"
                name="prod_exp_date"
                openTo="year"
                views={['year', 'month', 'day']}
                value={form.prod_exp_date}
                onChange={date => handleFormChange({key: 'prod_exp_date', value: date.toDate()}, index)}
                fullWidth
                required
                componentsProps={{ textField: {
                    error: false,
                    // onBlur: formik.handleBlur,
                    // helperText: formik.touched.prod_exp_date && formik.errors.prod_exp_date,
                    fullWidth: true
                    } }}
                />
              </Grid>
              <Grid
              xs={12}
              md={1.5}
              >
                <Button disabled={loading} variant='contained' color='error' onClick={() => removeFields(index)}>
                <Iconify icon='ic:baseline-remove-circle' sx={{mr: .5}}/>
                <Typography variant='subtitle2'>Remove</Typography>
                </Button>
              </Grid>
            </Grid>
            ))
        }
          </Box>
          <Divider />
          <Grid container spacing={3}>
          <Grid
          md={12}
          xs={6}
          >
                <Button sx={{mt: 3}} disabled={loading} variant='contained' onClick={() => addFields()}>
                  <Iconify icon='material-symbols:add-box-outline' sx={{mr: .5}}/>
                  <Typography variant='subtitle2'>Add Field</Typography>
                </Button>
            </Grid>
            <Grid
            xs={6}
            md={3}
            >
            <TextField
            sx={{mt: 2}}
            fullWidth
            label="Add Multiple Fields"
            name="add-fields"
            onChange={handleAddMultipleFields}
            defaultValue={prodCount.toString()}
            value={prodCount.toString()}
            select
            >
                  {fieldsCountRange.map((fieldsCount, k) => (
                    <MenuItem
                      key={k}
                      value={fieldsCount}
                    >
                      {fieldsCount}
                    </MenuItem>
                  ))}
                </TextField>
            </Grid>
            </Grid>
          {error && (
              <Grid xs={12}>
                <Typography
                  color="error"
                  sx={{ mt: 3 }}
                  variant="body2"
                >
                  {error}
                </Typography>
            </Grid>
              )}
          <CardActions sx={{ justifyContent: 'center', mt: 3 }}>
            <Box sx={{ minWidth: { md: 400 } }}><CustomButton fullWidth variant='contained' type='submit' innerText='Upload Products' isLoading={loading} /></Box>
        </CardActions>
        </LocalizationProvider>
        </form>
    )

}


export default ManualProductAdd