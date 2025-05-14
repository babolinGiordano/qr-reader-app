import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import {QrReaderComponent} from './qr-reader/qr-reader.component';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter([
      { path: '', component: QrReaderComponent },
      { path: '**', redirectTo: '' }
    ])
  ]
};
