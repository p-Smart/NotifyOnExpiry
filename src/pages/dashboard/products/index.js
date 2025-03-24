import Head from "next/head";
import axios from "axios";
import { sentenceCase } from "change-case";
import { useEffect, useState } from "react";
import Link from "next/link";
// @mui
import {
  Card,
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
} from "@mui/material";

import { authLayer } from "src/auth/authLayer";
import UserContext from "src/contexts/userContext";
import Label from "src/components/label/Label";
import Iconify from "src/components/iconify/Iconify";
import Scrollbar from "src/components/scrollbar/Scrollbar";
import DashboardLayout from "src/layouts/dashboard/DashboardLayout";
import ProductListHead from "src/sections/@dashboard/product/ProductListHead";
import ProductListToolbar from "src/sections/@dashboard/product/ProductListToolbar";

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: "prod_prod_name", label: "Produce", alignRight: false },
  { id: "prod_weight", label: "Weight", alignRight: false },
  { id: "farmer_name", label: "Farmer's Name", alignRight: false },
  { id: "created_at", label: "Added On", alignRight: false },
  { id: "exp_date", label: "Exp. Date", alignRight: false },
  { id: "status", label: "Status", alignRight: false },
  { id: "" },
];

// ----------------------------------------------------------------------

const Page = ({ data }) => {
  const [open, setOpen] = useState(null);

  const [products, setProducts] = useState([]);

  const [page, setPage] = useState(0);

  const [order, setOrder] = useState("asc");

  const [selected, setSelected] = useState([]);

  const [orderBy, setOrderBy] = useState("prod_name");

  const [filterprod_name, setFilterprod_name] = useState("");

  const [rowsPerPage, setRowsPerPage] = useState(5);

  const handleOpenMenu = (event) => {
    setOpen(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setOpen(null);
  };

  useEffect(() => {
    try {
      axios
        .get(`${process.env.NEXT_PUBLIC_API}/user/products/fetch-products`)
        .then(({ data }) => setProducts(data.products));
    } catch (err) {
      console.error(err.message);
    }
  }, []);

  return (
    <>
      <Head>
        <title> Products | Notify on Expiry </title>
      </Head>
      <UserContext.Provider value={{ data }}>
        <DashboardLayout>
          <Container>
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="space-between"
              mb={5}
            >
              <Typography variant="h4" gutterBottom>
                Produce List
              </Typography>
              <Link href="/dashboard/add-products">
                <Button
                  variant="contained"
                  startIcon={<Iconify icon="eva:plus-fill" />}
                >
                  Add New Produce
                </Button>
              </Link>
            </Stack>

            <Card>
              {/* Search In here */}
              <ProductListToolbar />

              <Scrollbar>
                <TableContainer sx={{ minWidth: 800 }}>
                  <Table>
                    <ProductListHead
                      order={order}
                      orderBy={orderBy}
                      headLabel={TABLE_HEAD}
                      // rowCount={USERLIST.length}
                      // onRequestSort={handleRequestSort}
                      // onSelectAllClick={handleSelectAllClick}
                    />
                    <TableBody>
                      {products.map((row, k) => {
                        const {
                          id,
                          prod_name,
                          prod_weight,
                          farmer_name,
                          prod_exp_date,
                          status,
                          prod_add_date,
                          avatarUrl,
                        } = row;

                        return (
                          <TableRow hover key={k} tabIndex={-1} role="checkbox">
                            <TableCell
                              component="th"
                              scope="row"
                              padding="none"
                            >
                              <Stack
                                direction="row"
                                alignItems="center"
                                spacing={2}
                              >
                                <Avatar
                                  alt={prod_name}
                                  src={`/assets/images/products/package.jpg`}
                                />
                                <Typography variant="subtitle2" noWrap>
                                  {prod_name}
                                </Typography>
                              </Stack>
                            </TableCell>

                            <TableCell align="left">
                              <Typography variant="subtitle2" noWrap>
                                {prod_weight}
                              </Typography>
                            </TableCell>
                            <TableCell align="left">
                              <Typography variant="subtitle2" noWrap>
                                {farmer_name}
                              </Typography>
                            </TableCell>
                            <TableCell align="left">
                              {new Date(prod_add_date).toLocaleDateString()}
                            </TableCell>

                            <TableCell align="left">
                              {new Date(prod_exp_date).toLocaleDateString()}
                            </TableCell>

                            <TableCell align="left">
                              <Label
                                color={
                                  (new Date(prod_exp_date) < new Date() &&
                                    "error") ||
                                  "success"
                                }
                              >
                                {new Date(prod_exp_date) < new Date()
                                  ? "Expired"
                                  : "Not Expired"}
                              </Label>
                            </TableCell>

                            <TableCell align="right">
                              <IconButton
                                size="large"
                                color="inherit"
                                onClick={handleOpenMenu}
                              >
                                <Iconify icon={"eva:more-vertical-fill"} />
                              </IconButton>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                      {/* {emptyRows > 0 && (
                    <TableRow style={{ height: 53 * emptyRows }}>
                      <TableCell colSpan={6} />
                    </TableRow>
                  )} */}
                    </TableBody>

                    {/* Not Found */}
                    {/* {false && (
                  <TableBody>
                    <TableRow>
                      <TableCell align="center" colSpan={6} sx={{ py: 3 }}>
                        <Paper
                          sx={{
                            textAlign: 'center',
                          }}
                        >
                          <Typography variant="h6" paragraph>
                            Not found
                          </Typography>

                          <Typography variant="body2">
                            No results found for &nbsp;
                            <strong>&quot;{filterprod_name}&quot;</strong>.
                            <br /> Try checking for typos or add new products.
                          </Typography>
                        </Paper>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                )} */}
                  </Table>
                </TableContainer>
              </Scrollbar>

              {/* <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={USERLIST.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          /> */}
            </Card>
          </Container>
        </DashboardLayout>

        <Popover
          open={Boolean(open)}
          anchorEl={open}
          onClose={handleCloseMenu}
          anchorOrigin={{ vertical: "top", horizontal: "left" }}
          transformOrigin={{ vertical: "top", horizontal: "right" }}
          PaperProps={{
            sx: {
              p: 1,
              width: 140,
              "& .MuiMenuItem-root": {
                px: 1,
                typography: "body2",
                borderRadius: 0.75,
              },
            },
          }}
        >
          <MenuItem>
            <Iconify icon={"eva:edit-fill"} sx={{ mr: 2 }} />
            Edit
          </MenuItem>

          <MenuItem sx={{ color: "error.main" }}>
            <Iconify icon={"eva:trash-2-outline"} sx={{ mr: 2 }} />
            Delete
          </MenuItem>
        </Popover>
      </UserContext.Provider>
    </>
  );
};

export default Page;
export const getServerSideProps = authLayer;
