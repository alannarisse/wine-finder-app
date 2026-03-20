import { Component, inject } from '@angular/core';
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
    MatSelectModule
  ],
  templateUrl: './wine-form-dialog.component.html',
  styleUrl: './wine-form-dialog.component.scss'
})
export class WineFormDialogComponent {
  private readonly fb = inject(FormBuilder);
  private readonly dialogRef = inject(MatDialogRef<WineFormDialogComponent>);
  private readonly wineService = inject(WineService);
  readonly data = inject<DialogData>(MAT_DIALOG_DATA);

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
      estimatedPrice: [this.data.wine?.estimatedPrice || '', [Validators.required, Validators.min(0)]],
      wineryCity: [this.data.wine?.wineryCity || '', Validators.required],
      wineryState: [this.data.wine?.wineryState || '', Validators.required],
      wineryAddress: [this.data.wine?.wineryAddress || '', Validators.required],
      wineryUrl: [this.data.wine?.wineryUrl || '', [Validators.required, Validators.pattern(/^https?:\/\/.+/)]],
      imageUrl: [this.data.wine?.imageUrl || '', Validators.required],
      thumbnailUrl: [this.data.wine?.thumbnailUrl || '', Validators.required],
      description: [this.data.wine?.description || '']
    });
  }

  onSubmit(): void {
    if (this.form.valid) {
      const formValue = this.form.value;
      const wine: Wine = {
        id: this.isEditMode ? this.data.wine!.id : 0,
        ...formValue,
        year: formValue.year ? parseInt(formValue.year, 10) : null,
        estimatedPrice: parseFloat(formValue.estimatedPrice)
      };
      this.dialogRef.close(wine);
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  useSameAsImage(): void {
    const imageUrl = this.form.get('imageUrl')?.value;
    if (imageUrl) {
      this.form.patchValue({ thumbnailUrl: imageUrl });
    }
  }
}
