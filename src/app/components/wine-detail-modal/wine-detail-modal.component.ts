import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Wine } from '../../models/wine.model';
import { WineService } from '../../services/wine.service';

@Component({
  selector: 'app-wine-detail-modal',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './wine-detail-modal.component.html',
  styleUrl: './wine-detail-modal.component.scss'
})
export class WineDetailModalComponent {
  readonly wine = inject<Wine>(MAT_DIALOG_DATA);
  private readonly dialogRef = inject(MatDialogRef<WineDetailModalComponent>);
  private readonly wineService = inject(WineService);

  get formattedPrice(): string {
    return this.wineService.formatPrice(this.wine.estimatedPrice);
  }

  get formattedYear(): string {
    return this.wineService.formatYear(this.wine.year);
  }

  get fullLocation(): string {
    return `${this.wine.wineryCity}, ${this.wine.wineryState}`;
  }

  close(): void {
    this.dialogRef.close();
  }

  openWineryWebsite(): void {
    window.open(this.wine.wineryUrl, '_blank', 'noopener,noreferrer');
  }
}
