import { useState, useEffect } from 'react';
import axios from 'axios';
import AdminNavbar from './AdminNavbar';
import { TextField, Button } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

function EditCategory() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ name: '' });

    useEffect(() => {
        fetchCategoryById();
    }, []);

    const fetchCategoryById = async () => {
        try {
            const response = await axios.get(`http://localhost:4000/api/getcategorybyid/${id}`);
            setFormData({ name: response.data.category.name });
        } catch (error) {
            console.error('Error fetching category:', error);
            toast.error(error.response?.data?.message || 'Failed to fetch category');
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`http://localhost:4000/api/updatecategories/${id}`, formData);
            toast.success('Category updated successfully!');
            navigate('/categories');
        } catch (error) {
            console.error('Error updating category:', error);
            toast.error(error.response?.data?.message || 'Failed to update category');
        }
    };

    return (
        <div className="bg-[#101828] min-h-screen">
            <AdminNavbar />
            <div className="max-w-4xl mx-auto p-6 rounded-lg shadow-lg">
                <h2 className="text-2xl font-semibold mb-4 text-gray-200">Edit Category</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <TextField
                        label="Category Name"
                        style={{ margin: "5px" }}
                        InputLabelProps={{ style: { color: 'white' } }}
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                '& fieldset': { borderColor: 'gray' },
                                '&:hover fieldset': { borderColor: 'lightgray' },
                                '&.Mui-focused fieldset': { borderColor: 'white' },
                            },
                            input: { color: 'white' }
                        }}
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        fullWidth
                    />
                    <Button
                        variant="contained"
                        color="primary"
                        type="submit"
                        fullWidth
                        className="w-[100%] mt-5 sm:w-auto cursor-pointer flex justify-center items-center text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 rounded-lg text-md px-4 py-2 font-bold text-center"
                    >
                        Update Category
                    </Button>
                </form>
            </div>
        </div>
    );
}

export default EditCategory;
