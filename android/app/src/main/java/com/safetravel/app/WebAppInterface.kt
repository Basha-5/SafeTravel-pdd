package com.safetravel.app

import android.content.Context
import android.os.BatteryManager
import android.os.Build
import android.os.VibrationEffect
import android.os.Vibrator
import android.os.VibratorManager
import android.webkit.JavascriptInterface
import android.widget.Toast
import org.json.JSONObject

/**
 * WebAppInterface.kt
 * Exposes native Android Kotlin capabilities to the SafeTravel Web App via JavaScript interface.
 */
class WebAppInterface(private val context: Context, private val activity: MainActivity) {

    /**
     * Confirms to the web app that it is running inside the native Android Kotlin container.
     */
    @JavascriptInterface
    fun isNativeAndroid(): Boolean {
        return true
    }

    /**
     * Trigger native device vibration for tactical feedback.
     */
    @JavascriptInterface
    fun vibrateDevice(durationMs: Long) {
        val vibrator = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
            val vibratorManager = context.getSystemService(Context.VIBRATOR_MANAGER_SERVICE) as? VibratorManager
            vibratorManager?.defaultVibrator
        } else {
            @Suppress("DEPRECATION")
            context.getSystemService(Context.VIBRATOR_SERVICE) as? Vibrator
        }

        vibrator?.let {
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                it.vibrate(VibrationEffect.createOneShot(durationMs, VibrationEffect.DEFAULT_AMPLITUDE))
            } else {
                @Suppress("DEPRECATION")
                it.vibrate(durationMs)
            }
        }
    }

    /**
     * Trigger native Emergency SOS (vibrates with emergency rhythm, logs coordinates, and dispatches alerts).
     */
    @JavascriptInterface
    fun triggerNativeSOS(locationJson: String) {
        try {
            val json = JSONObject(locationJson)
            val lat = json.optDouble("latitude", 0.0)
            val lng = json.optDouble("longitude", 0.0)
            val userName = json.optString("userName", "SafeTravel Tourist")

            // 1. Heavy emergency SOS vibration pattern
            val vibrator = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
                val vm = context.getSystemService(Context.VIBRATOR_MANAGER_SERVICE) as? VibratorManager
                vm?.defaultVibrator
            } else {
                @Suppress("DEPRECATION")
                context.getSystemService(Context.VIBRATOR_SERVICE) as? Vibrator
            }

            val timings = longArrayOf(0, 500, 200, 500, 200, 500, 400, 1000)
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                vibrator?.vibrate(VibrationEffect.createWaveform(timings, -1))
            } else {
                @Suppress("DEPRECATION")
                vibrator?.vibrate(timings, -1)
            }

            // 2. Dispatch native notification toast
            activity.runOnUiThread {
                Toast.makeText(
                    context,
                    "🚨 SOS ACTIVATED! Native emergency broadcast launched for $userName at ($lat, $lng)",
                    Toast.LENGTH_LONG
                ).show()
            }

            // 3. Start background location tracking service
            startBackgroundLocationService()

        } catch (e: Exception) {
            e.printStackTrace()
        }
    }

    /**
     * Dispatch WhatsApp alert with Google Maps GPS link using native Android Intent.
     */
    @JavascriptInterface
    fun sendWhatsAppAlert(phone: String, message: String) {
        EmergencyDispatcher.dispatchWhatsAppAlert(context, phone, message)
    }

    /**
     * Display native Android Toast.
     */
    @JavascriptInterface
    fun showNativeToast(message: String) {
        activity.runOnUiThread {
            Toast.makeText(context, message, Toast.LENGTH_SHORT).show()
        }
    }

    /**
     * Read native battery percentage for tourist safety monitoring.
     */
    @JavascriptInterface
    fun getBatteryLevel(): Int {
        val bm = context.getSystemService(Context.BATTERY_SERVICE) as? BatteryManager
        return bm?.getIntProperty(BatteryManager.BATTERY_PROPERTY_CAPACITY) ?: -1
    }

    /**
     * Start the native Kotlin Foreground Service for background location tracking.
     */
    @JavascriptInterface
    fun startBackgroundLocationService() {
        TouristLocationService.startService(context)
    }

    /**
     * Stop the background location tracking service.
     */
    @JavascriptInterface
    fun stopBackgroundLocationService() {
        TouristLocationService.stopService(context)
    }
}
