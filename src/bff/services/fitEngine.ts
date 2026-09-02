export function calculateFitConfidence(userProfile: any, userHistory: any, product: any, productSpecs: any, productReviews: any) {
  // 1. User History Match (Max 40 points)
  let historyScore = 0;
  let historyReasons: string[] = [];
  
  if (userHistory && userHistory.purchasedBrands && userHistory.purchasedBrands.includes(product.brand)) {
    historyScore += 20;
    historyReasons.push(`You have a successful fit history with ${product.brand}`);
  } else {
    historyReasons.push(`Limited fit history for ${product.brand}`);
  }

  const categorySize = userHistory?.successfulSizes?.[product.category];
  if (categorySize) {
    historyScore += 10;
    if (product.availableSizes && product.availableSizes.includes(categorySize)) {
      historyScore += 10;
      if (!historyReasons.some(r => r.includes('history'))) {
        historyReasons.push(`Matches your typical size in ${product.category}`);
      }
    }
  }

  // 2. Product-Specific Review Evidence (Max 35 points)
  let reviewScore = 0;
  let reviewReasons: string[] = [];
  
  const volume = productReviews?.volume || 0;
  const consistency = productReviews?.consistency || 'Unknown';
  const consensus = productReviews?.consensus || 'Unknown';

  if (volume < 10) {
    reviewScore += 5;
    reviewReasons.push(`Limited product-specific fit evidence`);
  } else if (volume <= 30) {
    reviewScore += 15;
  } else if (volume <= 100) {
    reviewScore += 25;
  } else {
    reviewScore += 30;
  }

  if (consistency === 'High') {
    reviewScore += 5;
    reviewReasons.push(`Consistent fit feedback from reviewers`);
  } else if (consistency === 'Mixed') {
    reviewScore -= 5;
    reviewReasons.push(`Mixed reviewer feedback on sizing`);
  } else {
    reviewScore -= 10;
    if (volume >= 10) reviewReasons.push(`Inconsistent fit feedback`);
  }

  // Cap review score at 35 and floor at 0
  reviewScore = Math.max(0, Math.min(35, reviewScore));

  // 3. Product Fit Characteristics (Max 25 points)
  let specsScore = 0;
  let specsReasons: string[] = [];
  
  const fitType = productSpecs?.fitType || 'Regular';
  const stretch = productSpecs?.stretch || 'Non-stretch';

  if (stretch === 'Stretchable') {
    specsScore += 15;
    specsReasons.push(`Stretchable fabric reduces fit risk`);
  } else {
    specsScore += 5;
    specsReasons.push(`Non-stretch fabric requires precise sizing`);
  }

  if (['Regular', 'Relaxed', 'Oversized'].includes(fitType)) {
    specsScore += 10;
    if (fitType !== 'Regular') {
      specsReasons.push(`${fitType} fit offers more flexibility`);
    }
  } else {
    specsScore += 5;
    specsReasons.push(`${fitType} fit may feel restrictive`);
  }

  specsScore = Math.max(0, Math.min(25, specsScore));

  // Total Score
  const totalScore = historyScore + reviewScore + specsScore;

  // Map to Confidence Level
  let confidenceLevel = 'LOW';
  if (totalScore >= 70) {
    confidenceLevel = 'HIGH';
  } else if (totalScore >= 40) {
    confidenceLevel = 'MEDIUM';
  }

  // Generate Caveat & Recommended Size
  let caveatText = '';
  let recommendedSize = userProfile?.usualSize || 'M';
  let recommendedSizeRationale = 'Based on your default profile size.';
  
  const runs = productSpecs?.runs || 'True';
  
  if (runs === 'Small') {
    caveatText = 'Runs slightly small — several reviewers recommend sizing up.';
    if (categorySize && product.availableSizes) {
      // Find the next size up if possible
      const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '28', '30', '32', '34', '36'];
      const idx = sizes.indexOf(categorySize);
      if (idx !== -1 && idx + 1 < sizes.length && product.availableSizes.includes(sizes[idx + 1])) {
        recommendedSize = sizes[idx + 1];
        recommendedSizeRationale = `Sized up to ${recommendedSize} because this item runs small.`;
      } else {
        recommendedSize = categorySize;
        recommendedSizeRationale = `Your usual size is ${recommendedSize}, but consider sizing up if possible.`;
      }
    }
  } else if (runs === 'Large') {
    caveatText = 'Runs slightly large — consider sizing down.';
    if (categorySize && product.availableSizes) {
      const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '28', '30', '32', '34', '36'];
      const idx = sizes.indexOf(categorySize);
      if (idx !== -1 && idx - 1 >= 0 && product.availableSizes.includes(sizes[idx - 1])) {
        recommendedSize = sizes[idx - 1];
        recommendedSizeRationale = `Sized down to ${recommendedSize} because this item runs large.`;
      } else {
        recommendedSize = categorySize;
        recommendedSizeRationale = `Your usual size is ${recommendedSize}, but consider sizing down if possible.`;
      }
    }
  } else if (consensus === 'Mixed Sizing') {
    caveatText = 'Review feedback is mixed on fit.';
    if (categorySize) {
      recommendedSize = categorySize;
      recommendedSizeRationale = `Sticking to your standard size (${recommendedSize}) due to mixed reviews.`;
    }
  } else {
    caveatText = 'Runs true to size based on recent reviews.';
    if (categorySize) {
      recommendedSize = categorySize;
      recommendedSizeRationale = `Your historically successful size (${recommendedSize}) aligns with this product.`;
    }
  }

  // Consolidate reasons (pick top 3)
  const allReasons = [];
  if (confidenceLevel === 'HIGH') {
    if (historyScore >= 20) allReasons.push(historyReasons[0]);
    if (reviewScore >= 20) allReasons.push(reviewReasons[0]);
    if (specsScore >= 15) allReasons.push(specsReasons[0]);
  } else {
    allReasons.push(...historyReasons.filter(r => r.includes('Limited')));
    allReasons.push(...reviewReasons.filter(r => r.includes('Mixed') || r.includes('Limited') || r.includes('Inconsistent')));
    allReasons.push(...specsReasons.filter(r => r.includes('Non-stretch') || r.includes('restrictive')));
  }

  // Fill in any gaps
  if (allReasons.length < 2) {
    allReasons.push(...historyReasons, ...reviewReasons, ...specsReasons);
  }
  
  // Deduplicate and limit to 3
  const uniqueReasons = [...new Set(allReasons)].filter(Boolean).slice(0, 3);

  return {
    confidenceLevel,
    reasons: uniqueReasons,
    caveatText,
    recommendedSize,
    recommendedSizeRationale,
    isFallback: false,
    _debugInfo: {
      historyScore,
      reviewScore,
      specsScore,
      totalScore
    }
  };
}
