import { Component, Input, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { Wine } from '../../models/wine.model';
import { WineService } from '../../services/wine.service';
import { WineDetailModalComponent } from '../wine-detail-modal/wine-detail-modal.component';

@Component({
  selector: 'app-wine-recommendations',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule
  ],
  templateUrl: './wine-recommendations.component.html',
  styleUrl: './wine-recommendations.component.scss'
})
export class WineRecommendationsComponent {
  private readonly wineService = inject(WineService);
  private readonly dialog = inject(MatDialog);

  /**
   * Array of varietal suggestions from the pairing (e.g., ["Pinot Noir", "Chardonnay"])
   */
  @Input() set pairingSuggestions(value: string[]) {
    this._pairingSuggestions.set(value || []);
  }

  private readonly _pairingSuggestions = signal<string[]>([]);

  readonly recommendationMessage = this.wineService.recommendationMessage;

  readonly recommendedWines = computed(() => {
    const suggestions = this._pairingSuggestions();
    if (suggestions.length === 0) return [];
    return this.wineService.getWineRecommendations(suggestions, 10);
  });

  readonly hasRecommendations = computed(() => this.recommendedWines().length > 0);

  formatPrice(price: number): string {
    return this.wineService.formatPrice(price);
  }

  formatYear(year: number | null): string {
    return this.wineService.formatYear(year);
  }

  openWineDetail(wine: Wine): void {
    this.dialog.open(WineDetailModalComponent, {
      data: wine,
      panelClass: 'wine-detail-dialog',
      maxWidth: '500px',
      width: '90vw'
    });
  }
}
