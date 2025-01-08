import React from 'react';
import { Link } from 'react-router-dom';

function NavOut() {
    return (
        <nav className="bg-blue-500 p-4">
            <div className="container mx-auto flex justify-between items-center ">
                {/* Title */}
                <div className="text-white text-2xl font-bold">
                    E-COMERCE
                </div>
                
                {/* Buttons */}
                <div className="space-x-4">
                    <Link 
                        to="/signin" 
                        className="bg-white text-blue-600 font-semibold py-2 px-4 rounded hover:bg-gray-100 transition duration-200"
                    >
                        Sign In
                    </Link>
                    <Link 
                        to="/signup" 
                        className="bg-white text-blue-600 font-semibold py-2 px-4 rounded hover:bg-gray-100 transition duration-200"
                    >
                        Sign Up
                    </Link>
                </div>
            </div>
        </nav>
    );
}

export default NavOut;
