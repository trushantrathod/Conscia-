import React, { useState, useEffect, useRef } from 'react';


// --- STYLES (remains the same) ---
const styles = {
  app: {
    backgroundColor: '#1a1a2e',
    minHeight: '100vh',
    color: '#e0e0e0',
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
  },
  // --- Add these new styles to your existing styles object ---

modalFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: '30px',
},
askButton: {
    backgroundColor: '#00f5d4',
    color: '#1a1a2e',
    border: 'none',
    borderRadius: '8px',
    padding: '10px 20px',
    cursor: 'pointer',
    fontWeight: '600',
    transition: 'transform 0.2s ease',
},
chatbotContainer: {
    position: 'absolute',
    bottom: '20px',
    right: '20px',
    width: '320px',
    height: '450px',
    backgroundColor: '#2c2c54',
    borderRadius: '15px',
    boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
    display: 'flex',
    flexDirection: 'column',
    zIndex: 1001,
    animation: 'fadeInUp 0.3s ease-out',
},
chatbotHeader: {
    padding: '15px',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderTopLeftRadius: '15px',
    borderTopRightRadius: '15px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontWeight: 'bold',
},
chatbotClose: {
    background: 'none',
    border: 'none',
    color: 'white',
    fontSize: '1.5rem',
    cursor: 'pointer',
},
chatbotBody: {
    flexGrow: 1,
    padding: '15px',
    overflowY: 'auto',
},
userMessage: {
    textAlign: 'right',
    backgroundColor: '#00f5d4',
    color: '#1a1a2e',
    padding: '10px',
    borderRadius: '15px 15px 0 15px',
    marginBottom: '10px',
    maxWidth: '80%',
    marginLeft: 'auto',
},
aiMessage: {
    textAlign: 'left',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: '10px',
    borderRadius: '15px 15px 15px 0',
    marginBottom: '10px',
    maxWidth: '80%',
    marginRight: 'auto',
},
chatbotInputArea: {
    display: 'flex',
    padding: '10px',
    borderTop: '1px solid rgba(255, 255, 255, 0.2)',
},
chatbotInput: {
    flexGrow: 1,
    border: 'none',
    backgroundColor: 'rgba(0,0,0,0.2)',
    borderRadius: '15px',
    padding: '10px 15px',
    color: 'white',
},
chatbotSendButton: {
    background: '#00f5d4',
    border: 'none',
    color: '#1a1a2e',
    borderRadius: '50%',
    width: '40px',
    height: '40px',
    marginLeft: '10px',
    cursor: 'pointer',
    fontSize: '1.2rem',
},
  header: {
    padding: '40px 20px',
    textAlign: 'center',
    animation: 'fadeIn 1s ease-out',
  },
  appName: {
    fontSize: '3rem',
    fontWeight: 'bold',
    color: '#ffffff',
    cursor: 'pointer',
    transition: 'color 0.3s ease',
  },
  tagline: {
    fontSize: '1.2rem',
    color: '#a0a0c0',
    marginTop: '5px',
  },
  landingContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px',
    textAlign: 'center',
  },
  introduction: {
    maxWidth: '800px',
    fontSize: '1.1rem',
    lineHeight: '1.6',
    color: '#c0c0e0',
    marginBottom: '40px',
    animation: 'fadeInUp 0.8s ease-out',
  },
  categoryGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '25px',
    width: '100%',
    maxWidth: '1200px',
    marginTop: '30px',
  },
  categoryCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    backdropFilter: 'blur(15px)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    borderRadius: '15px',
    padding: '40px 20px',
    textAlign: 'center',
    cursor: 'pointer',
    transition: 'transform 0.3s ease, background-color 0.3s ease, box-shadow 0.3s ease',
    fontSize: '1.5rem',
    fontWeight: '600',
    color: '#ffffff',
    animation: 'fadeInUp 0.8s ease-out forwards',
  },
  controlsContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '20px',
    marginBottom: '30px',
    padding: '20px',
    position: 'sticky',
    top: 0,
    backgroundColor: 'rgba(26, 26, 46, 0.85)',
    backdropFilter: 'blur(10px)',
    zIndex: 999,
    animation: 'fadeIn 0.5s ease-out',
  },
  backButton: {
    fontSize: '1rem',
    padding: '12px 20px',
    borderRadius: '10px',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    color: '#ffffff',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
  },
  searchBar: {
    fontSize: '1.1rem',
    padding: '12px 15px',
    width: '50%',
    maxWidth: '500px',
    borderRadius: '10px',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    color: '#ffffff',
    transition: 'box-shadow 0.3s ease',
  },
  sortDropdown: {
    fontSize: '1rem',
    padding: '12px',
    borderRadius: '10px',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    color: '#ffffff',
  },
  sortOption: {
    backgroundColor: '#1a1a2e',
    color: '#e0e0e0',
  },
  productList: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: '25px',
    padding: '20px',
  },
  productCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    backdropFilter: 'blur(15px)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    borderRadius: '15px',
    padding: '25px',
    width: '320px',
    textAlign: 'left',
    display: 'flex',
    flexDirection: 'column',
    cursor: 'pointer',
    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
    animation: 'fadeInUp 0.5s ease-out forwards',
  },
  productName: {
    fontSize: '1.2rem',
    fontWeight: '600',
    color: '#ffffff',
    marginTop: 0,
    minHeight: '45px',
    flexGrow: 1,
  },
  brandName: {
    fontSize: '0.9rem',
    color: '#a0a0c0',
    marginBottom: '15px',
  },
  scoresContainer: {
    borderTop: '1px solid rgba(255, 255, 255, 0.2)',
    paddingTop: '15px',
  },
  scoreItem: {
    display: 'grid',
    gridTemplateColumns: '110px 1fr 40px',
    alignItems: 'center',
    fontSize: '0.9rem',
    marginBottom: '8px',
  },
  scoreLabel: { color: '#e0e0e0' },
  scoreValue: { fontWeight: '600', textAlign: 'right', color: '#e0e0e0' },
  scoreBarContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    borderRadius: '10px',
    height: '8px',
    overflow: 'hidden',
  },
  modalOverlay: {
    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000,
    animation: 'fadeIn 0.3s ease-out',
  },
  modalContent: {
    backgroundColor: 'rgba(30, 30, 50, 0.9)',
    backdropFilter: 'blur(20px)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    padding: '30px',
    borderRadius: '15px',
    width: '90%',
    maxWidth: '600px',
    textAlign: 'left',
    maxHeight: '80vh',
    overflowY: 'auto',
    animation: 'scaleIn 0.3s ease-out',
  },
  modalCloseButton: {
    backgroundColor: '#e94560',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    padding: '10px 20px',
    cursor: 'pointer',
    marginTop: '20px',
    float: 'right',
    fontWeight: '600',
    transition: 'background-color 0.3s ease',
  },
  aiSummarySection: {
    marginTop: '20px',
    paddingTop: '15px',
    borderTop: '1px solid rgba(255, 255, 255, 0.2)',
  },
  aiSummaryText: {
    fontSize: '1rem',
    lineHeight: '1.6',
    color: '#c0c0e0',
    fontStyle: 'italic',
  }
};

