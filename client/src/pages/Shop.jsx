import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ProductCard from '../components/common/ProductCard';
import { Search, SlidersHorizontal, ChevronLeft, ChevronRight } from 'lucide-react';
import './Shop.css';

const Shop = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('');
  const [sort, setSort] = useState('-createdAt');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const categories = ['Electronics', 'Fashion', 'Home', 'Beauty', 'Sports'];

  useEffect(() => {
    fetchProducts();
  }, [category, sort, page]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      let url = `http://localhost:5000/api/products?page=${page}&sort=${sort}&limit=8`;
      if (category) url += `&category=${category}`;
      if (search) url += `&name[regex]=${search}&name[options]=i`;
      
      const res = await axios.get(url);
      setProducts(res.data.data);
      // Simplified pagination logic for demo
      setTotalPages(Math.ceil(res.data.count / 8) || 1);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchProducts();
  };

  return (
    <div className="container shop-page">
      <div className="shop-header">
        <h1>All Products</h1>
        <form className="shop-search" onSubmit={handleSearch}>
          <input 
            type="text" 
            placeholder="Search products..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button type="submit"><Search size={20} /></button>
        </form>
      </div>

      <div className="shop-layout">
        {/* Sidebar Filters */}
        <aside className="shop-sidebar glass">
          <div className="filter-section">
            <h3><SlidersHorizontal size={18} /> Filters</h3>
            
            <div className="filter-group">
              <h4>Category</h4>
              <button 
                className={category === '' ? 'active' : ''} 
                onClick={() => setCategory('')}
              >All Categories</button>
              {categories.map(cat => (
                <button 
                  key={cat}
                  className={category === cat ? 'active' : ''} 
                  onClick={() => setCategory(cat)}
                >{cat}</button>
              ))}
            </div>

            <div className="filter-group">
              <h4>Sort By</h4>
              <select value={sort} onChange={(e) => setSort(e.target.value)}>
                <option value="-createdAt">Newest First</option>
                <option value="price">Price: Low to High</option>
                <option value="-price">Price: High to Low</option>
                <option value="-ratings">Popularity</option>
              </select>
            </div>
          </div>
        </aside>

        {/* Product Grid */}
        <div className="shop-main">
          {loading ? (
            <div className="loading-grid">
               {[...Array(8)].map((_, i) => <div key={i} className="skeleton-card"></div>)}
            </div>
          ) : (
            <>
              <div className="grid grid-4">
                {products.map(product => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="pagination">
                  <button 
                    disabled={page === 1} 
                    onClick={() => setPage(prev => prev - 1)}
                  ><ChevronLeft /></button>
                  <span>Page {page} of {totalPages}</span>
                  <button 
                    disabled={page === totalPages} 
                    onClick={() => setPage(prev => prev + 1)}
                  ><ChevronRight /></button>
                </div>
              )}

              {products.length === 0 && (
                <div className="no-results">
                  <h3>No products found</h3>
                  <p>Try adjusting your search or filters</p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Shop;
