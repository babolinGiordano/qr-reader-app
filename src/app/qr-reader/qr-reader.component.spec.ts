import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { QrReaderComponent } from './qr-reader.component';
import { QrGeneratorComponent } from '../qr-generator/qr-generator.component';
import { MockComponent } from 'ng-mocks';

describe('QrReaderComponent', () => {
  let component: QrReaderComponent;
  let fixture: ComponentFixture<QrReaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        QrReaderComponent,
        MockComponent(QrGeneratorComponent)
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QrReaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have reader as the default active tab', () => {
    expect(component.activeTab).toBe('reader');
    const readerContent = fixture.debugElement.query(By.css('.tab-content'));
    expect(readerContent).toBeTruthy();
    expect(fixture.debugElement.query(By.css('app-qr-generator'))).toBeFalsy();
  });

  it('should switch to generator tab when clicked', () => {
    const generatorTabBtn = fixture.debugElement.queryAll(By.css('.tab-btn'))[1];
    generatorTabBtn.triggerEventHandler('click', null);
    fixture.detectChanges();

    expect(component.activeTab).toBe('generator');
    expect(fixture.debugElement.query(By.css('app-qr-generator'))).toBeTruthy();
  });

  it('should start scanning when start button is clicked', () => {
    spyOn(component, 'start').and.callThrough();

    const startButton = fixture.debugElement.query(By.css('button'));
    startButton.triggerEventHandler('click', null);

    expect(component.start).toHaveBeenCalled();
  });

  it('should stop scanning when stop button is clicked', () => {
    component.scanning = true;
    fixture.detectChanges();

    spyOn(component, 'stop').and.callThrough();

    const stopButton = fixture.debugElement.query(By.css('button'));
    stopButton.triggerEventHandler('click', null);

    expect(component.stop).toHaveBeenCalled();
  });
});
