import React, { useEffect, useRef, useState } from "react";
import "./Header.css";
import "./HeaderAdmin.css";
import Logo from "../Logo/Logo";
import Menu from "../Menu/Menu";
import { Link } from "react-router-dom";
import Button from "../Button/Button";
import SearchBox from "../SearchBox/SearchBox";
import axios from "axios";
import UserAccountDropdown from "../UserAccountDropdown/UserAccountDropdown";

const Header = () => {
  const headerRef = useRef();
  const [searchBoxOpen, setSearchBoxOpen] = useState(false);

  const [headerMenuTop, setHeaderMenuTop] = useState([]);
  const [headerMenuBottom, setHeaderMenuBottom] = useState([]);
  const [loadingTopMenu, setLoadingTopMenu] = useState(true);
  const [loadingBottomMenu, setLoadingBottomMenu] = useState(true);
  const [headerTopError, setHeaderTopError] = useState("");
  const [headerBottomError, setHeaderBottomError] = useState("");

  const HeaderTopMenuFallback = [
    { url: "/", title: "The official guide to Copenhagen", active: true },
    { url: "/beyond-copenhagen", title: "Beyond Copenhagen" },
    { url: "/copenhagen-card", title: "Copenhagen Card" },
    { url: "/admin/dashboard", title: "Admin Dashboard" },
  ];

  const HeaderBottomMenuFallback = [
    { url: "/see-and-do", title: "See & do" },
    { url: "/eat-and-drink", title: "Eat & drink" },
    { url: "/city-areas", title: "City areas" },
    { url: "/planning", title: "Planning" },
    { url: "/beyond-copenhagen", title: "Beyond Copenhagen" },
    { url: "/copenpay", title: "CopenPay" },
  ];

  const fetchHeaderMenu = async (menuKey, setMenu, setLoading, setError, fallback) => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/admin/menu?menuKey=${menuKey}`
      );
      const data = response.data?.data?.menuLinks;

      if (data && data.length > 0) {
        setMenu(data);
      } else {
        setMenu(fallback);
        // setError("No data found");
      }
    } catch (error) {
      console.error(`Failed to fetch ${menuKey}:`, error.message);
      setMenu(fallback);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHeaderMenu(
      "Main Navigation Top",
      setHeaderMenuTop,
      setLoadingTopMenu,
      setHeaderTopError,
      HeaderTopMenuFallback
    );
    fetchHeaderMenu(
      "Main Navigation Bottom",
      setHeaderMenuBottom,
      setLoadingBottomMenu,
      setHeaderBottomError,
      HeaderBottomMenuFallback
    );
  }, []);

  // Fixed header on scroll
  useEffect(() => {
    const handleScroll = () => {
      if (!headerRef.current) return;
      if (window.scrollY > 50) {
        headerRef.current.classList.add("fixed");
        headerRef.current.classList.remove("no-fixed");
      } else {
        headerRef.current.classList.remove("fixed");
        headerRef.current.classList.add("no-fixed");
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const closeSearch = (close = false) => {
    if (close) {
      setSearchBoxOpen(false);
      document.body.classList.remove("no-overflow");
    }
  };

  const searchFunction = () => {
    setSearchBoxOpen(true);
    document.body.classList.add("no-overflow");
  };

  const searchIconSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18.508 18.508" width="18"><path d="M12.264 2.111C10.856 0.704 9.164 0 7.188 0 5.21 0 3.518 0.704 2.11 2.111 0.704 3.52 0 5.211 0 7.187c0 1.977 0.704 3.67 2.111 5.077 1.408 1.407 3.1 2.111 5.076 2.111 1.708 0 3.22-0.54 4.538-1.617l5.705 5.75 1.078-1.078-5.75-5.705c1.078-1.318 1.617-2.83 1.617-4.537 0-1.977-0.704-3.67-2.111-5.077ZM3.144 3.145C4.254 2.007 5.6 1.437 7.188 1.437c1.588 0 2.943 0.562 4.066 1.685 1.123 1.123 1.684 2.478 1.684 4.066 0 1.587-0.561 2.942-1.684 4.065-1.123 1.123-2.478 1.684-4.066 1.684-1.587 0-2.942-0.561-4.065-1.684C2 10.13 1.437 8.775 1.437 7.187c0-1.587 0.57-2.934 1.708-4.042Z" fill-rule="evenodd" stroke="none" stroke-width="1"/></svg>`;

  return (
    <>
      {searchBoxOpen && <SearchBox closeFun={closeSearch} />}
      <header ref={headerRef}>
        <div className="container">
          <div className="row">
            <div className="col-sm-2 header-left">
              <Logo />
            </div>
            <div className="col-sm-10 header-right">
              <div className="header-top">
                {loadingTopMenu ? (
                  <p>Loading...</p>
                ) : (
                  <Menu menulinks={headerMenuTop} className="header-top-menu" />
                )}
              </div>
              <div className="header-bottom">
                <div className="row">
                  <div className="col-sm-9">
                    {loadingBottomMenu ? (
                      <p>Loading...</p>
                    ) : (
                      <Menu menulinks={headerMenuBottom} className="header-bottom-menu" />
                    )}
                  </div>
                  <div className="col-sm-3 header-bottom-right">
                    <div className="total-trip">
                      <Link to="/total-trips" title="total-trip-link">
                        <p>
                          My Trip
                          <span>
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" viewBox="0 0 27 24">
                              <path
                                d="M24.173 1.734c-3.048-2.531-7.757-2.111-10.673.822-2.916-2.938-7.625-3.358-10.673-.822-3.967 3.297-3.386 8.672-.559 11.521l9.25 9.307c.528.531 1.234.828 1.983.828.754 0 1.456-.292 1.983-.823l9.25-9.307c2.821-2.849 3.412-7.224-.559-10.526zm-1.245 9.766l-9.249 9.307c-.126.125-.232.125-.358 0l-9.249-9.307c-1.925-1.938-2.315-5.605.385-7.849 2.051-1.704 5.215-1.449 7.198.545l1.846 1.86 1.846-1.86c1.994-2.005 5.158-2.25 7.198-.552 2.695 2.245 2.294 5.933.385 7.855z"
                                fill="white"
                              />
                            </svg>
                          </span>
                        </p>
                      </Link>
                    </div>
                    <UserAccountDropdown />
                    <div className="menu">
                      <Button ctaFunction={searchFunction} className="search-btn" icon={searchIconSvg} />
                    </div>
                  </div>
                </div>
              </div>
              {(headerTopError || headerBottomError) && (
                <p className="menu-error">{headerTopError || headerBottomError}</p>
              )}
            </div>
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;