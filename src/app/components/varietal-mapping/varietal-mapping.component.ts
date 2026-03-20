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
    MatSnackBarModule
  ],
  templateUrl: './varietal-mapping.component.html',
  styleUrl: './varietal-mapping.component.scss'
})
export class VarietalMappingComponent {
  private readonly wineService = inject(WineService);
  private readonly snackBar = inject(MatSnackBar);

  readonly varietalMappings = signal<Map<string, number[]>>(new Map());
  readonly allWines = signal<Wine[]>([]);

  constructor() {
    this.loadData();
  }

  private loadData(): void {
    this.varietalMappings.set(this.wineService.getVarietalMappings());
    this.allWines.set(this.wineService.getAllWines());
  }

  get varietalList(): string[] {
    return Array.from(this.varietalMappings().keys()).sort();
  }

  getWinesForVarietal(varietal: string): Wine[] {
    const wineIds = this.varietalMappings().get(varietal) || [];
    return wineIds.map(id => this.allWines().find(w => w.id === id)).filter((w): w is Wine => !!w);
  }

  getAvailableWinesForVarietal(varietal: string): Wine[] {
    const currentIds = this.varietalMappings().get(varietal) || [];
    return this.allWines().filter(w =>
      w.varietal.toLowerCase().includes(varietal.toLowerCase()) ||
      varietal.toLowerCase().includes(w.varietal.toLowerCase()) ||
      !currentIds.includes(w.id)
    );
  }

  addWineToVarietal(varietal: string, wineId: number): void {
    this.wineService.addWineToVarietal(varietal, wineId);
    this.loadData();
    this.snackBar.open('Wine added to varietal mapping', 'Close', { duration: 2000 });
  }

  removeWineFromVarietal(varietal: string, wineId: number): void {
    this.wineService.removeWineFromVarietal(varietal, wineId);
    this.loadData();
    this.snackBar.open('Wine removed from varietal mapping', 'Close', { duration: 2000 });
  }

  formatPrice(price: number): string {
    return this.wineService.formatPrice(price);
  }
}
