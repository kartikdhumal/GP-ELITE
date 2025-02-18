import { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import Navigation from './Navigation';
import { jwtDecode } from 'jwt-decode'
import { CartContext } from '../context/CartContext';
import { toast } from 'react-toastify';
import MyCurrencyFormatter from '../currency-formatter/currencyFormatter';
import { Button, Rating, TextField } from '@mui/material';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';

function Product() {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [selectedImage, setSelectedImage] = useState('');
    const [quantity, setQuantity] = useState(1);
    const { cartItemsLength, updateCartCount } = useContext(CartContext);
    const [rating, setRating] = useState(0);
    const [allrating, setAllratings] = useState([]);
    const [userDetails, setUserDetails] = useState([]);
    const [currentUser, setCurrentUser] = useState(false);
    const [avgStar, setAvgStar] = useState(0);
    const [totalRating, setTotalRatings] = useState(0);
    const [currentTime, setCurrentTime] = useState(new Date());
    const [hasBought, setHasBought] = useState(false);

    const navigate = useNavigate();

    const [feedback, setFeedback] = useState("");

    const fetchUserDetails = async () => {
        try {
            let token = localStorage.getItem("token");
            let decoded = await jwtDecode(token);
            const expiryTime = decoded.exp;
            const currentTime = Math.floor(Date.now() / 1000);
            let isTokenValid = currentTime < expiryTime;
            if (isTokenValid) {
                await setUserDetails(decoded);
                await setCurrentUser(true);
            }
            else {
                toast.error("Session expired");
            }
        } catch (error) {
            console.error('Error fetching user details:', error);
            return null;
        }
    };

    const fetchOrders = async () => {
        try {
            let token = localStorage.getItem("token");
            let userId = null;
            let decoded = await jwtDecode(token);
            const expiryTime = decoded.exp;
            const currentTime = Math.floor(Date.now() / 1000);
            let isTokenValid = currentTime < expiryTime;
            if (isTokenValid) {
                userId = decoded.id;
                const response = await axios.get('http://localhost:4000/api/getorders', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                const bought = await response.data.orders.some((order) => order.userId === userId && order.orderItems.some((item) => item.productId == id));
                setHasBought(bought);
            }

        } catch (error) {
            console.error('Error fetching orders:', error);
        }
    };


    const fetchRatings = async () => {
        try {
            const response = await axios.get(`http://localhost:4000/api/fetchratingbyproduct/${id}`);
            if (response.status === 200) {
                setAvgStar(parseFloat(response.data.avgRating));
                setTotalRatings(response.data.ratings.length);
                setAllratings(response.data.ratings);
            }
        } catch (error) {
            console.error("Error fetching ratings:", error);
        }
    };

    const submitRating = async () => {
        if (rating < 1) {
            toast.warning("Please select rating");
            return;
        }

        if (feedback.length < 2) {
            toast.warning("Feedback must be at least 2 characters.");
            return;
        }

        if (/^\d+$/.test(feedback)) {
            toast.warning("Feedback cannot contain only digits.");
            return;
        }

        if (!hasBought) {
            toast.warning("You can't add review. You have not ordered this product");
            setRating(0);
            setFeedback("");
            return;
        }

        let token = localStorage.getItem("token");
        let isTokenValid = false;
        let userId = null;

        if (token) {
            try {
                const decoded = jwtDecode(token);
                const expiryTime = decoded.exp;
                userId = decoded.id;
                const currentTime = Math.floor(Date.now() / 1000);
                isTokenValid = currentTime < expiryTime;

                if (isTokenValid) {
                    try {
                        const response = await axios.post('http://localhost:4000/api/addratings', {
                            user_id: userId,
                            pro_id: id,
                            rating: rating,
                            feedback: feedback
                        }, {
                            headers: { Authorization: `Bearer ${token}` }
                        });

                        if (response.status === 201) {
                            fetchRatings();
                            toast.success("Rating added");
                            setRating(0);
                            setFeedback("");
                        }
                    } catch (error) {
                        console.error("Failed to submit feedback. Please try again.");
                        toast.error(error.response.data.message);
                        setRating(0);
                        setFeedback("");
                    }
                } else {
                    toast.warning("Your token has expired. Please login again");
                    localStorage.removeItem("token");
                    navigate('/');
                }
            } catch (error) {
                console.error("Error fetching user details:", error);
                toast.error("Something went wrong while fetching user details.");
            }
        } else {
            toast.warning("Please login to submit a rating.");
            setRating(0);
            setFeedback("");
        }
    };

    useEffect(() => {
        window.scrollTo(0, 0);
        fetchRatings();
        fetchOrders();
        fetchUserDetails();
    }, []);


    const fetchProduct = async () => {
        try {
            const response = await axios.get(`http://localhost:4000/api/getproductbyid/${id}`);
            setProduct(response.data.product);
            if (response.data.product.images.length > 0) {
                setSelectedImage(response.data.product.images[0].imageUrl);
            }
        } catch (error) {
            console.error('Error fetching product:', error);
        }
    };

    const handleAddToCart = async () => {
        const token = localStorage.getItem("token");

        const cartItem = {
            "pro_id": id,
            "name": product.name,
            "imageUrl": product.images[0].imageUrl,
            "price": product.price,
            "quantity": quantity
        };

        if (!token) {
            let sessionCart = JSON.parse(sessionStorage.getItem('sessionCart')) || [];
            const existingItemIndex = sessionCart.findIndex(item => item.pro_id === id);

            if (existingItemIndex !== -1) {
                let existingItem = sessionCart[existingItemIndex];

                if (existingItem.quantity >= product.quantity) {
                    toast.warning("You can't select more quantity than the available stock");
                } else {
                    toast.warning("Product is already in the cart");
                }
            } else {
                sessionCart.push(cartItem);
                sessionStorage.setItem('sessionCart', JSON.stringify(sessionCart));
                updateCartCount(cartItemsLength + 1);
                toast.success('Item added to cart');
            }
        }

        const decoded = jwtDecode(token);
        const expiryTime = decoded.exp;
        const currentTime = Math.floor(Date.now() / 1000);
        let isTokenValid = currentTime < expiryTime;

        if (!isTokenValid) {
            let sessionCart = JSON.parse(sessionStorage.getItem('sessionCart')) || [];
            const existingItemIndex = sessionCart.findIndex(item => item.pro_id === id);

            if (existingItemIndex !== -1) {
                let existingItem = sessionCart[existingItemIndex];

                if (existingItem.quantity >= product.quantity) {
                    toast.warning("You can't select more quantity than the available stock");
                } else {
                    toast.warning("Product is already in the cart");
                }
            } else {
                sessionCart.push(cartItem);
                sessionStorage.setItem('sessionCart', JSON.stringify(sessionCart));
                updateCartCount(cartItemsLength + 1);
                toast.success('Item added to cart');
            }
        } else {
            try {
                let decoded = jwtDecode(token);
                const response = await axios.post("http://localhost:4000/api/addtocart", {
                    user_id: decoded.id,
                    pro_id: id,
                    quantity: quantity
                }, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                if (response.status === 201) {
                    updateCartCount(cartItemsLength + 1);
                    toast.success('Item added to cart');
                } else {
                    toast.error('Failed to add item to cart');
                }
            } catch (err) {
                console.error('Error adding item to cart:', err.response);
                if (err.response?.status === 403) {
                    toast.error(err.response.data.message);
                    localStorage.removeItem("token");
                    navigate("/login");
                } else if (err.response?.status === 400 && err.response.data.message === "This product is already in your cart") {
                    toast.error(err.response.data.message);
                } else {
                    toast.error(err.response?.data?.message || 'An error occurred');
                }
            }
        }
    };


    const handleIncrease = () => {
        fetchUserDetails();
        if (quantity < product.quantity) {
            setQuantity(quantity + 1);
        }
        else {
            toast.warning("You can't select more quantity than actual quantity");
        }
    };

    const handleDecrease = () => {
        fetchUserDetails();
        if (quantity > 1) {
            setQuantity(quantity - 1);
        }
    };



    const deleteRating = async (user_id, pro_id) => {
        try {
            let token = localStorage.getItem("token");
            await axios.delete(`http://localhost:4000/api/deleterating/${user_id}/${pro_id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            toast.success('Rating deleted successfully!');
            await fetchRatings();

        } catch (error) {
            console.error('Error deleting rating:', error.response.data.message);
            toast.error(error?.response?.data?.message);
        }
    }

    function timeAgo(dateString) {
        const date = new Date(dateString);
        const now = new Date();
        const seconds = Math.floor((now - date) / 1000);

        if (seconds === 0) return `Just now`;
        if (seconds < 60) return `${seconds} seconds ago`;
        const minutes = Math.floor(seconds / 60);
        if (minutes < 60) return `${minutes} minutes ago`;
        const hours = Math.floor(minutes / 60);
        if (hours < 24) return `${hours} hours ago`;
        const days = Math.floor(hours / 24);
        if (days < 7) return `${days} days ago`;
        const weeks = Math.floor(days / 7);
        if (weeks < 4) return `${weeks} weeks ago`;
        const months = Math.floor(days / 30);
        if (months < 12) return `${months} months ago`;
        const years = Math.floor(days / 365);
        return `${years} years ago`;
    }


    useEffect(() => {
        fetchProduct();
        fetchUserDetails();
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentTime(new Date());
        }, 60000);

        return () => clearInterval(interval);
    }, []);


    if (!product) {
        return <div className="text-center text-xl mt-10">Loading...</div>;
    }

    return (
        <div className='bg-gray-800 md:h-auto md:block w-full'>
            <Navigation />
            <div className="w-full mx-auto px-8 py-16 flex flex-col justify-between items-center md:flex-row">
                <div className="w-full flex flex-col-reverse justify-center items-center md:w-auto">
                    <div className="flex flex-row gap-2 m-4">
                        {product.images.map((img, index) => (
                            <img
                                key={index}
                                src={img.imageUrl}
                                alt={img.imageUrl}
                                className={`w-24 object-cover cursor-pointer rounded-md border-2 ${selectedImage === img.imageUrl ? 'border-blue-500' : 'border-gray-300'}`}
                                onClick={() => setSelectedImage(img.imageUrl)}
                            />
                        ))}
                    </div>
                    <img src={selectedImage} alt="Product" className="w-96 object-cover rounded-lg shadow-md" />
                </div>

                <div className="w-full md:w-auto lg:flex p-5 flex-col justify-center md:block">
                    <div className="details">
                        <h2 className="text-3xl text-gray-200 font-bold mb-2 uppercase">{product.name}</h2>
                        <p className="text-gray-200 my-2"><span className="font-bold uppercase">{product.category?.name}</span></p>
                        <p className="text-xl font-semibold text-gray-300 mb-4">{MyCurrencyFormatter(product.price)}</p>
                        <p className="text-gray-200 mb-6">{product.description}</p>
                        <div className="ratings flex flex-col justify-center items-start">
                            <Rating name="half-rating-read"
                                sx={{
                                    fontSize: "22px",
                                    padding: "5px 0 5px 0",
                                    "& .MuiRating-icon": { color: "yellow" },
                                    "& .MuiRating-iconEmpty": { color: "white" }
                                }}
                                defaultValue={avgStar} precision={0.1} readOnly />
                            <span className='text-gray-200 pl-1'>({totalRating}) Ratings </span>
                        </div>
                    </div>
                </div>

                <div className="p-4 rounded-lg h-40  border-gray-100 bg-gray-700 shadow-md w-72">
                    <h3 className="text-lg text-center font-bold text-gray-200 mb-3">Add to Cart</h3>
                    <div className="flex items-center justify-center gap-4 mb-4">
                        <button
                            onClick={handleDecrease}
                            className="bg-black text-white px-3 py-1 rounded-md hover:bg-gray-800">
                            -
                        </button>
                        <span className="text-lg text-gray-200 font-bold">{quantity}</span>
                        <button
                            onClick={handleIncrease}
                            className="bg-black text-white px-3 py-1 rounded-md hover:bg-gray-800">
                            +
                        </button>
                    </div>
                    <button
                        onClick={handleAddToCart}
                        className="w-full cursor-pointer flex justify-center items-center text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 rounded-lg text-md px-4 py-2 font-bold text-center">
                        Add to Cart
                    </button>
                </div>
            </div>

            <div className="allratings flex flex-col justify-center items-center">
                <div className="rating lg:w-1/2 md:w-auto bg-gray-900 p-5 rounded-lg shadow-lg">
                    <p className="text-gray-200 text-2xl text-center font-bold">Rating</p>
                    <Rating
                        name="simple-controlled"
                        value={rating}
                        onChange={(event, newValue) => {
                            setRating(newValue);
                        }}
                        sx={{
                            fontSize: "32px",
                            padding: "10px 0 10px 0",
                            "& .MuiRating-icon": { color: "yellow" },
                            "& .MuiRating-iconEmpty": { color: "white" }
                        }}
                    />
                    <TextField
                        placeholder="Write your feedback"
                        variant="outlined"
                        value={feedback}
                        onChange={(e) => setFeedback(e.target.value)}
                        multiline
                        rows={3}
                        fullWidth
                        inputProps={{ maxLength: 500, style: { resize: "none" } }}
                        sx={{
                            marginBottom: 2, cursor: "pointer", backgroundColor: "#ffffff", borderRadius: 1,
                            color: 'white',
                            '& .MuiOutlinedInput-notchedOutline': { borderColor: 'gray' },
                            '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'lightgray' },
                            '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: 'white' },
                        }}
                        required
                    />

                    <Button
                        variant="contained"
                        color="primary"
                        onClick={submitRating}
                        className='lg:w-full mt-4 cursor-pointer flex justify-center items-center text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 rounded-lg text-md px-4 py-2 font-bold text-center'
                    >
                        Submit Feedback
                    </Button>
                </div>
                <div className="allrating flex flex-col justify-center w-full mt-8 items-center">
                    {allrating && allrating.map((ratingData) => (
                        <div key={ratingData.id} className="rating-item w-1/2 p-4 mb-4 bg-gray-900 rounded-lg shadow-lg">
                            <div className="rating-header flex justify-between">
                                <div className="name">
                                    <p className="text-white font-semibold">{ratingData.user.name}</p>
                                    <p className="text-gray-400 text-sm">{timeAgo(ratingData.created_at, currentTime)}</p>
                                </div>

                                {
                                    currentUser && userDetails.id === ratingData.user.id && <DeleteOutlineIcon
                                        sx={{
                                            color: "red",
                                            cursor: "pointer"
                                        }}
                                        onClick={() => deleteRating(userDetails.id, id)}
                                    />
                                }
                            </div>
                            <div className="rating-stars flex items-end mt-1">
                                <Rating
                                    name="read-only"
                                    value={ratingData.rating}
                                    readOnly
                                    sx={{ fontSize: '20px', "& .MuiRating-icon": { color: "yellow" } }}
                                />
                            </div>
                            <div className="flex justify-start items-start mt-1">
                                <p className="text-white">{ratingData.feedback}</p>
                            </div>
                        </div>
                    ))}
                </div>

            </div>
        </div>
    );
}

export default Product;
