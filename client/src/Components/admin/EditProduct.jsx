import { useState, useEffect } from 'react';
import axios from 'axios';
import AdminNavbar from './AdminNavbar';
import { TextField, Button, CircularProgress, MenuItem, Select, FormControl, InputLabel } from '@mui/material';
import { useDropzone } from 'react-dropzone';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

function EditProduct() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [categories, setCategories] = useState([]);
    const [uploading, setUploading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        quantity: '',
        cat_id: '',
        productImages: []
    });


    const fetchProductByID = async () => {
        try {
            const response = await axios.get(`http://localhost:4000/api/getproductbyid/${id}`);
            const product = response.data.product[0];
            setFormData({
                name: product.name,
                description: product.description,
                price: product.price,
                quantity: product.quantity,
                cat_id: product.cat_id,
                productImages: product.images || []
            });
        } catch (error) {
            console.error('Error fetching product:', error);
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

    useEffect(() => {
        fetchCategories();
        fetchProductByID();
    }, [id]);

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

        console.log(formData.productImages);
        setFormData(prev => ({ ...prev, productImages: uploadedImages }));
        console.log(formData.productImages);
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
            await axios.put(`http://localhost:4000/api/updateproduct/${id}`, formData);
            toast.success('Product updated successfully!');
            navigate('/products');
        } catch (error) {
            console.error('Error updating product:', error.response);
            toast.error(error.response?.data?.message || 'Failed to update product');
        }
    };

    const { getRootProps, getInputProps } = useDropzone({
        onDrop: handleImageUpload,
        accept: 'image/*',
        multiple: true
    });

    return (
        <div className="bg-[#101828] min-h-screen p-6">
            <AdminNavbar />
            <div className="max-w-4xl mx-auto p-6 bg-gray-800 rounded-lg shadow-lg">
                <h2 className="text-2xl font-semibold mb-4 text-white">Edit Product</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <TextField label="Name" name="name" style={{ margin: "5px" }}
                        InputLabelProps={{ style: { color: 'white' } }}
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                '& fieldset': { borderColor: 'gray' },
                                '&:hover fieldset': { borderColor: 'lightgray' },
                                '&.Mui-focused fieldset': { borderColor: 'white' },
                            },
                            input: { color: 'white' }
                        }}
                        value={formData.name} onChange={handleChange} required fullWidth
                    />

                    <div {...getRootProps()} className="border-2 border-dashed border-gray-400 p-4 cursor-pointer text-center">
                        <input {...getInputProps()} />
                        {uploading ? <CircularProgress /> : <p className='text-gray-200'>Drag & drop images here, or click to select</p>}
                    </div>

                    <div className="flex flex-wrap">
                        {formData.productImages.map((img, index) => (
                            <img key={index} src={img.imageUrl || img} alt="product preview" className="w-24 h-24 object-cover rounded-lg" />
                        ))}
                    </div>

                    <TextField label="Description" name="description" style={{ margin: "5px" }}
                        InputLabelProps={{ style: { color: 'white' } }}
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                '& fieldset': { borderColor: 'gray' },
                                '&:hover fieldset': { borderColor: 'lightgray' },
                                '&.Mui-focused fieldset': { borderColor: 'white' },
                            },
                            input: { color: 'white' }
                        }}
                        value={formData.description} onChange={handleChange} required fullWidth
                    />

                    <TextField label="Price" name="price" style={{ margin: "5px" }}
                        InputLabelProps={{ style: { color: 'white' } }}
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                '& fieldset': { borderColor: 'gray' },
                                '&:hover fieldset': { borderColor: 'lightgray' },
                                '&.Mui-focused fieldset': { borderColor: 'white' },
                            },
                            input: { color: 'white' }
                        }}
                        type="number" value={formData.price} onChange={handleChange} required fullWidth
                    />

                    <TextField label="Quantity" name="quantity" style={{ margin: "5px" }}
                        InputLabelProps={{ style: { color: 'white' } }}
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                '& fieldset': { borderColor: 'gray' },
                                '&:hover fieldset': { borderColor: 'lightgray' },
                                '&.Mui-focused fieldset': { borderColor: 'white' },
                            },
                            input: { color: 'white' }
                        }}
                        type="number" value={formData.quantity} onChange={handleChange} required fullWidth
                    />

                    <FormControl fullWidth required sx={{ color: 'white', margin: "5px" }}>
                        <InputLabel sx={{ color: 'white' }}>Category</InputLabel>
                        <Select name="cat_id" sx={{ color: 'white' }} value={formData.cat_id} onChange={handleChange}>
                            {categories.map((cat) => (
                                <MenuItem key={cat.id} value={cat.id}>
                                    {cat.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <Button variant="contained" color="primary" type="submit" fullWidth>
                        Update Product
                    </Button>
                </form>
            </div>
        </div>
    );
}

export default EditProduct;
