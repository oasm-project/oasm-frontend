import React from "react";
import { Control, RegisterOptions, Controller, useController } from "react-hook-form";

type Props = {
    name: string;
    label?: string;
    control: Control<any, any>;
    rules?: Omit<RegisterOptions<any, string>, "valueAsNumber" | "valueAsDate" | "setValueAs" | "disabled"> | undefined;
    defaultValue?: string;
    className?: string;
};

const FileInput = ({ control, name, defaultValue, label, rules, className }: Props) => {
    return (
        <Controller
            control={control}
            name={name}
            rules={rules}
            defaultValue={defaultValue}
            render={({ field: { name, onBlur, onChange, value, ref }, fieldState: { error } }) => (
                <div className={["space-y-2", className].join(" ")}>
                    <label htmlFor={name} className="text-gray-500">
                        {label}
                    </label>
                    <div className="relative">
                        <input
                            ref={ref}
                            id={name}
                            name={name}
                            onBlur={onBlur}
                            type="file"
                            // value={value}
                            onChange={(e) => {
                                onChange(e.target.files?.[0] || null);
                            }}
                            className={`w-full px-4 py-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm appearance-none ${
                                error ? "border-red-500" : ""
                            }`}
                        />
                    </div>
                    {error && <p className="mt-2 text-sm text-red-600">{error.message}</p>}
                </div>
            )}
        />
    );
};

export default FileInput;
