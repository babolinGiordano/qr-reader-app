import { Component, ElementRef, ViewChild, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import * as QRCode from 'qrcode';

@Component({
  selector: 'app-qr-generator',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './qr-generator.component.html',
  styleUrls: ['./qr-generator.component.scss']
})
export class QrGeneratorComponent {
  @ViewChild('qrCanvas', { static: false }) qrCanvas!: ElementRef<HTMLCanvasElement>;

  title: string = '';
  description: string = '';
  showModal: boolean = false;
  qrCodeGenerated: boolean = false;

  constructor(private cdr: ChangeDetectorRef) {}

  openModal() {
    this.showModal = true;
    this.title = '';
    this.description = '';
    this.qrCodeGenerated = false;
  }

  closeModal() {
    this.showModal = false;
  }

  generateQRCode() {
    if (!this.title.trim()) {
      alert('Please enter a title');
      return;
    }

    console.log('Generating QR code...');
    console.log('Canvas element:', this.qrCanvas);

    const qrData = JSON.stringify({
      title: this.title,
      description: this.description
    });

    if (this.qrCanvas && this.qrCanvas.nativeElement) {
      console.log('Canvas element is available');

      // Clear the canvas first
      const context = this.qrCanvas.nativeElement.getContext('2d');
      if (context) {
        context.clearRect(0, 0, this.qrCanvas.nativeElement.width, this.qrCanvas.nativeElement.height);
      }

      // Set a small timeout to ensure the canvas is ready
      setTimeout(() => {
        QRCode.toCanvas(this.qrCanvas.nativeElement, qrData, { width: 300 }, (error) => {
          if (error) {
            console.error('Error generating QR code:', error);
          } else {
            console.log('QR code generated successfully');
            this.qrCodeGenerated = true;
            this.cdr.detectChanges();
          }
        });
      }, 100);
    } else {
      console.error('Canvas element is not available');
    }
  }

  printQRCode() {
    if (!this.qrCodeGenerated) return;

    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert('Please allow popups for this website');
      return;
    }

    const qrCodeImg = this.qrCanvas.nativeElement.toDataURL('image/png');

    printWindow.document.write(`
      <html>
        <head>
          <title>Print QR Code</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              text-align: center;
              padding: 20px;
            }
            .qr-label {
              max-width: 300px;
              margin: 0 auto;
              border: 1px solid #ccc;
              padding: 15px;
              border-radius: 5px;
            }
            h2 {
              margin-top: 0;
              margin-bottom: 10px;
            }
            p {
              margin-bottom: 15px;
            }
            img {
              max-width: 100%;
            }
          </style>
        </head>
        <body>
          <div class="qr-label">
            <h2>${this.title}</h2>
            ${this.description ? `<p>${this.description}</p>` : ''}
            <img src="${qrCodeImg}" alt="QR Code">
          </div>
          <script>
            window.onload = function() {
              setTimeout(function() {
                window.print();
                window.close();
              }, 500);
            };
          </script>
        </body>
      </html>
    `);

    printWindow.document.close();
  }
}
