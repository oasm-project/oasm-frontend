import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import type { IconType } from "react-icons/lib";

type Props = {
    Icon: IconType;
    title: string;
    onClick?: () => void;
    url: string;
};

const SidebarIcon = ({ title, Icon, onClick, url }: Props) => {
    const router = useRouter();

    const isActive = React.useMemo(() => {
        return router.pathname === url;
    }, [router.pathname, url]);

    return (
        <Link href={url} onClick={() => onClick?.()} passHref>
            <div
                className={`flex items-center space-x-2 p-4 text-green-700 hover:text-green-500 hover:bg-green-100 transition-colors duration-200 rounded-lg cursor-pointer ${
                    isActive ? "bg-green-100" : ""
                }`}
            >
                <Icon className="h-6 w-6 flex-shrink-0" />
                <p className="hidden sm:inline-flex">{title}</p>
            </div>
        </Link>
    );
};

export default SidebarIcon;
