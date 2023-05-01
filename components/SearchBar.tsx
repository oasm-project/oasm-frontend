import React from "react";
import { HiOutlineSearch } from "react-icons/hi";

type SearchBarProps = {
    value: string;
    setValue: React.Dispatch<React.SetStateAction<string>>;
};

const SearchBar = ({ value, setValue }: SearchBarProps) => {
    return (
        <div className="flex items-center justify-between">
            <div className="flex items-center">
                <HiOutlineSearch className="text-gray-500" />
                <input type="text" className="border-b-2 border-gray-500 focus:outline-none ml-2" placeholder="Search for assignments" value={value} onChange={(e) => setValue(e.target.value)} />
            </div>
        </div>
    );
};

export default SearchBar;
