# TripWise — Smart Travel Planner

> A clean, responsive, and beginner-friendly travel planning web application built with **React**, **Vite**, and **Plain CSS**, powered by live destination data from a real external places API.

---

## 📌 1. Project Overview & Selected Track

- **Project Name:** TripWise — Smart Travel Planner
- **Track:** Frontend Development Track (Client-side Single Page Application)
- **Backend / Database:** None (Pure client-side frontend; data persists via browser `localStorage`)
- **Target Audience:** Travelers and vacation planners looking to discover destinations, search landmarks, explore details, and assemble a custom itinerary.

---

## 🛠️ 2. Technologies Used

- **React 19:** Component-based UI library using modern functional components and Hooks (`useState`, `useEffect`, `useMemo`).
- **JavaScript (ES6+):** Pure JavaScript application logic, `async/await`, array manipulation methods (`filter`, `map`, `sort`, `some`).
- **HTML5 & JSX:** Semantic page layout (`<header>`, `<nav>`, `<main>`, `<article>`, `<footer>`).
- **Plain CSS (Vanilla CSS):** Fully custom design system using CSS Variables, Flexbox, CSS Grid, and media queries. No external UI frameworks or complex CSS libraries.
- **Vite:** High-performance, lightweight development server and build tool.
- **Browser `localStorage`:** Client-side persistent storage to preserve user itineraries across browser sessions without a backend database.
- **Real External Places API:** Wikimedia / Wikipedia Places & Travel API (MediaWiki REST & Action API).

---

## 🌐 3. External API Integration Details

### A. Why This API Was Selected
We chose the **Wikimedia / Wikipedia Places & Travel API** as our primary real external API because:
1. **Authentic Live Data:** It provides verified real-world travel destinations with high-resolution imagery, historical/geographic descriptions, and real coordinates.
2. **Zero Barrier & 100% Reliability:** It is public, CORS-enabled (`origin=*`), and requires **no private API key**. This guarantees that any evaluator, teacher, or user running `npm run dev` or accessing a live deployment gets real live data instantly with zero risk of `401 Unauthorized` errors.
3. **Open Knowledge License:** Free for educational and non-commercial usage.

### B. Endpoints & Parameters
- **Curated Batch Endpoint:**
  ```text
  GET https://en.wikipedia.org/w/api.php?action=query&format=json&origin=*&titles={titleList}&prop=pageimages|extracts|coordinates|info&inprop=url&pithumbsize=800&exintro=1&explaintext=1&exchars=280
  ```
- **Dynamic Live Search Endpoint:**
  ```text
  GET https://en.wikipedia.org/w/api.php?action=query&format=json&origin=*&generator=search&gsrsearch={query}+tourist+attraction&gsrlimit=10&prop=pageimages|extracts|coordinates|info&inprop=url&pithumbsize=800&exintro=1&explaintext=1&exchars=240
  ```

### C. Response Fields Mapped to UI
| API Response Field | TripWise UI Field | Usage in Application |
| :--- | :--- | :--- |
| `page.title` | Destination Name | Card title and modal heading |
| `page.thumbnail.source` | Image URL | Destination photo banner with fallback |
| `page.extract` | Description | Truncated snippet on card; full text in modal |
| `page.coordinates[0]` | Coordinates | Latitude & Longitude shown in modal |
| `page.fullurl` | Source Link | Direct attribution link to original article |

### D. Free-Tier Limits & Attribution Requirements
- **License:** Creative Commons Attribution-ShareAlike (CC BY-SA 3.0/4.0).
- **Attribution:** Attribution link and credit provided in the modal and footer.
- **Rate Limits:** Wikimedia allows open educational queries; automated abuse is avoided by caching initial lists and requesting batched titles.

### E. Frontend API Key Security Considerations
> ⚠️ **Important Architecture Notice:**
> In a purely frontend Single Page Application (like React + Vite without a custom backend server), **storing an API key in a `.env` file (e.g. `VITE_API_KEY`) does NOT make it secure or private**.
> 
> During build time, Vite embeds environment variables starting with `VITE_` directly into the generated client-side JavaScript bundle. Anyone inspecting the website through browser Developer Tools (Network tab or Sources tab) can extract that key.
> 
> For true key confidentiality, a backend proxy server (such as Node.js/Express, AWS Lambda, or Firebase Functions) must be used to hold the secret key and forward requests. For this frontend-only assessment, choosing an open CORS-enabled places API guarantees both compliance and zero security exposure.

---

## 📂 4. Project Structure & Code Organization

```text
tripwise/
├── index.html                   # Entry HTML document with SEO meta tags & favicon
├── package.json                 # Project dependencies & build/test scripts
├── vite.config.js               # Vite build configuration
├── test_api.mjs                 # Automated Node.js integration test script for api.js
├── src/
│   ├── main.jsx                 # React root renderer
│   ├── App.jsx                  # Main application container coordinating state & views
│   ├── api.js                   # External API data fetcher, normalizer & search
│   ├── index.css                # Plain CSS design tokens, layouts, and responsive styles
│   └── components/
│       ├── Navbar.jsx           # Top brand navbar, tabs, and saved itinerary badge
│       ├── DestinationCard.jsx  # Reusable card with image, category, and action buttons
│       ├── DestinationModal.jsx # Detailed view modal with coordinates & external link
│       ├── MyTrip.jsx           # Itinerary manager with remove actions & empty state
│       └── ApiInfoModal.jsx     # Educational modal explaining API integration & architecture
```

---

## 🚀 5. How to Run Locally

