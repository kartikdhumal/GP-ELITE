import { useState, useEffect } from 'react';
import axios from 'axios';
import AdminNavbar from './AdminNavbar';
import { TextField, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Table, TableRow, TablePagination, TableFooter, styled, TableCell, TableHead, TableContainer, Paper, TableBody } from '@mui/material';
import { toast } from 'react-toastify';

function Categories() {
    const [categories, setCategories] = useState([]);
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
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
        fetchcategories();
    }, []);

    const fetchcategories = async () => {
        try {
            const response = await axios.get('http://localhost:4000/api/getcategories');
            setCategories(response.data.categories);
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { name } = formData;
        try {
            await axios.post('http://localhost:4000/api/addcategories', {
                name,
            });

            toast.success('Category added successfully!');
            setFormData({ name: '' });
            fetchcategories();
        } catch (error) {
            console.error('Error adding Category:', error?.response);
            toast.error(error.response?.data?.message || 'Failed to add Category');
        }
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:4000/api/deletecategories/${id}`);
            toast.success('Category deleted successfully!');
            fetchcategories();
        } catch (error) {
            console.error('Error deleting Category:', error.response.data.message);
            toast.error(error.response.data.message);
        }
    };

    return (
        <div className="bg-gray-800 min-h-screen">
            <AdminNavbar />
            <div className="max-w-4xl mx-auto bg-[#101828] rounded-lg shadow-lg p-5 mt-2">
                <h2 className="text-2xl font-semibold  text-white mx-5">Add Category</h2>
                <form onSubmit={handleSubmit} className="space-y-4 p-3">
                    <TextField label="Category name" style={{ margin: "5px" }} InputLabelProps={{ style: { color: 'white' } }} sx={{
                        '& .MuiOutlinedInput-root': {
                            '& fieldset': { borderColor: 'gray' },
                            '&:hover fieldset': { borderColor: 'lightgray' },
                            '&.Mui-focused fieldset': { borderColor: 'white' },
                        },
                        input: { color: 'white' }
                    }} name="name" value={formData.name} onChange={handleChange} required fullWidth />
                    <Button variant="contained" color="primary" type="submit" fullWidth className="w-[100%] mt-5 sm:w-auto cursor-pointer flex justify-center items-center text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 rounded-lg text-md px-4 py-2 font-bold text-center">Add Category</Button>
                </form>
            </div>

            <div className="max-w-4xl mx-auto mt-8 p-6 rounded-lg shadow-lg bg-[#101828]">
                <h2 className="text-2xl font-semibold mb-4 text-gray-200">Category List</h2>
                {categories.length === 0 ? (
                    <p className="text-gray-500 text-center">No categories exist.</p>
                ) : (
                    <div className="overflow-x-auto">
                        <TableContainer component={Paper} sx={{ bgcolor: '#101828' }}>
                            <Table aria-label="category table">
                                <TableHead className="text-gray-200">
                                    <TableRow>
                                        <TableCell sx={{ color: 'white' }} className="py-2 px-4 border">ID</TableCell>
                                        <TableCell sx={{ color: 'white' }} className="py-2 px-4 border">Name</TableCell>
                                        <TableCell sx={{ color: 'white' }} className="py-2 px-4 border">Actions</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {(rowsPerPage > 0
                                        ? categories.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                        : categories
                                    ).map((category, index) => (
                                        <StyledTableRow key={index}>
                                            <TableCell sx={{ color: 'white' }} className="py-2 px-4 border">{category.id}</TableCell>
                                            <TableCell sx={{ color: 'white' }} className="py-2 px-4 border">{category.name}</TableCell>
                                            <TableCell sx={{ color: 'white' }} className="py-2 px-4 border">
                                                <Button variant="contained" color="primary" sx={{ margin: "5px" }} className='lg-full my-2 cursor-pointer flex justify-center items-center text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 rounded-lg text-md px-4 py-2 font-bold text-center' onClick={() => navigate(`/editcategory/${category.id}`)}>
                                                    Edit
                                                </Button>
                                                <Button variant="contained" color="secondary" className='lg-full my-2 cursor-pointer flex justify-center items-center text-white bg-gradient-to-r from-red-500 via-red-600 to-red-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 rounded-lg text-md px-4 py-2 font-bold text-center' onClick={() => handleDelete(category.id)}>
                                                    Delete
                                                </Button>
                                            </TableCell>
                                        </StyledTableRow>
                                    ))}
                                </TableBody>
                                <TableFooter>
                                    <TableRow>
                                        <TablePagination
                                            rowsPerPageOptions={[1, 5, 10, { label: "All", value: -1 }]}
                                            colSpan={3}
                                            count={categories.length}
                                            rowsPerPage={rowsPerPage}
                                            page={page}
                                            sx={{
                                                color: "white"
                                            }}
                                            SelectProps={{
                                                inputProps: { "aria-label": "rows per page" },
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

export default Categories;
