import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExportFileButtonsComponent } from './export-file-buttons.component';

describe('ExportFileButtonsComponent', () => {
  let component: ExportFileButtonsComponent;
  let fixture: ComponentFixture<ExportFileButtonsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExportFileButtonsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExportFileButtonsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
