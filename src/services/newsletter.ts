import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import { db } from "../firebase";

export async function subscribeToNewsletter(emailRaw: string) {
  const email = emailRaw.trim().toLowerCase();

  const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  if (!isValid) {
    throw new Error("Please enter a valid email address.");
  }

  const ref = doc(db, "newsletter_subscribers", email);

  await setDoc(
    ref,
    {
      email,
      createdAt: serverTimestamp(),
      source: "footer",
    },
    { merge: true } 
  );
}
