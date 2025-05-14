import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import {QrReaderComponent} from './app/qr-reader/qr-reader.component';

bootstrapApplication(QrReaderComponent, appConfig)
  .catch((err) => console.error(err));

