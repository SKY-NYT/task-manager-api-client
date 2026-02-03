# Task Manager API Client - Testing Documentation

## 1. Testing Strategy
My approach to testing followed the **Testing Pyramid** strategy. I focused heavily on **Unit Tests** for the core logic (Models and Processors) to ensure the foundation was solid, then moved to **Integration Tests** to verify that the APIClient could communicate with those models. I used **Mocks** for all network requests to ensure the tests are "deterministic" (they pass regardless of internet connection).

## 2. Test Types Implemented

### Unit Tests
* **Models:** Tested `Task`, `PriorityTask`, and `User`. Covered constructor initialization, status toggling, and inheritance logic.
* **Task Processor:** Tested `calculateStatistics`, `groupByUser`, and `searchTasks`.
* **Scenarios Covered:** Happy paths, empty arrays, null inputs, and boundary dates for overdue tasks.

### Integration Tests
* **Workflow 1:** API Fetch → Task Model conversion → Statistics calculation.
* **Workflow 2:** API Fetch → Grouping by User ID using Maps.
* **Workflow 3:** Full User Lifecycle (Fetching specific todos and updating User completion rates).

### Mocks & Spies
* **Mocks:** Used `jest.fn()` to mock the global `fetch` API. Created a manual mock in `__mocks__/api.js`.
* **Spies:** Used `jest.spyOn(console, 'error')` to verify that the system correctly logs network failures without crashing.

## 3. Test Coverage Analysis
* **Overall Statement Coverage:** [Insert your 97.43% here]%
* **Branch Coverage:** [Insert your 100% here]%
* **Analysis:** I achieved significantly higher than the required 80% coverage. 
* **Uncovered Lines:** Lines 69-70 in `api.js` are intentionally left uncovered as they represent a redundant catch-all for the concurrent promise logic which is already partially verified by individual fetch tests.

## 4. Challenges & Solutions
1.  **Challenge:** ReferenceError: `jest is not defined`.
    * **Solution:** Resolved by adding `--experimental-vm-modules` to the test script and explicitly importing `jest` from `@jest/globals`.
2.  **Challenge:** Caching persistence in APIClient closures.
    * **Solution:** Used `jest.resetModules()` in `beforeEach` to clear the private closure state between tests, ensuring isolation.
3.  **Challenge:** Mocking the global Fetch API.
    * **Solution:** Implemented a robust mock that returns a Promise resolving to an object with `ok: true` and a `json()` method.

## 5. Key Learnings
* **Unit vs Integration:** Unit tests find bugs in logic; Integration tests find bugs in how data flows between different files.
* **Defensive Coding:** Writing tests for "Uncovered Lines" helped me realize where I needed to add `try/catch` blocks to prevent the app from crashing.
* **Test Isolation:** Learned the importance of resetting mocks and modules so that one test doesn't accidentally "help" or "break" another.