// --- Reusable Components (ScoreBar, EthicalScore) ---
function ScoreBar({ score }) {
  const getColor = (value) => {
    if (value > 75) return '#00f5d4';
    if (value > 50) return '#fee440';
    return '#f85149';
  };
  const barStyle = { width: `${score}%`, height: '100%', backgroundColor: getColor(score), borderRadius: '10px', transition: 'width 0.5s ease-in-out' };
  return <div style={styles.scoreBarContainer}><div style={barStyle}></div></div>;
}

function EthicalScore({ scores }) {
  if (!scores) return null;
  const scorePillars = [
    { label: '🌱 Environment', value: scores.environment },
    { label: '🤝 Labor', value: scores.labor },
    { label: '🐇 Animal Welfare', value: scores.animal_welfare },
    { label: '🏛️ Governance', value: scores.governance },
  ];
  return (
    <div style={styles.scoresContainer}>
      {scorePillars.map((pillar) => (
        <div key={pillar.label} style={styles.scoreItem}>
          <span style={styles.scoreLabel}>{pillar.label}</span>
          <ScoreBar score={pillar.value} />
          <span style={styles.scoreValue}>{pillar.value}</span>
        </div>
      ))}
    </div>
  );
}

// --- UPDATED ProductModal Component ---
function ProductModal({ product, onClose, category }) {
  const [reviews, setReviews] = useState([]);
  const [loadingReviews, setLoadingReviews] = useState(true);
  const [summary, setSummary] = useState('');
  const [loadingSummary, setLoadingSummary] = useState(true);

  useEffect(() => {
    if (product && product.product_id && category) {
      setLoadingReviews(true);
      fetch(`http://127.0.0.1:5000/api/${category}/reviews/${product.product_id}`)
        .then(res => res.json())
        .then(data => { setReviews(data); setLoadingReviews(false); })
        .catch(err => { console.error("Failed to fetch reviews:", err); setLoadingReviews(false); });
    }
  }, [product, category]);

  useEffect(() => {
    if (product) {
      setLoadingSummary(true);
      setSummary('');
      
      fetch('http://127.0.0.1:5000/api/generate-summary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(product)
      })
      .then(res => res.json())
      .then(data => {
        if (data.summary) {
          setSummary(data.summary);
        } else {
          setSummary('Could not generate a summary for this product.');
        }
        setLoadingSummary(false);
      })
      .catch(err => {
        console.error("Failed to fetch AI summary:", err);
        setSummary('An error occurred while generating the summary.');
        setLoadingSummary(false);
      });
    }
  }, [product]);

  if (!product) return null;

  return (
    <div style={styles.modalOverlay} onClick={onClose}>
      <div style={styles.modalContent} onClick={e => e.stopPropagation()}>
        <h2 style={{ marginTop: 0, color: '#ffffff' }}>{product.product_name}</h2>
        <p style={{ color: '#a0a0c0', borderBottom: '1px solid rgba(255, 255, 255, 0.2)', paddingBottom: '15px' }}>by {product.brand_name}</p>
        
        {/* --- FIX: ADDED THE MISSING AI SUMMARY SECTION HERE --- */}
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
                <p style={styles.reviewAuthor}>{review.author_name || 'Anonymous'} (Rating: {review.rating_numeric || review.rating}/5)</p>
                <p style={styles.reviewText}>{review.review_text}</p>
              </div>
            ))
          ) : (
            <p>No reviews found for this product.</p>
          )}
        </div>

        <button style={{...styles.modalCloseButton, ':hover': {backgroundColor: '#d43f52'}}} onClick={onClose}>Close</button>
      </div>
    </div>
  );
}

