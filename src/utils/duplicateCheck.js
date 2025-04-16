import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/service/firebase";

// Function to calculate Levenshtein distance for string similarity
function levenshteinDistance(a, b) {
  if (a.length === 0) return b.length;
  if (b.length === 0) return a.length;

  const matrix = [];

  for (let i = 0; i <= b.length; i++) {
    matrix[i] = [i];
  }

  for (let j = 0; j <= a.length; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        );
      }
    }
  }

  return matrix[b.length][a.length];
}

// Function to calculate similarity percentage
function calculateSimilarity(str1, str2) {
  if (!str1 || !str2) return 0;
  const distance = levenshteinDistance(str1.toLowerCase(), str2.toLowerCase());
  const maxLength = Math.max(str1.length, str2.length);
  return Math.round(((maxLength - distance) / maxLength) * 100);
}

// Function to generate Soundex code
function soundex(str) {
  if (!str) return '';
  
  const a = str.toLowerCase().split('');
  const firstLetter = a[0];
  
  const codes = {
    a: '', e: '', i: '', o: '', u: '',
    b: 1, f: 1, p: 1, v: 1,
    c: 2, g: 2, j: 2, k: 2, q: 2, s: 2, x: 2, z: 2,
    d: 3, t: 3,
    l: 4,
    m: 5, n: 5,
    r: 6
  };

  const result = a
    .map(v => codes[v])
    .filter((v, i, arr) => i === 0 || (v !== arr[i - 1] && v !== undefined));

  return (firstLetter + result.slice(1).join('')).toUpperCase();
}

// Main function to check for duplicates
export async function checkDuplicates(participant) {
  try {
    const participantsRef = collection(db, "participants");
    const familyDetailsRef = collection(db, "familydetails");
    
    // Get all participants
    const participantsSnapshot = await getDocs(participantsRef);
    const participants = participantsSnapshot.docs.map(doc => ({
      ...doc.data(),
      docId: doc.id
    }));

    // Get all family details
    const familySnapshot = await getDocs(familyDetailsRef);
    const families = familySnapshot.docs.map(doc => ({
      ...doc.data(),
      docId: doc.id
    }));

    // Check for personal information matches
    const personalMatches = participants
      .filter(p => p.docId !== participant.docId) // Exclude self
      .map(p => {
        const nameMatch = calculateSimilarity(participant.name, p.name);
        const soundexMatch = participant.name && p.name ? 
          (soundex(participant.name) === soundex(p.name) ? 100 : 0) : 0;
        const locationMatch = calculateSimilarity(participant.address, p.address);
        const birthdayMatch = calculateSimilarity(participant.birthday, p.birthday);
        
        const averageMatch = Math.round(
          (nameMatch + soundexMatch + locationMatch + birthdayMatch) / 4
        );

        return {
          participantId: p.id,
          fullName: p.name,
          location: p.address,
          birthday: p.birthday,
          nameMatch,
          soundexMatch,
          locationMatch,
          birthdayMatch,
          averageMatch
        };
      })
      .filter(match => match.averageMatch > 70); // Only return matches above 70%

    // Check for household matches
    const householdMatches = families
      .flatMap(family => (family.members || []).map(member => {
        const nameMatch = calculateSimilarity(participant.name, member.name);
        const soundexMatch = participant.name && member.name ? 
          (soundex(participant.name) === soundex(member.name) ? 100 : 0) : 0;
        const locationMatch = calculateSimilarity(participant.address, family.familyAddress);
        const birthdayMatch = calculateSimilarity(participant.birthday, member.birthday);
        
        const averageMatch = Math.round(
          (nameMatch + soundexMatch + locationMatch + birthdayMatch) / 4
        );

        return {
          householdId: family.familyId,
          householdName: family.familyName,
          participantName: member.name,
          location: family.familyAddress,
          birthday: member.birthday,
          nameMatch,
          soundexMatch,
          locationMatch,
          birthdayMatch,
          averageMatch
        };
      }))
      .filter(match => match.averageMatch > 70); // Only return matches above 70%

    return {
      hasDuplicates: personalMatches.length > 0 || householdMatches.length > 0,
      personalMatches,
      householdMatches
    };
  } catch (error) {
    console.error("Error checking duplicates:", error);
    throw error;
  }
} 