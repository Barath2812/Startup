import React from 'react';
import { assets } from "../assets/assets";
import { Link } from "react-router-dom";

const MainBanner = () => {
    return (
        <div className='w-full'>
            {/* Banner Image */}
            <div className='relative'>
                {/* Desktop and tablet banner */}
                <img
                    src={assets.banner}
                    alt="banner"
                    className='w-full hidden md:block'
                />

                {/* Mobile banner */}
                <img
                    src={assets.banner}
                    alt="banner"
                    className='w-full block md:hidden'
                />

                {/* Buttons over image for md+ */}
                <div className="hidden md:flex absolute bottom-6 left-12 flex-row items-center gap-6">
                    <Link
                        to="/products"
                        className='group flex items-center gap-2 px-6 py-2.5 bg-primary hover:bg-primary-dull transition rounded text-white text-base'
                    >
                        Shop Now
                        <img
                            className='w-5 h-5 transition-transform group-hover:translate-x-1'
                            src={assets.arrow}
                            alt="arrow"
                        />
                    </Link>

                    <Link
                        to="/products"
                        className='group flex items-center gap-2 px-6 py-2.5 border border-primary text-primary hover:bg-primary hover:text-white transition rounded text-base'
                    >
                        Explore Deals
                        <img
                            className='w-5 h-5 transition-transform group-hover:translate-x-1'
                            src={assets.arrow}
                            alt="arrow"
                        />
                    </Link>
                </div>
            </div>

            {/* Buttons below image for small devices, now side-by-side */}
            <div className="flex flex-row items-center gap-3 px-4 pt-4 md:hidden">
                <Link
                    to="/products"
                    className='group flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary-dull transition rounded text-white text-sm w-1/2 justify-center'
                >
                    Shop Now
                    <img
                        className='w-4 h-4 transition-transform group-hover:translate-x-1'
                        src={assets.arrow}
                        alt="arrow"
                    />
                </Link>

                <Link
                    to="/products"
                    className='group flex items-center gap-2 px-4 py-2 border border-primary text-primary hover:bg-primary hover:text-white transition rounded text-sm w-1/2 justify-center'
                >
                    Explore Deals
                    <img
                        className='w-4 h-4 transition-transform group-hover:translate-x-1'
                        src={assets.arrow}
                        alt="arrow"
                    />
                </Link>
            </div>
        </div>
    );
};

export default MainBanner;
