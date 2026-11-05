import type { CapacitorConfig } from '@capacitor/cli'

/**
 * کانفیگ Capacitor — پوسته اندرویدی اپ «کارلیست».
 *
 * اپ هوشمند است: موقع اولین اجرا، خودش آدرس سرور را از کاربر می‌پرسد
 * (صفحه splash در پوشه cap-web). پس لازم نیست آدرس را اینجا قفل کنی.
 *
 * نکته مهم: بدون allowNavigation، کاپسیتور آدرس سرور را در «مرورگر خارجی»
 * گوشی باز می‌کند! با allowNavigation: ['*'] هر آدرسی که کاربر وارد کند
 * داخل خود اپ (وب‌ویو) باز می‌شود — این کلیدِ اتصال به هر سروری است.
 */
const config: CapacitorConfig = {
  appId: 'com.karlist.app',
  appName: 'کارلیست',
  webDir: 'cap-web',
  server: {
    allowNavigation: ['*'],
  },
}

export default config
