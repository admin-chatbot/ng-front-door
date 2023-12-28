import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceParameterComponent } from './service-parameter.component';

describe('ServiceParameterComponent', () => {
  let component: ServiceParameterComponent;
  let fixture: ComponentFixture<ServiceParameterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ServiceParameterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ServiceParameterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
