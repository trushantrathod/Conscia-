import React, { useState, useEffect } from 'react';
import { styles } from '../styles';
import ProductModal from '../components/ProductModal';
import EthicalScore from '../components/EthicalScore';

// --- The onAskConscia prop is now received here ---
function ProductBrowser({ category, onBack, onAskConscia }) {
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
            .then(data => {
                setProducts(data);
                setLoading(false);
            })
            .catch(error => {
                setError(error.message);
                setLoading(false);
            });
    }, [category, searchTerm, sortBy]);

    return (
        <div>
            <div style={styles.controlsContainer}>
                <button style={styles.backButton} onClick={onBack}>← Back to Categories</button>
                <input
                    type="text"
                    style={styles.searchBar}
                    placeholder={`Search in ${category}...`}
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                />
                <select 
                    style={styles.sortDropdown} 
                    value={sortBy} 
                    onChange={e => setSortBy(e.target.value)}
                >
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
            {/* --- And the function is passed down to the ProductModal here --- */}
            <ProductModal 
                product={selectedProduct} 
                onClose={() => setSelectedProduct(null)} 
                category={category}
                onAskConscia={onAskConscia} 
            />
        </div>
    );
}

export default ProductBrowser;
