import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { WineService } from '../../services/wine.service';
import { Wine } from '../../models/wine.model';

@Component({
  selector: 'app-varietal-mapping',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatExpansionModule,
    MatChipsModule,
    MatIconModule,
    MatButtonModule,
    MatSelectModule,
    MatFormFieldModule,
    MatSnackBarModule,
  ],
  templateUrl: './varietal-mapping.component.html',
  styleUrl: './varietal-mapping.component.scss',
})
export class VarietalMappingComponent {
  private readonly wineService = inject(WineService);
  private readonly snackBar = inject(MatSnackBar);

  readonly saving = this.wineService.saving;
  readonly varietalMappings = computed(() => this.wineService.getVarietalMappings());
  readonly allWines = computed(() => this.wineService.getAllWines());

  get varietalList(): string[] {
    return this.wineService.getMappingLabels();
  }

  getWinesForVarietal(varietal: string): Wine[] {
    const wineIds = this.varietalMappings().get(varietal) || [];
    return wineIds
      .map((id) => this.allWines().find((w) => w.id === id))
      .filter((w): w is Wine => !!w);
  }

  getAvailableWinesForVarietal(varietal: string): Wine[] {
    const currentIds = this.varietalMappings().get(varietal) || [];
    return this.allWines().filter((w) => !currentIds.includes(w.id));
  }

  async addWineToVarietal(varietal: string, wineId: number): Promise<void> {
    try {
      await this.wineService.addWineToVarietal(varietal, wineId);
      this.snackBar.open('Wine added to varietal mapping', 'Close', { duration: 2000 });
    } catch {
      this.snackBar.open('Could not save mapping. Please retry.', 'Close', { duration: 5000 });
    }
  }

  async removeWineFromVarietal(varietal: string, wineId: number): Promise<void> {
    try {
      await this.wineService.removeWineFromVarietal(varietal, wineId);
      this.snackBar.open('Wine removed from varietal mapping', 'Close', { duration: 2000 });
    } catch {
      this.snackBar.open('Could not remove mapping. Please retry.', 'Close', { duration: 5000 });
    }
  }

  formatPrice(price: number): string {
    return this.wineService.formatPrice(price);
  }
}
