import { useState, useEffect } from 'react';
import axios from 'axios';
import AdminNavbar from './AdminNavbar';
import { TextField, Button, Select, MenuItem, Table, FormControl, InputLabel, TableRow, TablePagination, TableFooter, styled, TableCell, TableHead, TableContainer, Paper, TableBody } from '@mui/material';
import { toast } from 'react-toastify';

function Users() {
    const [users, setUsers] = useState([]);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'user',
    });

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);

    const StyledTableRow = styled(TableRow)(({ theme }) => ({
        '&:nth-of-type(odd)': {
            backgroundColor: theme.palette.action.hover,
        },
        '&:last-child TableCell, &:last-child th': {
            border: 0,
        },
    }));

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await axios.get('http://localhost:4000/api/getusers');
            setUsers(response.data.users);
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { name, email, password, role } = formData;
        try {
            await axios.post('http://localhost:4000/api/addusers', {
                name,
                email,
                password,
                role
            });

            toast.success('User added successfully!');
            setFormData({ name: '', email: '', password: '', role: 'user' });
            fetchUsers();
        } catch (error) {
            console.error('Error adding user:', error.response.data.message);
            toast.error(error.response?.data?.message || 'Failed to add user');
        }
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:4000/api/deleteusers/${id}`);
            toast.success('User deleted successfully!');
            fetchUsers();
        } catch (error) {
            console.error('Error deleting user:', error.response.data.message);
            toast.error(error?.response?.data?.message);
        }
    };

    return (
        <div className="bg-gray-800 min-h-screen">
            <AdminNavbar />
            <div className="max-w-4xl mx-auto bg-[#101828] rounded-lg shadow-lg p-5 mt-2">
                <h2 className="text-2xl font-semibold  text-white mx-5">Add User</h2>
                <form onSubmit={handleSubmit} className="space-y-4 p-3">
                    <TextField label="Name" style={{ margin: "5px" }} InputLabelProps={{ style: { color: 'white' } }} sx={{
                        '& .MuiOutlinedInput-root': {
                            '& fieldset': { borderColor: 'gray' },
                            '&:hover fieldset': { borderColor: 'lightgray' },
                            '&.Mui-focused fieldset': { borderColor: 'white' },
                        },
                        input: { color: 'white' }
                    }} name="name" value={formData.name} onChange={handleChange} required fullWidth />
                    <TextField label="Email" style={{ margin: "5px" }} InputLabelProps={{ style: { color: 'white' } }} sx={{
                        '& .MuiOutlinedInput-root': {
                            '& fieldset': { borderColor: 'gray' },
                            '&:hover fieldset': { borderColor: 'lightgray' },
                            '&.Mui-focused fieldset': { borderColor: 'white' },
                        },
                        input: { color: 'white' }
                    }} name="email" value={formData.email} onChange={handleChange} required fullWidth />
                    <TextField label="Password" style={{ margin: "5px" }} InputLabelProps={{ style: { color: 'white' } }} sx={{
                        '& .MuiOutlinedInput-root': {
                            '& fieldset': { borderColor: 'gray' },
                            '&:hover fieldset': { borderColor: 'lightgray' },
                            '&.Mui-focused fieldset': { borderColor: 'white' },
                        },
                        input: { color: 'white' }
                    }} type="password" name="password" value={formData.password} onChange={handleChange} required fullWidth />
                    <FormControl fullWidth required sx={{ color: 'white', margin: "5px" }}>
                        <InputLabel sx={{ color: 'white' }}>Role</InputLabel>
                        <Select
                            name="role"
                            value={formData.role}
                            onChange={handleChange}
                            sx={{
                                color: 'white',
                                '& .MuiOutlinedInput-notchedOutline': { borderColor: 'gray' },
                                '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'lightgray' },
                                '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: 'white' },
                            }}
                        >
                            <MenuItem value="user">User</MenuItem>
                            <MenuItem value="admin">Admin</MenuItem>
                        </Select>
                    </FormControl>

                    <Button variant="contained" color="primary" type="submit" fullWidth className="w-[100%] mt-5 sm:w-auto cursor-pointer flex justify-center items-center text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 rounded-lg text-md px-4 py-2 font-bold text-center">Add User</Button>
                </form>
            </div>

            <div className="max-w-4xl mx-auto mt-8 p-6 bg-[#101828] rounded-lg shadow-lg">
                <h2 className="text-2xl font-semibold mb-4 text-gray-200">User List</h2>
                {users.length === 0 ? (
                    <p className="text-gray-500 text-center">No users exist.</p>
                ) : (
                    <div className="overflow-x-auto">
                        <TableContainer component={Paper} sx={{ bgcolor: '#101828' }}>
                            <Table aria-label="custom pagination table">
                                <TableHead className="text-gray-200">
                                    <TableRow >
                                        <TableCell sx={{ color: 'white' }} className="py-2 px-4 border">ID</TableCell >
                                        <TableCell sx={{ color: 'white' }} className="py-2 px-4 border">Name</TableCell >
                                        <TableCell sx={{ color: 'white' }} className="py-2 px-4 border">Email</TableCell >
                                        <TableCell sx={{ color: 'white' }} className="py-2 px-4 border">Role</TableCell >
                                        <TableCell sx={{ color: 'white' }} className="py-2 px-4 border">Actions</TableCell >
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {(rowsPerPage > 0
                                        ? users.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                        : users
                                    ).map((user, index) => (
                                        <StyledTableRow key={index}>
                                            <TableCell sx={{ color: 'white' }} className="py-2 px-4 border">{user.id}</TableCell>
                                            <TableCell sx={{ color: 'white' }} className="py-2 px-4 border">{user.name}</TableCell>
                                            <TableCell sx={{ color: 'white' }} className="py-2 px-4 border">{user.email} </TableCell>
                                            <TableCell sx={{ color: 'white' }} className="py-2 px-4 border">{user.role}</TableCell>
                                            <TableCell className="py-2 px-4 border">
                                                <Button variant="contained" color="secondary" className='lg-full my-2 cursor-pointer flex justify-center items-center text-white bg-gradient-to-r from-red-500 via-red-600 to-red-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 rounded-lg text-md px-4 py-2 font-bold text-center' onClick={() => handleDelete(user.id)}>Delete</Button>
                                            </TableCell>
                                        </StyledTableRow>
                                    ))}
                                </TableBody>
                                <TableFooter>
                                    <TableRow>
                                        <TablePagination
                                            rowsPerPageOptions={[1, 5, 10, 15, { label: 'All', value: -1 }]}
                                            colSpan={5}
                                            count={users.length}
                                            rowsPerPage={rowsPerPage}
                                            page={page}
                                            sx={{
                                                color: "white"
                                            }}
                                            SelectProps={{
                                                inputProps: { 'aria-label': 'rows per page' },
                                                native: true,
                                            }}
                                            onPageChange={handleChangePage}
                                            onRowsPerPageChange={handleChangeRowsPerPage}
                                        />
                                    </TableRow>
                                </TableFooter>
                            </Table>
                        </TableContainer>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Users;
