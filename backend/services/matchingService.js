const calculateDistance = require('../utils/calculateDistance');

/**
 * Calculates score for clothing type compatibility (Weight: 25%)
 */
function calculateClothingTypeScore(donatedType, requiredType) {
  if (!donatedType || !requiredType) return 50;
  if (donatedType.toLowerCase() === requiredType.toLowerCase()) return 100;

  // Compatible outer garments
  const outerLayers = ['Jacket', 'Sweater'];
  if (outerLayers.includes(donatedType) && outerLayers.includes(requiredType)) return 75;

  // Compatible tops
  const tops = ['Shirt', 'T-Shirt'];
  if (tops.includes(donatedType) && tops.includes(requiredType)) return 75;

  // Compatible bottoms
  const bottoms = ['Pants', 'Jeans'];
  if (bottoms.includes(donatedType) && bottoms.includes(requiredType)) return 75;

  return 20;
}

/**
 * Calculates score for size compatibility (Weight: 20%)
 */
function calculateSizeScore(donatedSize, requiredSizes) {
  if (!donatedSize || !requiredSizes) return 50;
  
  const sizeList = Array.isArray(requiredSizes) ? requiredSizes : [requiredSizes];
  const normalizedDonated = donatedSize.trim().toUpperCase();

  // Check exact match in list
  const hasExact = sizeList.some(s => s.trim().toUpperCase() === normalizedDonated);
  if (hasExact) return 100;

  // Check free size or adjacent size compatibility
  if (sizeList.some(s => s.toLowerCase().includes('free') || s.toLowerCase().includes('all'))) return 85;

  const order = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
  const donatedIdx = order.indexOf(normalizedDonated);

  if (donatedIdx !== -1) {
    const isAdjacent = sizeList.some(s => {
      const idx = order.indexOf(s.trim().toUpperCase());
      return idx !== -1 && Math.abs(idx - donatedIdx) === 1;
    });
    if (isAdjacent) return 70;
  }

  return 0;
}

/**
 * Calculates score for gender and age suitability (Weight: 15%)
 */
function calculateGenderAgeScore(donatedGender, donatedAge, requiredGenderAge) {
  if (!requiredGenderAge) return 70;
  const reqStr = requiredGenderAge.toLowerCase();

  let genderMatch = false;
  if (donatedGender === 'Unisex' || reqStr.includes('unisex') || reqStr.includes(donatedGender.toLowerCase())) {
    genderMatch = true;
  }

  let ageMatch = false;
  if (donatedAge && reqStr.includes(donatedAge.toLowerCase())) {
    ageMatch = true;
  }

  if (genderMatch && ageMatch) return 100;
  if (genderMatch || ageMatch) return 60;
  return 0;
}

/**
 * Calculates current demand score based on remaining quantity (Weight: 15%)
 */
function calculateDemandScore(quantityRequired, quantityFulfilled) {
  const remaining = (quantityRequired || 0) - (quantityFulfilled || 0);

  if (remaining >= 15) return 100;
  if (remaining >= 10) return 85;
  if (remaining >= 5) return 70;
  if (remaining >= 1) return 50;
  return 0;
}

/**
 * Calculates location proximity score using Haversine formula (Weight: 15%)
 */
function calculateLocationScore(distanceKm) {
  if (distanceKm <= 5) return 100;
  if (distanceKm <= 15) return 85;
  if (distanceKm <= 30) return 70;
  if (distanceKm <= 50) return 50;
  return 30;
}

/**
 * Calculates urgency score (Weight: 10%)
 */
function calculateUrgencyScore(urgencyLevel) {
  switch (urgencyLevel) {
    case 'Critical': return 100;
    case 'High': return 80;
    case 'Medium': return 60;
    case 'Low': return 40;
    default: return 60;
  }
}

/**
 * Generates human-readable match explanation reasoning
 */
function generateMatchReasoning(orgName, donation, requirement, distanceKm, matchScore) {
  const urgencyText = requirement.urgencyLevel ? `${requirement.urgencyLevel} urgency` : 'high priority';
  const sizeText = donation.size ? `in ${donation.size} size` : '';
  const conditionText = donation.condition ? `${donation.condition.toLowerCase()} condition` : 'good state';

  return `${orgName} is a highly suitable match (Match Score: ${matchScore}%) because it currently requires ${donation.clothingType.toLowerCase()}s for ${requirement.genderSuitability || donation.genderSuitability} ${requirement.ageGroup || donation.ageGroup}s ${sizeText}. The donated clothing is in ${conditionText} and the organization is located only ${distanceKm} km away. The requirement has ${urgencyText}.`;
}

/**
 * Main Smart Matching Evaluator
 */
function evaluateMatch(donation, requirement, organization) {
  // 1. Calculate distance
  const donorLat = donation.pickupLocation?.coordinates?.latitude || 12.9716;
  const donorLng = donation.pickupLocation?.coordinates?.longitude || 77.5946;
  const orgLat = organization.location?.coordinates?.latitude || 12.9352;
  const orgLng = organization.location?.coordinates?.longitude || 77.6245;

  const distanceKm = calculateDistance(donorLat, donorLng, orgLat, orgLng);

  // 2. Individual factor scores
  const clothingTypeScore = calculateClothingTypeScore(donation.clothingType, requirement.clothingType);
  const sizeScore = calculateSizeScore(donation.size, requirement.size);
  const genderAgeScore = calculateGenderAgeScore(donation.genderSuitability, donation.ageGroup, `${requirement.genderSuitability} ${requirement.ageGroup}`);
  const demandScore = calculateDemandScore(requirement.quantityRequired, requirement.quantityFulfilled);
  const locationScore = calculateLocationScore(distanceKm);
  const urgencyScore = calculateUrgencyScore(requirement.urgencyLevel);

  // 3. Calculate weighted final score
  const matchScore = Math.round(
    (clothingTypeScore * 0.25) +
    (sizeScore * 0.20) +
    (genderAgeScore * 0.15) +
    (demandScore * 0.15) +
    (locationScore * 0.15) +
    (urgencyScore * 0.10)
  );

  // 4. Generate reasoning text
  const reasoning = generateMatchReasoning(
    organization.organizationName || 'Partner Organization',
    donation,
    requirement,
    distanceKm,
    matchScore
  );

  return {
    matchScore,
    distance: distanceKm,
    reasoning,
    compatibilityScores: {
      clothingType: clothingTypeScore,
      size: sizeScore,
      genderAge: genderAgeScore,
      condition: donation.condition === 'Excellent' ? 100 : donation.condition === 'Good' ? 80 : 60,
      demand: demandScore,
      location: locationScore,
      urgency: urgencyScore
    }
  };
}

module.exports = {
  evaluateMatch,
  calculateDistance,
  calculateClothingTypeScore,
  calculateSizeScore,
  calculateGenderAgeScore,
  calculateDemandScore,
  calculateLocationScore,
  calculateUrgencyScore
};
