import React from "react";
import { Ring } from "@uiball/loaders";

type Props = React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement> & {
    outline?: boolean;
    text: string;
    loading?: boolean;
    disabled?: boolean;
};

const Button = ({ outline, text, className, loading, disabled, ...rest }: Props) => {
    return (
        <button {...rest} className={[className, outline ? "btn-outlined" : "btn"].join(" ")} disabled={loading || disabled}>
            <div className="flex w-full justify-center space-x-5">
                <span>{text}</span>
                {loading && <Ring size={20} lineWeight={5} speed={2} color={outline ? "#15803d" : "#fff"} />}
            </div>
        </button>
    );
};

export default Button;
