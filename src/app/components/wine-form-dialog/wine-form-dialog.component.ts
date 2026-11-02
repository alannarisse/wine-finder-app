import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { Wine } from '../../models/wine.model';
import { WineService } from '../../services/wine.service';

interface DialogData {
  wine: Wine | null;
  mode: 'add' | 'edit';
}

@Component({
  selector: 'app-wine-form-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
  ],
  templateUrl: './wine-form-dialog.component.html',
  styleUrl: './wine-form-dialog.component.scss',
})
export class WineFormDialogComponent {
  private readonly fb = inject(FormBuilder);
  private readonly dialogRef = inject(MatDialogRef<WineFormDialogComponent>);
  private readonly wineService = inject(WineService);
  readonly data = inject<DialogData>(MAT_DIALOG_DATA);

  readonly saving = signal(false);
  readonly saveError = signal('');
  readonly varietals = this.wineService.getAvailableVarietals();
  readonly form: FormGroup;
  readonly isEditMode: boolean;

  constructor() {
    this.isEditMode = this.data.mode === 'edit';

    this.form = this.fb.group({
      wineryName: [this.data.wine?.wineryName || '', Validators.required],
      wineName: [this.data.wine?.wineName || '', Validators.required],
      varietal: [this.data.wine?.varietal || '', Validators.required],
      year: [this.data.wine?.year || null],
      estimatedPrice: [
        this.data.wine?.estimatedPrice ?? '',
        [Validators.required, Validators.min(0)],
      ],
      wineryCity: [this.data.wine?.wineryCity || '', Validators.required],
      wineryState: [this.data.wine?.wineryState || '', Validators.required],
      ava: [this.data.wine?.ava || ''],
      wineryAddress: [this.data.wine?.wineryAddress || '', Validators.required],
      wineryUrl: [
        this.data.wine?.wineryUrl || '',
        [Validators.required, Validators.pattern(/^https?:\/\/.+/)],
      ],
      imageUrl: [this.data.wine?.imageUrl || '', Validators.required],
      thumbnailUrl: [this.data.wine?.thumbnailUrl || '', Validators.required],
      description: [this.data.wine?.description || ''],
    });
  }

  async onSubmit(): Promise<void> {
    if (this.form.invalid || this.saving()) return;
    this.saving.set(true);
    this.saveError.set('');
    this.dialogRef.disableClose = true;
    const value = this.form.value;
    const wine: Wine = {
      ...value,
      id: this.data.wine?.id || 0,
      year: value.year === null || value.year === '' ? null : Number(value.year),
      estimatedPrice: Number(value.estimatedPrice),
    };
    try {
      if (this.isEditMode) await this.wineService.updateWine(wine);
      else {
        const { id, ...payload } = wine;
        await this.wineService.addWine(payload);
      }
      this.dialogRef.close(true);
    } catch (error: any) {
      const messages = error?.error?.message;
      this.saveError.set(
        Array.isArray(messages)
          ? messages.join('. ')
          : typeof messages === 'string'
            ? messages
            : 'Could not save wine. Check the API connection and retry.',
      );
    } finally {
      this.saving.set(false);
      this.dialogRef.disableClose = false;
    }
  }

  onCancel(): void {
    if (!this.saving()) this.dialogRef.close();
  }

  useSameAsImage(): void {
    const imageUrl = this.form.get('imageUrl')?.value;
    if (imageUrl) {
      this.form.patchValue({ thumbnailUrl: imageUrl });
    }
  }
}
