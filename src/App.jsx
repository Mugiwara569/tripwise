/**
 * App.jsx - Main Application Container for TripWise
 * 
 * Manages global application state:
 * - Active view ('explore' vs 'mytrip')
 * - Destination list loaded from real external API
 * - Search query, category filter, and sorting selection
 * - Modal popup for destination details & API documentation
 * - User's personal travel itinerary backed by browser localStorage
 */

import React, { useState, useEffect, useMemo } from 'react';
import Navbar from './components/Navbar';
import DestinationCard from './components/DestinationCard';
import DestinationModal from './components/DestinationModal';
import MyTrip from './components/MyTrip';
import ApiInfoModal from './components/ApiInfoModal';
import { fetchDestinations, searchExternalPlaces } from './api';

const STORAGE_KEY = 'tripwise_itinerary';

function App() {
  // Navigation state: 'explore' or 'mytrip'
  const [activeTab, setActiveTab] = useState('explore');

  // External API data & network states
  const [destinations, setDestinations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Search, filter, and sorting states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('featured'); // 'featured', 'name-asc', 'name-desc'

  // Modals
  const [selectedDestination, setSelectedDestination] = useState(null);
  const [showApiInfo, setShowApiInfo] = useState(false);

  // Live external search trigger status
  const [isLiveSearching, setIsLiveSearching] = useState(false);

  /**
   * Browser localStorage for itinerary persistence.
   * We initialize using a lazy state function so localStorage is only read once.
   */
  const [itinerary, setItinerary] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch (err) {
      console.warn('Could not read itinerary from localStorage:', err);
      return [];
    }
  });

  // Whenever the itinerary changes, save it to browser localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(itinerary));
    } catch (err) {
      console.warn('Could not save itinerary to localStorage:', err);
    }
  }, [itinerary]);

  /**
   * Loads destination data from the real external API on initial mount.
   */
  async function loadDestinations() {
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchDestinations();
      setDestinations(data);
    } catch (err) {
      setError(err.message || 'Failed to load destinations from the API.');
    } finally {
      setIsLoading(false);
    }
  }

  // Load destinations when the app mounts
  useEffect(() => {
    loadDestinations();
  }, []);

  /**
   * Adds or removes a destination from the user's itinerary.
   * Prevents duplicates by verifying the unique id.
   */
  function handleToggleTrip(destination) {
    const isAlreadySaved = itinerary.some((item) => item.id === destination.id);

    if (isAlreadySaved) {
      // Remove destination
      setItinerary((prev) => prev.filter((item) => item.id !== destination.id));
    } else {
      // Add destination (prevent duplicates)
      setItinerary((prev) => [...prev, destination]);
    }
  }

  /**
   * Explicit removal function for the MyTrip view.
   */
  function handleRemoveFromTrip(destinationId) {
    setItinerary((prev) => prev.filter((item) => item.id !== destinationId));
  }

  /**
   * Triggers a live external search query against Wikipedia API
   * for places not in the initial curated catalog.
   */
  async function handleLiveExternalSearch() {
    if (!searchQuery.trim()) return;
    setIsLiveSearching(true);
    setError(null);

    try {
      const searchResults = await searchExternalPlaces(searchQuery);
      if (searchResults.length === 0) {
        setError(`No live travel places found on Wikipedia matching "${searchQuery}".`);
      } else {
        // Merge without duplicate IDs
        setDestinations((prev) => {
          const existingIds = new Set(prev.map((d) => d.id));
          const newItems = searchResults.filter((d) => !existingIds.has(d.id));
          return [...newItems, ...prev];
        });
        setSelectedCategory('All');
      }
    } catch (err) {
      setError(`Live search failed: ${err.message}`);
    } finally {
      setIsLiveSearching(false);
    }
  }

  /**
   * Extract unique categories dynamically from current destinations.
   * Satisfies: "Provide a category filter based on categories that actually exist in the retrieved data."
   */
  const availableCategories = useMemo(() => {
    const categoriesSet = new Set(destinations.map((d) => d.category));
    return ['All', ...Array.from(categoriesSet)];
  }, [destinations]);

  /**
   * Filter and Sort destinations.
   * Search, filtering, and sorting work seamlessly together.
   */
  const processedDestinations = useMemo(() => {
    let result = [...destinations];

    // 1. Filter by category
    if (selectedCategory !== 'All') {
      result = result.filter((d) => d.category === selectedCategory);
    }

    // 2. Filter by search query (matching name, location, or description)
    if (searchQuery.trim()) {
      const term = searchQuery.toLowerCase().trim();
      result = result.filter(
        (d) =>
          d.name.toLowerCase().includes(term) ||
          d.location.toLowerCase().includes(term) ||
          d.description.toLowerCase().includes(term)
      );
    }

    // 3. Sort results
    if (sortBy === 'name-asc') {
      result.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === 'name-desc') {
      result.sort((a, b) => b.name.localeCompare(a.name));
    }

    return result;
  }, [destinations, selectedCategory, searchQuery, sortBy]);

  return (
    <div className="app-layout">
      {/* Navbar with brand, tabs, and saved itinerary badge */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        itineraryCount={itinerary.length}
        onOpenApiInfo={() => setShowApiInfo(true)}
      />

      {/* Main Content Area */}
      <main className="main-content">
        {activeTab === 'explore' ? (
          <section className="explore-view">
            {/* Hero Welcome Banner */}
            <div className="hero-section">
              <span className="hero-pill">✨ Real Places API Integration</span>
              <h1 className="hero-title">Discover the World with TripWise</h1>
              <p className="hero-subtitle">
                Explore iconic landmarks, natural wonders, and cultural hubs with live data from
                the Wikipedia Places API. Plan your personalized itinerary effortlessly.
              </p>
            </div>

            {/* Controls Bar: Search, Category Filter, and Sorting */}
            <div className="controls-card">
              {/* Search Bar */}
              <div className="search-bar-wrapper">
                <span className="search-icon" aria-hidden="true">🔍</span>
                <input
                  type="text"
                  className="search-input"
                  placeholder="Search destinations by name or country (e.g., Paris, Colosseum)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  aria-label="Search destinations"
                />
                {searchQuery && (
                  <button
                    type="button"
                    className="search-clear-btn"
                    onClick={() => setSearchQuery('')}
                    title="Clear search"
                  >
                    ✕
                  </button>
                )}
              </div>

              {/* Filter & Sort Controls Row */}
              <div className="filters-row">
                {/* Category Filter Pills */}
                <div className="category-group" role="group" aria-label="Filter by category">
                  <span className="filter-label">Category:</span>
                  <div className="category-pills">
                    {availableCategories.map((cat) => (
                      <button
                        key={cat}
                        type="button"
                        className={`category-pill ${selectedCategory === cat ? 'active' : ''}`}
                        onClick={() => setSelectedCategory(cat)}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Sorting Dropdown */}
                <div className="sort-group">
                  <label htmlFor="sort-select" className="filter-label">Sort by:</label>
                  <select
                    id="sort-select"
                    className="sort-select"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                  >
                    <option value="featured">Featured / Default</option>
                    <option value="name-asc">Alphabetical (A → Z)</option>
                    <option value="name-desc">Reverse Alphabetical (Z → A)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Results Count & Active Filters Indicator */}
            <div className="results-status-bar">
              <span className="results-count">
                Showing <strong>{processedDestinations.length}</strong> {processedDestinations.length === 1 ? 'destination' : 'destinations'}
              </span>

              {(selectedCategory !== 'All' || searchQuery) && (
                <button
                  type="button"
                  className="reset-filters-btn"
                  onClick={() => {
                    setSelectedCategory('All');
                    setSearchQuery('');
                  }}
                >
                  Reset Filters
                </button>
              )}
            </div>

            {/* State 1: Loading State */}
            {isLoading && (
              <div className="state-container loading-state">
                <div className="spinner" aria-hidden="true"></div>
                <h3 className="state-title">Discovering Destinations...</h3>
                <p className="state-message">
                  Fetching live travel data from the external Wikipedia Places API.
                </p>
              </div>
            )}

            {/* State 2: Network / API Error State */}
            {!isLoading && error && (
              <div className="state-container error-state">
                <div className="state-icon" aria-hidden="true">⚠️</div>
                <h3 className="state-title">Unable to Load Destinations</h3>
                <p className="state-message">{error}</p>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={loadDestinations}
                >
                  🔄 Try Again
                </button>
              </div>
            )}

            {/* State 3: Empty Search / Filter Results */}
            {!isLoading && !error && processedDestinations.length === 0 && (
              <div className="state-container empty-state">
                <div className="state-icon" aria-hidden="true">🔎</div>
                <h3 className="state-title">No Destinations Found</h3>
                <p className="state-message">
                  {searchQuery
                    ? `No matching places found for "${searchQuery}". Would you like to query Wikipedia's global database directly?`
                    : `No destinations match the selected category "${selectedCategory}".`}
                </p>
                
                <div className="empty-actions">
                  {searchQuery && (
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={handleLiveExternalSearch}
                      disabled={isLiveSearching}
                    >
                      {isLiveSearching ? 'Searching API...' : `🌐 Query Live API for "${searchQuery}"`}
                    </button>
                  )}
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedCategory('All');
                    }}
                  >
                    Clear All Filters
                  </button>
                </div>
              </div>
            )}

            {/* State 4: Destination Grid */}
            {!isLoading && !error && processedDestinations.length > 0 && (
              <div className="destinations-grid">
                {processedDestinations.map((destination) => (
                  <DestinationCard
                    key={destination.id}
                    destination={destination}
                    onSelect={setSelectedDestination}
                    onToggleTrip={handleToggleTrip}
                    isInTrip={itinerary.some((item) => item.id === destination.id)}
                  />
                ))}
              </div>
            )}
          </section>
        ) : (
          /* My Trip View */
          <MyTrip
            itinerary={itinerary}
            onRemoveFromTrip={handleRemoveFromTrip}
            onSelectDestination={setSelectedDestination}
            onReturnToExplore={() => setActiveTab('explore')}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-container">
          <p className="footer-text">
            <strong>TripWise</strong> — Smart Travel Planner. Built with React, Vite & Plain CSS.
          </p>
          <p className="footer-attribution">
            Places data provided live via Wikimedia / Wikipedia Open API. Licensed under CC BY-SA.
          </p>
        </div>
      </footer>

      {/* Destination Details Modal */}
      {selectedDestination && (
        <DestinationModal
          destination={selectedDestination}
          onClose={() => setSelectedDestination(null)}
          onToggleTrip={handleToggleTrip}
          isInTrip={itinerary.some((item) => item.id === selectedDestination.id)}
        />
      )}

      {/* Educational API Information Modal */}
      {showApiInfo && (
        <ApiInfoModal onClose={() => setShowApiInfo(false)} />
      )}
    </div>
  );
}

export default App;
