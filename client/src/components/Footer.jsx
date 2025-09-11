import { footerLinks } from "../assets/assets";
import React from "react";
import {assets} from "../assets/assets";
const Footer = () => {

    return (
        <div className="px-6 md:px-16 lg:px-24 xl:px-32 mt-24 bg-primary/10">
            <div className="flex flex-col md:flex-row items-start justify-between gap-10 py-10 border-b border-gray-500/30 text-gray-500">
                <div>
                    <img className="w-34 md:w-32" src= {assets.logo} alt="dummyLogoColored" />
                    <p className="max-w-[410px] mt-6">Root Care is committed to delivering 100% natural and chemical-free skincare and haircare solutions. Our products are handcrafted with Ayurvedic ingredients to nourish, heal, and rejuvenate your beauty—naturally.</p>
                </div>
                <div className="flex flex-wrap justify-between w-full md:w-[45%] gap-5">
                </div>
            </div>
            <p className="py-4 text-center text-sm md:text-base text-gray-500/80">
                Copyright {new Date().getFullYear()} © Root Care All Right Reserved.
            </p>
        </div>
    );
};

export default Footer;
