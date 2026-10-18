/**
 * DestinationModal.jsx - Destination Details Modal Component
 * 
 * Displays rich, comprehensive details for a chosen destination:
 * - High-resolution image
 * - Destination name and category badge
 * - Geographic coordinates and country location
 * - Full un-truncated description
 * - Data source attribution link
 * - "Add to My Trip" / "Remove from My Trip" button
 */

import React, { useState, useEffect } from 'react';

function DestinationModal({ destination, onClose, onToggleTrip, isInTrip }) {
  const [imgError, setImgError] = useState(false);

  // Close modal when pressing the Escape key
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === 'Escape') {
        onClose();
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!destination) return null;

  const fallbackImage = 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=800&q=80';

  return (
    <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="modal-title">
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        {/* Close Button */}
        <button
          type="button"
          className="modal-close-btn"
          onClick={onClose}
          aria-label="Close details"
        >
          ✕
        </button>

        {/* Modal Header Media */}
        <div className="modal-image-wrapper">
          <img
            src={imgError || !destination.imageUrl ? fallbackImage : destination.imageUrl}
            alt={destination.name}
            className="modal-image"
            onError={() => setImgError(true)}
          />
          <span className="modal-category-badge">{destination.category}</span>
        </div>

        {/* Modal Body */}
        <div className="modal-body">
          <div className="modal-header-info">
            <h2 id="modal-title" className="modal-title">{destination.name}</h2>
            <div className="modal-meta-row">
              <span className="modal-location">
                <span aria-hidden="true">📍</span> {destination.location}
              </span>
              <span className="modal-coordinates">
                <span aria-hidden="true">🌐</span> {destination.coordinates}
              </span>
            </div>
          </div>

          <div className="modal-section">
            <h4 className="modal-section-title">About this Destination</h4>
            <p className="modal-description">{destination.description}</p>
          </div>

          {/* External Source Link */}
          {destination.sourceUrl && (
            <div className="modal-source-info">
              <span>Source: </span>
              <a
                href={destination.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="modal-source-link"
              >
                Read full article on Wikipedia ↗
              </a>
            </div>
          )}

          {/* Modal Actions */}
          <div className="modal-actions">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
            >
              ← Back to Explore
            </button>

            <button
              type="button"
              className={`btn ${isInTrip ? 'btn-saved' : 'btn-primary'}`}
              onClick={() => onToggleTrip(destination)}
            >
              {isInTrip ? '✓ Remove from Itinerary' : '+ Add to My Trip'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DestinationModal;
