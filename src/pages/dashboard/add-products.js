import Head from 'next/head'
import Link from 'next/link'
// @mui
import {
    Card,
    CardContent,
    CardActions,
    Table,
    Stack,
    Paper,
    Avatar,
    Button,
    Popover,
    Checkbox,
    TableRow,
    MenuItem,
    TableBody,
    TableCell,
    Container,
    Typography,
    IconButton,
    TableContainer,
    TablePagination,
    Divider,
    Tabs,
    Tab
  } from '@mui/material';
import { useState } from 'react';
import DashboardLayout from "src/layouts/dashboard/DashboardLayout"
import ManualProductAdd from 'src/sections/@dashboard/add-product/ManualProductAdd';
import BarCodeAdd from 'src/sections/@dashboard/add-product/BarCodeAdd';
import CustomButton from 'src/components/Button';
import { authLayer } from 'src/auth/authLayer';
import UserContext from 'src/contexts/userContext';


const Page = ({data}) => {
    const [selectedTab, setSelectedTab] = useState(0);
    const handleTabChange = (event, newValue) => {
        setSelectedTab(newValue);
    };

    return(
        <>
        <Head>
            <title> Add New Products | Notify on Expiry </title>
        </Head>
        <UserContext.Provider value={{data}}>
        <DashboardLayout>
        <Container maxWidth="lg">
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Add New Products
          </Typography>
          <Link href='/dashboard/products'>
          <Button variant="contained">
            View All Products
          </Button>
          </Link>
        </Stack>
        <Card>
          <div>
          <Tabs value={selectedTab} onChange={handleTabChange}>
            <Tab label="Add Product Manually" />
            <Tab label="Scan Barcode" />
          </Tabs>
          <CardContent sx={{ pt: 0 }}>
          {/* Add Product Manually Tab */}
            {selectedTab === 0 && (
              <ManualProductAdd />
            )}

            {/* Scan Barcode Tab */}
            {selectedTab === 1 && (
              <BarCodeAdd />
            )}
          </CardContent>
        </div>
        </Card>
        </Container>
        </DashboardLayout>
        </UserContext.Provider>
        </>
    )
}


export default Page


export const getServerSideProps = authLayer