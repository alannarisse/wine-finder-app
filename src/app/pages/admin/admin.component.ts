import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTabsModule } from '@angular/material/tabs';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Wine } from '../../models/wine.model';
import { WineService } from '../../services/wine.service';
import { AuthService } from '../../services/auth.service';
import { WineFormDialogComponent } from '../../components/wine-form-dialog/wine-form-dialog.component';
import { VarietalMappingComponent } from '../../components/varietal-mapping/varietal-mapping.component';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatSnackBarModule,
    MatTabsModule,
    MatChipsModule,
    MatTooltipModule,
    VarietalMappingComponent
  ],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.scss'
})
export class AdminComponent {
  private readonly wineService = inject(WineService);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly dialog = inject(MatDialog);
  private readonly snackBar = inject(MatSnackBar);

  readonly wines = signal<Wine[]>([]);
  readonly displayedColumns = ['thumbnail', 'wineName', 'wineryName', 'varietal', 'year', 'price', 'actions'];

  constructor() {
    this.loadWines();
  }

  private loadWines(): void {
    this.wines.set(this.wineService.getAllWines());
  }

  openAddDialog(): void {
    const dialogRef = this.dialog.open(WineFormDialogComponent, {
      width: '600px',
      maxWidth: '95vw',
      data: { wine: null, mode: 'add' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.wineService.addWine(result);
        this.loadWines();
        this.snackBar.open('Wine added successfully', 'Close', { duration: 3000 });
      }
    });
  }

  openEditDialog(wine: Wine): void {
    const dialogRef = this.dialog.open(WineFormDialogComponent, {
      width: '600px',
      maxWidth: '95vw',
      data: { wine, mode: 'edit' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.wineService.updateWine(result);
        this.loadWines();
        this.snackBar.open('Wine updated successfully', 'Close', { duration: 3000 });
      }
    });
  }

  deleteWine(wine: Wine): void {
    if (confirm(`Are you sure you want to delete "${wine.wineName}"?`)) {
      this.wineService.deleteWine(wine.id);
      this.loadWines();
      this.snackBar.open('Wine deleted', 'Close', { duration: 3000 });
    }
  }

  formatPrice(price: number): string {
    return this.wineService.formatPrice(price);
  }

  formatYear(year: number | null): string {
    return this.wineService.formatYear(year);
  }

  exportData(): void {
    const data = this.wineService.exportData();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'wine-data-export.json';
    a.click();
    URL.revokeObjectURL(url);
    this.snackBar.open('Data exported successfully', 'Close', { duration: 3000 });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/']);
  }
}
