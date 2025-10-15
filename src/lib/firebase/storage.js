import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage"; // Import of needed modules form firebase

import { storage } from "@/src/lib/firebase/clientApp"; // Import variables for db and storage

import { updateRestaurantImageReference } from "@/src/lib/firebase/firestore"; // Import function for updating restraunt image

// Fundtion testing for restarunt id and image type
export async function updateRestaurantImage(restaurantId, image) {
  try {
    if (!restaurantId) {
      throw new Error("No restaurant ID has been provided.");
    }

    if (!image || !image.name) {
      throw new Error("A valid image has not been provided.");
    }
    // async function uploading image
    const publicImageUrl = await uploadImage(restaurantId, image);
    await updateRestaurantImageReference(restaurantId, publicImageUrl);

    return publicImageUrl;
  } catch (error) {
    console.error("Error processing request:", error);
  }
}
// Function setting new image for restaurant and refrences the Database
async function uploadImage(restaurantId, image) {
  const filePath = `images/${restaurantId}/${image.name}`;
  const newImageRef = ref(storage, filePath);
  await uploadBytesResumable(newImageRef, image);

  return await getDownloadURL(newImageRef);
}