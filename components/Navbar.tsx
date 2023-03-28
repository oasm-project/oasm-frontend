import React from "react";

type Props = {};

function Navbar({}: Props) {
    return (
        <nav className="flex justify-between items-center py-4 px-5 md:px-10 shadow-sm bg-white">
            <h1 className="text-3xl font-bold">OASM</h1>

            <div className="space-x-5">
                <button className="text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800 transition-colors duration-300">
                    Sign in
                </button>
                <button className="border border-green-700 bg-white text-green-700 hover:bg-green-800 hover:text-white focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:text-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800 transition-colors duration-300">
                    Sign up
                </button>
            </div>
        </nav>
    );
}

export default Navbar;
