/**
 * Navbar.jsx - Navigation Bar Component
 * 
 * Displays the TripWise branding, navigation buttons to switch between
 * "Explore" and "My Trip", and a count badge showing how many items are saved.
 */

import React from 'react';

function Navbar({ activeTab, setActiveTab, itineraryCount, onOpenApiInfo }) {
  return (
    <header className="navbar">
      <div className="navbar-container">
        {/* Brand Logo & Title */}
        <div className="navbar-brand" onClick={() => setActiveTab('explore')} role="button" tabIndex={0}>
          <span className="brand-icon" aria-hidden="true">✈️</span>
          <div className="brand-text">
            <span className="brand-name">TripWise</span>
            <span className="brand-tagline">Smart Travel Planner</span>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="navbar-nav" aria-label="Main Navigation">
          <button
            type="button"
            className={`nav-btn ${activeTab === 'explore' ? 'active' : ''}`}
            onClick={() => setActiveTab('explore')}
          >
            <span className="nav-icon" aria-hidden="true">🌍</span>
            Explore
          </button>

          <button
            type="button"
            className={`nav-btn ${activeTab === 'mytrip' ? 'active' : ''}`}
            onClick={() => setActiveTab('mytrip')}
          >
            <span className="nav-icon" aria-hidden="true">🧳</span>
            My Trip
            {/* Show badge only when there are saved destinations */}
            {itineraryCount > 0 && (
              <span className="nav-badge" aria-label={`${itineraryCount} destinations saved`}>
                {itineraryCount}
              </span>
            )}
          </button>

          {/* Educational API info trigger */}
          <button
            type="button"
            className="nav-btn api-info-btn"
            onClick={onOpenApiInfo}
            title="Learn about the API integration"
          >
            <span className="nav-icon" aria-hidden="true">ℹ️</span>
            API Info
          </button>
        </nav>
      </div>
    </header>
  );
}

export default Navbar;