// --- Product Browser Screen Component (remains the same) ---
function ProductBrowser({ category, onBack }) {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [sortBy, setSortBy] = useState('default');

    useEffect(() => {
        setLoading(true);
        fetch(`http://127.0.0.1:5000/api/${category}/search?q=${searchTerm}&sort_by=${sortBy}`)
            .then(response => {
                if (!response.ok) { throw new Error('Network response was not ok'); }
                return response.json();
            })
            .then(data => { setProducts(data); setLoading(false); })
            .catch(error => { setError(error.message); setLoading(false); });
    }, [category, searchTerm, sortBy]);

    return (
        <div>
            <div style={styles.controlsContainer}>
                <button style={{...styles.backButton, ':hover': {backgroundColor: 'rgba(255, 255, 255, 0.2)'}}} onClick={onBack}>← Back to Categories</button>
                <input
                    type="text"
                    style={{...styles.searchBar, ':focus': {boxShadow: '0 0 0 2px #00f5d4'}}}
                    placeholder={`Search in ${category}...`}
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                />
                <select style={styles.sortDropdown} value={sortBy} onChange={e => setSortBy(e.target.value)}>
                    <option style={styles.sortOption} value="default">Sort by: Default</option>
                    <option style={styles.sortOption} value="environment">Sort by: Environment</option>
                    <option style={styles.sortOption} value="labor">Sort by: Labor</option>
                    <option style={styles.sortOption} value="animal_welfare">Sort by: Animal Welfare</option>
                    <option style={styles.sortOption} value="governance">Sort by: Governance</option>
                </select>
            </div>
            {loading && <p style={{textAlign: 'center'}}>Loading products...</p>}
            {error && <p style={{textAlign: 'center'}}>Error: {error}</p>}
            <div style={styles.productList}>
                {!loading && products.length === 0 && <p>No products found.</p>}
                {products.map((product, index) => (
                    <div 
                        key={product.product_id || index} 
                        style={{...styles.productCard, animationDelay: `${index * 0.05}s`}}
                        onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-5px)'; e.currentTarget.style.boxShadow = '0 10px 20px rgba(0, 0, 0, 0.2)'; }}
                        onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
                        onClick={() => setSelectedProduct(product)}
                    >
                        <div>
                            <h2 style={styles.productName}>{product.product_name}</h2>
                            <p style={styles.brandName}>by {product.brand_name}</p>
                        </div>
                        <EthicalScore scores={product.ethical_score} />
                    </div>
                ))}
            </div>
            <ProductModal product={selectedProduct} onClose={() => setSelectedProduct(null)} category={category} />
        </div>
    );
}

