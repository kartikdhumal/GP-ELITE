import 'react'
import Navigation from './Navigation'
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Footer from './Footer';
import MyCurrencyFormatter from '../currency-formatter/currencyFormatter';
import { Rating } from '@mui/material';

function Home() {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [categoryCards, setCategoryCards] = useState([]);

    useEffect(() => {
        fetchProducts();
        fetchCategories();
    }, []);

    useEffect(() => {
        if (products.length > 0 && categories.length > 0) {
            generateCategoryCards();
        }
    }, [products, categories]);

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

    const generateCategoryCards = () => {
        let filteredCategories = categories.map(category => {
            let categoryProducts = products.filter(product => product.cat_id === category.id);
            if (categoryProducts.length > 0) {
                let firstProduct = categoryProducts[0];
                let firstImage = firstProduct.images?.length > 0 ? firstProduct.images[0] : "https://via.placeholder.com/150";

                return {
                    ...category,
                    productImage: firstImage
                };
            }
            return null;
        }).filter(category => category !== null);

        setCategoryCards(filteredCategories);
    };

    const shortDescription = (description) => {
        let desc;
        if (description.length > 50) {
            desc = description.substring(0, 50) + "...";
            return desc;
        }
        else {
            return description;
        }
    }

    return (
        <div className="main">
            <Navigation />
            <div className="bg-gradient-to-b from-gray-400 to-[#101828] h-[90vh] flex flex-col items-center justify-center text-white">
                <div className="text-center w-full items-center flex justify-evenly lg:flex-row-reverse md:flex-col">
                    <div>
                        <h1 className="text-5xl text-[#101828] sm:text-6xl font-bold tracking-wide">
                            GP Elite
                        </h1>
                        <h2 className="text-2xl text-gray-800 sm:text-3xl font-bold mt-2">
                            Guddu Pandit
                        </h2>
                        <p className="text-lg sm:text-xl text-gray-200 font-semibold mt-4 ">
                            Prime Tshirts for Prime People
                        </p>
                        <button
                            onClick={() => {
                                document.getElementById('hotproducts')?.scrollIntoView({ behavior: 'smooth' });
                            }}
                            className="lg:w-full mt-5 sm:w-auto cursor-pointer flex justify-center items-center text-white bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-400 dark:focus:ring-blue-900 rounded-lg text-md px-4 py-2 font-bold text-center ml-2"
                        >
                            Shop Now
                        </button>
                    </div>
                    <img src={'/vector.png'} className="w-96 h-96"></img>
                </div>
            </div>
            <div className="categories p-16 w-full flex flex-col bg-[#101828]">
                <p className='text-gray-200 text-3xl font-bold'> Categories </p>
                <div className="data flex flex-row flex-wrap">
                    {
                        categoryCards && categoryCards.length > 0 ? (
                            categoryCards.map((data) => (
                                <div key={data.id} className="group my-5 mr-5 flex w-full max-w-xs flex-col overflow-hidden rounded-lg border border-gray-100 bg-gray-400 shadow-md">
                                    <Link className="relative mx-3 mt-3 flex h-60 overflow-hidden rounded-xl" to={`/categorywise/${data.name}`}>
                                        <img className="absolute top-0 right-0 h-full w-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-105" src={data.productImage.imageUrl} alt={data.name} />
                                    </Link>
                                    <div className="mt-4 px-5 pb-5 text-center">
                                        <Link to={`/categorywise/${data.name}`}>
                                            <h5 className="text-xl font-bold tracking-tight text-slate-900" >{data.name}</h5>
                                        </Link>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p>No Categories Found</p>
                        )
                    }
                </div>
            </div>
            <div className="categories p-16 w-full flex flex-col bg-[#101828]" id='hotproducts'>
                <p className='text-gray-200 text-3xl font-bold'> Hot Products </p>
                <div className="data flex flex-row flex-wrap">
                    {

                        products && products.length > 0 ? (
                            products.map((data) => (
                                <div key={data.id} className="group mt-4 mr-5 flex w-full max-w-xs flex-col overflow-hidden rounded-lg border border-gray-100 bg-gray-400 shadow-md">
                                    <Link className="relative mx-3 mt-3 flex h-60 overflow-hidden rounded-xl" to={`/product/${data.id}`}>
                                        <img className="absolute top-0 right-0 h-full w-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-105" src={data.images[0].imageUrl} alt={data.name} />
                                    </Link>
                                    <div className="mt-4 px-5 pb-5 text-left">
                                        <Link to={`/product/${data.id}`}>
                                            <h5 className="text-xl flex items-end h-16 pb-2 font-bold tracking-tight text-slate-900">{shortDescription(data.name)}</h5>
                                            {
                                                data.ratings.length !== 0 && <>
                                                    <div className="ratings flex flex-col justify-center items-start">
                                                        <Rating name="half-rating-read"
                                                            sx={{
                                                                fontSize: "22px",
                                                                padding: "5px 0 5px 0",
                                                                "& .MuiRating-icon": { color: "gold" },
                                                                "& .MuiRating-iconEmpty": { color: "black" }
                                                            }}
                                                            defaultValue={data.ratings.length > 0 ? data.ratings.reduce((sum, rating) => sum + rating.rating, 0) / data.ratings.length : 0} precision={0.1} readOnly />
                                                    </div>
                                                </>
                                            }
                                            <h5 className="text-xl font-bold tracking-tight text-slate-900">{MyCurrencyFormatter(data.price)}</h5>
                                        </Link>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p>No Products Found</p>
                        )
                    }
                </div>
            </div>
            <Footer />
        </div>
    )
}

export default Home
