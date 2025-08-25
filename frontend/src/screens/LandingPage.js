import React, { useState, useEffect } from 'react';
import { styles } from '../styles';

function LandingPage({ onSelectCategory }) {
    const [categories, setCategories] = useState([]);
    useEffect(() => {
        fetch('http://127.0.0.1:5000/api/categories')
            .then(res => res.json())
            .then(data => setCategories(data))
            .catch(err => console.error("Failed to fetch categories:", err));
    }, []);

    const categoryEmojis = {
        beauty: '💅',
        electronics: '💻',
        fashion: '👕',
        groceries: '🛒',
        books: '📚'
    };

    return (
        <div style={styles.landingContainer}>
            <div style={styles.introduction}>
                <p>In a world of complex supply chains and misleading marketing, making ethical purchasing decisions is harder than ever. Conscia cuts through the noise. We use AI to analyze products across key ethical pillars—environmental impact, labor rights, animal welfare, and corporate governance. Our mission is to provide you with clear, unbiased information, empowering you to shop with your values and make every purchase a conscious one.</p>
            </div>
            <h2>Choose a Category to Explore</h2>
            <div style={styles.categoryGrid}>
                {categories.map(category => (
                    <div 
                        key={category} 
                        style={{...styles.categoryCard, ':hover': {transform: 'scale(1.05)'}}}
                        onClick={() => onSelectCategory(category)}
                    >
                        {categoryEmojis[category] || '📦'} {category.charAt(0).toUpperCase() + category.slice(1)}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default LandingPage;
