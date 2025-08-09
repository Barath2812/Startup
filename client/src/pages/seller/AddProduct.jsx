import React, { useState } from 'react';
import { assets } from '../../assets/assets';
import { categories } from '../../assets/assets';
import { useAppContext } from '../../hooks/useAppContext';

const AddProduct = () => {


    const [files, setFiles] = useState([]);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('');
    const [price, setPrice] = useState('');
    const [offerprice, setOfferPrice] = useState('');
    const { axios, toast, fetchProducts } = useAppContext();

    const onSubmitHandler = async (event) => {
        event.preventDefault();
        try {
            const productData = {
                name,
                description: description.split('\n'),
                category,
                price: Number(price),
                offerPrice: Number(offerprice),
            };

            const formData = new FormData();
            formData.append('productData', JSON.stringify(productData));
            for (let i = 0; i < files.length; i++) {
                formData.append('images', files[i]);
            }

            const { data } = await axios.post('/api/product/add', formData, {
                withCredentials: true,
            });

            toast.success(data.message);
            setName('');
            setDescription('');
            setCategory('');
            setPrice('');
            setOfferPrice('');
            setFiles([]);
            // Refresh the product list
            fetchProducts();
        } catch (error) {
            toast.error(error.response?.data?.message || error.message);
        }
    };

    return (
        <div className="no-scrollbar flex-1 h-[95vh] overflow-y-scroll flex flex-col justify-between">
            <form onSubmit={onSubmitHandler} className="md:p-10 p-4 space-y-5 max-w-lg">
                <div>
                    <p className="text-base font-medium">Product Image</p>
                    <div className="flex flex-wrap items-center gap-3 mt-2">
                        {Array(4).fill('').map((_, index) => (
                            <label key={index} htmlFor={`image${index}`}>
                                <input
                                    type="file"
                                    id={`image${index}`}
                                    accept="image/*"
                                    hidden
                                    onChange={(e) => {
                                        const updatedFiles = [...files];
                                        updatedFiles[index] = e.target.files[0];
                                        setFiles(updatedFiles);
                                    }}
                                />
                                <img
                                    className="max-w-24 cursor-pointer"
                                    src={
                                        files[index]
                                            ? URL.createObjectURL(files[index])
                                            : assets.uploadarea
                                    }
                                    alt="upload"
                                />
                            </label>
                        ))}
                    </div>
                </div>

                <div className="flex flex-col gap-1 max-w-md">
                    <label className="text-base font-medium" htmlFor="product-name">Product Name</label>
                    <input
                        id="product-name"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Type here"
                        className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40"
                        required
                    />
                </div>

                <div className="flex flex-col gap-1 max-w-md">
                    <label className="text-base font-medium" htmlFor="product-description">Product Description</label>
                    <textarea
                        id="product-description"
                        rows={4}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40 resize-none"
                        placeholder="Type here"
                        required
                    />
                </div>

                <div className="w-full flex flex-col gap-1">
                    <label className="text-base font-medium" htmlFor="category">Category</label>
                    <select
                        id="category"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40"
                        required
                    >
                        <option value="">Select Category</option>
                        {categories.map((item, index) => (
                            <option key={index} value={item.path}>{item.path}</option>
                        ))}
                    </select>
                </div>

                <div className="flex items-center gap-5 flex-wrap">
                    <div className="flex-1 flex flex-col gap-1 w-32">
                        <label className="text-base font-medium" htmlFor="product-price">Product Price</label>
                        <input
                            id="product-price"
                            type="number"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            placeholder="0"
                            className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40"
                            required
                        />
                    </div>
                    <div className="flex-1 flex flex-col gap-1 w-32">
                        <label className="text-base font-medium" htmlFor="offer-price">Offer Price</label>
                        <input
                            id="offer-price"
                            type="number"
                            value={offerprice}
                            onChange={(e) => setOfferPrice(e.target.value)}
                            placeholder="0"
                            className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40"
                            required
                        />
                    </div>
                </div>

                <button
                    type="submit"
                    className="px-8 py-2.5 bg-primary text-white font-medium rounded hover:bg-primary-dull cursor-pointer"
                >
                    ADD
                </button>
            </form>
        </div>
    );
};

export default AddProduct;
