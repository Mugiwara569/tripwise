/**
 * ApiInfoModal.jsx - Educational API Integration Documentation Modal
 * 
 * Provides transparent, educational information about:
 * - Selected places API (Wikimedia Places API & OpenTripMap)
 * - Endpoints and parameters used
 * - Response fields mapped to UI cards
 * - Free-tier limits and attribution
 * - Frontend API key security considerations
 */

import React from 'react';

function ApiInfoModal({ onClose }) {
  return (
    <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div className="modal-container api-info-container" onClick={(e) => e.stopPropagation()}>
        <button
          type="button"
          className="modal-close-btn"
          onClick={onClose}
          aria-label="Close API info"
        >
          ✕
        </button>

        <div className="api-info-content">
          <div className="api-info-header">
            <span className="api-badge">Technical Guide & Architecture</span>
            <h2>External Places API Integration</h2>
            <p>
              TripWise connects to real external APIs to fetch authentic destination imagery,
              descriptions, categories, and coordinates.
            </p>
          </div>

          <div className="api-info-section">
            <h3>1. Why this API was Selected</h3>
            <p>
              We chose the <strong>Wikimedia / Wikipedia Places & Travel API</strong> as our primary
              real external API provider because it offers verified world destinations with authentic
              high-resolution photos, human-curated descriptions, and geographic coordinates.
              Importantly, it is CORS-friendly and requires <em>no private API key</em>, guaranteeing
              that any assessor, reviewer, or learner can run and test this frontend immediately
              without signup barriers or 401 Unauthorized errors.
            </p>
          </div>

          <div className="api-info-section">
            <h3>2. Endpoints & Parameters Used</h3>
            <ul>
              <li>
                <strong>Batch Destinations:</strong>
                <code>https://en.wikipedia.org/w/api.php?action=query&format=json&origin=*&titles=...&prop=pageimages|extracts|coordinates|info&inprop=url&pithumbsize=800&exintro=1&explaintext=1&exchars=280</code>
              </li>
              <li>
                <strong>Dynamic Live Search:</strong>
                <code>https://en.wikipedia.org/w/api.php?action=query&format=json&origin=*&generator=search&gsrsearch=&#123;query&#125;&prop=pageimages|extracts|coordinates|info&inprop=url&pithumbsize=800</code>
              </li>
              <li>
                <strong>Parameters:</strong> <code>origin=*</code> enables CORS in browser fetch;
                <code>pithumbsize=800</code> provides crisp photos; <code>exintro=1&explaintext=1</code> extracts clean plain-text descriptions.
              </li>
            </ul>
          </div>

          <div className="api-info-section">
            <h3>3. Response Fields Mapped to UI</h3>
            <div className="api-table-wrapper">
              <table className="api-table">
                <thead>
                  <tr>
                    <th>API Response Field</th>
                    <th>TripWise UI Field</th>
                    <th>Description</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><code>page.title</code></td>
                    <td>Destination Name</td>
                    <td>Official name displayed on card header</td>
                  </tr>
                  <tr>
                    <td><code>page.thumbnail.source</code></td>
                    <td>Image Banner</td>
                    <td>High-resolution photo with fallback handling</td>
                  </tr>
                  <tr>
                    <td><code>page.extract</code></td>
                    <td>Description / Snippet</td>
                    <td>Truncated on card, full view in details modal</td>
                  </tr>
                  <tr>
                    <td><code>page.coordinates</code></td>
                    <td>Coordinates</td>
                    <td>Latitude and Longitude displayed in details</td>
                  </tr>
                  <tr>
                    <td><code>page.fullurl</code></td>
                    <td>Source Article Link</td>
                    <td>Direct citation link for factual verification</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="api-info-section">
            <h3>4. Frontend API Key Security Limitation</h3>
            <div className="alert-box">
              <p>
                <strong>Important Architecture Concept:</strong> In a purely client-side Single Page Application (SPA)
                like this React + Vite app (with no backend proxy), any API key stored in <code>.env</code>
                (e.g., <code>VITE_API_KEY</code>) is <em>compiled directly into the public JavaScript bundle</em>.
                Any visitor can easily inspect network traffic or view source code to reveal that key.
                Therefore, frontend environment variables provide build-time convenience, not true secret security!
              </p>
            </div>
          </div>

          <div className="api-info-section">
            <h3>5. Free-Tier Limits & Attribution</h3>
            <ul>
              <li><strong>Wikipedia / Wikimedia API:</strong> Open knowledge license (CC BY-SA 3.0/4.0). Completely free for public educational use. Attribution provided on destination modal.</li>
              <li><strong>OpenTripMap:</strong> 5,000 requests/day, 10 req/second under Open Data Commons ODbL.</li>
            </ul>
          </div>

          <div className="api-info-actions">
            <button type="button" className="btn btn-primary" onClick={onClose}>
              Got It, Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ApiInfoModal;
