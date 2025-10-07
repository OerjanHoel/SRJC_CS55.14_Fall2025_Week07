import RestaurantListings from "@/src/components/RestaurantListings.jsx"; // Imports restaurant listing
import { getRestaurants } from "@/src/lib/firebase/firestore.js"; // Gets restaurant DB instances
import { getAuthenticatedAppForUser } from "@/src/lib/firebase/serverApp.js"; // Import the User authentication from serverApp.js
import { getFirestore } from "firebase/firestore"; // Imports firestore from firestore node module

// Force next.js to treat this route as server-side rendered
// Without this line, during the build process, next.js will treat this route as static and build a static HTML file for it

export const dynamic = "force-dynamic";

// This line also forces this route to be server-side rendered
// export const revalidate = 0;

// Export serverside rendering
export default async function Home(props) {
  const searchParams = await props.searchParams;
  // Using seachParams which Next.js provides, allows the filtering to happen on the server-side
  const { firebaseServerApp } = await getAuthenticatedAppForUser();
  // Awaiting the getRestaurants to load
  const restaurants = await getRestaurants(
    getFirestore(firebaseServerApp),
    searchParams
  );
  // Returns JSX components 
  return (
    <main className="main__home">
      <RestaurantListings
        initialRestaurants={restaurants}
        searchParams={searchParams}
      />
    </main>
  );
}
