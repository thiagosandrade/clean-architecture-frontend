import { TestBed } from '@angular/core/testing';
import { AppComponent } from './app';

beforeEach(() => {

  Object.defineProperty(window, 'localStorage', {
    value: {
      getItem: () => null,
      setItem: () => {},
      removeItem: () => {},
      clear: () => {},
    },
    writable: true
  });

});

describe('AppComponent', () => {

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        AppComponent
      ]
    }).compileComponents();
  });


  it('should create the application', () => {

    const fixture =
      TestBed.createComponent(AppComponent);

    const app =
      fixture.componentInstance;

    expect(app).toBeTruthy();

  });

});