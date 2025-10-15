import { gemini20Flash, googleAI } from "@genkit-ai/googleai"; // Import the AI 
import { genkit } from "genkit"; // Genereating kit
import { getReviewsByRestaurantId } from "@/src/lib/firebase/firestore.js"; // Import of the resturant review data form DB
import { getAuthenticatedAppForUser } from "@/src/lib/firebase/serverApp"; // Import user authentication
import { getFirestore } from "firebase/firestore"; // Import of Firestore DB

// Export AI gengerated summary
export async function GeminiSummary({ restaurantId }) {
  const { firebaseServerApp } = await getAuthenticatedAppForUser();
  const reviews = await getReviewsByRestaurantId(
    getFirestore(firebaseServerApp),
    restaurantId
  );

  // Variable howlding review seperator
  const reviewSeparator = "@";
  // Gemini prompt to write review summary
  const prompt = `
    Based on the following restaurant reviews, 
    where each review is separated by a '${reviewSeparator}' character, 
    create a one-sentence summary of what people think of the restaurant. 

    Here are the reviews: ${reviews.map((review) => review.text).join(reviewSeparator)}
  `;
  // Testing to see if it is has Gemini AI API Key
  try {
    if (!process.env.GEMINI_API_KEY) {
      // Make sure GEMINI_API_KEY environment variable is set:
      // https://firebase.google.com/docs/genkit/get-started
      throw new Error(
        'GEMINI_API_KEY not set. Set it with "firebase apphosting:secrets:set GEMINI_API_KEY"'
      );
    }

    // Configure a Genkit instance.
    const ai = genkit({
      plugins: [googleAI()],
      model: gemini20Flash, // set default model
    });
    const { text } = await ai.generate(prompt);
    // Creates a JSX with summary
    return (
      <div className="restaurant__review_summary">
        <p>{text}</p>
        <p>✨ Summarized with Gemini</p>
      </div>
    );
  } catch (e) {
    console.error(e);
    return <p>Error summarizing reviews.</p>;
  }
}
// Export of skeleton(Shows when AI is working on summary)
export function GeminiSummarySkeleton() {
  return (
    <div className="restaurant__review_summary">
      <p>✨ Summarizing reviews with Gemini...</p>
    </div>
  );
}
