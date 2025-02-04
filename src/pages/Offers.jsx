import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  collection,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  startAfter,
} from "firebase/firestore";
import { db } from "../firebase.config";
import { toast } from "react-toastify";
import Spinner from "../components/Spinner";
import ListingItem from "../components/ListingItem";

function Offers() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastFetchedListing, setLastFetchedListing] = useState(null);

  useEffect(() => {
    const fetchListings = async () => {
      try {
        setLoading(true); // Ensure loading state is set

        // Reference to the listings collection
        const listingsRef = collection(db, "listings");

        // Create query with 'offer' filter
        const q = query(
          listingsRef,
          where("offer", "==", true), // ✅ Added offer filter
          orderBy("timestamp", "desc"),
          limit(10)
        );

        // Execute query
        const querySnap = await getDocs(q);
        if (querySnap.empty) {
          setLoading(false);
          return;
        }

        const lastVisible = querySnap.docs[querySnap.docs.length - 1];
        setLastFetchedListing(lastVisible);

        const listingsArray = querySnap.docs.map((doc) => ({
          id: doc.id,
          data: doc.data(),
        }));

        setListings(listingsArray);
      } catch (error) {
        toast.error("Could not fetch listings");
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
  }, []);

  // Load More Listings Function
  const onFetchMoreListings = async () => {
    if (!lastFetchedListing) return; // ✅ Prevent calling if there's no more data

    try {
      setLoading(true);

      const listingsRef = collection(db, "listings");

      const q = query(
        listingsRef,
        where("offer", "==", true),
        orderBy("timestamp", "desc"),
        startAfter(lastFetchedListing), // ✅ Ensures pagination works
        limit(5) // ✅ Adjust limit as needed
      );

      const querySnap = await getDocs(q);
      if (querySnap.empty) {
        setLoading(false);
        return;
      }

      const lastVisible = querySnap.docs[querySnap.docs.length - 1];
      setLastFetchedListing(lastVisible);

      const newListings = querySnap.docs.map((doc) => ({
        id: doc.id,
        data: doc.data(),
      }));

      setListings((prevListings) => [...prevListings, ...newListings]);
    } catch (error) {
      toast.error("Could not fetch more listings");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="category">
      <header>
        <p className="pageHeader">Offers</p>
      </header>

      {loading && <Spinner />}

      {!loading && listings.length === 0 && <p>There are no current offers</p>}

      {!loading && listings.length > 0 && (
        <>
          <main>
            <ul className="categoryListings">
              {listings.map((listing) => (
                <ListingItem
                  listing={listing.data}
                  id={listing.id}
                  key={listing.id}
                />
              ))}
            </ul>
          </main>

          <br />
          <br />

          {lastFetchedListing && !loading && (
            <p className="loadMore" onClick={onFetchMoreListings}>
              Load More
            </p>
          )}
        </>
      )}
    </div>
  );
}

export default Offers;
