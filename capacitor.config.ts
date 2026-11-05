import type { CapacitorConfig } from '@capacitor/cli'

/**
 * کانفیگ Capacitor — پوسته اندرویدی اپ «کارلیست».
 *
 * اپ هوشمند است: موقع اولین اجرا، خودش آدرس سرور را از کاربر می‌پرسد
 * (صفحه splash در پوشه cap-web). پس لازم نیست آدرس را اینجا قفل کنی.
 *
 * اگر خواستی آدرس را ثابت داخل APK بگذاری، حالت زیر را فعال کن:
 *   server: { url: 'https://karlist.example.com', cleartext: false }
 */
const config: CapacitorConfig = {
  appId: 'com.karlist.app',
  appName: 'کارلیست',
  webDir: 'cap-web',
}

export default config
