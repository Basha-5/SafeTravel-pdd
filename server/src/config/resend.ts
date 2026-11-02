import { Resend } from 'resend';
import dotenv from 'dotenv';
dotenv.config();

const resendApiKey = process.env.RESEND_API_KEY || 're_placeholder_api_key';
export const resend = new Resend(resendApiKey);

const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || 'SafeTravel <onboarding@resend.dev>';

/**
 * 1. Send OTP Verification Code Email
 */
export const sendOTPEmail = async (toEmail: string, otpCode: string) => {
  try {
    const response = await resend.emails.send({
      from: FROM_EMAIL,
      to: toEmail,
      subject: `🛡️ ${otpCode} is your SafeTravel Security Code`,
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 560px; margin: auto; padding: 32px 24px; border: 1px solid #e2e8f0; border-radius: 20px; background: #ffffff;">
          <div style="text-align: center; margin-bottom: 24px;">
            <div style="display: inline-block; padding: 12px; background: #eff6ff; border-radius: 16px;">
              <span style="font-size: 32px;">🛡️</span>
            </div>
            <h2 style="color: #0f172a; margin: 12px 0 4px 0; font-size: 24px; font-weight: 800;">SafeTravel Authentication</h2>
            <p style="color: #64748b; font-size: 14px; margin: 0;">Tourist Safety & Monitoring Verification</p>
          </div>

          <p style="color: #334155; font-size: 15px; line-height: 1.6;">
            Hello Traveler,<br/>
            Please use the one-time security code below to complete your authentication:
          </p>

          <div style="font-size: 36px; font-weight: 900; letter-spacing: 8px; color: #2563eb; background: #f8fafc; border: 2px dashed #93c5fd; padding: 20px; border-radius: 16px; text-align: center; margin: 24px 0;">
            ${otpCode}
          </div>

          <div style="background: #f1f5f9; padding: 14px; border-radius: 12px; font-size: 13px; color: #475569; margin-bottom: 24px;">
            ⏱️ <b>Notice:</b> This code is valid for <b>10 minutes</b>. Never share this token with anyone.
          </div>

          <hr style="border: none; border-top: 1px solid #f1f5f9; margin: 24px 0;"/>
          <p style="color: #94a3b8; font-size: 12px; text-align: center; margin: 0;">
            SafeTravel Global Tourist Security System • GPS Satellites Connected
          </p>
        </div>
      `,
    });
    console.log('✅ Resend OTP Email dispatched:', response);
    return response;
  } catch (error) {
    console.error('❌ Resend OTP Email error:', error);
    return null;
  }
};

/**
 * 2. Send Emergency SOS Broadcast Email to Emergency Contacts
 */
export const sendSOSAlertEmail = async (
  toEmail: string,
  details: {
    touristName: string;
    latitude: number;
    longitude: number;
    locationUrl: string;
    message?: string;
    time?: string;
  }
) => {
  try {
    const { touristName, latitude, longitude, locationUrl, message, time } = details;
    const formattedTime = time || new Date().toLocaleString();

    const response = await resend.emails.send({
      from: FROM_EMAIL,
      to: toEmail,
      subject: `🚨 EMERGENCY ALERT: ${touristName} triggered SOS in SafeTravel!`,
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: auto; padding: 32px 24px; border: 2px solid #ef4444; border-radius: 20px; background: #ffffff;">
          <div style="background: #fef2f2; border: 1px solid #fecaca; padding: 16px; border-radius: 16px; text-align: center; margin-bottom: 24px;">
            <span style="font-size: 40px;">🚨</span>
            <h1 style="color: #b91c1c; margin: 8px 0 4px 0; font-size: 24px; font-weight: 900;">URGENT SOS EMERGENCY BROADCAST</h1>
            <p style="color: #dc2626; font-size: 14px; font-weight: 600; margin: 0;">Tourist Safety Beacon Activated</p>
          </div>

          <p style="color: #1e293b; font-size: 16px; line-height: 1.6;">
            <b>${touristName}</b> has activated the Emergency SOS alert on SafeTravel and requires immediate assistance.
          </p>

          <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 14px; padding: 18px; margin: 20px 0;">
            <p style="margin: 0 0 10px 0; font-size: 14px; color: #475569;">
              <b>Incident Time:</b> ${formattedTime}
            </p>
            <p style="margin: 0 0 10px 0; font-size: 14px; color: #475569;">
              <b>GPS Coordinates:</b> ${latitude.toFixed(5)}° N, ${longitude.toFixed(5)}° E
            </p>
            <p style="margin: 0; font-size: 14px; color: #475569;">
              <b>Emergency Message:</b> "${message || 'I need help! Please contact me immediately!'}"
            </p>
          </div>

          <div style="text-align: center; margin: 28px 0;">
            <a href="${locationUrl}" target="_blank" style="display: inline-block; background: #dc2626; color: #ffffff; text-decoration: none; padding: 16px 32px; border-radius: 12px; font-weight: 800; font-size: 16px; box-shadow: 0 4px 14px rgba(220, 38, 38, 0.4);">
              📍 Open Live Location on Google Maps
            </a>
          </div>

          <div style="background: #eff6ff; border: 1px solid #bfdbfe; padding: 14px; border-radius: 12px; font-size: 13px; color: #1e40af;">
            📞 <b>Recommended Action:</b> Call the tourist immediately, alert local emergency authorities (Police: 100/112, Ambulance: 108), or contact the relevant consulate.
          </div>

          <hr style="border: none; border-top: 1px solid #f1f5f9; margin: 24px 0;"/>
          <p style="color: #94a3b8; font-size: 12px; text-align: center; margin: 0;">
            Automated Emergency Dispatch • SafeTravel Tourist Protection Platform
          </p>
        </div>
      `,
    });
    console.log('✅ Resend SOS Alert Email dispatched:', response);
    return response;
  } catch (error) {
    console.error('❌ Resend SOS Alert Email error:', error);
    return null;
  }
};

