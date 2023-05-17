import Head from 'next/head';
import { faker } from '@faker-js/faker';
// @mui
import { useTheme } from '@mui/material/styles';
import { Grid, Container, Typography } from '@mui/material';
// components
import Iconify from '../../components/iconify';
// sections
import {
  Recents,
  AppWidgetSummary,
} from '../../sections/@dashboard/app';
import DashboardLayout from '../../layouts/dashboard/DashboardLayout';
import { authLayer } from 'src/auth/authLayer';
import UserContext from 'src/contexts/userContext';
import Link from 'next/link'

// ----------------------------------------------------------------------

export default function Page({data}) {
  return (
    <>
      <Head>
        <title> Dashboard | Notify On Expiry </title>
      </Head>
      <UserContext.Provider value={{data}}>
      <DashboardLayout>
      <Container maxWidth="xl">
        <Typography variant="h4" sx={{ mb: 5 }}>
          Hi, {data?.user_fname}
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={3}>
          <Link href='/dashboard/products'>
            <AppWidgetSummary title="Total Products" total={data?.totalProd || 0} icon={'ph:package-fill'} />
          </Link>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary title="Avg. Exp Remaining(Days)" total={data?.avgExpRemaining || 0} color="info" icon={'material-symbols:clock-loader-20'} />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary title="Upcoming Expirations" total={data?.upcomingExpProd || 0} color="warning" icon={'twemoji:double-exclamation-mark'} />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Link href='/dashboard/products/expired-products'>
              <AppWidgetSummary title="Expired Products" total={data?.expiredProd || 0} color="error" icon={'el:warning-sign'} />
            </Link>
          </Grid>

          <Grid item xs={12}>
            <Recents
              title="Newly Added Products"
              list={data.recentProd.map( ({prod_name, created_at}, k) => ({
                id: k,
                title: prod_name,
                description: 'other descriptions',
                image: `/assets/images/products/package.jpg`,
                postedAt: new Date(created_at),
              }) )}
            />
          </Grid>
        </Grid>
      </Container>
      </DashboardLayout>
      </UserContext.Provider>
    </>
  );
}



export const getServerSideProps = authLayer
