import React from "react";
import { Control, Controller, RegisterOptions } from "react-hook-form";

type SelectData = {
    label: string;
    value: string;
};

type Props = {
    name: string;
    label?: string;
    control: Control<any, any>;
    rules?: Omit<RegisterOptions<any, string>, "valueAsNumber" | "valueAsDate" | "setValueAs" | "disabled"> | undefined;
    defaultValue?: string;
    data: SelectData[];
    className?: string;
};

function SelectInput({ name, label, control, rules, defaultValue, data, className }: Props) {
    return (
        <Controller
            control={control}
            name={name}
            rules={rules}
            defaultValue={defaultValue}
            render={({ field: { name, onBlur, onChange, value }, fieldState: { error } }) => (
                <div className={[className, "space-y-2"].join(" ")}>
                    <label htmlFor={name} className="text-gray-500">
                        {label}
                    </label>
                    <div className="relative">
                        <select
                            id={name}
                            name={name}
                            onBlur={onBlur}
                            onChange={onChange}
                            value={value}
                            className={`w-full px-4 py-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm appearance-none ${
                                error ? "border-red-500" : ""
                            }`}
                        >
                            <option value="" disabled>
                                Select
                            </option>
                            {data.map((item) => (
                                <option key={item.value} value={item.value}>
                                    {item.label}
                                </option>
                            ))}
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                            </svg>
                        </div>
                    </div>
                    {error && <p className="mt-2 text-sm text-red-600">{error.message}</p>}
                </div>
            )}
        />
    );
}

export default SelectInput;
