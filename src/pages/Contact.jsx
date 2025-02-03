import React, { useState, useEffect } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase.config";
import { toast } from "react-toastify";

function Contact() {
  const [message, setMessage] = useState("");
  const [landlord, setLandlord] = useState(null); // Corrected variable name
  const [searchParams] = useSearchParams(); // Corrected use of useSearchParams
  const params = useParams();

  // Fetch landlord data from Firestore
  const getLandlord = async () => {
    const docRef = doc(db, "users", params.landlordId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      setLandlord(docSnap.data());
    } else {
      toast.error("Could not get landlord data");
    }
  };

  useEffect(() => {
    getLandlord(); // Fetch landlord data when landlordId changes
  }, [params.landlordId]); // Dependency array to re-run on landlordId change

  const onChange = (e) => setMessage(e.target.value);

  const listingName = searchParams.get("listingName"); // Get the listing name from query params

  return (
    <div className="pageContainer">
      <header>
        <p className="pageHeader">Contact Landlord</p>
      </header>

      {landlord && (
        <main>
          <div className="contactLandlord">
            <p className="landlordName">Contact {landlord.name}</p>
          </div>
          <form className="messageForm">
            <div className="messageDiv">
              <label htmlFor="message">Message</label>
              <textarea
                name="message"
                id="message"
                className="textarea"
                value={message}
                onChange={onChange}
              ></textarea>
            </div>

            <button
              className="primaryButton"
              onClick={(e) => {
                e.preventDefault();
                const mailtoLink = `mailto:${
                  landlord.email
                }?subject=${encodeURIComponent(
                  listingName
                )}&body=${encodeURIComponent(message)}`;
                window.location.href = mailtoLink;
              }}
            >
              Send Message
            </button>
          </form>
        </main>
      )}
    </div>
  );
}

export default Contact;
