import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatDividerModule } from '@angular/material/divider';
import { PairingService } from '../../services/pairing.service';
import { Pairing } from '../../models/pairing.model';
import { WineRecommendationsComponent } from '../wine-recommendations/wine-recommendations.component';

@Component({
  selector: 'app-wine-finder',
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatSelectModule,
    MatCardModule,
    MatListModule,
    MatDividerModule,
    WineRecommendationsComponent
  ],
  templateUrl: './wine-finder.component.html',
  styleUrl: './wine-finder.component.scss'
})
export class WineFinderComponent {
  private readonly pairingService = inject(PairingService);

  readonly categories = this.pairingService.categories;
  readonly selectedCategory = signal<string>('');
  readonly selectedSubCategory = signal<string>('');

  readonly subCategories = computed(() => {
    const category = this.selectedCategory();
    if (!category) return [];
    return this.pairingService.getSubCategories(category);
  });

  readonly currentPairing = computed<Pairing | null>(() => {
    const category = this.selectedCategory();
    const subCategory = this.selectedSubCategory();
    if (!category || !subCategory) return null;
    return this.pairingService.getPairing(category, subCategory) || null;
  });

  readonly showResults = computed(() => this.currentPairing() !== null);
  readonly showInstructions = computed(() => !this.showResults());

  onCategoryChange(category: string): void {
    this.selectedCategory.set(category);
    this.selectedSubCategory.set('');
  }

  onSubCategoryChange(subCategory: string): void {
    this.selectedSubCategory.set(subCategory);
  }

  capitalize(text: string): string {
    return text.charAt(0).toUpperCase() + text.slice(1);
  }
}
