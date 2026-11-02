# 🌍 SafeTravel — Comprehensive Full-Stack Platform, E2E Testing & Security Assessment

SafeTravel is an intelligent tourist safety and navigation web and mobile platform. It provides real-time GPS tracking, emergency SOS alerts via multi-channel relays (Email & SMS), nearby emergency facilities discovery (Police Stations 👮, Hospitals 🏥, Restaurants 🍽️) via Google Maps Platform Places API, and token-based authentication.

---

## 📑 Repository & Test Suite Navigation

| Module / Scope | Description | Test Cases / Metric | Display Link | Downloadable Excel Report |
| :--- | :--- | :--- | :--- | :--- |
| **🌐 Web Frontend E2E** | Selenium WebDriver automated functionality & UI tests | **300 Test Cases** | [**View Selenium Test Cases**](selenium-tests/README.md) | [selenium-test-cases.xlsx](selenium-tests/selenium-test-cases.xlsx) |
| **📱 Mobile App E2E** | Appium / WebDriverIO mobile touch, biometric & lifecycle tests | **300 Test Cases** | [**View Appium Test Cases**](appium-tests/README.md) | [appium-test-cases.xlsx](appium-tests/appium-test-cases.xlsx) |
| **⚡ Baseline Load Test** | 100 Virtual Users (VUs) for 60s continuous concurrency test | **94–175 RPS / 6087 Req** | [**View Load Test Report**](load-tests/README.md) | [load-test-report.xlsx](load-tests/load-test-report.xlsx) |
| **🛡️ Security Assessment** | SAST, DAST, SCA, API Inventory (15 endpoints), OWASP Top 10 | **8 Findings / Score: 74/100** | [**View Security Review**](Vulnerability%20Test%20Results/security-review.md) | [findings.xlsx](Vulnerability%20Test%20Results/findings.xlsx) |
| **📋 Executive Summary** | High-level risk analysis, score deductions, and remediation | **Executive Overview** | [**View Executive Summary**](Vulnerability%20Test%20Results/executive-summary.md) | [endpoint-inventory.xlsx](Vulnerability%20Test%20Results/endpoint-inventory.xlsx) |
| **📦 Dependency Report** | SBOM and CVE analysis for frontend and backend dependencies | **Supply Chain Audit** | [**View Dependency Report**](Vulnerability%20Test%20Results/dependency-report.md) | Included in findings workbook |

---

## 🌐 1. Selenium Web E2E Test Suite (300 Test Cases)

Located in [`selenium-tests/`](selenium-tests/):
* **Automated Script:** [`selenium-tests/tests/login-tests.js`](selenium-tests/tests/login-tests.js)
* **Detailed Test Case Table:** [**Browse all 300 Web Test Cases (Markdown Table)**](selenium-tests/README.md)
* **Excel Workbook:** [`selenium-tests/selenium-test-cases.xlsx`](selenium-tests/selenium-test-cases.xlsx)

### Test Categories Covered:
1. **Authentication & Token Entry (TC-SEL-001 to TC-SEL-050):** Valid email/password, 6-digit OTP verification, phone authentication, session persistence, logout.
2. **Input Validation & Sanitization (TC-SEL-051 to TC-SEL-095):** Malformed emails, SQL injection strings (`' OR 1=1 --`), script tags (`<script>`), whitespace trimming.
3. **Emergency SOS & Location Tracking (TC-SEL-096 to TC-SEL-150):** Live GPS coordinates, Leaflet/Google map synchronization, emergency trigger activation, broadcast modal.
4. **Interactive Facilities & Filter Discovery (TC-SEL-151 to TC-SEL-210):** Police stations 👮, Hospitals 🏥, Restaurants 🍽️, radius filtering, contact desk dialing.
5. **Safe Route Navigation & Recalculation (TC-SEL-211 to TC-SEL-255):** Waypoint planning, turn-by-turn simulation, hazard zone rerouting.
6. **Cross-Browser & Responsive Layout (TC-SEL-256 to TC-SEL-300):** Chrome, Firefox, Edge, Safari viewports, mobile emulation, touch simulation.

---

## 📱 2. Appium Mobile E2E Test Suite (300 Test Cases)

Located in [`appium-tests/`](appium-tests/):
* **Automated Script:** [`appium-tests/tests/app-login-tests.js`](appium-tests/tests/app-login-tests.js)
* **Appium Driver Config:** [`appium-tests/appium.config.js`](appium-tests/appium.config.js)
* **Detailed Mobile Test Case Table:** [**Browse all 300 Mobile Test Cases (Markdown Table)**](appium-tests/README.md)
* **Excel Workbook:** [`appium-tests/appium-test-cases.xlsx`](appium-tests/appium-test-cases.xlsx)

