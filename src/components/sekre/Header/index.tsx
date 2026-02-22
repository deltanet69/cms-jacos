import Link from "next/link";
import { useRouter } from "next/navigation";
import { account } from "@/lib/appwrite";
import { Menu, Search, Bell, LogOut } from "lucide-react";

interface HeaderProps {
    sidebarOpen: string | boolean | undefined;
    setSidebarOpen: (arg0: boolean) => void;
}

const Header = (props: HeaderProps) => {
    const router = useRouter();

    const handleLogout = async () => {
        try {
            await account.deleteSession("current");
            router.push("/sekre/login");
        } catch (error) {
            console.error("Logout failed", error);
        }
    };

    return (
        <header className="sticky top-0 z-999 flex w-full bg-white drop-shadow-xl/3 dark:bg-boxdark dark:drop-shadow-none">
            <div className="flex flex-grow items-center justify-between px-4 py-7 shadow-2 md:px-6 2xl:px-11">
                <div className="flex items-center gap-2 sm:gap-4 lg:hidden">
                    {/* Hamburger Toggle */}
                    <button
                        aria-controls="sidebar"
                        onClick={(e) => {
                            e.stopPropagation();
                            props.setSidebarOpen(!props.sidebarOpen);
                        }}
                        className="z-99999 block rounded-sm border border-stroke bg-white p-1.5 shadow-sm dark:border-strokedark dark:bg-boxdark lg:hidden"
                    >
                        <Menu size={20} />
                    </button>
                </div>

                <div className="hidden sm:block">
                    <form action="" method="POST">
                        <div className="relative">
                            <button className="absolute left-0 top-1/2 -translate-y-1/2">
                                <Search size={18} className="text-bodydark2" />
                            </button>

                            <input
                                type="text"
                                placeholder="Type to search..."
                                className="w-full bg-transparent pl-9 pr-4 font-medium focus:outline-none xl:w-125"
                            />
                        </div>
                    </form>
                </div>

                <div className="flex items-center gap-3 2xsm:gap-7">
                    <ul className="flex items-center gap-2 2xsm:gap-4">
                        {/* Notification Menu */}
                        <li className="relative">
                            <Link
                                href="#"
                                className="relative flex h-8.5 w-8.5 items-center justify-center rounded-full border-[0.5px] border-stroke bg-gray hover:text-primary dark:border-strokedark dark:bg-meta-4 dark:text-white"
                            >
                                <Bell size={18} />
                                <span className="absolute -top-0.5 right-0 z-1 h-2 w-2 rounded-full bg-meta-1">
                                    <span className="absolute -z-1 inline-flex h-full w-full animate-ping rounded-full bg-meta-1 opacity-75"></span>
                                </span>
                            </Link>
                        </li>
                    </ul>

                    {/* User Area */}
                    <div className="flex items-center gap-4">
                        <div className="hidden text-right lg:block">
                            <span className="block text-sm font-medium text-black dark:text-white"> Admin Jacos </span>
                            <span className="block text-xs"> Administrator </span>
                        </div>

                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-2 rounded-md bg-gray px-3 py-2 text-sm font-medium hover:text-danger dark:bg-meta-4 dark:text-white"
                        >
                            <LogOut size={18} />
                            <span className="hidden sm:inline">Logout</span>
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