// --- Landing Page Component (remains the same) ---
function LandingPage({ onSelectCategory }) {
    const [categories, setCategories] = useState([]);
    useEffect(() => {
        fetch('http://127.0.0.1:5000/api/categories')
            .then(res => res.json())
            .then(data => setCategories(data))
            .catch(err => console.error("Failed to fetch categories:", err));
    }, []);

    const categoryEmojis = { beauty: '💅', fashion: '👕', groceries: '🛒', books: '📚' };

    return (
        <div style={styles.landingContainer}>
            <div style={styles.introduction}>
                <p>In a world of complex supply chains and misleading marketing, making ethical purchasing decisions is harder than ever. Conscia cuts through the noise. We use AI to analyze products across key ethical pillars—environmental impact, labor rights, animal welfare, and corporate governance. Our mission is to provide you with clear, unbiased information, empowering you to shop with your values and make every purchase a conscious one.</p>
            </div>
            <h2>Choose a Category to Explore</h2>
            <div style={styles.categoryGrid}>
                {categories.map((category, index) => (
                    <div 
                        key={category} 
                        style={{...styles.categoryCard, animationDelay: `${0.5 + index * 0.1}s`}}
                        onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.05)'; e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)'; }}
                        onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)'; }}
                        onClick={() => onSelectCategory(category)}
                    >
                        {categoryEmojis[category] || '📦'} {category.charAt(0).toUpperCase() + category.slice(1)}
                    </div>
                ))}
            </div>
        </div>
    );
}
// --- Chatbot Component ---
function Chatbot({ product, onClose }) {
    const [messages, setMessages] = useState([
        { 
            sender: 'ai', 
            text: product 
                ? `Hi! Ask me anything about "${product.product_name}".` 
                : "Hi! I'm Conscia. You can ask me general questions about ethical shopping."
        }
    ]);
    const [userInput, setUserInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const chatBodyRef = useRef(null);

    useEffect(() => {
        if (chatBodyRef.current) {
            chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSendMessage = () => {
        if (!userInput.trim()) return;
        const newUserMessage = { sender: 'user', text: userInput };
        const updatedMessages = [...messages, newUserMessage];
        setMessages(updatedMessages);
        setUserInput('');
        setIsLoading(true);

        fetch('http://127.0.0.1:5000/api/chatbot', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                product: product,
                history: updatedMessages.map(msg => ({ sender: msg.sender, text: msg.text }))
            })
        })
        .then(res => res.json())
        .then(data => {
            const aiResponse = { sender: 'ai', text: data.reply || "Sorry, I couldn't get a response." };
            setMessages(prev => [...prev, aiResponse]);
        })
        .catch(err => {
            console.error("Chatbot API error:", err);
            const errorResponse = { sender: 'ai', text: "Sorry, I'm having trouble connecting." };
            setMessages(prev => [...prev, errorResponse]);
        })
        .finally(() => setIsLoading(false));
    };

    return (
        <div style={styles.chatbotContainer}>
            <div style={styles.chatbotHeader}>
                <span>Chat with Conscia</span>
                <button onClick={onClose} style={styles.chatbotClose}>×</button>
            </div>
            <div style={styles.chatbotBody} ref={chatBodyRef}>
                {messages.map((msg, index) => (
                    <div key={index} style={msg.sender === 'user' ? styles.userMessage : styles.aiMessage}>
                        {msg.text}
                    </div>
                ))}
                {isLoading && <div style={styles.aiMessage}>...</div>}
            </div>
            <div style={styles.chatbotInputArea}>
                <input
                    type="text"
                    value={userInput}
                    onChange={e => setUserInput(e.target.value)}
                    onKeyPress={e => e.key === 'Enter' && handleSendMessage()}
                    placeholder="Ask a question..."
                    style={styles.chatbotInput}
                    disabled={isLoading}
                />
                <button onClick={handleSendMessage} style={styles.chatbotSendButton} disabled={isLoading}>➤</button>
            </div>
        </div>
    );
}


// --- Main App Component ---
function App() {
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [chatProduct, setChatProduct] = useState(null); 
    const [showChatHint, setShowChatHint] = useState(true);

    const handleSetChatContext = (product) => {
        setChatProduct(product);
        setIsChatOpen(true); 
    };

    const toggleChat = () => {
        setIsChatOpen(!isChatOpen);
        if (isChatOpen) {
            setChatProduct(null);
        }
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            setShowChatHint(false);
        }, 7000); 

        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        const styleSheet = document.createElement("style");
        styleSheet.type = "text/css";
        styleSheet.innerText = `
            body {
                margin: 0;
            }
            @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
            @keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
            @keyframes scaleIn { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
        `;
        document.head.appendChild(styleSheet);
    }, []);

    const appStyles = {
        ...styles.app,
        backgroundColor: '#12121a',
        backgroundImage: `
            linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)
        `,
        backgroundSize: '30px 30px',
    };

    return (
        <div style={appStyles}>
            <header style={styles.header}>
                {/* --- FIX: Increased font sizes for title and tagline --- */}
                <h1 style={{...styles.appName, fontSize: '3.5rem', fontWeight: 'bold', letterSpacing: '1px'}} onClick={() => setSelectedCategory(null)}>Conscia</h1>
                <p style={{...styles.tagline, fontSize: '1.25rem', marginTop: '10px', fontWeight: '300'}}>AI-Powered Ethical Shopping Companion</p>
            </header>
            
            <main>
                {selectedCategory ? (
                    <ProductBrowser 
                        category={selectedCategory} 
                        onBack={() => setSelectedCategory(null)} 
                        onAskConscia={handleSetChatContext}
                    />
                ) : (
                    <LandingPage 
                        onSelectCategory={setSelectedCategory} 
                    />
                )}
            </main>

            <div style={styles.chatbotToggleContainer}>
                {isChatOpen ? (
                    <Chatbot product={chatProduct} onClose={toggleChat} />
                ) : (
                    <>
                        {showChatHint && (
                            <div style={styles.chatHint}>
                                <span>Have a question? Ask our AI assistant!</span>
                                <button onClick={() => setShowChatHint(false)} style={styles.chatHintClose}>×</button>
                            </div>
                        )}
                        <button 
                            style={styles.chatbotToggleButton} 
                            onClick={toggleChat}
                            title="Ask Conscia"
                        >
                            <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12.82,10.34a2.26,2.26,0,0,0-2.12-1.22,2.33,2.33,0,0,0-2.34,2.34v1.1a2.34,2.34,0,0,0,2.34,2.34,2.26,2.26,0,0,0,2.12-1.22H12.2v-1h.62v-1.1h-.62Zm-2.12,2.14a1,1,0,0,1-1-1.1,1,1,0,0,1,1-1,1,1,0,0,1,1,1v1.1a1,1,0,0,1-1,1Z"/>
                                <path d="M12,2A10,10,0,1,0,22,12,10,10,0,0,0,12,2Zm0,18a8,8,0,1,1,8-8A8,8,0,0,1,12,20Z"/>
                            </svg>
                        </button>
                    </>
                )}
            </div>
        </div>
    );
}

// --- Add or update these styles in your styles.js file ---
Object.assign(styles, {
    chatbotToggleContainer: {
        position: 'fixed',
        bottom: '30px',
        right: '30px',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        gap: '15px',
    },
    chatbotToggleButton: {
        backgroundColor: '#00f5d4',
        color: '#12121a',
        border: 'none',
        borderRadius: '50%',
        width: '60px',
        height: '60px',
        cursor: 'pointer',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        boxShadow: '0 5px 20px rgba(0, 245, 212, 0.3)',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
    },
    chatHint: {
        backgroundColor: 'white',
        color: '#12121a',
        padding: '10px 15px',
        borderRadius: '8px',
        boxShadow: '0 5px 15px rgba(0,0,0,0.2)',
        display: 'flex',
        alignItems: 'center',
        whiteSpace: 'nowrap',
        animation: 'fadeInUp 0.5s ease-out forwards',
        fontWeight: '500',
    },
    chatHintClose: {
        background: 'none',
        border: 'none',
        color: '#12121a',
        marginLeft: '10px',
        cursor: 'pointer',
        fontSize: '1.2rem',
        fontWeight: 'bold',
    }
});


export default App;


