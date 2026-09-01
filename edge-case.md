# Edge Cases & Mitigation Strategies: Myntra In-Wishlist Decision Assistant

This document outlines potential edge cases for the In-Wishlist AI Fit & Decision Assistant MVP and proposes strategies to handle them gracefully without breaking the user experience.

## 1. Missing or Incomplete User Data
| Edge Case | Impact | Mitigation Strategy |
| :--- | :--- | :--- |
| **No User Body Profile** | Cannot calculate a personalized Fit Confidence Score. | **Fallback:** Hide the personalized Fit Score. Instead, show generic consensus data (e.g., "75% of buyers say this runs small"). Prompt the user to "Add your measurements for a personalized fit score." |
| **No Purchase History/Wardrobe Data** | Styling Recommendation Engine cannot suggest pairings with existing wardrobe items. | **Fallback:** Rely on item-to-item collaborative filtering to suggest generally popular pairings (e.g., "People often style this with white sneakers") or cross-sell from trending categories. |

## 2. Missing or Incomplete Product Data
| Edge Case | Impact | Mitigation Strategy |
| :--- | :--- | :--- |
| **Zero UGC or Reviews (New Item)** | Decision Drawer is empty; no semantic summary or try-on photos. | **Fallback:** Hide the UGC gallery and Semantic Review sections entirely. Do not show empty states. Display a generic "Be the first to review" prompt. |
| **Inconsistent Sizing Metadata** | AI Fit Engine may generate wildly inaccurate confidence scores. | **Guardrail:** If product sizing confidence (data quality) is below a threshold, suppress the Fit Score on the AI Banner to prevent misleading the user, which could lead to returns. |

## 3. Inventory & Concurrency Issues
| Edge Case | Impact | Mitigation Strategy |
| :--- | :--- | :--- |
| **Race Condition on Cart Add** | User taps "Select Size & Move to Bag", but the item goes out of stock in those milliseconds. | **Graceful Handling:** Catch the inventory failure from the Cart Service. Show a friendly toast error: "Oops, this size just sold out!" and instantly update the UI to show available alternatives. |
| **Fully Out-of-Stock Item in Wishlist** | AI Banner and Decision Drawer might promote an item that cannot be bought. | **Logic Bypass:** If all SKUs for a product are OOS, do not render the AI Fit Banner or Decision Drawer. Instead, display standard "Out of Stock" UI with a "Notify Me" or "View Similar" CTA. |

## 4. AI/System Latency & Failures
| Edge Case | Impact | Mitigation Strategy |
| :--- | :--- | :--- |
| **AI Service Timeout (>500ms)** | AI Banner blocks rendering of the Wishlist, causing a poor perceived performance. | **Fail Open (Soft Degradation):** The client must never wait indefinitely. If the BFF/Cache doesn't return the banner data within the 500ms budget, render the standard wishlist item seamlessly. Do not show loading spinners on the main feed. |
| **AI Summarizer Hallucination** | The LLM misinterprets sarcastic reviews or hallucinates fabric traits. | **Guardrail:** Implement strict system prompts for the LLM. Add a subtle user feedback mechanism (thumbs up/down) on the semantic summary to flag bad outputs and retrain the model. |

## 5. UI/UX & Network Constraints
| Edge Case | Impact | Mitigation Strategy |
| :--- | :--- | :--- |
| **Slow Network Connection (2G/3G)** | High-res UGC images in the Decision Drawer fail to load quickly. | **Optimization:** Serve highly compressed WebP thumbnails initially. Prioritize rendering the text-based Semantic Summaries and Fit Score first, as they are lightweight. |
| **Bottom-Sheet Gesture Conflict** | Swipe-to-dismiss gesture on the Decision Drawer conflicts with OS-level gestures (e.g., iOS home swipe). | **Design:** Ensure proper safe-area padding at the bottom of the screen and use standard native gesture handlers (via React Native) to differentiate between scroll and dismiss intents. |
