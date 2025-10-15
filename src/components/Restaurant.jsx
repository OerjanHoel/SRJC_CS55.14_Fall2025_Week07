"use client";

// This components shows one individual restaurant
// It receives data from src/app/restaurant/[id]/page.jsx

import { React, useState, useEffect, Suspense } from "react"; // Import hooks from react node
import dynamic from "next/dynamic"; // Import of dynamic module
import { getRestaurantSnapshotById } from "@/src/lib/firebase/firestore.js"; // Import of function from firestore.js 
import { useUser } from "@/src/lib/getUser"; // User function in getUser.js
import RestaurantDetails from "@/src/components/RestaurantDetails.jsx"; // Import component from RestaurantDetails
import { updateRestaurantImage } from "@/src/lib/firebase/storage.js"; // Import of image update function 

// Import of review dialog component
const ReviewDialog = dynamic(() => import("@/src/components/ReviewDialog.jsx"));

// Export of function 
export default function Restaurant({
  id,
  initialRestaurant,
  initialUserId,
  children,
}) {
  const [restaurantDetails, setRestaurantDetails] = useState(initialRestaurant);
  const [isOpen, setIsOpen] = useState(false);

  // Need to know user id to choose to show dialog or not
  const userId = useUser()?.uid || initialUserId;
  const [review, setReview] = useState({
    rating: 0,
    text: "",
  });
// Function to set new review value
  const onChange = (value, name) => {
    setReview({ ...review, [name]: value });
  };
  // Function for uploading image to review page
  async function handleRestaurantImage(target) {
    const image = target.files ? target.files[0] : null;
    if (!image) {
      return;
    }
    // Waiting for upload to finish
    const imageURL = await updateRestaurantImage(id, image);
    setRestaurantDetails({ ...restaurantDetails, photo: imageURL });
  }

  const handleClose = () => {
    setIsOpen(false);
    setReview({ rating: 0, text: "" });
  };
  // Callback function when a change is made to resturant collection
  useEffect(() => {
    return getRestaurantSnapshotById(id, (data) => {
      setRestaurantDetails(data);
    });
  }, [id]);
// Returns JSX code for showing restaurant details
  return (
    <>
      <RestaurantDetails
        restaurant={restaurantDetails}
        userId={userId}
        handleRestaurantImage={handleRestaurantImage}
        setIsOpen={setIsOpen}
        isOpen={isOpen}
      >
        {children}
      </RestaurantDetails>
      {userId && (
        <Suspense fallback={<p>Loading...</p>}>
          <ReviewDialog
            isOpen={isOpen}
            handleClose={handleClose}
            review={review}
            onChange={onChange}
            userId={userId}
            id={id}
          />
        </Suspense>
      )}
    </>
  );
}
