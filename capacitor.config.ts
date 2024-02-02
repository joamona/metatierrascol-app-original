import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.landsurvey.app',
  appName: 'MetaTierras Colombia',
  webDir: 'dist/land-survey',
  server: {
    androidScheme: 'https'
  }
};

export default config;
