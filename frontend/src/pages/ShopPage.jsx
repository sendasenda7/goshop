import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiFilter, FiX, FiSearch, FiGrid, FiList } from 'react-icons/fi';
import { useSearchParams } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import ProductCard from '../components/product/ProductCard';
import api from '../utils/api';
import { ShopSkeleton } from '../components/common/Loaders';

const categories = ['Tous', 'Femme', 'Homme', 'Sacs', 'Collections', 'Nouveautés', 'Cadeaux'];
const sortOptions = ['Nouveautes', 'Prix croissant', 'Prix decroissant', 'Meilleures ventes'];

// Mapping URL param → nom de catégorie affiché
const catParamToLabel = {
  'femme': 'Femme',
  'homme': 'Homme',
  'sacs': 'Sacs',
  'collections': 'Collections',
  'nouveautés': 'Nouveautés',
  'nouveautes': 'Nouveautés',
  'cadeaux': 'Cadeaux',
};

const ShopPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [activeSort, setActiveSort] = useState('Nouveautes');
  const [filterOpen, setFilterOpen] = useState(false);
  const [viewMode, setViewMode] = useState('grid');
  const [search, setSearch] = useState('');
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [priceRange, setPriceRange] = useState([0, 1000]);

  // Lire la catégorie depuis l'URL (?cat=femme)
  const catParam = searchParams.get('cat') || '';
  const activeCategory = catParamToLabel[catParam.toLowerCase()] || 'Tous';
  const [currentPage, setCurrentPage] = useState(1);

  // Debounce de la recherche : on attend que l'utilisateur arrête de taper
  // (300ms) avant de lancer l'appel API, pour ne pas spammer le backend
  // à chaque caractère.
  const [searchInput, setSearchInput] = useState('');
  useEffect(() => {
    const timeout = setTimeout(() => { setSearch(searchInput); setCurrentPage(1); }, 300);
    return () => clearTimeout(timeout);
  }, [searchInput]);

  // Changer catégorie → met à jour l'URL
  const handleCategoryChange = (cat) => {
    if (cat === 'Tous') {
      searchParams.delete('cat');
    } else {
      searchParams.set('cat', cat.toLowerCase());
    }
    setSearchParams(searchParams);
    setCurrentPage(1);
  };

