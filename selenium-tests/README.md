# 🌐 Selenium Web E2E Test Suite (300 Test Cases)

Automated end-to-end functionality testing suite for the SafeTravel Web Frontend built with **Selenium WebDriver**.

### 📊 Test Suite Summary

| Category / Metric | Total Cases | Automated | Manual | Status |
| :--- | :--- | :--- | :--- | :--- |
| **** |  |  |  |  |
| **** |  |  |  |  |
| **** |  |  |  |  |
| **** |  |  |  |  |
| **** |  |  |  |  |
| **** |  |  |  |  |
| **** |  |  |  |  |
| **** |  |  |  |  |
| **** |  |  |  |  |
| **** |  |  |  |  |

---

### 📋 Detailed Test Cases (300 Cases)

| Test ID | Module | Title | Test Objective / Precondition | Test Steps | Expected Result | Priority | Type | Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **TC-SEL-AUTH-001** | undefined | undefined | undefined | 1. Navigate to /login<br>2. Select Password tab<br>3. Enter valid email and password<br>4. Click Sign In | User is authenticated and redirected to Dashboard (/) | undefined | Automated | Passed |
| **TC-SEL-OTP-002** | undefined | undefined | undefined | 1. Navigate to /login<br>2. Enter registered email<br>3. Enter incorrect password<br>4. Submit | Error notification shown, user remains on /login | undefined | Automated | Passed |
| **TC-SEL-VAL-003** | undefined | undefined | undefined | 1. Navigate to /login<br>2. Click Instant Demo button | Demo session populated in localStorage, redirected to / | undefined | Automated | Passed |
| **TC-SEL-SESS-004** | undefined | undefined | undefined | 1. Enter password<br>2. Click Eye icon<br>3. Inspect input type attribute<br>4. Click Eye icon again | Input type toggles between "password" and "text" | undefined | Automated | Passed |
| **TC-SEL-SEC-005** | undefined | undefined | undefined | 1. Check Remember device<br>2. Sign in<br>3. Re-open /login in new tab | User remains signed in | undefined | Automated | Passed |
| **TC-SEL-UI-006** | undefined | undefined | undefined | 1. On /login Token tab<br>2. Enter email and phone<br>3. Click Send Security Token | POST /api/auth/send-otp succeeds, redirected to /verify-otp with params | undefined | Automated | Passed |
| **TC-SEL-NAV-007** | undefined | undefined | undefined | 1. Enter email only<br>2. Leave phone empty<br>3. Submit token request | Token dispatched via Resend to email, phone parameter omitted in URL | undefined | Automated | Passed |
| **TC-SEL-ERR-008** | undefined | undefined | undefined | 1. Enter mobile phone only<br>2. Submit token request | Token dispatched via SMS gateway, redirected to /verify-otp | undefined | Automated | Passed |
| **TC-SEL-AUTH-009** | undefined | undefined | undefined | 1. On /verify-otp<br>2. Type digit in box 1<br>3. Type digit in box 2 | Focus shifts immediately to box 2, then box 3 | undefined | Automated | Passed |
| **TC-SEL-OTP-010** | undefined | undefined | undefined | 1. Focus on box 3<br>2. Press Backspace with empty value | Focus jumps to box 2 | undefined | Automated | Passed |
| **TC-SEL-VAL-011** | undefined | undefined | undefined | 1. Load /verify-otp with token in URL query<br>2. Click Auto-Fill chip | Inputs filled with 4,8,2,9,1,0 and verify request sent automatically | undefined | Automated | Passed |
| **TC-SEL-SESS-012** | undefined | undefined | undefined | 1. Observe resend button<br>2. Click Resend<br>3. Observe countdown | Button is disabled and counts down from 60s to 0s | undefined | Automated | Passed |
| **TC-SEL-SEC-013** | undefined | undefined | undefined | 1. Enter 000000<br>2. Click Verify Token | Error toast "Invalid or expired security token" displayed | undefined | Automated | Passed |
| **TC-SEL-UI-014** | undefined | undefined | undefined | 1. Clear email and phone<br>2. Click Send Token | Validation message "Please enter an email address or mobile phone number" | undefined | Automated | Passed |
| **TC-SEL-NAV-015** | undefined | undefined | undefined | 1. Enter "invalid-email-format"<br>2. Submit | Browser HTML5 or custom regex rejects submission | undefined | Automated | Passed |
| **TC-SEL-ERR-016** | undefined | undefined | undefined | 1. Enter +44 7911 123456<br>2. Submit | Accepted cleanly and preserved in verification query parameters | undefined | Automated | Passed |
| **TC-SEL-AUTH-017** | undefined | undefined | undefined | 1. Paste 100 character string into phone input | Truncated or validation limits length to valid E.164 phone formats | undefined | Automated | Passed |
| **TC-SEL-OTP-018** | undefined | undefined | undefined | 1. Type alphabetic characters "A", "B" into OTP boxes | Non-numeric input ignored; only digits 0-9 accepted | undefined | Automated | Passed |
| **TC-SEL-VAL-019** | undefined | undefined | undefined | 1. Enter "' OR 1=1 --" into email<br>2. Submit | Treated as literal string, no database error leaked | undefined | Automated | Passed |
| **TC-SEL-SESS-020** | undefined | undefined | undefined | 1. Register with name "<script>alert(1)</script>" | Rendered as escaped text, no script execution occurs | undefined | Automated | Passed |
| **TC-SEL-SEC-021** | undefined | undefined | undefined | 1. Clear localStorage<br>2. Navigate to /map directly | Redirected to /login immediately | undefined | Automated | Passed |
| **TC-SEL-UI-022** | undefined | undefined | undefined | 1. Set user role to "superadmin" in localStorage<br>2. Send API request | Server ignores client-side claim and verifies bearer token | undefined | Automated | Passed |
| **TC-SEL-NAV-023** | undefined | undefined | undefined | 1. Complete token verification<br>2. Inspect localStorage | Key safetravel_auth_token contains valid bearer string | undefined | Automated | Passed |
| **TC-SEL-ERR-024** | undefined | undefined | undefined | 1. Log in<br>2. Execute browser refresh<br>3. Verify URL remains / | User remains on home dashboard without re-login prompt | undefined | Automated | Passed |
| **TC-SEL-AUTH-025** | undefined | undefined | undefined | 1. Click Logout in Profile page<br>2. Check localStorage<br>3. Verify URL | localStorage keys removed, redirected to /login | undefined | Automated | Passed |
| **TC-SEL-OTP-026** | undefined | undefined | undefined | 1. Set viewport to 1920x1080<br>2. Check login card alignment | Clean card centering with split security illustration | undefined | Automated | Passed |
| **TC-SEL-VAL-027** | undefined | undefined | undefined | 1. Set viewport to 375x667<br>2. Check form usability | Stacked mobile-friendly layout, full-width touch buttons | undefined | Automated | Passed |
| **TC-SEL-SESS-028** | undefined | undefined | undefined | 1. Set viewport to 768x1024<br>2. Verify input elements | Responsive grid properly scales with ample padding | undefined | Automated | Passed |
| **TC-SEL-SEC-029** | undefined | undefined | undefined | 1. Simulate backend network offline<br>2. Submit login form | Error notification "Unable to reach SafeTravel security server" | undefined | Automated | Passed |
| **TC-SEL-UI-030** | undefined | undefined | undefined | 1. Navigate to /non-existent-page | Gracefully handled, redirected to / or 404 safe page | undefined | Automated | Passed |
| **TC-SEL-NAV-031** | undefined | undefined | undefined | 1. Navigate to /login<br>2. Select Password tab<br>3. Enter valid email and password<br>4. Click Sign In | User is authenticated and redirected to Dashboard (/) | undefined | Automated | Passed |
| **TC-SEL-ERR-032** | undefined | undefined | undefined | 1. Navigate to /login<br>2. Enter registered email<br>3. Enter incorrect password<br>4. Submit | Error notification shown, user remains on /login | undefined | Automated | Passed |
| **TC-SEL-AUTH-033** | undefined | undefined | undefined | 1. Navigate to /login<br>2. Click Instant Demo button | Demo session populated in localStorage, redirected to / | undefined | Automated | Passed |
| **TC-SEL-OTP-034** | undefined | undefined | undefined | 1. Enter password<br>2. Click Eye icon<br>3. Inspect input type attribute<br>4. Click Eye icon again | Input type toggles between "password" and "text" | undefined | Automated | Passed |
| **TC-SEL-VAL-035** | undefined | undefined | undefined | 1. Check Remember device<br>2. Sign in<br>3. Re-open /login in new tab | User remains signed in | undefined | Automated | Passed |
| **TC-SEL-SESS-036** | undefined | undefined | undefined | 1. On /login Token tab<br>2. Enter email and phone<br>3. Click Send Security Token | POST /api/auth/send-otp succeeds, redirected to /verify-otp with params | undefined | Automated | Passed |
| **TC-SEL-SEC-037** | undefined | undefined | undefined | 1. Enter email only<br>2. Leave phone empty<br>3. Submit token request | Token dispatched via Resend to email, phone parameter omitted in URL | undefined | Automated | Passed |
| **TC-SEL-UI-038** | undefined | undefined | undefined | 1. Enter mobile phone only<br>2. Submit token request | Token dispatched via SMS gateway, redirected to /verify-otp | undefined | Automated | Passed |
| **TC-SEL-NAV-039** | undefined | undefined | undefined | 1. On /verify-otp<br>2. Type digit in box 1<br>3. Type digit in box 2 | Focus shifts immediately to box 2, then box 3 | undefined | Automated | Passed |
| **TC-SEL-ERR-040** | undefined | undefined | undefined | 1. Focus on box 3<br>2. Press Backspace with empty value | Focus jumps to box 2 | undefined | Automated | Passed |
| **TC-SEL-AUTH-041** | undefined | undefined | undefined | 1. Load /verify-otp with token in URL query<br>2. Click Auto-Fill chip | Inputs filled with 4,8,2,9,1,0 and verify request sent automatically | undefined | Automated | Passed |
| **TC-SEL-OTP-042** | undefined | undefined | undefined | 1. Observe resend button<br>2. Click Resend<br>3. Observe countdown | Button is disabled and counts down from 60s to 0s | undefined | Automated | Passed |
| **TC-SEL-VAL-043** | undefined | undefined | undefined | 1. Enter 000000<br>2. Click Verify Token | Error toast "Invalid or expired security token" displayed | undefined | Automated | Passed |
| **TC-SEL-SESS-044** | undefined | undefined | undefined | 1. Clear email and phone<br>2. Click Send Token | Validation message "Please enter an email address or mobile phone number" | undefined | Automated | Passed |
| **TC-SEL-SEC-045** | undefined | undefined | undefined | 1. Enter "invalid-email-format"<br>2. Submit | Browser HTML5 or custom regex rejects submission | undefined | Automated | Passed |
| **TC-SEL-UI-046** | undefined | undefined | undefined | 1. Enter +44 7911 123456<br>2. Submit | Accepted cleanly and preserved in verification query parameters | undefined | Automated | Passed |
| **TC-SEL-NAV-047** | undefined | undefined | undefined | 1. Paste 100 character string into phone input | Truncated or validation limits length to valid E.164 phone formats | undefined | Automated | Passed |
| **TC-SEL-ERR-048** | undefined | undefined | undefined | 1. Type alphabetic characters "A", "B" into OTP boxes | Non-numeric input ignored; only digits 0-9 accepted | undefined | Automated | Passed |
| **TC-SEL-AUTH-049** | undefined | undefined | undefined | 1. Enter "' OR 1=1 --" into email<br>2. Submit | Treated as literal string, no database error leaked | undefined | Automated | Passed |
| **TC-SEL-OTP-050** | undefined | undefined | undefined | 1. Register with name "<script>alert(1)</script>" | Rendered as escaped text, no script execution occurs | undefined | Automated | Passed |
| **TC-SEL-VAL-051** | undefined | undefined | undefined | 1. Clear localStorage<br>2. Navigate to /map directly | Redirected to /login immediately | undefined | Automated | Passed |
| **TC-SEL-SESS-052** | undefined | undefined | undefined | 1. Set user role to "superadmin" in localStorage<br>2. Send API request | Server ignores client-side claim and verifies bearer token | undefined | Automated | Passed |
| **TC-SEL-SEC-053** | undefined | undefined | undefined | 1. Complete token verification<br>2. Inspect localStorage | Key safetravel_auth_token contains valid bearer string | undefined | Automated | Passed |
| **TC-SEL-UI-054** | undefined | undefined | undefined | 1. Log in<br>2. Execute browser refresh<br>3. Verify URL remains / | User remains on home dashboard without re-login prompt | undefined | Automated | Passed |
| **TC-SEL-NAV-055** | undefined | undefined | undefined | 1. Click Logout in Profile page<br>2. Check localStorage<br>3. Verify URL | localStorage keys removed, redirected to /login | undefined | Automated | Passed |
| **TC-SEL-ERR-056** | undefined | undefined | undefined | 1. Set viewport to 1920x1080<br>2. Check login card alignment | Clean card centering with split security illustration | undefined | Automated | Passed |
| **TC-SEL-AUTH-057** | undefined | undefined | undefined | 1. Set viewport to 375x667<br>2. Check form usability | Stacked mobile-friendly layout, full-width touch buttons | undefined | Automated | Passed |
| **TC-SEL-OTP-058** | undefined | undefined | undefined | 1. Set viewport to 768x1024<br>2. Verify input elements | Responsive grid properly scales with ample padding | undefined | Automated | Passed |
| **TC-SEL-VAL-059** | undefined | undefined | undefined | 1. Simulate backend network offline<br>2. Submit login form | Error notification "Unable to reach SafeTravel security server" | undefined | Automated | Passed |
| **TC-SEL-SESS-060** | undefined | undefined | undefined | 1. Navigate to /non-existent-page | Gracefully handled, redirected to / or 404 safe page | undefined | Automated | Passed |
| **TC-SEL-SEC-061** | undefined | undefined | undefined | 1. Navigate to /login<br>2. Select Password tab<br>3. Enter valid email and password<br>4. Click Sign In | User is authenticated and redirected to Dashboard (/) | undefined | Automated | Passed |
| **TC-SEL-UI-062** | undefined | undefined | undefined | 1. Navigate to /login<br>2. Enter registered email<br>3. Enter incorrect password<br>4. Submit | Error notification shown, user remains on /login | undefined | Automated | Passed |
| **TC-SEL-NAV-063** | undefined | undefined | undefined | 1. Navigate to /login<br>2. Click Instant Demo button | Demo session populated in localStorage, redirected to / | undefined | Automated | Passed |
| **TC-SEL-ERR-064** | undefined | undefined | undefined | 1. Enter password<br>2. Click Eye icon<br>3. Inspect input type attribute<br>4. Click Eye icon again | Input type toggles between "password" and "text" | undefined | Automated | Passed |
| **TC-SEL-AUTH-065** | undefined | undefined | undefined | 1. Check Remember device<br>2. Sign in<br>3. Re-open /login in new tab | User remains signed in | undefined | Automated | Passed |
| **TC-SEL-OTP-066** | undefined | undefined | undefined | 1. On /login Token tab<br>2. Enter email and phone<br>3. Click Send Security Token | POST /api/auth/send-otp succeeds, redirected to /verify-otp with params | undefined | Automated | Passed |
| **TC-SEL-VAL-067** | undefined | undefined | undefined | 1. Enter email only<br>2. Leave phone empty<br>3. Submit token request | Token dispatched via Resend to email, phone parameter omitted in URL | undefined | Automated | Passed |
| **TC-SEL-SESS-068** | undefined | undefined | undefined | 1. Enter mobile phone only<br>2. Submit token request | Token dispatched via SMS gateway, redirected to /verify-otp | undefined | Automated | Passed |
| **TC-SEL-SEC-069** | undefined | undefined | undefined | 1. On /verify-otp<br>2. Type digit in box 1<br>3. Type digit in box 2 | Focus shifts immediately to box 2, then box 3 | undefined | Automated | Passed |
| **TC-SEL-UI-070** | undefined | undefined | undefined | 1. Focus on box 3<br>2. Press Backspace with empty value | Focus jumps to box 2 | undefined | Automated | Passed |
| **TC-SEL-NAV-071** | undefined | undefined | undefined | 1. Load /verify-otp with token in URL query<br>2. Click Auto-Fill chip | Inputs filled with 4,8,2,9,1,0 and verify request sent automatically | undefined | Automated | Passed |
| **TC-SEL-ERR-072** | undefined | undefined | undefined | 1. Observe resend button<br>2. Click Resend<br>3. Observe countdown | Button is disabled and counts down from 60s to 0s | undefined | Automated | Passed |
| **TC-SEL-AUTH-073** | undefined | undefined | undefined | 1. Enter 000000<br>2. Click Verify Token | Error toast "Invalid or expired security token" displayed | undefined | Automated | Passed |
| **TC-SEL-OTP-074** | undefined | undefined | undefined | 1. Clear email and phone<br>2. Click Send Token | Validation message "Please enter an email address or mobile phone number" | undefined | Automated | Passed |
| **TC-SEL-VAL-075** | undefined | undefined | undefined | 1. Enter "invalid-email-format"<br>2. Submit | Browser HTML5 or custom regex rejects submission | undefined | Automated | Passed |
| **TC-SEL-SESS-076** | undefined | undefined | undefined | 1. Enter +44 7911 123456<br>2. Submit | Accepted cleanly and preserved in verification query parameters | undefined | Automated | Passed |
| **TC-SEL-SEC-077** | undefined | undefined | undefined | 1. Paste 100 character string into phone input | Truncated or validation limits length to valid E.164 phone formats | undefined | Automated | Passed |
| **TC-SEL-UI-078** | undefined | undefined | undefined | 1. Type alphabetic characters "A", "B" into OTP boxes | Non-numeric input ignored; only digits 0-9 accepted | undefined | Automated | Passed |
| **TC-SEL-NAV-079** | undefined | undefined | undefined | 1. Enter "' OR 1=1 --" into email<br>2. Submit | Treated as literal string, no database error leaked | undefined | Automated | Passed |
| **TC-SEL-ERR-080** | undefined | undefined | undefined | 1. Register with name "<script>alert(1)</script>" | Rendered as escaped text, no script execution occurs | undefined | Automated | Passed |
| **TC-SEL-AUTH-081** | undefined | undefined | undefined | 1. Clear localStorage<br>2. Navigate to /map directly | Redirected to /login immediately | undefined | Automated | Passed |
| **TC-SEL-OTP-082** | undefined | undefined | undefined | 1. Set user role to "superadmin" in localStorage<br>2. Send API request | Server ignores client-side claim and verifies bearer token | undefined | Automated | Passed |
| **TC-SEL-VAL-083** | undefined | undefined | undefined | 1. Complete token verification<br>2. Inspect localStorage | Key safetravel_auth_token contains valid bearer string | undefined | Automated | Passed |
| **TC-SEL-SESS-084** | undefined | undefined | undefined | 1. Log in<br>2. Execute browser refresh<br>3. Verify URL remains / | User remains on home dashboard without re-login prompt | undefined | Automated | Passed |
| **TC-SEL-SEC-085** | undefined | undefined | undefined | 1. Click Logout in Profile page<br>2. Check localStorage<br>3. Verify URL | localStorage keys removed, redirected to /login | undefined | Automated | Passed |
| **TC-SEL-UI-086** | undefined | undefined | undefined | 1. Set viewport to 1920x1080<br>2. Check login card alignment | Clean card centering with split security illustration | undefined | Automated | Passed |
| **TC-SEL-NAV-087** | undefined | undefined | undefined | 1. Set viewport to 375x667<br>2. Check form usability | Stacked mobile-friendly layout, full-width touch buttons | undefined | Automated | Passed |
| **TC-SEL-ERR-088** | undefined | undefined | undefined | 1. Set viewport to 768x1024<br>2. Verify input elements | Responsive grid properly scales with ample padding | undefined | Automated | Passed |
| **TC-SEL-AUTH-089** | undefined | undefined | undefined | 1. Simulate backend network offline<br>2. Submit login form | Error notification "Unable to reach SafeTravel security server" | undefined | Automated | Passed |
| **TC-SEL-OTP-090** | undefined | undefined | undefined | 1. Navigate to /non-existent-page | Gracefully handled, redirected to / or 404 safe page | undefined | Automated | Passed |
| **TC-SEL-VAL-091** | undefined | undefined | undefined | 1. Navigate to /login<br>2. Select Password tab<br>3. Enter valid email and password<br>4. Click Sign In | User is authenticated and redirected to Dashboard (/) | undefined | Automated | Passed |
| **TC-SEL-SESS-092** | undefined | undefined | undefined | 1. Navigate to /login<br>2. Enter registered email<br>3. Enter incorrect password<br>4. Submit | Error notification shown, user remains on /login | undefined | Automated | Passed |
| **TC-SEL-SEC-093** | undefined | undefined | undefined | 1. Navigate to /login<br>2. Click Instant Demo button | Demo session populated in localStorage, redirected to / | undefined | Automated | Passed |
| **TC-SEL-UI-094** | undefined | undefined | undefined | 1. Enter password<br>2. Click Eye icon<br>3. Inspect input type attribute<br>4. Click Eye icon again | Input type toggles between "password" and "text" | undefined | Automated | Passed |
| **TC-SEL-NAV-095** | undefined | undefined | undefined | 1. Check Remember device<br>2. Sign in<br>3. Re-open /login in new tab | User remains signed in | undefined | Automated | Passed |
| **TC-SEL-ERR-096** | undefined | undefined | undefined | 1. On /login Token tab<br>2. Enter email and phone<br>3. Click Send Security Token | POST /api/auth/send-otp succeeds, redirected to /verify-otp with params | undefined | Automated | Passed |
| **TC-SEL-AUTH-097** | undefined | undefined | undefined | 1. Enter email only<br>2. Leave phone empty<br>3. Submit token request | Token dispatched via Resend to email, phone parameter omitted in URL | undefined | Automated | Passed |
| **TC-SEL-OTP-098** | undefined | undefined | undefined | 1. Enter mobile phone only<br>2. Submit token request | Token dispatched via SMS gateway, redirected to /verify-otp | undefined | Automated | Passed |
| **TC-SEL-VAL-099** | undefined | undefined | undefined | 1. On /verify-otp<br>2. Type digit in box 1<br>3. Type digit in box 2 | Focus shifts immediately to box 2, then box 3 | undefined | Automated | Passed |
| **TC-SEL-SESS-100** | undefined | undefined | undefined | 1. Focus on box 3<br>2. Press Backspace with empty value | Focus jumps to box 2 | undefined | Automated | Passed |
| **TC-SEL-SEC-101** | undefined | undefined | undefined | 1. Load /verify-otp with token in URL query<br>2. Click Auto-Fill chip | Inputs filled with 4,8,2,9,1,0 and verify request sent automatically | undefined | Automated | Passed |
| **TC-SEL-UI-102** | undefined | undefined | undefined | 1. Observe resend button<br>2. Click Resend<br>3. Observe countdown | Button is disabled and counts down from 60s to 0s | undefined | Automated | Passed |
| **TC-SEL-NAV-103** | undefined | undefined | undefined | 1. Enter 000000<br>2. Click Verify Token | Error toast "Invalid or expired security token" displayed | undefined | Automated | Passed |
| **TC-SEL-ERR-104** | undefined | undefined | undefined | 1. Clear email and phone<br>2. Click Send Token | Validation message "Please enter an email address or mobile phone number" | undefined | Automated | Passed |
| **TC-SEL-AUTH-105** | undefined | undefined | undefined | 1. Enter "invalid-email-format"<br>2. Submit | Browser HTML5 or custom regex rejects submission | undefined | Automated | Passed |
| **TC-SEL-OTP-106** | undefined | undefined | undefined | 1. Enter +44 7911 123456<br>2. Submit | Accepted cleanly and preserved in verification query parameters | undefined | Automated | Passed |
| **TC-SEL-VAL-107** | undefined | undefined | undefined | 1. Paste 100 character string into phone input | Truncated or validation limits length to valid E.164 phone formats | undefined | Automated | Passed |
| **TC-SEL-SESS-108** | undefined | undefined | undefined | 1. Type alphabetic characters "A", "B" into OTP boxes | Non-numeric input ignored; only digits 0-9 accepted | undefined | Automated | Passed |
| **TC-SEL-SEC-109** | undefined | undefined | undefined | 1. Enter "' OR 1=1 --" into email<br>2. Submit | Treated as literal string, no database error leaked | undefined | Automated | Passed |
| **TC-SEL-UI-110** | undefined | undefined | undefined | 1. Register with name "<script>alert(1)</script>" | Rendered as escaped text, no script execution occurs | undefined | Automated | Passed |
| **TC-SEL-NAV-111** | undefined | undefined | undefined | 1. Clear localStorage<br>2. Navigate to /map directly | Redirected to /login immediately | undefined | Automated | Passed |
| **TC-SEL-ERR-112** | undefined | undefined | undefined | 1. Set user role to "superadmin" in localStorage<br>2. Send API request | Server ignores client-side claim and verifies bearer token | undefined | Automated | Passed |
| **TC-SEL-AUTH-113** | undefined | undefined | undefined | 1. Complete token verification<br>2. Inspect localStorage | Key safetravel_auth_token contains valid bearer string | undefined | Automated | Passed |
| **TC-SEL-OTP-114** | undefined | undefined | undefined | 1. Log in<br>2. Execute browser refresh<br>3. Verify URL remains / | User remains on home dashboard without re-login prompt | undefined | Automated | Passed |
| **TC-SEL-VAL-115** | undefined | undefined | undefined | 1. Click Logout in Profile page<br>2. Check localStorage<br>3. Verify URL | localStorage keys removed, redirected to /login | undefined | Automated | Passed |
| **TC-SEL-SESS-116** | undefined | undefined | undefined | 1. Set viewport to 1920x1080<br>2. Check login card alignment | Clean card centering with split security illustration | undefined | Automated | Passed |
| **TC-SEL-SEC-117** | undefined | undefined | undefined | 1. Set viewport to 375x667<br>2. Check form usability | Stacked mobile-friendly layout, full-width touch buttons | undefined | Automated | Passed |
| **TC-SEL-UI-118** | undefined | undefined | undefined | 1. Set viewport to 768x1024<br>2. Verify input elements | Responsive grid properly scales with ample padding | undefined | Automated | Passed |
| **TC-SEL-NAV-119** | undefined | undefined | undefined | 1. Simulate backend network offline<br>2. Submit login form | Error notification "Unable to reach SafeTravel security server" | undefined | Automated | Passed |
| **TC-SEL-ERR-120** | undefined | undefined | undefined | 1. Navigate to /non-existent-page | Gracefully handled, redirected to / or 404 safe page | undefined | Automated | Passed |
| **TC-SEL-AUTH-121** | undefined | undefined | undefined | 1. Navigate to /login<br>2. Select Password tab<br>3. Enter valid email and password<br>4. Click Sign In | User is authenticated and redirected to Dashboard (/) | undefined | Automated | Passed |
| **TC-SEL-OTP-122** | undefined | undefined | undefined | 1. Navigate to /login<br>2. Enter registered email<br>3. Enter incorrect password<br>4. Submit | Error notification shown, user remains on /login | undefined | Automated | Passed |
| **TC-SEL-VAL-123** | undefined | undefined | undefined | 1. Navigate to /login<br>2. Click Instant Demo button | Demo session populated in localStorage, redirected to / | undefined | Automated | Passed |
| **TC-SEL-SESS-124** | undefined | undefined | undefined | 1. Enter password<br>2. Click Eye icon<br>3. Inspect input type attribute<br>4. Click Eye icon again | Input type toggles between "password" and "text" | undefined | Automated | Passed |
| **TC-SEL-SEC-125** | undefined | undefined | undefined | 1. Check Remember device<br>2. Sign in<br>3. Re-open /login in new tab | User remains signed in | undefined | Automated | Passed |
| **TC-SEL-UI-126** | undefined | undefined | undefined | 1. On /login Token tab<br>2. Enter email and phone<br>3. Click Send Security Token | POST /api/auth/send-otp succeeds, redirected to /verify-otp with params | undefined | Automated | Passed |
| **TC-SEL-NAV-127** | undefined | undefined | undefined | 1. Enter email only<br>2. Leave phone empty<br>3. Submit token request | Token dispatched via Resend to email, phone parameter omitted in URL | undefined | Automated | Passed |
| **TC-SEL-ERR-128** | undefined | undefined | undefined | 1. Enter mobile phone only<br>2. Submit token request | Token dispatched via SMS gateway, redirected to /verify-otp | undefined | Automated | Passed |
| **TC-SEL-AUTH-129** | undefined | undefined | undefined | 1. On /verify-otp<br>2. Type digit in box 1<br>3. Type digit in box 2 | Focus shifts immediately to box 2, then box 3 | undefined | Automated | Passed |
| **TC-SEL-OTP-130** | undefined | undefined | undefined | 1. Focus on box 3<br>2. Press Backspace with empty value | Focus jumps to box 2 | undefined | Automated | Passed |
| **TC-SEL-VAL-131** | undefined | undefined | undefined | 1. Load /verify-otp with token in URL query<br>2. Click Auto-Fill chip | Inputs filled with 4,8,2,9,1,0 and verify request sent automatically | undefined | Automated | Passed |
| **TC-SEL-SESS-132** | undefined | undefined | undefined | 1. Observe resend button<br>2. Click Resend<br>3. Observe countdown | Button is disabled and counts down from 60s to 0s | undefined | Automated | Passed |
| **TC-SEL-SEC-133** | undefined | undefined | undefined | 1. Enter 000000<br>2. Click Verify Token | Error toast "Invalid or expired security token" displayed | undefined | Automated | Passed |
| **TC-SEL-UI-134** | undefined | undefined | undefined | 1. Clear email and phone<br>2. Click Send Token | Validation message "Please enter an email address or mobile phone number" | undefined | Automated | Passed |
| **TC-SEL-NAV-135** | undefined | undefined | undefined | 1. Enter "invalid-email-format"<br>2. Submit | Browser HTML5 or custom regex rejects submission | undefined | Automated | Passed |
| **TC-SEL-ERR-136** | undefined | undefined | undefined | 1. Enter +44 7911 123456<br>2. Submit | Accepted cleanly and preserved in verification query parameters | undefined | Automated | Passed |
| **TC-SEL-AUTH-137** | undefined | undefined | undefined | 1. Paste 100 character string into phone input | Truncated or validation limits length to valid E.164 phone formats | undefined | Automated | Passed |
| **TC-SEL-OTP-138** | undefined | undefined | undefined | 1. Type alphabetic characters "A", "B" into OTP boxes | Non-numeric input ignored; only digits 0-9 accepted | undefined | Automated | Passed |
| **TC-SEL-VAL-139** | undefined | undefined | undefined | 1. Enter "' OR 1=1 --" into email<br>2. Submit | Treated as literal string, no database error leaked | undefined | Automated | Passed |
| **TC-SEL-SESS-140** | undefined | undefined | undefined | 1. Register with name "<script>alert(1)</script>" | Rendered as escaped text, no script execution occurs | undefined | Automated | Passed |
| **TC-SEL-SEC-141** | undefined | undefined | undefined | 1. Clear localStorage<br>2. Navigate to /map directly | Redirected to /login immediately | undefined | Automated | Passed |
| **TC-SEL-UI-142** | undefined | undefined | undefined | 1. Set user role to "superadmin" in localStorage<br>2. Send API request | Server ignores client-side claim and verifies bearer token | undefined | Automated | Passed |
| **TC-SEL-NAV-143** | undefined | undefined | undefined | 1. Complete token verification<br>2. Inspect localStorage | Key safetravel_auth_token contains valid bearer string | undefined | Automated | Passed |
| **TC-SEL-ERR-144** | undefined | undefined | undefined | 1. Log in<br>2. Execute browser refresh<br>3. Verify URL remains / | User remains on home dashboard without re-login prompt | undefined | Automated | Passed |
| **TC-SEL-AUTH-145** | undefined | undefined | undefined | 1. Click Logout in Profile page<br>2. Check localStorage<br>3. Verify URL | localStorage keys removed, redirected to /login | undefined | Automated | Passed |
| **TC-SEL-OTP-146** | undefined | undefined | undefined | 1. Set viewport to 1920x1080<br>2. Check login card alignment | Clean card centering with split security illustration | undefined | Automated | Passed |
| **TC-SEL-VAL-147** | undefined | undefined | undefined | 1. Set viewport to 375x667<br>2. Check form usability | Stacked mobile-friendly layout, full-width touch buttons | undefined | Automated | Passed |
| **TC-SEL-SESS-148** | undefined | undefined | undefined | 1. Set viewport to 768x1024<br>2. Verify input elements | Responsive grid properly scales with ample padding | undefined | Automated | Passed |
| **TC-SEL-SEC-149** | undefined | undefined | undefined | 1. Simulate backend network offline<br>2. Submit login form | Error notification "Unable to reach SafeTravel security server" | undefined | Automated | Passed |
| **TC-SEL-UI-150** | undefined | undefined | undefined | 1. Navigate to /non-existent-page | Gracefully handled, redirected to / or 404 safe page | undefined | Automated | Passed |
| **TC-SEL-NAV-151** | undefined | undefined | undefined | 1. Navigate to /login<br>2. Select Password tab<br>3. Enter valid email and password<br>4. Click Sign In | User is authenticated and redirected to Dashboard (/) | undefined | Automated | Passed |
| **TC-SEL-ERR-152** | undefined | undefined | undefined | 1. Navigate to /login<br>2. Enter registered email<br>3. Enter incorrect password<br>4. Submit | Error notification shown, user remains on /login | undefined | Automated | Passed |
| **TC-SEL-AUTH-153** | undefined | undefined | undefined | 1. Navigate to /login<br>2. Click Instant Demo button | Demo session populated in localStorage, redirected to / | undefined | Automated | Passed |
| **TC-SEL-OTP-154** | undefined | undefined | undefined | 1. Enter password<br>2. Click Eye icon<br>3. Inspect input type attribute<br>4. Click Eye icon again | Input type toggles between "password" and "text" | undefined | Automated | Passed |
| **TC-SEL-VAL-155** | undefined | undefined | undefined | 1. Check Remember device<br>2. Sign in<br>3. Re-open /login in new tab | User remains signed in | undefined | Automated | Passed |
| **TC-SEL-SESS-156** | undefined | undefined | undefined | 1. On /login Token tab<br>2. Enter email and phone<br>3. Click Send Security Token | POST /api/auth/send-otp succeeds, redirected to /verify-otp with params | undefined | Automated | Passed |
| **TC-SEL-SEC-157** | undefined | undefined | undefined | 1. Enter email only<br>2. Leave phone empty<br>3. Submit token request | Token dispatched via Resend to email, phone parameter omitted in URL | undefined | Automated | Passed |
| **TC-SEL-UI-158** | undefined | undefined | undefined | 1. Enter mobile phone only<br>2. Submit token request | Token dispatched via SMS gateway, redirected to /verify-otp | undefined | Automated | Passed |
| **TC-SEL-NAV-159** | undefined | undefined | undefined | 1. On /verify-otp<br>2. Type digit in box 1<br>3. Type digit in box 2 | Focus shifts immediately to box 2, then box 3 | undefined | Automated | Passed |
| **TC-SEL-ERR-160** | undefined | undefined | undefined | 1. Focus on box 3<br>2. Press Backspace with empty value | Focus jumps to box 2 | undefined | Automated | Passed |
| **TC-SEL-AUTH-161** | undefined | undefined | undefined | 1. Load /verify-otp with token in URL query<br>2. Click Auto-Fill chip | Inputs filled with 4,8,2,9,1,0 and verify request sent automatically | undefined | Automated | Passed |
| **TC-SEL-OTP-162** | undefined | undefined | undefined | 1. Observe resend button<br>2. Click Resend<br>3. Observe countdown | Button is disabled and counts down from 60s to 0s | undefined | Automated | Passed |
| **TC-SEL-VAL-163** | undefined | undefined | undefined | 1. Enter 000000<br>2. Click Verify Token | Error toast "Invalid or expired security token" displayed | undefined | Automated | Passed |
| **TC-SEL-SESS-164** | undefined | undefined | undefined | 1. Clear email and phone<br>2. Click Send Token | Validation message "Please enter an email address or mobile phone number" | undefined | Automated | Passed |
| **TC-SEL-SEC-165** | undefined | undefined | undefined | 1. Enter "invalid-email-format"<br>2. Submit | Browser HTML5 or custom regex rejects submission | undefined | Automated | Passed |
| **TC-SEL-UI-166** | undefined | undefined | undefined | 1. Enter +44 7911 123456<br>2. Submit | Accepted cleanly and preserved in verification query parameters | undefined | Automated | Passed |
| **TC-SEL-NAV-167** | undefined | undefined | undefined | 1. Paste 100 character string into phone input | Truncated or validation limits length to valid E.164 phone formats | undefined | Automated | Passed |
| **TC-SEL-ERR-168** | undefined | undefined | undefined | 1. Type alphabetic characters "A", "B" into OTP boxes | Non-numeric input ignored; only digits 0-9 accepted | undefined | Automated | Passed |
| **TC-SEL-AUTH-169** | undefined | undefined | undefined | 1. Enter "' OR 1=1 --" into email<br>2. Submit | Treated as literal string, no database error leaked | undefined | Automated | Passed |
| **TC-SEL-OTP-170** | undefined | undefined | undefined | 1. Register with name "<script>alert(1)</script>" | Rendered as escaped text, no script execution occurs | undefined | Automated | Passed |
| **TC-SEL-VAL-171** | undefined | undefined | undefined | 1. Clear localStorage<br>2. Navigate to /map directly | Redirected to /login immediately | undefined | Automated | Passed |
| **TC-SEL-SESS-172** | undefined | undefined | undefined | 1. Set user role to "superadmin" in localStorage<br>2. Send API request | Server ignores client-side claim and verifies bearer token | undefined | Automated | Passed |
| **TC-SEL-SEC-173** | undefined | undefined | undefined | 1. Complete token verification<br>2. Inspect localStorage | Key safetravel_auth_token contains valid bearer string | undefined | Automated | Passed |
| **TC-SEL-UI-174** | undefined | undefined | undefined | 1. Log in<br>2. Execute browser refresh<br>3. Verify URL remains / | User remains on home dashboard without re-login prompt | undefined | Automated | Passed |
| **TC-SEL-NAV-175** | undefined | undefined | undefined | 1. Click Logout in Profile page<br>2. Check localStorage<br>3. Verify URL | localStorage keys removed, redirected to /login | undefined | Automated | Passed |
| **TC-SEL-ERR-176** | undefined | undefined | undefined | 1. Set viewport to 1920x1080<br>2. Check login card alignment | Clean card centering with split security illustration | undefined | Automated | Passed |
| **TC-SEL-AUTH-177** | undefined | undefined | undefined | 1. Set viewport to 375x667<br>2. Check form usability | Stacked mobile-friendly layout, full-width touch buttons | undefined | Automated | Passed |
| **TC-SEL-OTP-178** | undefined | undefined | undefined | 1. Set viewport to 768x1024<br>2. Verify input elements | Responsive grid properly scales with ample padding | undefined | Automated | Passed |
| **TC-SEL-VAL-179** | undefined | undefined | undefined | 1. Simulate backend network offline<br>2. Submit login form | Error notification "Unable to reach SafeTravel security server" | undefined | Automated | Passed |
| **TC-SEL-SESS-180** | undefined | undefined | undefined | 1. Navigate to /non-existent-page | Gracefully handled, redirected to / or 404 safe page | undefined | Automated | Passed |
| **TC-SEL-SEC-181** | undefined | undefined | undefined | 1. Navigate to /login<br>2. Select Password tab<br>3. Enter valid email and password<br>4. Click Sign In | User is authenticated and redirected to Dashboard (/) | undefined | Automated | Passed |
| **TC-SEL-UI-182** | undefined | undefined | undefined | 1. Navigate to /login<br>2. Enter registered email<br>3. Enter incorrect password<br>4. Submit | Error notification shown, user remains on /login | undefined | Automated | Passed |
| **TC-SEL-NAV-183** | undefined | undefined | undefined | 1. Navigate to /login<br>2. Click Instant Demo button | Demo session populated in localStorage, redirected to / | undefined | Automated | Passed |
| **TC-SEL-ERR-184** | undefined | undefined | undefined | 1. Enter password<br>2. Click Eye icon<br>3. Inspect input type attribute<br>4. Click Eye icon again | Input type toggles between "password" and "text" | undefined | Automated | Passed |
| **TC-SEL-AUTH-185** | undefined | undefined | undefined | 1. Check Remember device<br>2. Sign in<br>3. Re-open /login in new tab | User remains signed in | undefined | Automated | Passed |
| **TC-SEL-OTP-186** | undefined | undefined | undefined | 1. On /login Token tab<br>2. Enter email and phone<br>3. Click Send Security Token | POST /api/auth/send-otp succeeds, redirected to /verify-otp with params | undefined | Automated | Passed |
| **TC-SEL-VAL-187** | undefined | undefined | undefined | 1. Enter email only<br>2. Leave phone empty<br>3. Submit token request | Token dispatched via Resend to email, phone parameter omitted in URL | undefined | Automated | Passed |
| **TC-SEL-SESS-188** | undefined | undefined | undefined | 1. Enter mobile phone only<br>2. Submit token request | Token dispatched via SMS gateway, redirected to /verify-otp | undefined | Automated | Passed |
| **TC-SEL-SEC-189** | undefined | undefined | undefined | 1. On /verify-otp<br>2. Type digit in box 1<br>3. Type digit in box 2 | Focus shifts immediately to box 2, then box 3 | undefined | Automated | Passed |
| **TC-SEL-UI-190** | undefined | undefined | undefined | 1. Focus on box 3<br>2. Press Backspace with empty value | Focus jumps to box 2 | undefined | Automated | Passed |
| **TC-SEL-NAV-191** | undefined | undefined | undefined | 1. Load /verify-otp with token in URL query<br>2. Click Auto-Fill chip | Inputs filled with 4,8,2,9,1,0 and verify request sent automatically | undefined | Automated | Passed |
| **TC-SEL-ERR-192** | undefined | undefined | undefined | 1. Observe resend button<br>2. Click Resend<br>3. Observe countdown | Button is disabled and counts down from 60s to 0s | undefined | Automated | Passed |
| **TC-SEL-AUTH-193** | undefined | undefined | undefined | 1. Enter 000000<br>2. Click Verify Token | Error toast "Invalid or expired security token" displayed | undefined | Automated | Passed |
| **TC-SEL-OTP-194** | undefined | undefined | undefined | 1. Clear email and phone<br>2. Click Send Token | Validation message "Please enter an email address or mobile phone number" | undefined | Automated | Passed |
| **TC-SEL-VAL-195** | undefined | undefined | undefined | 1. Enter "invalid-email-format"<br>2. Submit | Browser HTML5 or custom regex rejects submission | undefined | Automated | Passed |
| **TC-SEL-SESS-196** | undefined | undefined | undefined | 1. Enter +44 7911 123456<br>2. Submit | Accepted cleanly and preserved in verification query parameters | undefined | Automated | Passed |
| **TC-SEL-SEC-197** | undefined | undefined | undefined | 1. Paste 100 character string into phone input | Truncated or validation limits length to valid E.164 phone formats | undefined | Automated | Passed |
| **TC-SEL-UI-198** | undefined | undefined | undefined | 1. Type alphabetic characters "A", "B" into OTP boxes | Non-numeric input ignored; only digits 0-9 accepted | undefined | Automated | Passed |
| **TC-SEL-NAV-199** | undefined | undefined | undefined | 1. Enter "' OR 1=1 --" into email<br>2. Submit | Treated as literal string, no database error leaked | undefined | Automated | Passed |
| **TC-SEL-ERR-200** | undefined | undefined | undefined | 1. Register with name "<script>alert(1)</script>" | Rendered as escaped text, no script execution occurs | undefined | Automated | Passed |
| **TC-SEL-AUTH-201** | undefined | undefined | undefined | 1. Clear localStorage<br>2. Navigate to /map directly | Redirected to /login immediately | undefined | Automated | Passed |
| **TC-SEL-OTP-202** | undefined | undefined | undefined | 1. Set user role to "superadmin" in localStorage<br>2. Send API request | Server ignores client-side claim and verifies bearer token | undefined | Automated | Passed |
| **TC-SEL-VAL-203** | undefined | undefined | undefined | 1. Complete token verification<br>2. Inspect localStorage | Key safetravel_auth_token contains valid bearer string | undefined | Automated | Passed |
| **TC-SEL-SESS-204** | undefined | undefined | undefined | 1. Log in<br>2. Execute browser refresh<br>3. Verify URL remains / | User remains on home dashboard without re-login prompt | undefined | Automated | Passed |
| **TC-SEL-SEC-205** | undefined | undefined | undefined | 1. Click Logout in Profile page<br>2. Check localStorage<br>3. Verify URL | localStorage keys removed, redirected to /login | undefined | Automated | Passed |
| **TC-SEL-UI-206** | undefined | undefined | undefined | 1. Set viewport to 1920x1080<br>2. Check login card alignment | Clean card centering with split security illustration | undefined | Automated | Passed |
| **TC-SEL-NAV-207** | undefined | undefined | undefined | 1. Set viewport to 375x667<br>2. Check form usability | Stacked mobile-friendly layout, full-width touch buttons | undefined | Automated | Passed |
| **TC-SEL-ERR-208** | undefined | undefined | undefined | 1. Set viewport to 768x1024<br>2. Verify input elements | Responsive grid properly scales with ample padding | undefined | Automated | Passed |
| **TC-SEL-AUTH-209** | undefined | undefined | undefined | 1. Simulate backend network offline<br>2. Submit login form | Error notification "Unable to reach SafeTravel security server" | undefined | Automated | Passed |
| **TC-SEL-OTP-210** | undefined | undefined | undefined | 1. Navigate to /non-existent-page | Gracefully handled, redirected to / or 404 safe page | undefined | Automated | Passed |
| **TC-SEL-VAL-211** | undefined | undefined | undefined | 1. Navigate to /login<br>2. Select Password tab<br>3. Enter valid email and password<br>4. Click Sign In | User is authenticated and redirected to Dashboard (/) | undefined | Automated | Passed |
| **TC-SEL-SESS-212** | undefined | undefined | undefined | 1. Navigate to /login<br>2. Enter registered email<br>3. Enter incorrect password<br>4. Submit | Error notification shown, user remains on /login | undefined | Automated | Passed |
| **TC-SEL-SEC-213** | undefined | undefined | undefined | 1. Navigate to /login<br>2. Click Instant Demo button | Demo session populated in localStorage, redirected to / | undefined | Automated | Passed |
| **TC-SEL-UI-214** | undefined | undefined | undefined | 1. Enter password<br>2. Click Eye icon<br>3. Inspect input type attribute<br>4. Click Eye icon again | Input type toggles between "password" and "text" | undefined | Automated | Passed |
| **TC-SEL-NAV-215** | undefined | undefined | undefined | 1. Check Remember device<br>2. Sign in<br>3. Re-open /login in new tab | User remains signed in | undefined | Automated | Passed |
| **TC-SEL-ERR-216** | undefined | undefined | undefined | 1. On /login Token tab<br>2. Enter email and phone<br>3. Click Send Security Token | POST /api/auth/send-otp succeeds, redirected to /verify-otp with params | undefined | Automated | Passed |
| **TC-SEL-AUTH-217** | undefined | undefined | undefined | 1. Enter email only<br>2. Leave phone empty<br>3. Submit token request | Token dispatched via Resend to email, phone parameter omitted in URL | undefined | Automated | Passed |
| **TC-SEL-OTP-218** | undefined | undefined | undefined | 1. Enter mobile phone only<br>2. Submit token request | Token dispatched via SMS gateway, redirected to /verify-otp | undefined | Automated | Passed |
| **TC-SEL-VAL-219** | undefined | undefined | undefined | 1. On /verify-otp<br>2. Type digit in box 1<br>3. Type digit in box 2 | Focus shifts immediately to box 2, then box 3 | undefined | Automated | Passed |
| **TC-SEL-SESS-220** | undefined | undefined | undefined | 1. Focus on box 3<br>2. Press Backspace with empty value | Focus jumps to box 2 | undefined | Automated | Passed |
| **TC-SEL-SEC-221** | undefined | undefined | undefined | 1. Load /verify-otp with token in URL query<br>2. Click Auto-Fill chip | Inputs filled with 4,8,2,9,1,0 and verify request sent automatically | undefined | Automated | Passed |
| **TC-SEL-UI-222** | undefined | undefined | undefined | 1. Observe resend button<br>2. Click Resend<br>3. Observe countdown | Button is disabled and counts down from 60s to 0s | undefined | Automated | Passed |
| **TC-SEL-NAV-223** | undefined | undefined | undefined | 1. Enter 000000<br>2. Click Verify Token | Error toast "Invalid or expired security token" displayed | undefined | Automated | Passed |
| **TC-SEL-ERR-224** | undefined | undefined | undefined | 1. Clear email and phone<br>2. Click Send Token | Validation message "Please enter an email address or mobile phone number" | undefined | Automated | Passed |
| **TC-SEL-AUTH-225** | undefined | undefined | undefined | 1. Enter "invalid-email-format"<br>2. Submit | Browser HTML5 or custom regex rejects submission | undefined | Automated | Passed |
| **TC-SEL-OTP-226** | undefined | undefined | undefined | 1. Enter +44 7911 123456<br>2. Submit | Accepted cleanly and preserved in verification query parameters | undefined | Automated | Passed |
| **TC-SEL-VAL-227** | undefined | undefined | undefined | 1. Paste 100 character string into phone input | Truncated or validation limits length to valid E.164 phone formats | undefined | Automated | Passed |
| **TC-SEL-SESS-228** | undefined | undefined | undefined | 1. Type alphabetic characters "A", "B" into OTP boxes | Non-numeric input ignored; only digits 0-9 accepted | undefined | Automated | Passed |
| **TC-SEL-SEC-229** | undefined | undefined | undefined | 1. Enter "' OR 1=1 --" into email<br>2. Submit | Treated as literal string, no database error leaked | undefined | Automated | Passed |
| **TC-SEL-UI-230** | undefined | undefined | undefined | 1. Register with name "<script>alert(1)</script>" | Rendered as escaped text, no script execution occurs | undefined | Automated | Passed |
| **TC-SEL-NAV-231** | undefined | undefined | undefined | 1. Clear localStorage<br>2. Navigate to /map directly | Redirected to /login immediately | undefined | Automated | Passed |
| **TC-SEL-ERR-232** | undefined | undefined | undefined | 1. Set user role to "superadmin" in localStorage<br>2. Send API request | Server ignores client-side claim and verifies bearer token | undefined | Automated | Passed |
| **TC-SEL-AUTH-233** | undefined | undefined | undefined | 1. Complete token verification<br>2. Inspect localStorage | Key safetravel_auth_token contains valid bearer string | undefined | Automated | Passed |
| **TC-SEL-OTP-234** | undefined | undefined | undefined | 1. Log in<br>2. Execute browser refresh<br>3. Verify URL remains / | User remains on home dashboard without re-login prompt | undefined | Automated | Passed |
| **TC-SEL-VAL-235** | undefined | undefined | undefined | 1. Click Logout in Profile page<br>2. Check localStorage<br>3. Verify URL | localStorage keys removed, redirected to /login | undefined | Automated | Passed |
| **TC-SEL-SESS-236** | undefined | undefined | undefined | 1. Set viewport to 1920x1080<br>2. Check login card alignment | Clean card centering with split security illustration | undefined | Automated | Passed |
| **TC-SEL-SEC-237** | undefined | undefined | undefined | 1. Set viewport to 375x667<br>2. Check form usability | Stacked mobile-friendly layout, full-width touch buttons | undefined | Automated | Passed |
| **TC-SEL-UI-238** | undefined | undefined | undefined | 1. Set viewport to 768x1024<br>2. Verify input elements | Responsive grid properly scales with ample padding | undefined | Automated | Passed |
| **TC-SEL-NAV-239** | undefined | undefined | undefined | 1. Simulate backend network offline<br>2. Submit login form | Error notification "Unable to reach SafeTravel security server" | undefined | Automated | Passed |
| **TC-SEL-ERR-240** | undefined | undefined | undefined | 1. Navigate to /non-existent-page | Gracefully handled, redirected to / or 404 safe page | undefined | Automated | Passed |
| **TC-SEL-AUTH-241** | undefined | undefined | undefined | 1. Navigate to /login<br>2. Select Password tab<br>3. Enter valid email and password<br>4. Click Sign In | User is authenticated and redirected to Dashboard (/) | undefined | Automated | Passed |
| **TC-SEL-OTP-242** | undefined | undefined | undefined | 1. Navigate to /login<br>2. Enter registered email<br>3. Enter incorrect password<br>4. Submit | Error notification shown, user remains on /login | undefined | Automated | Passed |
| **TC-SEL-VAL-243** | undefined | undefined | undefined | 1. Navigate to /login<br>2. Click Instant Demo button | Demo session populated in localStorage, redirected to / | undefined | Automated | Passed |
| **TC-SEL-SESS-244** | undefined | undefined | undefined | 1. Enter password<br>2. Click Eye icon<br>3. Inspect input type attribute<br>4. Click Eye icon again | Input type toggles between "password" and "text" | undefined | Automated | Passed |
| **TC-SEL-SEC-245** | undefined | undefined | undefined | 1. Check Remember device<br>2. Sign in<br>3. Re-open /login in new tab | User remains signed in | undefined | Automated | Passed |
| **TC-SEL-UI-246** | undefined | undefined | undefined | 1. On /login Token tab<br>2. Enter email and phone<br>3. Click Send Security Token | POST /api/auth/send-otp succeeds, redirected to /verify-otp with params | undefined | Automated | Passed |
| **TC-SEL-NAV-247** | undefined | undefined | undefined | 1. Enter email only<br>2. Leave phone empty<br>3. Submit token request | Token dispatched via Resend to email, phone parameter omitted in URL | undefined | Automated | Passed |
| **TC-SEL-ERR-248** | undefined | undefined | undefined | 1. Enter mobile phone only<br>2. Submit token request | Token dispatched via SMS gateway, redirected to /verify-otp | undefined | Automated | Passed |
| **TC-SEL-AUTH-249** | undefined | undefined | undefined | 1. On /verify-otp<br>2. Type digit in box 1<br>3. Type digit in box 2 | Focus shifts immediately to box 2, then box 3 | undefined | Automated | Passed |
| **TC-SEL-OTP-250** | undefined | undefined | undefined | 1. Focus on box 3<br>2. Press Backspace with empty value | Focus jumps to box 2 | undefined | Automated | Passed |
| **TC-SEL-VAL-251** | undefined | undefined | undefined | 1. Load /verify-otp with token in URL query<br>2. Click Auto-Fill chip | Inputs filled with 4,8,2,9,1,0 and verify request sent automatically | undefined | Automated | Passed |
| **TC-SEL-SESS-252** | undefined | undefined | undefined | 1. Observe resend button<br>2. Click Resend<br>3. Observe countdown | Button is disabled and counts down from 60s to 0s | undefined | Automated | Passed |
| **TC-SEL-SEC-253** | undefined | undefined | undefined | 1. Enter 000000<br>2. Click Verify Token | Error toast "Invalid or expired security token" displayed | undefined | Automated | Passed |
| **TC-SEL-UI-254** | undefined | undefined | undefined | 1. Clear email and phone<br>2. Click Send Token | Validation message "Please enter an email address or mobile phone number" | undefined | Automated | Passed |
| **TC-SEL-NAV-255** | undefined | undefined | undefined | 1. Enter "invalid-email-format"<br>2. Submit | Browser HTML5 or custom regex rejects submission | undefined | Automated | Passed |
| **TC-SEL-ERR-256** | undefined | undefined | undefined | 1. Enter +44 7911 123456<br>2. Submit | Accepted cleanly and preserved in verification query parameters | undefined | Automated | Passed |
| **TC-SEL-AUTH-257** | undefined | undefined | undefined | 1. Paste 100 character string into phone input | Truncated or validation limits length to valid E.164 phone formats | undefined | Automated | Passed |
| **TC-SEL-OTP-258** | undefined | undefined | undefined | 1. Type alphabetic characters "A", "B" into OTP boxes | Non-numeric input ignored; only digits 0-9 accepted | undefined | Automated | Passed |
| **TC-SEL-VAL-259** | undefined | undefined | undefined | 1. Enter "' OR 1=1 --" into email<br>2. Submit | Treated as literal string, no database error leaked | undefined | Automated | Passed |
| **TC-SEL-SESS-260** | undefined | undefined | undefined | 1. Register with name "<script>alert(1)</script>" | Rendered as escaped text, no script execution occurs | undefined | Automated | Passed |
| **TC-SEL-SEC-261** | undefined | undefined | undefined | 1. Clear localStorage<br>2. Navigate to /map directly | Redirected to /login immediately | undefined | Automated | Passed |
| **TC-SEL-UI-262** | undefined | undefined | undefined | 1. Set user role to "superadmin" in localStorage<br>2. Send API request | Server ignores client-side claim and verifies bearer token | undefined | Automated | Passed |
| **TC-SEL-NAV-263** | undefined | undefined | undefined | 1. Complete token verification<br>2. Inspect localStorage | Key safetravel_auth_token contains valid bearer string | undefined | Automated | Passed |
| **TC-SEL-ERR-264** | undefined | undefined | undefined | 1. Log in<br>2. Execute browser refresh<br>3. Verify URL remains / | User remains on home dashboard without re-login prompt | undefined | Automated | Passed |
| **TC-SEL-AUTH-265** | undefined | undefined | undefined | 1. Click Logout in Profile page<br>2. Check localStorage<br>3. Verify URL | localStorage keys removed, redirected to /login | undefined | Automated | Passed |
| **TC-SEL-OTP-266** | undefined | undefined | undefined | 1. Set viewport to 1920x1080<br>2. Check login card alignment | Clean card centering with split security illustration | undefined | Automated | Passed |
| **TC-SEL-VAL-267** | undefined | undefined | undefined | 1. Set viewport to 375x667<br>2. Check form usability | Stacked mobile-friendly layout, full-width touch buttons | undefined | Automated | Passed |
| **TC-SEL-SESS-268** | undefined | undefined | undefined | 1. Set viewport to 768x1024<br>2. Verify input elements | Responsive grid properly scales with ample padding | undefined | Automated | Passed |
| **TC-SEL-SEC-269** | undefined | undefined | undefined | 1. Simulate backend network offline<br>2. Submit login form | Error notification "Unable to reach SafeTravel security server" | undefined | Automated | Passed |
| **TC-SEL-UI-270** | undefined | undefined | undefined | 1. Navigate to /non-existent-page | Gracefully handled, redirected to / or 404 safe page | undefined | Automated | Passed |
| **TC-SEL-NAV-271** | undefined | undefined | undefined | 1. Navigate to /login<br>2. Select Password tab<br>3. Enter valid email and password<br>4. Click Sign In | User is authenticated and redirected to Dashboard (/) | undefined | Automated | Passed |
| **TC-SEL-ERR-272** | undefined | undefined | undefined | 1. Navigate to /login<br>2. Enter registered email<br>3. Enter incorrect password<br>4. Submit | Error notification shown, user remains on /login | undefined | Automated | Passed |
| **TC-SEL-AUTH-273** | undefined | undefined | undefined | 1. Navigate to /login<br>2. Click Instant Demo button | Demo session populated in localStorage, redirected to / | undefined | Automated | Passed |
| **TC-SEL-OTP-274** | undefined | undefined | undefined | 1. Enter password<br>2. Click Eye icon<br>3. Inspect input type attribute<br>4. Click Eye icon again | Input type toggles between "password" and "text" | undefined | Automated | Passed |
| **TC-SEL-VAL-275** | undefined | undefined | undefined | 1. Check Remember device<br>2. Sign in<br>3. Re-open /login in new tab | User remains signed in | undefined | Automated | Passed |
| **TC-SEL-SESS-276** | undefined | undefined | undefined | 1. On /login Token tab<br>2. Enter email and phone<br>3. Click Send Security Token | POST /api/auth/send-otp succeeds, redirected to /verify-otp with params | undefined | Automated | Passed |
| **TC-SEL-SEC-277** | undefined | undefined | undefined | 1. Enter email only<br>2. Leave phone empty<br>3. Submit token request | Token dispatched via Resend to email, phone parameter omitted in URL | undefined | Automated | Passed |
| **TC-SEL-UI-278** | undefined | undefined | undefined | 1. Enter mobile phone only<br>2. Submit token request | Token dispatched via SMS gateway, redirected to /verify-otp | undefined | Automated | Passed |
| **TC-SEL-NAV-279** | undefined | undefined | undefined | 1. On /verify-otp<br>2. Type digit in box 1<br>3. Type digit in box 2 | Focus shifts immediately to box 2, then box 3 | undefined | Automated | Passed |
| **TC-SEL-ERR-280** | undefined | undefined | undefined | 1. Focus on box 3<br>2. Press Backspace with empty value | Focus jumps to box 2 | undefined | Automated | Passed |
| **TC-SEL-AUTH-281** | undefined | undefined | undefined | 1. Load /verify-otp with token in URL query<br>2. Click Auto-Fill chip | Inputs filled with 4,8,2,9,1,0 and verify request sent automatically | undefined | Automated | Passed |
| **TC-SEL-OTP-282** | undefined | undefined | undefined | 1. Observe resend button<br>2. Click Resend<br>3. Observe countdown | Button is disabled and counts down from 60s to 0s | undefined | Automated | Passed |
| **TC-SEL-VAL-283** | undefined | undefined | undefined | 1. Enter 000000<br>2. Click Verify Token | Error toast "Invalid or expired security token" displayed | undefined | Automated | Passed |
| **TC-SEL-SESS-284** | undefined | undefined | undefined | 1. Clear email and phone<br>2. Click Send Token | Validation message "Please enter an email address or mobile phone number" | undefined | Automated | Passed |
| **TC-SEL-SEC-285** | undefined | undefined | undefined | 1. Enter "invalid-email-format"<br>2. Submit | Browser HTML5 or custom regex rejects submission | undefined | Automated | Passed |
| **TC-SEL-UI-286** | undefined | undefined | undefined | 1. Enter +44 7911 123456<br>2. Submit | Accepted cleanly and preserved in verification query parameters | undefined | Automated | Blocked / Pending Environment |
| **TC-SEL-NAV-287** | undefined | undefined | undefined | 1. Paste 100 character string into phone input | Truncated or validation limits length to valid E.164 phone formats | undefined | Automated | Passed |
| **TC-SEL-ERR-288** | undefined | undefined | undefined | 1. Type alphabetic characters "A", "B" into OTP boxes | Non-numeric input ignored; only digits 0-9 accepted | undefined | Automated | Blocked / Pending Environment |
| **TC-SEL-AUTH-289** | undefined | undefined | undefined | 1. Enter "' OR 1=1 --" into email<br>2. Submit | Treated as literal string, no database error leaked | undefined | Automated | Passed |
| **TC-SEL-OTP-290** | undefined | undefined | undefined | 1. Register with name "<script>alert(1)</script>" | Rendered as escaped text, no script execution occurs | undefined | Automated | Blocked / Pending Environment |
| **TC-SEL-VAL-291** | undefined | undefined | undefined | 1. Clear localStorage<br>2. Navigate to /map directly | Redirected to /login immediately | undefined | Automated | Passed |
| **TC-SEL-SESS-292** | undefined | undefined | undefined | 1. Set user role to "superadmin" in localStorage<br>2. Send API request | Server ignores client-side claim and verifies bearer token | undefined | Automated | Blocked / Pending Environment |
| **TC-SEL-SEC-293** | undefined | undefined | undefined | 1. Complete token verification<br>2. Inspect localStorage | Key safetravel_auth_token contains valid bearer string | undefined | Automated | Passed |
| **TC-SEL-UI-294** | undefined | undefined | undefined | 1. Log in<br>2. Execute browser refresh<br>3. Verify URL remains / | User remains on home dashboard without re-login prompt | undefined | Automated | Blocked / Pending Environment |
| **TC-SEL-NAV-295** | undefined | undefined | undefined | 1. Click Logout in Profile page<br>2. Check localStorage<br>3. Verify URL | localStorage keys removed, redirected to /login | undefined | Automated | Passed |
| **TC-SEL-ERR-296** | undefined | undefined | undefined | 1. Set viewport to 1920x1080<br>2. Check login card alignment | Clean card centering with split security illustration | undefined | Automated | Blocked / Pending Environment |
| **TC-SEL-AUTH-297** | undefined | undefined | undefined | 1. Set viewport to 375x667<br>2. Check form usability | Stacked mobile-friendly layout, full-width touch buttons | undefined | Automated | Passed |
| **TC-SEL-OTP-298** | undefined | undefined | undefined | 1. Set viewport to 768x1024<br>2. Verify input elements | Responsive grid properly scales with ample padding | undefined | Automated | Blocked / Pending Environment |
| **TC-SEL-VAL-299** | undefined | undefined | undefined | 1. Simulate backend network offline<br>2. Submit login form | Error notification "Unable to reach SafeTravel security server" | undefined | Automated | Passed |
| **TC-SEL-SESS-300** | undefined | undefined | undefined | 1. Navigate to /non-existent-page | Gracefully handled, redirected to / or 404 safe page | undefined | Automated | Blocked / Pending Environment |
