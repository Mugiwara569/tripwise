/**
 * MyTrip.jsx - Itinerary Management View
 * 
 * Renders the user's customized travel itinerary stored in localStorage.
 * Handles removing items, reviewing details, and displays an engaging
 * empty state when no places have been added yet.
 */

import React from 'react';

function MyTrip({ itinerary, onRemoveFromTrip, onSelectDestination, onReturnToExplore }) {
  const fallbackImage = 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=800&q=80';

  return (
    <section className="mytrip-view">
      {/* View Header */}
      <div className="mytrip-header">
        <div>
          <h2 className="section-title">My Trip Itinerary</h2>
          <p className="section-subtitle">
            Manage your personal travel plans and selected destinations.
          </p>
        </div>
        {itinerary.length > 0 && (
          <div className="itinerary-summary-pill">
            <span>{itinerary.length} {itinerary.length === 1 ? 'place' : 'places'} planned</span>
          </div>
        )}
      </div>

      {/* Empty State */}
      {itinerary.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon" aria-hidden="true">🗺️</div>
          <h3 className="empty-state-title">Your Itinerary is Empty</h3>
          <p className="empty-state-message">
            You haven't added any travel destinations yet. Browse through our Explore
            catalog to discover exciting places and add them to your trip!
          </p>
          <button
            type="button"
            className="btn btn-primary empty-state-btn"
            onClick={onReturnToExplore}
          >
            ✈️ Explore Destinations
          </button>
        </div>
      ) : (
        /* Grid of Saved Destinations */
        <div className="destinations-grid">
          {itinerary.map((destination) => (
            <article key={destination.id} className="destination-card mytrip-card">
              <div className="card-image-wrapper">
                <img
                  src={destination.imageUrl || fallbackImage}
                  alt={destination.name}
                  className="card-image"
                  loading="lazy"
                />
                <span className="card-category-badge">{destination.category}</span>
              </div>

              <div className="card-content">
                <div className="card-header">
                  <h3 className="card-title">{destination.name}</h3>
                  <span className="card-location">
                    <span className="location-icon" aria-hidden="true">📍</span>
                    {destination.location}
                  </span>
                </div>

                <p className="card-description">
                  {destination.description.length > 110
                    ? `${destination.description.substring(0, 110)}...`
                    : destination.description}
                </p>

                <div className="card-actions">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => onSelectDestination(destination)}
                  >
                    Details
                  </button>

                  <button
                    type="button"
                    className="btn btn-danger"
                    onClick={() => onRemoveFromTrip(destination.id)}
                    title="Remove from itinerary"
                  >
                    🗑️ Remove
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

export default MyTrip;
