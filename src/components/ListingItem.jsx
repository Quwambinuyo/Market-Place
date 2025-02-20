import React from "react";
import { Link } from "react-router-dom";
import { AiOutlineDelete } from "react-icons/ai";
import { FaEdit } from "react-icons/fa";
import bedIcon from "../assets/svg/bedIcon.svg";
import bathtubIcon from "../assets/svg/bathtubIcon.svg";

function ListingItem({ listing, id, onEdit, onDelete }) {
  console.log(listing);

  return (
    <div>
      <li className="categoryListing">
        <Link
          to={`/category/${listing.type}/${id}`}
          className="categoryListingLink"
        >
          <img
            src={listing.imgUrls[0]}
            alt={listing.name}
            className="categoryListingImg"
          />
          <div className="categoryListingDetails">
            <p className="categoryListingLocation">{listing.location}</p>
            <p className="categoryListingName">{listing.name}</p>
            <p className="categoryListingPrice">
              $
              {String(
                listing.offer ? listing.discountedPrice : listing.regularPrice
              ).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
              {listing.type === "rent" && " / Month"}
            </p>

            <div className="categoryListingInfoDiv">
              <img src={bedIcon} alt="bed" />
              <p className="categoryListingInfoText">
                {listing.bedrooms > 1
                  ? `${listing.bedrooms} Bedrooms`
                  : "1 Bedroom"}
              </p>
              <img src={bathtubIcon} alt="bath" />
              <p className="categoryListingInfoText">
                {listing.bathrooms > 1
                  ? `${listing.bathrooms} Bathrooms`
                  : "1 Bathroom"}
              </p>
            </div>
          </div>
        </Link>

        {onDelete && (
          <button
            className="removeIcon"
            onClick={() => onDelete(listing.id, listing.name)}
          >
            <AiOutlineDelete />
          </button>
        )}

        {onEdit && (
          <button>
            <FaEdit className="editIcon" onClick={() => onEdit(id)} />
          </button>
        )}
      </li>
    </div>
  );
}

export default ListingItem;
