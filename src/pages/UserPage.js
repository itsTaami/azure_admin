import { useContext, useEffect, useState } from 'react';

import { Helmet } from 'react-helmet-async';
import { filter } from 'lodash';
import { sentenceCase } from 'change-case';
import axios from 'axios';

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
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { red } from '@mui/material/colors';
// components
import Label from '../components/label';
import Iconify from '../components/iconify';
import Scrollbar from '../components/scrollbar';
import CategoryModal from '../components/modal/categoryModal';
import deleteCat from 'src/CategoryActions/deleteCat';
// sections
import { UserListHead, UserListToolbar } from '../sections/@dashboard/user';
// mock
import USERLIST from '../_mock/user';
import { CategoryContext } from '../context/Category';
import DeleteConfirm from '../components/modal/deleteconfirm';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'title', label: 'Нэр', alignRight: false },
  { id: 'description', label: 'Тайлбар', alignRight: false },
  { id: 'categoryImg', label: 'Зураг', alignRight: false },
  { id: 'catgegoryRating', label: 'Үнэлгээ', alignRight: false },
  { id: '', label: 'Actions', alignRight: true },
];

// ----------------------------------------------------------------------

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function applySortFilter(array, comparator, query) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  if (query) {
    return filter(array, (_user) => _user.name.toLowerCase().indexOf(query.toLowerCase()) !== -1);
  }
  return stabilizedThis.map((el) => el[0]);
}

export default function UserPage() {
  // console.log(categories, fil)

  // const [open, setOpen] = useState(null);

  const [yes, setYes] = useState(false);

  const [newCategory, setNewCategory] = useState(false);

  const [page, setPage] = useState(0);

  const [order, setOrder] = useState('asc');

  const [selected, setSelected] = useState([]);

  const [orderBy, setOrderBy] = useState('name');

  const [filterName, setFilterName] = useState('');

  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [catData, setCatData] = useState({});

  const [isModal, setIsModal] = useState(false);

  const [isSubmit, setIsSubmit] = useState(false);

  // Context
  const { categories, fileteredCategory, getCategory } = useContext(CategoryContext);

  // const icons = [
  //   { icon: <DeleteIcon sx={{ color: red[500] }} />, name: 'Delete' },
  //   { icon: <EditIcon color="action" />, name: 'Edit' },
  // ];

  const modalToggle = () => {
    setIsModal(!isModal);
  };

  const handleYes = () => {
    setYes(true);
  };
  const handleNo = () => {
    setYes(false);
  };

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = USERLIST.map((n) => n.name);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, name) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(selected.slice(0, selectedIndex), selected.slice(selectedIndex + 1));
    }
    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setPage(0);
    setRowsPerPage(parseInt(event.target.value, 10));
  };

  const handleFilterByName = (event) => {
    setPage(0);
    setFilterName(event.target.value);
  };

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - USERLIST.length) : 0;

  const filteredUsers = applySortFilter(USERLIST, getComparator(order, orderBy), filterName);

  const isNotFound = !filteredUsers.length && !!filterName;

  useEffect(() => getCategory(), [isSubmit]);

  return (
    <>
      <Helmet>
        <title> Azure Category </title>
      </Helmet>

      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Category
          </Typography>
          <Button
            onClick={() => {
              modalToggle();
              // setCatData({ name: 'New Category' });
              setNewCategory(true);
            }}
            variant="contained"
            startIcon={<Iconify icon="eva:plus-fill" />}
          >
            New Category
          </Button>
        </Stack>
        {!categories.length && <h4>Хоосон байна</h4>}
        {categories.length > 0 && (
          <Card>
            <UserListToolbar numSelected={selected.length} filterName={filterName} onFilterName={handleFilterByName} />

            <Scrollbar>
              <TableContainer sx={{ minWidth: 800 }}>
                <Table>
                  <UserListHead
                    order={order}
                    orderBy={orderBy}
                    headLabel={TABLE_HEAD}
                    rowCount={USERLIST.length}
                    numSelected={selected.length}
                    onRequestSort={handleRequestSort}
                    onSelectAllClick={handleSelectAllClick}
                  />
                  <TableBody>
                    {fileteredCategory?.map((row) => {
                      const { _id, title, description, categoryImg, categoryRating } = row;

                      return (
                        <TableRow hover key={_id} tabIndex={-1} role="checkbox">
                          <TableCell padding="checkbox">
                            <Checkbox checked={false} onChange={(event) => handleClick(event, title)} />
                          </TableCell>

                          <TableCell component="th" scope="row" padding="none">
                            <Stack direction="row" alignItems="center" spacing={2}>
                              <Avatar alt={title} src={categoryImg} />
                              <Typography variant="subtitle2" noWrap>
                                {title}
                              </Typography>
                            </Stack>
                          </TableCell>

                          <TableCell align="left">{description}</TableCell>

                          <TableCell align="left">url</TableCell>

                          <TableCell align="left">
                            {/* <Label color={(status === 'banned' && 'error') || 'success'}>{sentenceCase(status)}</Label> */}
                            {/* <Rating name="half-rating-read" defaultValue={categoryRating} precision={0.5} readOnly>
                                {categoryRating}
                              </Rating> */}
                            {categoryRating}
                          </TableCell>

                          <TableCell align="right" sx={{ display: 'flex' }}>
                            {/* <IconButton size="large" color="inherit" onClick={handleOpenMenu}>
                              <Iconify icon={'eva:more-vertical-fill'} />
                            </IconButton> */}
                            {/* {icons.map((e, index) => (
                              <Button
                                key={index}
                                onClick={() => {
                                  modalToggle();
                                  setCatData({ ...row, name: e.name });
                                  setNewCategory(false);
                                }}
                              >
                                {e.icon}
                              </Button>
                            ))} */}
                            <Button
                              onClick={() => {
                                handleYes();
                                setCatData({ ...row });
                              }}
                            >
                              <DeleteIcon sx={{ color: 'red' }} />
                            </Button>
                            <Button
                              onClick={() => {
                                modalToggle();
                                setCatData({ ...row });
                                setNewCategory(false);
                                setIsSubmit(!isSubmit);
                                setNewCategory(false);
                              }}
                            >
                              <EditIcon sx={{ color: 'grey' }} />
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                    {emptyRows > 0 && (
                      <TableRow style={{ height: 53 * emptyRows }}>
                        <TableCell colSpan={6} />
                      </TableRow>
                    )}
                  </TableBody>

                  {isNotFound && (
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
                              <strong>&quot;{filterName}&quot;</strong>.
                              <br /> Try checking for typos or using complete words.
                            </Typography>
                          </Paper>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  )}
                </Table>
              </TableContainer>
            </Scrollbar>

            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={USERLIST.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </Card>
        )}
      </Container>
      {isModal && (
        <CategoryModal
          catData={catData}
          isSubmit={isSubmit}
          setIsSubmit={setIsSubmit}
          isModal={isModal}
          modalToggle={modalToggle}
          newCategory={newCategory}
        />
      )}
      <DeleteConfirm
        open={yes}
        handleClose={handleNo}
        title="Category"
        noFunc={() => {
          handleNo();
          console.log('No');
        }}
        yesFunc={() => {
          console.log('Yes Delete');
          deleteCat({ _id: catData._id });
          handleNo();
          setIsSubmit(!isSubmit);
        }}
      />
    </>
  );
}
