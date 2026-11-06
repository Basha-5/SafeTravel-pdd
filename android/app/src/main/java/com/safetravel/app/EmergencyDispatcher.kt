package com.safetravel.app

import android.content.ActivityNotFoundException
import android.content.Context
import android.content.Intent
import android.net.Uri
import android.widget.Toast
import java.net.URLEncoder

/**
 * EmergencyDispatcher.kt
 * Handles native Android Intent dispatches for Emergency SOS (WhatsApp, SMS, Phone).
 */
object EmergencyDispatcher {

    /**
     * Dispatch WhatsApp alert with tourist GPS link using Android ACTION_VIEW intent.
     */
    fun dispatchWhatsAppAlert(context: Context, contactPhone: String, message: String) {
        val cleanPhone = contactPhone.replace("+", "").replace(" ", "").replace("-", "")
        val encodedMessage = try {
            URLEncoder.encode(message, "UTF-8")
        } catch (e: Exception) {
            message
        }

        // Try direct WhatsApp package intent first
        val intent = Intent(Intent.ACTION_VIEW).apply {
            data = Uri.parse("https://api.whatsapp.com/send?phone=$cleanPhone&text=$encodedMessage")
            setPackage("com.whatsapp")
            flags = Intent.FLAG_ACTIVITY_NEW_TASK
        }

        try {
            context.startActivity(intent)
        } catch (e: ActivityNotFoundException) {
            // Fallback to browser WhatsApp Web / wa.me
            val fallbackIntent = Intent(Intent.ACTION_VIEW).apply {
                data = Uri.parse("https://wa.me/$cleanPhone?text=$encodedMessage")
                flags = Intent.FLAG_ACTIVITY_NEW_TASK
            }
            try {
                context.startActivity(fallbackIntent)
            } catch (ex: Exception) {
                Toast.makeText(context, "WhatsApp not installed on device", Toast.LENGTH_SHORT).show()
            }
        }
    }

    /**
     * Dispatch native Emergency SMS.
     */
    fun dispatchSmsAlert(context: Context, contactPhone: String, message: String) {
        val smsIntent = Intent(Intent.ACTION_SENDTO).apply {
            data = Uri.parse("smsto:$contactPhone")
            putExtra("sms_body", message)
            flags = Intent.FLAG_ACTIVITY_NEW_TASK
        }
        try {
            context.startActivity(smsIntent)
        } catch (e: Exception) {
            Toast.makeText(context, "Unable to launch SMS composer", Toast.LENGTH_SHORT).show()
        }
    }

    /**
     * Direct Emergency Dialer Intent (e.g. 112, 911, 100).
     */
    fun dialEmergencyNumber(context: Context, emergencyNumber: String) {
        val dialIntent = Intent(Intent.ACTION_DIAL).apply {
            data = Uri.parse("tel:$emergencyNumber")
            flags = Intent.FLAG_ACTIVITY_NEW_TASK
        }
        try {
            context.startActivity(dialIntent)
        } catch (e: Exception) {
            Toast.makeText(context, "Unable to initiate call", Toast.LENGTH_SHORT).show()
        }
    }
}
