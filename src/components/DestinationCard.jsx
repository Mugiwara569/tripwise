/**
 * DestinationCard.jsx - Destination Card Component
 * 
 * Renders an individual travel destination card with its image,
 * title, category badge, location, summary snippet, and action buttons.
 */

import React, { useState } from 'react';

function DestinationCard({ destination, onSelect, onToggleTrip, isInTrip }) {
  // Local state to handle image loading failures gracefully
  const [imgError, setImgError] = useState(false);

  // Fallback image in case the API thumbnail is broken or missing
  const fallbackImage = 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=800&q=80';

  return (
    <article className="destination-card">
      {/* Destination Image Banner */}
      <div className="card-image-wrapper">
        <img
          src={imgError || !destination.imageUrl ? fallbackImage : destination.imageUrl}
          alt={destination.name}
          className="card-image"
          onError={() => setImgError(true)}
          loading="lazy"
        />
        <span className="card-category-badge">{destination.category}</span>
      </div>

      {/* Card Content Area */}
      <div className="card-content">
        <div className="card-header">
          <h3 className="card-title">{destination.name}</h3>
          <span className="card-location">
            <span className="location-icon" aria-hidden="true">📍</span>
            {destination.location}
          </span>
        </div>

        <p className="card-description">
          {destination.description.length > 130
            ? `${destination.description.substring(0, 130)}...`
            : destination.description}
        </p>

        {/* Card Action Buttons */}
        <div className="card-actions">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => onSelect(destination)}
          >
            View Details
          </button>

          <button
            type="button"
            className={`btn ${isInTrip ? 'btn-saved' : 'btn-primary'}`}
            onClick={() => onToggleTrip(destination)}
            title={isInTrip ? 'Remove from My Trip' : 'Add to My Trip'}
          >
            {isInTrip ? '✓ In Itinerary' : '+ Add to Trip'}
          </button>
        </div>
      </div>
    </article>
  );
}

export default DestinationCard;
