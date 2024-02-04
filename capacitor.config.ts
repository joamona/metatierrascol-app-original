import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.metatierrascol.app',
  appName: 'MetaTierras Colombia',
  webDir: 'dist/metatierrascol',
  server: {
    androidScheme: 'https'
  }
};

export default config;
