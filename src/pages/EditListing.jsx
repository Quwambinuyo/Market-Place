import React, { useState, useEffect, useRef } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import {
  GoogleMap,
  useJsApiLoader,
  Autocomplete,
} from "@react-google-maps/api";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { useNavigate, useParams } from "react-router-dom";
import Spinner from "../components/Spinner";
import { toast } from "react-toastify";
import { v4 as uuidv4 } from "uuid";
import {
  doc,
  updateDoc,
  getDoc,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore";
import { formatImages, libraries } from "../common.js";
import { db } from "../firebase.config";

function EditListing() {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_MAP_API_KEY,
    libraries,
  });
  const [geolocationEnabled, setGeoLocationEnabled] = useState(true);
  const [isAddressValid, setIsAddressValid] = useState(false);
  const [loading, setLoading] = useState(false);
  const [listing, setListing] = useState(false);
  const [formData, setFormData] = useState({
    type: "rent",
    name: "",
    bedrooms: 1,
    bathrooms: 1,
    parking: false,
    furnished: false,
    address: "",
    addressCopy: "",
    offer: false,
    regularPrice: 0,
    discountedPrice: 0,
    images: {},
    latitude: 0,
    longitude: 0,
  });

  const {
    type,
    name,
    bedrooms,
    bathrooms,
    parking,
    furnished,
    address,
    offer,
    addressCopy,
    regularPrice,
    discountedPrice,
    images,
    latitude,
    longitude,
  } = formData;

  const addressRef = useRef();

  const auth = getAuth();
  const navigate = useNavigate();
  const params = useParams();
  const isMounted = useRef(true);

  // Redirect if listing is not users
  useEffect(() => {
    if (listing && listing.userRef !== auth.currentUser.uid) {
      toast.error("You can not edit that listing");
      navigate("/");
    }
  });

  // Fetch listing to edit
  useEffect(() => {
    setLoading(true);
    const fetchListing = async () => {
      const docRef = doc(db, "listings", params.listingId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setListing(docSnap.data());
        setFormData({
          ...docSnap.data(),
          address: docSnap.data().location,
        });
        setLoading(false);
      } else {
        navigate("/");
        toast.error("Listing does not exist");
      }
    };

    fetchListing();
  }, [params.listingId, navigate]);

  // Set userRef to logged in user
  useEffect(() => {
    if (isMounted.current) {
      onAuthStateChanged(auth, (user) => {
        if (user) {
          setFormData((prevState) => ({
            ...prevState,
            userRef: user.uid,
          }));
        } else {
          navigate("/sign-in");
        }
        setLoading(false);
      });
    }
    return () => {
      isMounted.current = false;
    };
  }, [auth, navigate]);

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (discountedPrice >= regularPrice) {
        setLoading(false);
        toast.error("Discounted Price needs to be less than regular price");

        return;
      }

      if (images.length > 6) {
        setLoading(false);
        toast.error("Max 6 images");
        return;
      }

      let geolocation = {};
      let location;

      const updatedImage = await Promise.all(
        Array.from(images).map((image) => formatImages(image))
      );

      geolocation.lat = latitude;
      geolocation.lng = longitude;
      location = addressCopy || address;

      const formDataCopy = {
        ...formData,
        imgUrls: updatedImage,
        geolocation,
        timestamp: serverTimestamp(),
      };

      delete formDataCopy.images;
      delete formDataCopy.addressCopy;

      location && (formDataCopy.location = location);
      !formDataCopy.offer && delete formDataCopy.discountedPrice;

      // Update listing
      const docRef = doc(db, "listings", params.listingId);
      await updateDoc(docRef, formDataCopy);
      toast.success("listing saved");

      navigate(`/category/${formDataCopy.type}/${docRef.id}`);

      console.log(updatedImage);
    } catch (error) {
      console.log(error, error?.message, error?.response);
      if (
        error?.message?.includes("cannot be written because its size") ||
        error?.message?.includes('The value of property "imgUrls" is longer')
      ) {
        console.log(error);
        toast.error("Image size is too large");
      } else {
        toast.error("Failed to create listing");
        console.log(error);
      }
    } finally {
      setLoading(false);
    }
  };

  const onMutate = (e) => {
    let boolean = null;

    if (e.target.value === "true") {
      boolean = true;
    }

    if (e.target.value === "false") {
      boolean = false;
    }

    //files
    if (e.target.files) {
      setFormData((prevState) => ({
        ...prevState,
        images: e.target.files,
      }));
    }

    // Text / Booleans / Numbers
    if (!e.target.files) {
      setFormData((prevState) => ({
        ...prevState,
        [e.target.id]: boolean ?? e.target.value,
      }));
    }
  };

  if (loading) {
    return <Spinner />;
  }

  // console.log(formData);

  return (
    <div className="profile">
      <header>
        <p className="pageHeader">Edit a Listing</p>
        <main>
          <form onSubmit={onSubmit}>
            <label className="formLabel">Sell / Rent</label>
            <div className="formButtons">
              <button
                type="button"
                className={type === "sale" ? "formButtonActive" : "formButton"}
                id="type"
                value="sale"
                onClick={onMutate}
              >
                Sell
              </button>
              <button
                type="button"
                className={type === "rent" ? "formButtonActive" : "formButton"}
                id="type"
                value="rent"
                onClick={onMutate}
              >
                Rent
              </button>
            </div>

            <label className="formLabel">Name</label>
            <input
              className="formInputName"
              type="text"
              id="name"
              value={name}
              onChange={onMutate}
              maxLength="32"
              minLength="10"
              required
            />

            <div className="flex formRooms">
              <div>
                <label className="formLabel">Bedrooms</label>
                <input
                  className="formInputSmall"
                  type="number"
                  id="bedrooms"
                  value={bedrooms}
                  onChange={onMutate}
                  min="1"
                  max="50"
                  required
                />
              </div>

              <div>
                <label className="formLabel">Bathrooms</label>
                <input
                  className="formInputSmall"
                  type="number"
                  id="bathrooms"
                  value={bathrooms}
                  onChange={onMutate}
                  min="1"
                  max="50"
                  required
                />
              </div>
            </div>

            <label className="formLabel">Parking spot</label>
            <div className="formButtons">
              <button
                className={parking ? "formButtonActive" : "formButton"}
                type="button"
                id="parking"
                value={true}
                onClick={onMutate}
                min="1"
                max="50"
              >
                Yes
              </button>
              <button
                className={
                  !parking && parking !== null
                    ? "formButtonActive"
                    : "formButton"
                }
                type="button"
                id="parking"
                value={false}
                onClick={onMutate}
              >
                No
              </button>
            </div>

            <label className="formLabel">Furnished</label>
            <div className="formButtons">
              <button
                className={furnished ? "formButtonActive" : "formButton"}
                type="button"
                id="furnished"
                value={true}
                onClick={onMutate}
              >
                Yes
              </button>
              <button
                className={
                  !furnished && furnished !== null
                    ? "formButtonActive"
                    : "formButton"
                }
                type="button"
                id="furnished"
                value={false}
                onClick={onMutate}
              >
                No
              </button>
            </div>

            <label className="formLabel">Address</label>
            {isLoaded && (
              <Autocomplete
                onLoad={(autocomplete) => (addressRef.current = autocomplete)}
                onPlaceChanged={() => {
                  const place = addressRef.current.getPlace();

                  if (place) {
                    setIsAddressValid(true);
                  }

                  const address = {
                    name: place.formatted_address,
                    longitude: place.geometry.location.lng(),
                    latitude: place.geometry.location.lat(),
                  };

                  setFormData((prev) => ({
                    ...prev,
                    addressCopy: address.name,
                    longitude: address.longitude,
                    latitude: address.latitude,
                  }));
                }}
              >
                <input
                  className="formInputAddress"
                  type="text"
                  id="address"
                  // value={address}
                  defaultValue={addressCopy}
                  onChange={onMutate}
                  required
                  ref={addressRef}
                />
              </Autocomplete>
            )}

            {isAddressValid && (
              <div className="flex formLatLng">
                <div>
                  <label className="formLabel">Latitude</label>
                  <input
                    className="formInputSmall"
                    type="number"
                    id="latitude"
                    value={latitude}
                    onChange={onMutate}
                    required
                    disabled
                  />
                </div>
                <div>
                  <label className="formLabel">Longitude</label>
                  <input
                    className="formInputSmall"
                    type="number"
                    id="longitude"
                    value={longitude}
                    onChange={onMutate}
                    required
                    disabled
                  />
                </div>
              </div>
            )}

            <label className="formLabel">Offer</label>
            <div className="formButtons">
              <button
                className={offer ? "formButtonActive" : "formButton"}
                type="button"
                id="offer"
                value={true}
                onClick={onMutate}
              >
                Yes
              </button>
              <button
                className={
                  !offer && offer !== null ? "formButtonActive" : "formButton"
                }
                type="button"
                id="offer"
                value={false}
                onClick={onMutate}
              >
                No
              </button>
            </div>

            <label className="formLabel">Regular Price</label>
            <div className="formPriceDiv">
              <input
                className="formInputSmall"
                type="number"
                id="regularPrice"
                value={regularPrice}
                onChange={onMutate}
                min="50"
                max="750000000"
                required
              />
              {type === "rent" && <p className="formPriceText">$ / Month</p>}
            </div>

            {offer && (
              <>
                <label className="formLabel">Discounted Price</label>
                <input
                  className="formInputSmall"
                  type="number"
                  id="discountedPrice"
                  value={discountedPrice}
                  onChange={onMutate}
                  min="50"
                  max="750000000"
                  required={offer}
                />
              </>
            )}

            <label className="formLabel">Images</label>
            <p className="imagesInfo">
              The first image will be the cover (max 6).
            </p>
            <input
              className="formInputFile"
              type="file"
              id="images"
              onChange={onMutate}
              max="6"
              accept=".jpg,.png,.jpeg"
              multiple
              required
            />
            <button type="submit" className="primaryButton createListingButton">
              Create Listing
            </button>
          </form>
        </main>
      </header>
    </div>
  );
}

export default EditListing;
