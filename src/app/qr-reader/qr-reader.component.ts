import { Component, ElementRef, ViewChild, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserMultiFormatReader } from '@zxing/browser';
import { QrGeneratorComponent } from '../qr-generator/qr-generator.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, QrGeneratorComponent],
  template: `
    <div class="wrapper">
      <h1>QR Code Tool</h1>
      <div class="tabs">
        <button class="tab-btn" [class.active]="activeTab === 'reader'" (click)="activeTab = 'reader'">QR Reader</button>
        <button class="tab-btn" [class.active]="activeTab === 'generator'" (click)="activeTab = 'generator'">QR Generator</button>
      </div>

      <div *ngIf="activeTab === 'reader'" class="tab-content">
        <video #video autoplay muted></video>
        <p *ngIf="result">QR Code: <strong>{{ result }}</strong></p>
        <button *ngIf="!scanning" (click)="start()">Start Scanner</button>
        <button *ngIf="scanning" (click)="stop()">Stop Scanner</button>
      </div>

      <div *ngIf="activeTab === 'generator'" class="tab-content">
        <app-qr-generator></app-qr-generator>
      </div>
    </div>
  `,
  styles: [`
    .wrapper {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 2rem;
      max-width: 800px;
      margin: 0 auto;
    }

    .tabs {
      display: flex;
      width: 100%;
      max-width: 400px;
      margin-bottom: 1.5rem;
      border-bottom: 1px solid #ddd;
    }

    .tab-btn {
      flex: 1;
      padding: 0.75rem 1rem;
      background: none;
      border: none;
      border-bottom: 3px solid transparent;
      cursor: pointer;
      font-size: 1rem;
      font-weight: 500;
      color: #666;
      transition: all 0.3s;
    }

    .tab-btn.active {
      color: #4285f4;
      border-bottom-color: #4285f4;
    }

    .tab-btn:hover:not(.active) {
      color: #333;
      background-color: #f5f5f5;
    }

    .tab-content {
      width: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    video {
      width: 100%;
      max-width: 400px;
      border: 1px solid #ccc;
      margin-bottom: 1rem;
      border-radius: 4px;
    }

    button {
      margin: 0.5rem;
      padding: 0.5rem 1rem;
      background-color: #4285f4;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      transition: background-color 0.3s;
    }

    button:hover {
      background-color: #3367d6;
    }
  `]
})
export class QrReaderComponent implements OnDestroy {
  @ViewChild('video', { static: true }) videoRef!: ElementRef<HTMLVideoElement>;

  private reader = new BrowserMultiFormatReader();
  result: string | null = null;
  scanning = false;
  activeTab: 'reader' | 'generator' = 'reader';
  private stopFn: (() => void) | undefined;

  async start() {
    this.result = null;
    try {
      const controls = await this.reader.decodeFromVideoDevice(
        undefined,
        this.videoRef.nativeElement,
        (res) => {
          if (res) {
            this.result = res.getText();
            this.stop();
          }
        }
      );
      this.stopFn = () => controls.stop();
      this.scanning = true;
    } catch (err) {
      console.error('Errore nello scanner:', err);
    }
  }

  stop() {
    if (this.stopFn) {
      this.stopFn();
      this.stopFn = undefined;
    }
    this.scanning = false;
  }

  ngOnDestroy() {
    this.stop();
  }
}
