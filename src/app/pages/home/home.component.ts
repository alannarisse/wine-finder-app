import { Component } from '@angular/core';
import { WineFinderComponent } from '../../components/wine-finder/wine-finder.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [WineFinderComponent],
  template: `<app-wine-finder></app-wine-finder>`
})
export class HomeComponent {}
