"use client";
import React, {
    useEffect,
    useRef,
    useState,
    useCallback,
    useContext,
} from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useSidebar } from "../context/SidebarContext";
import { ChevronDownIcon, HorizontaLDots } from "../icons/index";
import { AuthContext } from "@/context/AuthContext";
import axios, { isAxiosError } from "axios";
import { toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faBuildingUser,
    faCalendar,
    faDoorOpen,
    faEnvelope,
    faHouse,
    faIdBadge,
    faNoteSticky,
    faUserCircle,
} from "@fortawesome/free-solid-svg-icons";
import { User } from "../../interfaces/User";

type NavItem = {
    name: string;
    icon: React.ReactNode;
    path?: string;
    subItems?: { name: string; path: string; pro?: boolean; new?: boolean }[];
    onClick?: () => void;
};

const AppSidebar: React.FC = () => {
    const { isExpanded, isMobileOpen, isHovered, setIsHovered } = useSidebar();
    const pathname = usePathname();

    const authContext = useContext(AuthContext);
    const [navItems, setNavItems] = useState<(NavItem | null)[]>([]);
    const router = useRouter();
    const othersItems: NavItem[] = [];
    const [user, setUser] = useState<User | null>(null);
    const renderMenuItems = (
        navItems: (NavItem | null)[],
        menuType: "main" | "others"
    ) => (
        <ul className="flex flex-col gap-6">
            {navItems.map((nav, index) => {
                if (!nav) {
                    return;
                }
                return (
                    <li key={nav.name}>
                        {nav.subItems ? (
                            <button
                                onClick={() =>
                                    handleSubmenuToggle(index, menuType)
                                }
                                className={`menu-item group  ${
                                    openSubmenu?.type === menuType &&
                                    openSubmenu?.index === index
                                        ? "menu-item-active"
                                        : "menu-item-inactive"
                                } cursor-pointer ${
                                    !isExpanded && !isHovered
                                        ? "lg:justify-center"
                                        : "lg:justify-start"
                                }`}
                            >
                                <span
                                    className={` ${
                                        openSubmenu?.type === menuType &&
                                        openSubmenu?.index === index
                                            ? "menu-item-icon-active"
                                            : "menu-item-icon-inactive"
                                    }`}
                                >
                                    {nav.icon}
                                </span>
                                {(isExpanded || isHovered || isMobileOpen) && (
                                    <span className={`menu-item-text`}>
                                        {nav.name}
                                    </span>
                                )}
                                {(isExpanded || isHovered || isMobileOpen) && (
                                    <ChevronDownIcon
                                        className={`ml-auto w-5 h-5 transition-transform duration-200  ${
                                            openSubmenu?.type === menuType &&
                                            openSubmenu?.index === index
                                                ? "rotate-180 text-brand-500"
                                                : ""
                                        }`}
                                    />
                                )}
                            </button>
                        ) : (
                            nav.path && (
                                <Link
                                    onClick={nav.onClick}
                                    href={nav.path}
                                    className={`menu-item group ${
                                        isActive(nav.path)
                                            ? "menu-item-active"
                                            : "menu-item-inactive"
                                    }`}
                                >
                                    <span
                                        className={`${
                                            isActive(nav.path)
                                                ? "menu-item-icon-active"
                                                : "menu-item-icon-inactive"
                                        }`}
                                    >
                                        {nav.icon}
                                    </span>
                                    {(isExpanded ||
                                        isHovered ||
                                        isMobileOpen) && (
                                        <span className={`menu-item-text`}>
                                            {nav.name}
                                        </span>
                                    )}
                                </Link>
                            )
                        )}
                        {nav.subItems &&
                            (isExpanded || isHovered || isMobileOpen) && (
                                <div
                                    ref={(el) => {
                                        subMenuRefs.current[
                                            `${menuType}-${index}`
                                        ] = el;
                                    }}
                                    className="overflow-hidden transition-all duration-300"
                                    style={{
                                        height:
                                            openSubmenu?.type === menuType &&
                                            openSubmenu?.index === index
                                                ? `${
                                                      subMenuHeight[
                                                          `${menuType}-${index}`
                                                      ]
                                                  }px`
                                                : "0px",
                                    }}
                                >
                                    <ul className="mt-2 space-y-1 ml-9">
                                        {nav.subItems.map((subItem) => (
                                            <li key={subItem.name}>
                                                <Link
                                                    href={subItem.path}
                                                    className={`menu-dropdown-item ${
                                                        isActive(subItem.path)
                                                            ? "menu-dropdown-item-active"
                                                            : "menu-dropdown-item-inactive"
                                                    }`}
                                                >
                                                    {subItem.name}
                                                    <span className="flex items-center gap-1 ml-auto">
                                                        {subItem.new && (
                                                            <span
                                                                className={`ml-auto ${
                                                                    isActive(
                                                                        subItem.path
                                                                    )
                                                                        ? "menu-dropdown-badge-active"
                                                                        : "menu-dropdown-badge-inactive"
                                                                } menu-dropdown-badge `}
                                                            >
                                                                new
                                                            </span>
                                                        )}
                                                        {subItem.pro && (
                                                            <span
                                                                className={`ml-auto ${
                                                                    isActive(
                                                                        subItem.path
                                                                    )
                                                                        ? "menu-dropdown-badge-active"
                                                                        : "menu-dropdown-badge-inactive"
                                                                } menu-dropdown-badge `}
                                                            >
                                                                pro
                                                            </span>
                                                        )}
                                                    </span>
                                                </Link>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                    </li>
                );
            })}
        </ul>
    );

    const [openSubmenu, setOpenSubmenu] = useState<{
        type: "main" | "others";
        index: number;
    } | null>(null);
    const [subMenuHeight, setSubMenuHeight] = useState<Record<string, number>>(
        {}
    );
    const subMenuRefs = useRef<Record<string, HTMLDivElement | null>>({});

    const isActive = useCallback(
        (path: string) => path === pathname,
        [pathname]
    );
    const handleSubmenuToggle = (
        index: number,
        menuType: "main" | "others"
    ) => {
        setOpenSubmenu((prevOpenSubmenu) => {
            if (
                prevOpenSubmenu &&
                prevOpenSubmenu.type === menuType &&
                prevOpenSubmenu.index === index
            ) {
                return null;
            }
            return { type: menuType, index };
        });
    };

    useEffect(() => {
        // Check if the current path matches any submenu item
        let submenuMatched = false;
        ["main", "others"].forEach((menuType) => {
            const items = menuType === "main" ? navItems : othersItems;
            items.forEach((nav, index) => {
                if (!nav) {
                    return;
                }

                if (nav.subItems) {
                    nav.subItems.forEach((subItem) => {
                        if (isActive(subItem.path)) {
                            setOpenSubmenu({
                                type: menuType as "main" | "others",
                                index,
                            });
                            submenuMatched = true;
                        }
                    });
                }
            });
        });

        // If no submenu item matches, close the open submenu
        if (!submenuMatched) {
            setOpenSubmenu(null);
        }
    }, [pathname, isActive]);

    useEffect(() => {
        // Set the height of the submenu items when the submenu is opened
        if (openSubmenu !== null) {
            const key = `${openSubmenu.type}-${openSubmenu.index}`;
            if (subMenuRefs.current[key]) {
                setSubMenuHeight((prevHeights) => ({
                    ...prevHeights,
                    [key]: subMenuRefs.current[key]?.scrollHeight || 0,
                }));
            }
        }
    }, [openSubmenu]);

    useEffect(() => {
        async function getNavItems() {
            try {
                const { data: userType } = await axios.get(
                    "/api/users/get-type",
                    {
                        headers: {
                            Authorization: `Bearer ${authContext?.token}`,
                        },
                    }
                );
                setNavItems([
                    {
                        icon: (
                            <FontAwesomeIcon
                                className="text-xl xl:text-2xl"
                                icon={faUserCircle}
                            />
                        ),
                        name: "Hesabım",
                        path: "/hesabim",
                    },
                    {
                        icon: (
                            <FontAwesomeIcon
                                className="text-xl xl:text-2xl"
                                icon={faEnvelope}
                            />
                        ),
                        name: "Mesajlar",
                        subItems: [
                            { name: "Mesajlarım", path: "/mesajlar" },
                            {
                                name: "Yeni Mesaj Gönder",
                                path: "/mesajlar/mesaj-gonder",
                            },
                        ],
                    },
                    {
                        icon: (
                            <FontAwesomeIcon
                                icon={faCalendar}
                                className="text-xl xl:text-2xl"
                            />
                        ),
                        name: "Takvim",
                        path: "/takvim",
                    },

                    {
                        name: "Notlar",
                        icon: (
                            <FontAwesomeIcon
                                icon={faNoteSticky}
                                className="text-xl xl:text-2xl"
                            />
                        ),
                        subItems: [
                            { name: "Notları görüntüle", path: "/notlar" },
                            { name: "Not Ekle", path: "/notlar/not-ekle" },
                        ],
                    },
                    userType === "Admin"
                        ? {
                              name: "Departmanlar",
                              icon: (
                                  <FontAwesomeIcon
                                      icon={faHouse}
                                      className="text-xl xl:text-2xl"
                                  />
                              ),
                              subItems: [
                                  {
                                      name: "Departmanlar",
                                      path: "/departmanlar",
                                  },
                                  {
                                      name: "Yeni Departman Ekle",
                                      path: "/departmanlar/departman-ekle",
                                  },
                              ],
                          }
                        : null,
                    userType === "Admin"
                        ? {
                              name: "Çalışanlar",
                              icon: (
                                  <FontAwesomeIcon
                                      icon={faIdBadge}
                                      className="text-xl xl:text-2xl"
                                  />
                              ),
                              path: "/calisanlar",
                          }
                        : null,
                    {
                        name: "Çıkış Yap",
                        icon: (
                            <FontAwesomeIcon
                                icon={faDoorOpen}
                                className="text-xl xl:text-2xl"
                            />
                        ),
                        path: "/giris-yap",
                        onClick: () => authContext?.setToken(null),
                    },
                ]);
            } catch (error) {
                if (isAxiosError(error)) {
                    toast.error(error.response?.data.message || error.message);
                } else if (error instanceof Error) {
                    toast.error(error.message);
                } else {
                    console.log(error);
                    toast.error("Bir şeyler ters gitti");
                }
            }
        }
        getNavItems();
    }, []);

    useEffect(() => {
        async function getUserData() {
            try {
                const { data } = await axios.get("/api/users", {
                    headers: { Authorization: `Bearer ${authContext?.token}` },
                });
                setUser(data);
            } catch (error) {
                if (isAxiosError(error)) {
                    toast.error(error.response?.data.message || error.message);
                } else if (error instanceof Error) {
                    toast.error(error.message);
                } else {
                    console.log(error);
                    toast.error("Bir şeyler ters gitti");
                }
            }
        }

        if (!user) {
            getUserData();
        }

        const intervalId = setInterval(() => getUserData(), 5000);

        return () => clearInterval(intervalId);
    }, []);

    return (
        <aside
            className={`fixed mt-16 flex flex-col lg:mt-0 top-0 px-5 left-0 bg-white dark:bg-gray-900 dark:border-gray-800 text-gray-900 h-screen transition-all duration-300 ease-in-out z-50 border-r border-gray-200 
        ${
            isExpanded || isMobileOpen
                ? "w-[290px]"
                : isHovered
                ? "w-[290px]"
                : "w-[90px]"
        }
        ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0`}
            onMouseEnter={() => !isExpanded && setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div
                className={`py-8 flex  ${
                    !isExpanded && !isHovered
                        ? "lg:justify-center"
                        : "justify-start"
                }`}
            >
                <Link href="/">
                    {isExpanded || isHovered || isMobileOpen ? (
                        <>
                            <Image
                                className=" bg-gray-700 p-2 rounded-lg"
                                src="/images/logos/kadromap-logo.png"
                                alt="Logo"
                                width={150}
                                height={40}
                            />
                        </>
                    ) : (
                        <Image
                            src="/images/logos/k-logo.png"
                            alt="Logo"
                            width={32}
                            height={32}
                        />
                    )}
                </Link>
            </div>
            <div className="flex flex-col overflow-y-auto duration-300 ease-linear no-scrollbar">
                <nav className="mb-6">
                    {user && isExpanded && (
                        <>
                            <div
                                onClick={() => router.push("/hesabim")}
                                className="flex dark:text-white dark:hover:bg-gray-700 cursor-pointer hover:bg-gray-100 duration-150 gap-4 items-center p-1 border rounded-lg mb-4"
                            >
                                <div>
                                    <FontAwesomeIcon
                                        className="text-xl xl:text-2xl text-gray-500"
                                        icon={faUserCircle}
                                    ></FontAwesomeIcon>
                                </div>
                                <div className="flex flex-col gap-2">
                                    <p>{user?.name + " " + user?.lastName}</p>
                                    <p>{user?.email}</p>
                                </div>
                            </div>
                        </>
                    )}
                    <div className="flex flex-col gap-4">
                        <div>
                            <h2
                                className={`mb-4 text-xs uppercase flex leading-[20px] text-gray-400 ${
                                    !isExpanded && !isHovered
                                        ? "lg:justify-center"
                                        : "justify-start"
                                }`}
                            >
                                {isExpanded || isHovered || isMobileOpen ? (
                                    "Menü"
                                ) : (
                                    <HorizontaLDots />
                                )}
                            </h2>
                            {renderMenuItems(navItems, "main")}
                        </div>
                    </div>
                </nav>
            </div>

            {isExpanded && (
                <div className="flex flex-col gap-4 text-center p-2  mt-auto mb-4">
                    <div
                        onClick={() =>
                            window.open(
                                "https://www.linkedin.com/in/aytun%C3%A7-demir-70339723a/",
                                "_blank"
                            )
                        }
                        className="flex dark:text-white flex-col hover:bg-blue-600 duration-150 cursor-pointer hover:text-white gap-2 border rounded-lg p-2 text-center"
                    >
                        <p>LinkedIn / Aytunç Demir</p>
                    </div>
                    <div
                        onClick={() =>
                            window.open(
                                "https://www.linkedin.com/in/aytun%C3%A7-demir-70339723a/",
                                "_blank"
                            )
                        }
                        className="flex flex-col gap-2 border hover:bg-gray-800 dark:text-white hover:text-white duration-150 cursor-pointer rounded-lg p-2 text-center"
                    >
                        <p>Aytunç Demir/Kadromap</p>
                        <p>@2025</p>
                    </div>
                </div>
            )}
        </aside>
    );
};

export default AppSidebar;
