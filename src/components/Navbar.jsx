import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import ExploreIcon from "../assets/svg/exploreIcon.svg?react";
import OfferIcon from "../assets/svg/localOfferIcon.svg?react";
import PersonOutLineIcon from "../assets/svg/personOutlineIcon.svg?react";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const pathMatchRoute = (route) => {
    if (route == location.pathname) {
      return true;
    }
  };

  return (
    <footer className="navbar">
      <nav className="navbarNav">
        <ul className="list-none navbarListItems">
          <li className="navbarListItem" onClick={() => navigate("/")}>
            <ExploreIcon
              className="icon-class"
              fill={pathMatchRoute("/") ? "#ba4a00" : "##1b2631"}
            />
            <p
              className={
                pathMatchRoute("/")
                  ? "navbarListItemNameActive"
                  : "navbarListItemName"
              }
            >
              Explore
            </p>
          </li>
          <li className="navbarListItem" onClick={() => navigate("/offers")}>
            <OfferIcon
              className="icon-class"
              fill={pathMatchRoute("/offers") ? "#ba4a00" : "#1b2631"}
            />
            <p
              className={
                pathMatchRoute("/offers")
                  ? "navbarListItemNameActive"
                  : "navbarListItemName"
              }
            >
              Offer
            </p>
          </li>
          <li className="navbarListItem" onClick={() => navigate("/profile")}>
            <PersonOutLineIcon
              className="icon-class"
              fill={pathMatchRoute("/profile") ? "#ba4a00" : "#1b2631"}
            />
            <p
              className={
                pathMatchRoute("/profile")
                  ? "navbarListItemNameActive"
                  : "navbarListItemName"
              }
            >
              Profile
            </p>
          </li>
        </ul>
      </nav>
    </footer>
  );
}

export default Navbar;