### Prerequisites
- Node.js (version 18 or newer recommended)
- npm (comes bundled with Node.js)

### Step-by-Step Instructions
1. **Clone or navigate to the project directory:**
   ```bash
   cd tripwise
   ```
2. **Install project dependencies:**
   ```bash
   npm install
   ```
3. **(Optional) Run the automated API verification script:**
   ```bash
   npm run test:api
   ```
   *This directly tests live connectivity to the Wikipedia Places API.*
4. **Start the local development server:**
   ```bash
   npm run dev
   ```
5. **Open your browser and visit:**
   ```text
   http://localhost:5173/
   ```

---

## 📦 6. How to Build & Deploy to Static Hosting

### Build for Production
To create an optimized production build:
```bash
npm run build
```
This generates a static output folder named `dist/` containing all compiled HTML, CSS, and JS.

### Option A: Deploy to Netlify (Recommended - Drag & Drop or CLI)
1. Sign in to [Netlify](https://www.netlify.com/).
2. Drag and drop the `dist/` folder into the Netlify Drop interface, or connect your GitHub repository:
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`
3. Your website will be instantly live with a public URL (e.g., `https://tripwise-planner.netlify.app`).

### Option B: Deploy to Vercel
1. Install Vercel CLI: `npm i -g vercel` or visit [Vercel](https://vercel.com/).
2. Run `vercel` in the project root and follow prompts:
   - Framework preset: `Vite`
   - Build command: `npm run build`
   - Output directory: `dist`

### Option C: Deploy to GitHub Pages
1. Install `gh-pages`: `npm install -D gh-pages`
2. Add `"base": "./"` in `vite.config.js`.
3. Add deploy script to `package.json`: `"deploy": "gh-pages -d dist"`.
4. Run `npm run build && npm run deploy`.

---

## 🐙 7. Instructions to Upload to GitHub

1. **Initialize Git inside the project directory (if not already done):**
   ```bash
   git init
   ```
2. **Add all project files:**
   ```bash
   git add .
   ```
3. **Create the initial commit:**
   ```bash
   git commit -m "Initial commit: TripWise Smart Travel Planner"
   ```
4. **Create a new public repository on GitHub** (e.g., `tripwise-travel-planner`).
5. **Link your local repository to GitHub and push:**
   ```bash
   git branch -M main
   git remote add origin https://github.com/<YOUR_USERNAME>/tripwise-travel-planner.git
   git push -u origin main
   ```

---

## 📸 8. Screenshots Checklist to Capture

Before submitting, take and save the following screenshots into a `screenshots/` folder:
- [ ] **1. Explore Destinations:** Main catalog showing the hero header, search/filter controls, and destination cards.
- [ ] **2. Search or Filter Results:** Destination grid filtered by a category (e.g., "Nature & Parks") or filtered by search query (e.g., "Eiffel").
- [ ] **3. Destination Details:** The modal view showing full descriptions, coordinates, category badge, and the "Add to My Trip" button.
- [ ] **4. My Trip with Saved Destinations:** The itinerary page displaying multiple saved destinations and the counter badge.
- [ ] **5. Empty My Trip State:** The itinerary page with 0 places, displaying the illustration, message, and "Explore Destinations" button.
- [ ] **6. Mobile Layout:** The application viewed on a mobile device or responsive simulator (e.g., Chrome DevTools at 375px width).

---

## ✅ 9. Final Assessment Requirements Checklist

| Requirement | Implementation Details | Status |
| :--- | :--- | :---: |
| **Real External API** | Uses Wikimedia Places & Travel API via `fetch()` and `async/await` | Completed |
| **No Mock/Fake API** | Real destination images, titles, descriptions, coordinates retrieved live | Completed |
| **Explore View** | Navbar, hero, search bar, category pills, sort dropdown, cards grid | Completed |
| **Destination Cards** | Displays image, name, location, category, description snippet, buttons | Completed |
| **Details Modal** | Full description, coordinates, category, high-res photo, Wikipedia link | Completed |
| **My Trip View** | Dedicated itinerary view, item cards, remove buttons, trip counter | Completed |
| **Duplicate Prevention** | `handleToggleTrip` checks existing item IDs before adding | Completed |
| **localStorage Persistence** | Itinerary loaded on start and updated automatically via `useEffect` | Completed |
| **Search Functionality** | Real-time name/location matching + option to query live API | Completed |
| **Category Filter** | Dynamic categories extracted directly from retrieved data | Completed |
| **Alphabetical Sorting** | A → Z and Z → A sorting working together with search & filters | Completed |
| **Loading State** | Animated spinner with friendly status message | Completed |
| **Error Handling** | Network error notice with "Try Again" retry button | Completed |
| **Empty Search State** | Clear feedback when search has no matches + reset button | Completed |
| **Empty Itinerary State** | Helpful guide and "Explore Destinations" CTA button | Completed |
| **Plain CSS Styling** | Custom travel theme without Tailwind or component UI libraries | Completed |
| **Responsive Design** | Fluid layouts & media queries for mobile, tablet, and desktop | Completed |
| **Beginner-Friendly Code**| Clean structure, descriptive names, and detailed explanatory comments | Completed |

---

## 💡 10. Known Limitations

1. **Client-Side API Key Exposure:** As explained in the architecture guide, client-side SPAs cannot securely hide API keys. By using an open CORS-enabled Wikipedia Places endpoint, we eliminated the need to expose private secrets.
2. **Offline Mode:** If internet access is completely disconnected, new live searches or destination loads will show the built-in Error State with a "Try Again" button.
