// Simple simulated AI extractor for hackathon MVP
// Matches keywords in the natural language text to extract a user profile.

export const extractUserProfile = (text) => {
  const lowerText = text.toLowerCase();
  
  const profile = {
    occupation: null,
    education: null,
    intent: null
  };

  // Check occupation
  if (lowerText.includes("student") || lowerText.includes("chhatra")) {
    profile.occupation = "student";
  } else if (lowerText.includes("farmer") || lowerText.includes("kisan") || lowerText.includes("kheti")) {
    profile.occupation = "farmer";
  } else if (lowerText.includes("business") || lowerText.includes("vendor") || lowerText.includes("stall") || lowerText.includes("rehdi")) {
    profile.occupation = "street vendor";
  }

  // Check education
  if (lowerText.includes("college") || lowerText.includes("graduation") || lowerText.includes("degree")) {
    profile.education = "college";
  } else if (lowerText.includes("school")) {
    profile.education = "school";
  }

  // Check intent
  if (lowerText.includes("scholarship")) {
    profile.intent = "scholarship";
  } else if (lowerText.includes("loan") || lowerText.includes("business badhane")) {
    profile.intent = "loan";
  } else if (lowerText.includes("financial help") || lowerText.includes("paise")) {
    profile.intent = "financial help";
  }

  return profile;
};
