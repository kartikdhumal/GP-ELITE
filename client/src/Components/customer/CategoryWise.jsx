import axios from 'axios';
import 'react'
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom'
import Navigation from './Navigation';
import MyCurrencyFormatter from '../currency-formatter/currencyFormatter';
import { Rating } from '@mui/material';

function CategoryWise() {
    const { name } = useParams();
    const [products, setProducts] = useState(null);

    useEffect(() => {
        fetchProduct();
    }, []);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);



    const fetchProduct = async () => {
        try {
            const response = await axios.get(`http://localhost:4000/api/getproducts`);
            setProducts(response.data.products.filter((product) => product.category.name === name));
        } catch (error) {
            console.error('Error fetching product:', error);
        }
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
        <div>
            <Navigation />
            <div className="categories p-16 w-full flex flex-col h-[100vh] bg-gray-800">
                <p className='text-gray-200 text-3xl font-bold'> {name} </p>
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
                            <p className='text-center w-full text-3xl text-gray-200'>No Product with this category Found</p>
                        )
                    }
                </div>
            </div>
        </div>
    )
}

export default CategoryWise
