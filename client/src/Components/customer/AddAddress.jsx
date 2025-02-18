import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navigation from './Navigation';
import { toast } from 'react-toastify';

function AddAddress() {
    const [address, setAddress] = useState({
        houseNo: '',
        street1: '',
        street2: '',
        city: '',
        state: '',
        pincode: ''
    });
    const navigate = useNavigate();

    const handleChange = (e) => {
        setAddress({ ...address, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const { city, state, pincode } = address;

        if (!city.trim() || !isNaN(city)) {
            toast.warning("Please enter a valid City name.");
            return;
        }

        if (!state.trim() || !isNaN(state)) {
            toast.warning("Please enter a valid State name.");
            return;
        }

        if (!/^\d{6}$/.test(pincode)) {
            toast.warning("Please enter a valid 6-digit Pincode.");
            return;
        }

        toast.success('Address added successfully!');
        navigate('/placeorder', { state: { address } });
    };

    return (
        <div className='bg-gray-800 lg:h-[100vw] md:h-[100vw]'>
            <Navigation />
            <div className='flex justify-center items-center flex-col w-full px-8 py-12'>
                <h2 className='text-3xl text-gray-200 font-bold mb-6 text-center'>Add Address</h2>
                <form onSubmit={handleSubmit} className='bg-gray-700 p-6 rounded-lg shadow-md'>
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                        <input type='text' name='houseNo' placeholder='House No.' value={address.houseNo}
                            onChange={handleChange} className='p-3 rounded-md bg-gray-900 text-gray-200 w-full border border-gray-600 focus:ring-2 focus:ring-blue-500' required />
                        <input type='tel' name='street1' placeholder='Street 1' value={address.street1}
                            onChange={handleChange} className='p-3 rounded-md bg-gray-900 text-gray-200 w-full border border-gray-600 focus:ring-2 focus:ring-blue-500' required />
                    </div>
                    <input type='text' name='street2' placeholder='Street 2' value={address.street2}
                        onChange={handleChange} className='p-3 mt-4 rounded-md bg-gray-900 text-gray-200 w-full border border-gray-600 focus:ring-2 focus:ring-blue-500' required />
                    <div className='grid grid-cols-1 md:grid-cols-3 gap-4 mt-4'>
                        <input type='text' name='city' placeholder='City' value={address.city}
                            onChange={handleChange} className='p-3 rounded-md bg-gray-900 text-gray-200 w-full border border-gray-600 focus:ring-2 focus:ring-blue-500' required />
                        <input type='text' name='state' placeholder='State' value={address.state}
                            onChange={handleChange} className='p-3 rounded-md bg-gray-900 text-gray-200 w-full border border-gray-600 focus:ring-2 focus:ring-blue-500' required />
                        <input type='text' name='pincode' placeholder='Pin Code' value={address.pincode}
                            onChange={handleChange} className='p-3 rounded-md bg-gray-900 text-gray-200 w-full border border-gray-600 focus:ring-2 focus:ring-blue-500' required />
                    </div>
                    <button type='submit' className='w-full mt-6 bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br text-white font-bold py-3 rounded-lg focus:ring-4 focus:ring-blue-300'>
                        Save Address
                    </button>
                </form>
            </div>
        </div>
    );
}

export default AddAddress;