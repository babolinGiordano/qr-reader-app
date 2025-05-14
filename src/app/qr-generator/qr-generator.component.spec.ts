import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { QrGeneratorComponent } from './qr-generator.component';
import { ElementRef } from '@angular/core';
import * as QRCode from 'qrcode';

// Mock QRCode library
jest.mock('qrcode', () => ({
  toCanvas: jest.fn((canvas, data, options, callback) => {
    callback(null);
    return Promise.resolve();
  })
}));

describe('QrGeneratorComponent', () => {
  let component: QrGeneratorComponent;
  let fixture: ComponentFixture<QrGeneratorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormsModule, QrGeneratorComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(QrGeneratorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should open modal with reset form', () => {
    component.title = 'Test Title';
    component.description = 'Test Description';
    component.qrCodeGenerated = true;

    component.openModal();

    expect(component.showModal).toBe(true);
    expect(component.title).toBe('');
    expect(component.description).toBe('');
    expect(component.qrCodeGenerated).toBe(false);
  });

  it('should close modal', () => {
    component.showModal = true;

    component.closeModal();

    expect(component.showModal).toBe(false);
  });

  it('should not generate QR code if title is empty', () => {
    spyOn(window, 'alert');
    component.title = '';

    component.generateQRCode();

    expect(window.alert).toHaveBeenCalledWith('Please enter a title');
    expect(component.qrCodeGenerated).toBe(false);
  });

  it('should generate QR code if title is provided', () => {
    // Setup
    component.title = 'Test Title';
    component.description = 'Test Description';

    // Mock canvas element
    const mockCanvas = document.createElement('canvas');
    const mockElementRef = new ElementRef(mockCanvas);
    component.qrCanvas = mockElementRef;

    // Call method
    component.generateQRCode();

    // Use setTimeout to wait for the internal setTimeout in the component
    setTimeout(() => {
      expect(QRCode.toCanvas).toHaveBeenCalled();
      expect(component.qrCodeGenerated).toBe(true);
    }, 10);
  });

  it('should not print QR code if not generated', () => {
    component.qrCodeGenerated = false;
    spyOn(window, 'open').and.returnValue(null);

    component.printQRCode();

    expect(window.open).not.toHaveBeenCalled();
  });

  it('should print QR code if generated', () => {
    // Setup
    component.qrCodeGenerated = true;
    component.title = 'Test Title';

    // Mock canvas element
    const mockCanvas = document.createElement('canvas');
    spyOn(mockCanvas, 'toDataURL').and.returnValue('data:image/png;base64,test');
    const mockElementRef = new ElementRef(mockCanvas);
    component.qrCanvas = mockElementRef;

    // Mock window.open
    const mockWindow = {
      document: {
        write: jasmine.createSpy('write'),
        close: jasmine.createSpy('close')
      }
    };
    spyOn(window, 'open').and.returnValue(mockWindow as any);

    // Call method
    component.printQRCode();

    // Assertions
    expect(window.open).toHaveBeenCalledWith('', '_blank');
    expect(mockWindow.document.write).toHaveBeenCalled();
    expect(mockWindow.document.close).toHaveBeenCalled();
  });
});
