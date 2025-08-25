import React, { useState, useEffect } from 'react';
import { styles } from '../styles';
import EthicalScore from './EthicalScore';

function ProductModal({ product, onClose, category, onAskConscia }) { // <-- Added onAskConscia prop
  const [reviews, setReviews] = useState([]);
  const [loadingReviews, setLoadingReviews] = useState(true);
  const [summary, setSummary] = useState('');
  const [loadingSummary, setLoadingSummary] = useState(true);

  const API_URL = process.env.REACT_APP_API_URL || 'http://127.0.0.1:5000';

  useEffect(() => {
    if (product && product.product_id && category) {
      setLoadingReviews(true);
      fetch(`${API_URL}/api/${category}/reviews/${product.product_id}`)
        .then(res => res.json())
        .then(data => { setReviews(data); setLoadingReviews(false); })
        .catch(err => { console.error("Failed to fetch reviews:", err); setLoadingReviews(false); });
    }
  }, [product, category, API_URL]);

  useEffect(() => {
    if (product) {
      setLoadingSummary(true);
      fetch(`${API_URL}/api/generate-summary`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(product)
      })
      .then(res => res.json())
      .then(data => {
        setSummary(data.summary || 'Could not generate a summary.');
        setLoadingSummary(false);
      })
      .catch(err => {
        console.error("Failed to fetch AI summary:", err);
        setSummary('An error occurred while generating the summary.');
        setLoadingSummary(false);
      });
    }
  }, [product, API_URL]);

  if (!product) return null;

  const handleAskClick = () => {
    onAskConscia(product); // Pass the product context up to the App
    onClose(); // Close the modal
  };

  return (
    <div style={styles.modalOverlay} onClick={onClose}>
      <div style={styles.modalContent} onClick={e => e.stopPropagation()}>
        <h2 style={{ marginTop: 0, color: '#ffffff' }}>{product.product_name}</h2>
        <p style={{ color: '#a0a0c0', borderBottom: '1px solid rgba(255, 255, 255, 0.2)', paddingBottom: '15px' }}>
          by {product.brand_name}
        </p>
        
        <div style={styles.aiSummarySection}>
            <h3 style={{color: '#ffffff'}}>Ethical Snapshot</h3>
            {loadingSummary ? (
                <p style={styles.aiSummaryText}>🧠 Generating summary...</p>
            ) : (
                <p style={styles.aiSummaryText}>{summary}</p>
            )}
        </div>

        <h3 style={{color: '#ffffff', marginTop: '20px'}}>Ethical Score Breakdown</h3>
        <EthicalScore scores={product.ethical_score} />
        
        <div style={styles.reviewsSection}>
          <h3 style={{color: '#ffffff'}}>User Reviews</h3>
          {loadingReviews ? <p>Loading reviews...</p> : reviews.length > 0 ? (
            reviews.map((review, index) => (
              <div key={index} style={styles.reviewCard}>
                <p style={styles.reviewAuthor}>
                  {review.author_name || 'Anonymous'} (Rating: {review.rating_numeric || review.rating}/5)
                </p>
                <p style={styles.reviewText}>{review.review_text}</p>
              </div>
            ))
          ) : (
            <p>No reviews found for this product.</p>
          )}
        </div>

        <div style={styles.modalFooter}>
            <button style={styles.askButton} onClick={handleAskClick}>
                💬 Ask Conscia
            </button>
            <button style={styles.modalCloseButton} onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
}

export default ProductModal;
