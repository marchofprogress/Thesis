import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PdfExtractComponent } from './pdf-extract.component';

describe('PdfExtractComponent', () => {
  let component: PdfExtractComponent;
  let fixture: ComponentFixture<PdfExtractComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PdfExtractComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PdfExtractComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
