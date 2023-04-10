import { authLogout } from "@/api";
import { getCookie } from "cookies-next";
import { useRouter } from "next/router";
import React from "react";

type Props = {};

function Logout({}: Props) {
    const router = useRouter();
    const [loading, setLoading] = React.useState(true);
    React.useEffect(() => {
        console.log("token", getCookie("refresh_token"));
        async function logout() {
            try {
                setLoading(true);
                await authLogout({
                    refreshToken: getCookie("refresh_token")
                });

                router.push("/");
            } catch (error) {
                console.log(error);
            } finally {
                setLoading(false);
            }
        }

        logout();
    }, [router]);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-700"></div>
            </div>
        );
    }

    return null;
}

export default Logout;