useEffect(() => {
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (activeCategory !== 'Tous') params.append('category', activeCategory);
      if (search) params.append('search', search);
      if (activeSort === 'Nouveautes') params.append('sort', 'newest');
      if (activeSort === 'Prix croissant') params.append('sort', 'price-asc');
      if (activeSort === 'Prix decroissant') params.append('sort', 'price-desc');
      if (activeSort === 'Meilleures ventes') params.append('sort', 'sold');
      params.append('minPrice', priceRange[0]);
      params.append('maxPrice', priceRange[1]);
      params.append('page', currentPage);
      params.append('limit', 12);

      const res = await api.get(`/products?${params}`);
      setProducts(res.data.products || []);
      setTotalPages(res.data.pages || 1);
      setTotalCount(res.data.total || 0);
    } catch (err) {
      console.error(err);
      setProducts([]);
      setTotalPages(1);
      setTotalCount(0);
    } finally {
      setLoading(false);
    }
  };
  fetchProducts();
}, [activeCategory, activeSort, search, priceRange, currentPage]);

  return (
    <div className="min-h-screen bg-gs-white">
      <Navbar />

      {/* PAGE HEADER */}
      <div className="pt-28 pb-10 px-6 md:px-12 border-b border-black/5">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <p className="label-tag text-gs-gold mb-2">Notre Selection</p>
            <h1 className="font-display text-5xl md:text-6xl font-light italic">
              La <span className="font-semibold">Boutique</span>
            </h1>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 py-8">

        {/* TOOLBAR */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">

          {/* Categories */}
          <div className="flex items-center gap-2 flex-wrap">
            {categories.map((cat) => (
              <motion.button
                key={cat}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => handleCategoryChange(cat)}
                className={`text-xs tracking-widest uppercase px-5 py-2.5 transition-all duration-300 ${
                  activeCategory === cat
                    ? 'bg-gs-black text-white'
                    : 'border border-black/20 text-gs-gray hover:border-gs-black hover:text-gs-black'
                }`}
              >
                {cat}
              </motion.button>
            ))}
          </div>

          {/* Right Controls */}
          <div className="flex items-center gap-3">
            {/* Search */}
            <div className="flex items-center border border-black/20 px-3 py-2 gap-2 focus-within:border-gs-black transition-colors">
              <FiSearch size={14} className="text-gs-gray" />
              <input
                type="text"
                placeholder="Rechercher..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="text-xs outline-none bg-transparent w-32 placeholder:text-gs-gray"
              />
            </div>

            {/* Filter */}
            <button
              onClick={() => setFilterOpen(true)}
              className="flex items-center gap-2 border border-black/20 px-4 py-2 text-xs tracking-widest uppercase hover:border-gs-black transition-colors"
            >
              <FiFilter size={14} />
              Filtres
            </button>

            {/* View mode */}
            <div className="flex items-center border border-black/20">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 transition-colors ${viewMode === 'grid' ? 'bg-gs-black text-white' : 'text-gs-gray hover:text-gs-black'}`}
              >
                <FiGrid size={14} />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 transition-colors ${viewMode === 'list' ? 'bg-gs-black text-white' : 'text-gs-gray hover:text-gs-black'}`}
              >
                <FiList size={14} />
              </button>
            </div>
          </div>
        </div>

        {/* SORT + COUNT */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-xs text-gs-gray font-light">
            <span className="text-gs-black font-medium">{products.length}</span> produits
          </p>
          <div className="flex items-center gap-2">
            <span className="text-xs text-gs-gray">Trier par:</span>
            <select
              value={activeSort}
              onChange={(e) => { setActiveSort(e.target.value); setCurrentPage(1); }}
              className="text-xs border border-black/20 px-3 py-2 outline-none bg-transparent cursor-pointer hover:border-gs-black transition-colors"
            >
              {sortOptions.map((opt) => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </div>
        </div>

        {/* PRODUCTS GRID */}
<AnimatePresence mode="wait">
  {loading ? (
    <ShopSkeleton viewMode={viewMode} />
  ) : products.length === 0 ? (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="text-center py-24"
    >
      <p className="font-display text-3xl font-light italic text-gs-gray mb-4">Aucun produit trouve</p>
      <button onClick={() => { handleCategoryChange('Tous'); setSearch(''); setSearchInput(''); }} className="btn-outline-black">
        Reinitialiser
      </button>
    </motion.div>
  ) : (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className={`grid gap-4 ${
          viewMode === 'grid'
            ? 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4'
            : 'grid-cols-1 md:grid-cols-2'
        }`}
      >
                {products.map((product, i) => (
                  <ProductCard key={product._id} product={product} index={i} />
                ))}
              </motion.div>

              {/* PAGINATION */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-16">
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="px-4 py-2 text-xs tracking-widest uppercase border border-black/15 disabled:opacity-30 disabled:cursor-not-allowed hover:border-gs-gold transition-colors"
                  >
                    Précédent
                  </button>

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                    <button
                      key={p}
                      onClick={() => setCurrentPage(p)}
                      className={`w-9 h-9 text-xs transition-colors ${
                        p === currentPage
                          ? 'bg-gs-black text-white'
                          : 'text-gs-gray hover:text-gs-black border border-black/10'
                      }`}
                    >
                      {p}
                    </button>
                  ))}

                  <button
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 text-xs tracking-widest uppercase border border-black/15 disabled:opacity-30 disabled:cursor-not-allowed hover:border-gs-gold transition-colors"
                  >
                    Suivant
                  </button>
                </div>
              )}

              <p className="text-center text-xs text-gs-gray mt-4 tracking-wide">
                {totalCount} produit{totalCount > 1 ? 's' : ''} au total
              </p>
            </>
          )}
        </AnimatePresence>
      </div>

      {/* FILTER DRAWER */}
      <AnimatePresence>
        {filterOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setFilterOpen(false)}
              className="fixed inset-0 bg-black/40 z-50"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="fixed top-0 right-0 h-full w-80 bg-white z-50 p-8 overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-10">
                <h3 className="text-sm tracking-widest uppercase font-semibold">Filtres</h3>
                <button onClick={() => setFilterOpen(false)}>
                  <FiX size={20} />
                </button>
              </div>

              {/* Price Range */}
              <div className="mb-10">
                <h4 className="label-tag mb-4">Prix</h4>
                <div className="space-y-3">
                  <input
                    type="range"
                    min="0"
                    max="1000"
                    value={priceRange[1]}
                    onChange={(e) => { setPriceRange([0, Number(e.target.value)]); setCurrentPage(1); }}
                    className="w-full accent-gs-black"
                  />
                  <div className="flex justify-between text-xs text-gs-gray">
                    <span>0 TND</span>
                    <span className="text-gs-black font-medium">{priceRange[1]} TND</span>
                  </div>
                </div>
              </div>

              {/* Categories */}
              <div className="mb-10">
                <h4 className="label-tag mb-4">Categorie</h4>
                <div className="space-y-2">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => { handleCategoryChange(cat); setFilterOpen(false); }}
                      className={`block w-full text-left text-sm py-2 border-b border-black/5 hover:text-gs-gold transition-colors ${
                        activeCategory === cat ? 'text-gs-gold font-medium' : 'text-gs-gray font-light'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Apply */}
              <button
                onClick={() => setFilterOpen(false)}
                className="btn-gold w-full text-center"
              >
                Appliquer
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
};

export default ShopPage;