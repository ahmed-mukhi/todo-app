import React, { useEffect, useState } from 'react';
import '../App.css';
import { DelTodos, getTodos } from '../controllers/todosControllers';
import {
    Snackbar,
    IconButton,
    LinearProgress,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    TableSortLabel,
    TablePagination
}
    from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import { blue, grey, green } from "@mui/material/colors";
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import EditForm from './editForm';
import { useContext } from 'react';
import { FormContext } from '../App';
const ListFormat = () => {
    const { method, setMethod, open, setOpen, setActive, setId, active, user, status, setChange, change, data, setData } = useContext(FormContext);
    const [row, setRow] = useState({});
    const [sortBy, setSortBy] = useState('title');
    const [sortOrder, setSortOrder] = useState('asc');
    const [backup, setBackup] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);

    const handleSort = (property) => {
        const isAscending = sortBy === property && sortOrder === 'asc';
        const newSortOrder = isAscending ? 'desc' : 'asc';
        setSortBy(property);
        setSortOrder(newSortOrder);
    };

    const sortedTodos = () => {
        const sortedArray = [...data];
        sortedArray.sort((a, b) => {
            const aValue = a[sortBy].toLowerCase();
            const bValue = b[sortBy].toLowerCase();
            if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
            if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
            return 0;
        });
        setData(sortedArray);
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    useEffect(() => {
        sortedTodos();
    }, [sortBy, sortOrder]);

    const handleClose = (ev, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpen(false);
    };

    useEffect(() => {
        if (data) {
            setBackup(data);
        }
    }, [data]);

    const statusColors = {
        Initial: grey[300],
        Progress: blue[300],
        Completed: green[300],
    };

    const paginate = () => {
        const startIndex = page * rowsPerPage;
        const endIndex = startIndex + rowsPerPage;
        return backup.slice(startIndex, endIndex);
    }

    const setColor = (status) => {
        return statusColors[status] || grey[300];
    };


    const fetchData = async (action) => {
        const resp = await getTodos(user._id);
        setData(resp.todos);
        setChange(false);
    };

    const handleForm = (item) => {
        setId(item._id);
        setRow(item);
        setMethod("edit");
        setActive(true);
    }

    useEffect(() => {
        if (!active) {
            setRow({});
        }
    }, [active]);

    const handleDel = async (id) => {
        const resp = await DelTodos(id, user._id);
        if (resp) {
            setChange(true);
            setOpen(true);
        }
    }

    useEffect(() => {
        setData([]);
        if (user || change) {
            setRow({});
            fetchData();
        }
    }, [change]);


    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };


    const action = (
        <React.Fragment>
            <IconButton
                size="small"
                aria-label="close"
                color="inherit"
                onClick={handleClose}
            >
                <CloseIcon fontSize="small" />
            </IconButton>
        </React.Fragment>
    );

    return (
        <div>
            <EditForm initialData={row} action={method} />
            <Snackbar
                open={open}
                autoHideDuration={6000}
                onClose={handleClose}
                message="Task Deleted"
                action={action}
            />

            {data !== [] ?
                (<TableContainer component={Paper}>
                    <Table sx={{ '& .MuiTableCell-root': { padding: '8px' } }}>
                        <TableHead>
                            <TableRow>
                                <TableCell>
                                    <TableSortLabel
                                        active={sortBy === 'title'}
                                        direction={sortOrder}
                                        onClick={() => handleSort('title')}
                                    >
                                        Title
                                    </TableSortLabel>
                                </TableCell>
                                <TableCell >
                                    <TableSortLabel
                                        active={sortBy === 'desc'}
                                        direction={sortOrder}
                                        onClick={() => handleSort('desc')}
                                    >
                                        Description
                                    </TableSortLabel>
                                </TableCell>
                                <TableCell >Status</TableCell>
                                <TableCell >
                                    <TableSortLabel
                                        active={sortBy === 'assignedDate'}
                                        direction={sortOrder}
                                        onClick={() => handleSort('assignedDate')}
                                    >
                                        Assigned
                                    </TableSortLabel>
                                </TableCell>
                                <TableCell >
                                    <TableSortLabel
                                        active={sortBy === 'dueDate'}
                                        direction={sortOrder}
                                        onClick={() => handleSort('dueDate')}
                                    >
                                        Due
                                    </TableSortLabel>
                                </TableCell>
                                <TableCell >Tags</TableCell>
                                <TableCell >Edit</TableCell>
                                <TableCell >Del</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {!change && backup ? data
                                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                .map(item => {
                                    return (
                                        <TableRow
                                            // hover
                                            key={item._id}
                                            sx={{ border: 0, backgroundColor: setColor(item.status) }}
                                        >
                                            <TableCell>{item.title}</TableCell>
                                            <TableCell>{item.desc}</TableCell>
                                            <TableCell>{item.status}</TableCell>
                                            <TableCell>{new Date(item.assignedDate).toDateString()}</TableCell>
                                            <TableCell>{new Date(item.dueDate).toDateString()}</TableCell>
                                            <TableCell>
                                                {item.tags.map((tag, index) => {
                                                    return (
                                                        <React.Fragment key={index}>
                                                            {tag}
                                                            {index !== item.tags.length - 1 && " , "}
                                                        </React.Fragment>
                                                    );
                                                })}
                                            </TableCell>
                                            <TableCell>
                                                <IconButton onClick={e => {
                                                    handleForm(item);
                                                }}>
                                                    <EditIcon sx={{ ":hover": { color: "green" } }} />
                                                </IconButton>
                                            </TableCell>
                                            <TableCell>
                                                <IconButton onClick={(e) => handleDel(item._id)}>
                                                    <DeleteIcon sx={{ ":hover": { color: "red" } }} />
                                                </IconButton>
                                            </TableCell>
                                        </TableRow>
                                    )
                                }) : (
                                <TableRow>
                                    <TableCell colSpan={8}>
                                        <LinearProgress />
                                    </TableCell>
                                </TableRow>
                            )
                            }
                        </TableBody>
                    </Table>
                    <TablePagination
                        rowsPerPageOptions={[5, 10, 25]}
                        component="div"
                        count={data.length || 0}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                    />
                </TableContainer>
                )
                : (<LinearProgress />)
            }
        </div>
    )
};

export default ListFormat;