# SafeTravel - Android (Kotlin) Architecture & Implementation Guide

This document describes the native Android implementation in **Kotlin** for SafeTravel, matching the Web application architecture.

## 1. Android Tech Stack
- **Language**: Kotlin 2.0+
- **UI Framework**: Jetpack Compose (Modern declarative UI)
- **Architecture**: MVVM + Clean Architecture (Repository pattern)
- **Dependency Injection**: Hilt / Dagger
- **Networking**: Retrofit 2 + OkHttp 3
- **Local Storage**: Room Database + DataStore
- **Location Services**: Google Play Services Location (`FusedLocationProviderClient`)
- **Maps**: Google Maps SDK / Mapbox / OpenStreetMap (osmdroid)
- **Backend / DB**: Supabase Kotlin SDK (`io.github.jan-tennert.supabase:postgrest-kt`)
- **Emergency Dispatch**: Android Intent (`Intent.ACTION_VIEW` targeting `com.whatsapp`) + TelephonyManager

---

## 2. Emergency WhatsApp Dispatch in Kotlin

When the tourist activates SOS in the Android app:

```kotlin
fun dispatchWhatsAppEmergencyAlert(context: Context, contactPhone: String, locationUrl: String) {
    val message = "🚨 EMERGENCY! I need help. My current GPS location is: $locationUrl. Please contact me immediately! - SafeTravel"
    val encodedMessage = URLEncoder.encode(message, "UTF-8")
    val cleanPhone = contactPhone.replace("+", "").replace(" ", "").replace("-", "")
    
    val intent = Intent(Intent.ACTION_VIEW).apply {
        data = Uri.parse("https://api.whatsapp.com/send?phone=$cleanPhone&text=$encodedMessage")
        setPackage("com.whatsapp")
    }
    
    try {
        context.startActivity(intent)
    } catch (e: ActivityNotFoundException) {
        // Fallback to web browser or SMS
        val browserIntent = Intent(Intent.ACTION_VIEW, Uri.parse("https://wa.me/$cleanPhone?text=$encodedMessage"))
        context.startActivity(browserIntent)
    }
}
```

---

## 3. Background Location Tracking Service (Foreground Service)

To continuously track tourists and detect geofence deviations even when the screen is locked:

```kotlin
class TouristLocationService : Service() {
    private lateinit var fusedLocationClient: FusedLocationProviderClient
    private lateinit var locationCallback: LocationCallback

    override fun onCreate() {
        super.onCreate()
        fusedLocationClient = LocationServices.getFusedLocationProviderClient(this)
        
        locationCallback = object : LocationCallback() {
            override fun onLocationResult(locationResult: LocationResult) {
                for (location in locationResult.locations) {
                    // 1. Broadcast to Supabase location_logs table
                    // 2. Check geofence proximity to hazard/caution zones
                    // 3. Update active SOS if emergency mode is active
                }
            }
        }
    }

    override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
        val notification = createPersistentSafetyNotification()
        startForeground(NOTIFICATION_ID, notification)
        startLocationUpdates()
        return START_STICKY
    }
}
```

---

## 4. Screen Mapping (Web vs Android)

| Screen | Web (React + TS) | Android (Kotlin + Jetpack Compose) |
|---|---|---|
| **1. Auth** | `LoginPage.tsx`, `OTPVerification.tsx` | `LoginScreen.kt`, `OtpVerificationScreen.kt` |
| **2. Home** | `HomePage.tsx` | `HomeScreen.kt` (Dashboard with circular Safety Score) |
| **3. Map** | `MapPage.tsx` (Leaflet) | `MapScreen.kt` (Google Maps Compose / osmdroid) |
| **4. Routes** | `RoutesPage.tsx` | `RouteNavigationScreen.kt` + Text-to-Speech (`android.speech.tts`) |
| **5. Facilities** | `FacilitiesPage.tsx` | `FacilitiesListScreen.kt` + Direct `ACTION_DIAL` Intents |
| **6. SOS** | `SOSPage.tsx` (Pulse Animation, WhatsApp) | `SosEmergencyScreen.kt` (Hardware Volume Key SOS Trigger) |
| **7. Profile** | `ProfilePage.tsx` | `ProfileScreen.kt` + Contact Picker Intent |
