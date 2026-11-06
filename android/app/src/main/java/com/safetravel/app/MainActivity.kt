package com.safetravel.app

import android.Manifest
import android.annotation.SuppressLint
import android.content.pm.PackageManager
import android.os.Bundle
import android.view.KeyEvent
import android.webkit.GeolocationPermissions
import android.webkit.WebChromeClient
import android.webkit.WebSettings
import android.webkit.WebView
import android.webkit.WebViewClient
import android.widget.Toast
import androidx.activity.OnBackPressedCallback
import androidx.appcompat.app.AppCompatActivity
import androidx.core.app.ActivityCompat
import androidx.core.content.ContextCompat

/**
 * MainActivity.kt
 * Primary Native Android Activity written in Kotlin 2.0.
 * Hosts the SafeTravel responsive Web Application, injects native Kotlin WebAppInterface,
 * and intercepts physical hardware buttons for emergency triggers.
 */
class MainActivity : AppCompatActivity() {

    private lateinit var webView: WebView
    private val LOCATION_PERMISSION_REQUEST_CODE = 1001

    // Hardware volume button double-press emergency trigger detection
    private var lastVolumeDownTime: Long = 0
    private val DOUBLE_CLICK_TIME_DELTA: Long = 400 // ms

    @SuppressLint("SetJavaScriptEnabled")
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        // Initialize WebView
        webView = WebView(this)
        setContentView(webView)

        setupWebSettings()
        setupClients()
        requestEssentialPermissions()
        handleBackNavigation()

        // Load the SafeTravel web app
        // In development: points to local server; in production: loads bundled assets or deployed URL
        val targetUrl = "http://10.0.2.2:3000" // Android Emulator localhost bridge or deployed URL
        webView.loadUrl(targetUrl)
    }

    @SuppressLint("SetJavaScriptEnabled")
    private fun setupWebSettings() {
        webView.settings.apply {
            javaScriptEnabled = true
            domStorageEnabled = true
            databaseEnabled = true
            setGeolocationEnabled(true)
            mixedContentMode = WebSettings.MIXED_CONTENT_ALWAYS_ALLOW
            useWideViewPort = true
            loadWithOverviewMode = true
            cacheMode = WebSettings.LOAD_DEFAULT
            allowFileAccess = true
            allowContentAccess = true
        }

        // Register the Kotlin WebAppInterface bridge into JavaScript as 'window.Android'
        webView.addJavascriptInterface(WebAppInterface(this, this), "Android")
    }

    private fun setupClients() {
        // Handle internal navigation without launching external browser
        webView.webViewClient = object : WebViewClient() {
            override fun shouldOverrideUrlLoading(view: WebView?, url: String?): Boolean {
                if (url != null && (url.startsWith("tel:") || url.startsWith("whatsapp:") || url.startsWith("mailto:"))) {
                    EmergencyDispatcher.dispatchWhatsAppAlert(this@MainActivity, "", url)
                    return true
                }
                return false
            }
        }

        // Handle GPS permission requests from the Web App Leaflet/Google Map components
        webView.webChromeClient = object : WebChromeClient() {
            override fun onGeolocationPermissionsShowPrompt(
                origin: String?,
                callback: GeolocationPermissions.Callback?
            ) {
                // Grant geolocation access to the web app
                callback?.invoke(origin, true, false)
            }
        }
    }

    private fun requestEssentialPermissions() {
        val permissions = arrayOf(
            Manifest.permission.ACCESS_FINE_LOCATION,
            Manifest.permission.ACCESS_COARSE_LOCATION,
            Manifest.permission.VIBRATE,
            Manifest.permission.INTERNET
        )

        val neededPermissions = permissions.filter {
            ContextCompat.checkSelfPermission(this, it) != PackageManager.PERMISSION_GRANTED
        }

        if (neededPermissions.isNotEmpty()) {
            ActivityCompat.requestPermissions(
                this,
                neededPermissions.toTypedArray(),
                LOCATION_PERMISSION_REQUEST_CODE
            )
        }
    }

    private fun handleBackNavigation() {
        onBackPressedDispatcher.addCallback(this, object : OnBackPressedCallback(true) {
            override fun handleOnBackPressed() {
                if (webView.canGoBack()) {
                    webView.goBack()
                } else {
                    finish()
                }
            }
        })
    }

    /**
     * Intercept physical volume buttons:
     * Rapid double-press on Volume Down triggers native emergency SOS broadcast!
     */
    override fun onKeyDown(keyCode: Int, event: KeyEvent?): Boolean {
        if (keyCode == KeyEvent.KEYCODE_VOLUME_DOWN) {
            val clickTime = System.currentTimeMillis()
            if (clickTime - lastVolumeDownTime < DOUBLE_CLICK_TIME_DELTA) {
                // Rapid double-press detected!
                Toast.makeText(this, "🚨 HARDWARE EMERGENCY SOS TRIGGERED!", Toast.LENGTH_LONG).show()
                // Dispatch event directly into the web application React context
                webView.evaluateJavascript("window.dispatchEvent(new CustomEvent('hardware-sos-triggered'));", null)
                return true
            }
            lastVolumeDownTime = clickTime
        }
        return super.onKeyDown(keyCode, event)
    }

    override fun onDestroy() {
        webView.destroy()
        super.onDestroy()
    }
}