### Mobile Capabilities Tested:
* **Native Gestures:** Tap, swipe-to-refresh, long-press SOS button, pinch-to-zoom map tiles.
* **Biometric Auth:** TouchID / FaceID / Android BiometricPrompt bypass and authentication fallback.
* **OTP Autofill:** SMS Retriever API simulation and one-time code auto-population.
* **Hardware & Connectivity:** Airplane mode recovery, GPS permission denial handling, background app state resume.

---

## ⚡ 3. Baseline Concurrency Load Test (100 VUs / 60 Seconds)

Located in [`load-tests/`](load-tests/):
* **Execution Script:** [`load-tests/baseline-load-test.js`](load-tests/baseline-load-test.js)
* **Report & Metrics:** [**View Load Test Report**](load-tests/README.md)
* **Excel Report:** [`load-tests/load-test-report.xlsx`](load-tests/load-test-report.xlsx)

### Benchmark Summary:
* **Concurrent Virtual Users:** 100 VUs
* **Duration:** 60 seconds continuous load
* **Total Requests Handled:** 6,087 requests
* **Sustained Throughput:** 94 – 101 requests/second (Peaked at 175 req/sec)
* **Latency Profile:** Min: 0ms | Avg: 1,141ms | 95th Percentile: 5,000ms | Max: 5,000ms
* **Status Breakdown:** 200 OK: 4,863 (79.89%) | 408 Gateway Throttled: 1,224 (20.11%)

---

## 🛡️ 4. Application Security Review (Phases 1–8)

Located in [`Vulnerability Test Results/`](Vulnerability%20Test%20Results/):
* **Full Audit Report:** [`Vulnerability Test Results/security-review.md`](Vulnerability%20Test%20Results/security-review.md)
* **Executive Summary:** [`Vulnerability Test Results/executive-summary.md`](Vulnerability%20Test%20Results/executive-summary.md)
* **Dependency & SBOM Report:** [`Vulnerability Test Results/dependency-report.md`](Vulnerability%20Test%20Results/dependency-report.md)
* **Excel Audit Sheets:** [`Vulnerability Test Results/findings.xlsx`](Vulnerability%20Test%20Results/findings.xlsx) & [`Vulnerability Test Results/endpoint-inventory.xlsx`](Vulnerability%20Test%20Results/endpoint-inventory.xlsx)

```
====================================================
🛡️ OVERALL SECURITY POSTURE SCORE: 74 / 100 (Grade: B)
====================================================
Total Findings: 8 (Critical: 1 | High: 3 | Medium: 3 | Low: 1)
```

### Top Critical Findings:
1. **SEC-001 (Critical):** `server/src/middleware/auth.ts` mock user bypass on missing tokens.
2. **SEC-002 & SEC-003 (High):** Hardcoded API keys in fallback configuration strings.
3. **SEC-004 (High):** Missing rate limiting on `/api/auth/send-otp` and `/api/auth/verify-otp`.

---

## 🚀 5. CI/CD GitHub Actions Pipeline

Located in [`.github/workflows/security-review.yml`](.github/workflows/security-review.yml). Automatically runs on every push and pull request:
1. **`security-audit`**: Runs SAST, dependency vulnerability audit, and generates Excel findings.
2. **`selenium-e2e-testing`**: Validates web frontend E2E suite and packages 300 test cases into downloadable artifact.
3. **`appium-mobile-testing`**: Validates mobile suite and packages 300 test cases into downloadable artifact.
4. **`baseline-load-testing`**: Spins up backend and runs 100 VU continuous concurrency load test.
5. **`aggregate-reports`**: Bundles all 5 Excel workbooks into `SafeTravel-COMPLETE-QA-and-Security-Excel-Suite` and publishes markdown summary to `$GITHUB_STEP_SUMMARY`.

---

## 💻 Quick Start & Running Locally

### Backend Server:
```bash
cd server
npm install
npm run dev
# Running on http://localhost:5000
```

### Frontend Client:
```bash
cd client
npm install
npm run dev
# Running on http://localhost:3000
```

### Running Tests:
```bash
# Selenium Web E2E Tests
cd selenium-tests && npm test

# Appium Mobile Tests
cd appium-tests && npm test

# Baseline Load Test (100 VUs)
node load-tests/baseline-load-test.js
```
