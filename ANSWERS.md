# Technical Assessment Answers

### 1. How to run
**Prerequisites:** Node.js (v18+) and Python 3.9+. 

**Step-by-step instructions:**
1. Clone the repository and navigate into it.
2. **Start the Backend:** 
   Open a terminal, `cd backend`, create a virtual environment (`python -m venv venv`), and activate it (`venv\Scripts\activate` on Windows or `source venv/bin/activate` on Unix). Run `pip install -r requirements.txt`, followed by `uvicorn main:app --reload`.
3. **Start the Frontend:** 
   In a separate terminal in the root directory, install npm packages with `npm install`, then start the client with `npm run dev`. Navigate to `http://localhost:5173` in your browser.

### 2. Stack choice
**Frontend:** I chose React alongside Vite and TypeScript. React is highly modular for small components (like Modals and Toast notifications). Vite drastically reduces build times compared to Create React App, and TypeScript enforces strict typing for `Note` schemas to catch missing properties at compile time. *What would be worse:* Plain vanilla HTML/JS would make managing active state (like the multi-modal popups, live search results, and toast queues) incredibly difficult to structure and prone to bugs.
**Backend:** I selected Python with FastAPI and SQLite. FastAPI provides automatic data validation out of the box using Pydantic, which significantly reduces boilerplate compared to Flask or Express. *What would be worse:* Using a heavy relational database service like PostgreSQL or MongoDB would be overkill for a lightweight notes app, overcomplicating setup with docker images for anyone trying to run the app.

### 3. One real edge case
**Edge Case:** Rapid API firing during searching leading to race conditions.
**Location:** [src/App.tsx](src/App.tsx#L55-L77) (inside `handleSearch`).
**Explanation:** If a user types the word "Python" quickly, the component state changes with every keystroke ('P', 'Py', 'Pyt', etc.). If we fetch the API immediately on every key press, we send a barrage of requests. Because of network latency, the request for "Py" might resolve *after* the request for "Python", overwriting the UI with stale data. 
**Handling:** I implemented a debounce using `setTimeout` to wait 300ms before triggering the API. The `searchTimerRef.current` tracks the timeout ID. If the user presses another key within that 300ms, the previous timer is `clearTimeout`'d and reset. Without this debounce, the UI would flicker rapidly, the backend could get rate-limited, and data race conditions would occur.

### 4. AI usage
- **Tool:** GitHub Copilot / ChatGPT
- **Prompt:** *"How do I debounce a search input in React so it doesn't call my API on every single keystroke?"*
- **What I asked for:** Help implementing a debounce pattern in a React functional component for the search text input.
- **What I changed:** The AI originally suggested importing `lodash.debounce` or creating a complex custom `useDebounce` hook. I chose to implement it inline using a simple `setTimeout` tracked via `useRef`.
- **Why I changed it:** Implementing it directly with `useRef` (as seen in [src/App.tsx](src/App.tsx#L55-L77)) avoided adding another third-party dependency just for one text input, and it kept the search logic tightly coupled to the component state without unnecessary abstractions.

### 5. Honest gap
One thing that simply isn't good enough right now is the search functionality in the repository. Right now, `search_notes` in `routes.py` uses multiple SQL `LIKE '%q%'` queries across the title, content, and tags. This approach is O(n) and forces a full table scan. It also requires the search string to be identical (it wouldn't match "run" if the user searches "running"). 

If I had another day, I would migrate the underlying SQLite schema to utilize a Virtual Table with **FTS5** (Full Text Search). This would yield significantly faster searches via an inverted index, and enable much smarter querying—such as stemming, ranking results by relevance, and doing boolean matches (AND/OR word matching), resolving the scalability and capability issues of the current implementation.