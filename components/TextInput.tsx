import React, { InputHTMLAttributes } from "react";
import { Control, Controller } from "react-hook-form";

type Props = {
    name: string;
    label?: string;
    placeholder?: string;
    type?: InputHTMLAttributes<HTMLInputElement>["type"];
    control: Control<any, any>;
    rules?: any;
};

const TextInput = ({ name, label, type, placeholder, control, rules }: Props) => {
    return (
        <Controller
            control={control}
            name={name}
            rules={rules}
            render={({ field: { name, onBlur, onChange, value }, fieldState: { error } }) => (
                <div className="space-y-2">
                    {label && (
                        <label htmlFor={name} className="text-gray-500">
                            {label}
                        </label>
                    )}
                    <input
                        id={name}
                        type={type}
                        name={name}
                        onBlur={onBlur}
                        onChange={onChange}
                        placeholder={placeholder}
                        value={value}
                        className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-700 focus:border-transparent"
                    />
                    {error && <p className="text-red-500">{error.message}</p>}
                </div>
            )}
        />
    );
};

export default TextInput;
