/**
 * AndroidBridge.ts
 * Provides JavaScript <-> Kotlin two-way communication when the web app runs inside the native Android container.
 */

declare global {
  interface Window {
    Android?: {
      isNativeAndroid: () => boolean;
      triggerNativeSOS: (locationJson: string) => void;
      vibrateDevice: (durationMs: number) => void;
      sendWhatsAppAlert: (phone: string, message: string) => void;
      showNativeToast: (message: string) => void;
      getBatteryLevel: () => number;
      startBackgroundLocationService: () => void;
      stopBackgroundLocationService: () => void;
    };
  }
}

export const androidBridge = {
  /**
   * Check if running inside the native Android Kotlin container
   */
  isNative(): boolean {
    return typeof window !== 'undefined' && Boolean(window.Android?.isNativeAndroid());
  },

  /**
   * Trigger native Android SOS siren, emergency vibration, and auto-dispatch
   */
  triggerSOS(latitude: number, longitude: number, userName?: string): void {
    if (this.isNative()) {
      const payload = JSON.stringify({
        latitude,
        longitude,
        userName: userName || 'SafeTravel Tourist',
        timestamp: new Date().toISOString(),
      });
      window.Android?.triggerNativeSOS(payload);
    } else {
      console.log('🌐 Web mode: Native Android bridge not active');
    }
  },

  /**
   * Native device vibration for tactile feedback
   */
  vibrate(durationMs: number = 300): void {
    if (this.isNative()) {
      window.Android?.vibrateDevice(durationMs);
    } else if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      navigator.vibrate(durationMs);
    }
  },

  /**
   * Dispatch native WhatsApp message with location link
   */
  sendWhatsApp(phone: string, message: string): void {
    if (this.isNative()) {
      window.Android?.sendWhatsAppAlert(phone, message);
    } else {
      const cleanPhone = phone.replace(/[^0-9]/g, '');
      const url = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
      window.open(url, '_blank');
    }
  },

  /**
   * Show native Android Toast notification
   */
  showToast(message: string): void {
    if (this.isNative()) {
      window.Android?.showNativeToast(message);
    }
  },

  /**
   * Start Android Kotlin Background Foreground Location Service
   */
  startBackgroundTracking(): void {
    if (this.isNative()) {
      window.Android?.startBackgroundLocationService();
    }
  },
};

export default androidBridge;
