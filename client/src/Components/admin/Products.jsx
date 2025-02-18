import { useState, useEffect } from 'react';
import axios from 'axios';
import AdminNavbar from './AdminNavbar';
import { TextField, Button, CircularProgress, MenuItem, Select, FormControl, InputLabel, TableFooter, TablePagination, styled } from '@mui/material';
import { useDropzone } from 'react-dropzone';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import MyCurrencyFormatter from '../currency-formatter/currencyFormatter';

function Products() {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        quantity: '',
        cat_id: '',
        productImages: []
    });
    const [uploading, setUploading] = useState(false);
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
        fetchProducts();
        fetchCategories();
    }, []);

    const fetchProducts = async () => {
        try {
            const response = await axios.get('http://localhost:4000/api/getproducts');
            setProducts(response.data.products);
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    };

    const fetchCategories = async () => {
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

    const handleImageUpload = async (files) => {
        setUploading(true);
        const uploadedImages = [];

        for (let file of files) {
            const formData = new FormData();
            formData.append("file", file);
            formData.append('upload_preset', 'ml_default');

            try {
                const res = await axios.post("https://api.cloudinary.com/v1_1/ddhjzsml9/image/upload", formData);
                uploadedImages.push(res.data.secure_url);
            } catch (error) {
                console.error('Error uploading image:', error);
            }
        }

        setFormData(prev => ({ ...prev, productImages: [...prev.productImages, ...uploadedImages] }));
        setUploading(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { name, description, price, quantity, cat_id, productImages } = formData;

        if (!name || !description || !price || !quantity || !cat_id || productImages.length === 0) {
            toast.warning("All fields are required, including at least one image.");
            return;
        }

        try {
            await axios.post('http://localhost:4000/api/addproducts', { name, description, price, quantity, cat_id, productImages });
            toast.success('Product added successfully!');
            setFormData({ name: '', description: '', price: '', quantity: '', cat_id: '', productImages: [] });
            fetchProducts();
        } catch (error) {
            console.error('Error adding product:', error.response?.data?.message);
            toast.error(error.response?.data?.message || 'Failed to add product');
        }
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:4000/api/deleteproduct/${id}`);
            toast.success('Product deleted successfully!');
            fetchProducts();
        } catch (error) {
            console.error('Error deleting product:', error.response?.data?.message);
            toast.error(error?.response?.data?.message);
        }
    };

    const { getRootProps, getInputProps } = useDropzone({ onDrop: handleImageUpload, accept: 'image/*', multiple: true });

    return (
        <div className="bg-gray-800 min-h-screen">
            <AdminNavbar />
            <div className="max-w-4xl mx-auto bg-[#101828] rounded-lg shadow-lg p-5 mt-2">
                <h2 className="text-2xl font-semibold  text-white mx-5">Add Product</h2>
                <form onSubmit={handleSubmit} className="space-y-4 p-3">
                    <TextField label="Name" name="name" style={{ margin: "5px" }} InputLabelProps={{ style: { color: 'white' } }} sx={{
                        '& .MuiOutlinedInput-root': {
                            '& fieldset': { borderColor: 'gray' },
                            '&:hover fieldset': { borderColor: 'lightgray' },
                            '&.Mui-focused fieldset': { borderColor: 'white' },
                        },
                        input: { color: 'white' }
                    }} value={formData.name} onChange={handleChange} required fullWidth />

                    <div {...getRootProps()} className="border-2 border-dashed border-gray-400 p-4 cursor-pointer text-center">
                        <input {...getInputProps()} />
                        {uploading ? <CircularProgress /> : <p className='text-gray-200'>Drag & drop images here, or click to select</p>}
                    </div>

                    <div className="flex flex-wrap">
                        {formData.productImages.map((img, index) => (
                            <img key={index} src={img} alt="product preview" className="w-24 h-24 object-cover rounded-lg" />
                        ))}
                    </div>

                    <TextField label="Description" style={{ margin: "5px" }} InputLabelProps={{ style: { color: 'white' } }} sx={{
                        '& .MuiOutlinedInput-root': {
                            '& fieldset': { borderColor: 'gray' },
                            '&:hover fieldset': { borderColor: 'lightgray' },
                            '&.Mui-focused fieldset': { borderColor: 'white' },
                        },
                        input: { color: 'white' }
                    }} name="description" value={formData.description} onChange={handleChange} required fullWidth />
                    <TextField label="Price" name="price" style={{ margin: "5px" }} InputLabelProps={{ style: { color: 'white' } }} sx={{
                        '& .MuiOutlinedInput-root': {
                            '& fieldset': { borderColor: 'gray' },
                            '&:hover fieldset': { borderColor: 'lightgray' },
                            '&.Mui-focused fieldset': { borderColor: 'white' },
                        },
                        input: { color: 'white' }
                    }} type="number" value={formData.price} onChange={handleChange} required fullWidth />
                    <TextField label="Quantity" name="quantity" style={{ margin: "5px" }} InputLabelProps={{ style: { color: 'white' } }} sx={{
                        '& .MuiOutlinedInput-root': {
                            '& fieldset': { borderColor: 'gray' },
                            '&:hover fieldset': { borderColor: 'lightgray' },
                            '&.Mui-focused fieldset': { borderColor: 'white' },
                        },
                        input: { color: 'white' }
                    }} type="number" value={formData.quantity} onChange={handleChange} required fullWidth />

                    <FormControl fullWidth required sx={{ color: 'white', margin: "5px" }}>
                        <InputLabel sx={{ color: 'white' }}>Category</InputLabel>
                        <Select name="cat_id" sx={{
                            color: 'white',
                            '& .MuiOutlinedInput-notchedOutline': { borderColor: 'gray' },
                            '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'lightgray' },
                            '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: 'white' },
                        }} value={formData.cat_id} onChange={handleChange}>
                            {categories.map((cat) => (
                                <MenuItem key={cat.id} value={cat.id}>
                                    {cat.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <Button variant="contained" color="primary" type="submit" fullWidth>
                        Add Product
                    </Button>
                </form>
            </div>

            <div className="max-w-7xl mx-auto mt-8 p-8 bg-gray-900 rounded-lg shadow-lg">
                <h2 className="text-2xl font-semibold mb-4 text-white">Product List</h2>
                <TableContainer component={Paper} sx={{ bgcolor: '#101828' }}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell sx={{ color: 'white' }}>Image</TableCell>
                                <TableCell sx={{ color: 'white' }}>Name</TableCell>
                                <TableCell sx={{ color: 'white' }}>Description</TableCell>
                                <TableCell sx={{ color: 'white' }}>Price</TableCell>
                                <TableCell sx={{ color: 'white' }}>Quantity</TableCell>
                                <TableCell sx={{ color: 'white' }}>Category</TableCell>
                                <TableCell sx={{ color: 'white' }}>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {products.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={7} align="center" sx={{ color: 'gray' }}>No products available.</TableCell>
                                </TableRow>
                            ) : (
                                (rowsPerPage > 0
                                    ? products.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                    : products
                                ).map((product, index) => (
                                    <StyledTableRow key={index}>
                                        <TableCell>
                                            {product.images.length > 0 &&
                                                product.images.map((img, index) => (
                                                    <img
                                                        key={index}
                                                        src={img.imageUrl}
                                                        alt={product.name}
                                                        width="50"
                                                        height="50"
                                                        style={{ borderRadius: '5px', marginRight: '5px' }}
                                                    />
                                                ))
                                            }

                                        </TableCell>
                                        <TableCell sx={{ color: 'white' }}>{product.name}</TableCell>
                                        <TableCell sx={{ color: 'white' }}>{product.description}</TableCell>
                                        <TableCell sx={{ color: 'white' }}>{MyCurrencyFormatter(product.price)}</TableCell>
                                        <TableCell sx={{ color: 'white' }}>{product.quantity}</TableCell>
                                        <TableCell sx={{ color: 'white' }}>{categories.find(cat => cat.id === product.cat_id)?.name || 'Unknown'}</TableCell>
                                        <TableCell sx={{ width: '17%' }}>
                                            <Button variant="contained" color="primary" sx={{ margin: "5px" }} className='lg-full my-2 cursor-pointer flex justify-center items-center text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 rounded-lg text-md px-4 py-2 font-bold text-center' onClick={() => navigate(`/editproduct/${product.id}`)}>Edit</Button>
                                            <Button variant="contained" color="secondary" className='lg-full my-2 cursor-pointer flex justify-center items-center text-white bg-gradient-to-r from-red-500 via-red-600 to-red-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 rounded-lg text-md px-4 py-2 font-bold text-center' onClick={() => handleDelete(product.id)}>Delete</Button>
                                        </TableCell>
                                    </StyledTableRow>
                                ))
                            )}
                        </TableBody>
                        <TableFooter>

                            <TableRow>
                                <TablePagination
                                    rowsPerPageOptions={[1, 5, 10, { label: "All", value: -1 }]}
                                    colSpan={7}
                                    count={categories.length}
                                    rowsPerPage={rowsPerPage}
                                    sx={{ color: "white" }}
                                    page={page}

                                    SelectProps={{
                                        inputProps: { "aria-label": "rows per page" },
                                        native: true,
                                        sx: {
                                            color: "white",
                                            "& svg": { color: "white" }
                                        },
                                    }}
                                    onPageChange={handleChangePage}
                                    onRowsPerPageChange={handleChangeRowsPerPage}
                                />
                            </TableRow>
                        </TableFooter>
                    </Table>
                </TableContainer>
            </div>
        </div>
    );
}

export default Products;