/**
 * 3. Send Safety & Weather Advisory Notification Email
 */
export const sendSafetyAdvisoryEmail = async (
  toEmail: string,
  details: {
    title: string;
    description: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
    locationName?: string;
  }
) => {
  try {
    const { title, description, severity, locationName } = details;
    const severityColor = severity === 'critical' || severity === 'high' ? '#ef4444' : '#f59e0b';

    const response = await resend.emails.send({
      from: FROM_EMAIL,
      to: toEmail,
      subject: `⚠️ SafeTravel Advisory: ${title}`,
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 560px; margin: auto; padding: 28px 24px; border: 1px solid #e2e8f0; border-radius: 18px; background: #ffffff;">
          <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 16px;">
            <span style="font-size: 28px;">⚠️</span>
            <div>
              <h3 style="margin: 0; color: #0f172a; font-size: 18px; font-weight: 800;">${title}</h3>
              <span style="display: inline-block; background: ${severityColor}; color: white; padding: 2px 8px; border-radius: 6px; font-size: 11px; font-weight: 700; text-transform: uppercase; margin-top: 4px;">
                ${severity} Risk
              </span>
            </div>
          </div>

          <p style="color: #334155; font-size: 14px; line-height: 1.6;">${description}</p>
          ${locationName ? `<p style="color: #64748b; font-size: 13px;"><b>Affected Area:</b> ${locationName}</p>` : ''}

          <div style="background: #f8fafc; padding: 12px; border-radius: 10px; font-size: 12px; color: #64748b; margin-top: 20px;">
            Stay inside verified safe zones and avoid isolated corridors after sunset.
          </div>
        </div>
      `,
    });
    return response;
  } catch (error) {
    console.error('❌ Resend Safety Advisory Email error:', error);
    return null;
  }
};

/**
 * 4. Send Trip Itinerary / Safe Route Share Email
 */
export const sendTripShareEmail = async (
  toEmail: string,
  details: {
    touristName: string;
    source: string;
    destination: string;
    safetyScore: number;
    distance: number;
    duration: number;
    locationUrl: string;
  }
) => {
  try {
    const { touristName, source, destination, safetyScore, distance, duration, locationUrl } = details;

    const response = await resend.emails.send({
      from: FROM_EMAIL,
      to: toEmail,
      subject: `🗺️ ${touristName} is sharing their SafeTravel journey with you`,
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 560px; margin: auto; padding: 28px 24px; border: 1px solid #e2e8f0; border-radius: 18px; background: #ffffff;">
          <h2 style="color: #2563eb; margin: 0 0 12px 0;">SafeTravel Journey Update</h2>
          <p style="color: #334155; font-size: 14px; line-height: 1.5;">
            <b>${touristName}</b> has shared their current travel route with you:
          </p>

          <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 14px; padding: 16px; margin: 16px 0;">
            <p style="margin: 0 0 8px 0; font-size: 14px;"><b>From:</b> ${source}</p>
            <p style="margin: 0 0 8px 0; font-size: 14px;"><b>To:</b> ${destination}</p>
            <p style="margin: 0 0 8px 0; font-size: 14px;"><b>Distance & ETA:</b> ${distance} km (~${duration} mins)</p>
            <p style="margin: 0; font-size: 14px; color: #16a34a;"><b>Route Safety Rating:</b> ${safetyScore}% Verified Safe</p>
          </div>

          <div style="text-align: center; margin: 24px 0;">
            <a href="${locationUrl}" target="_blank" style="display: inline-block; background: #2563eb; color: #ffffff; text-decoration: none; padding: 12px 24px; border-radius: 10px; font-weight: 700; font-size: 14px;">
              View Live Route & Tracking
            </a>
          </div>
        </div>
      `,
    });
    return response;
  } catch (error) {
    console.error('❌ Resend Trip Share Email error:', error);
    return null;
  }
};
