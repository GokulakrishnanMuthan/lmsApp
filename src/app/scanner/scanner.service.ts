import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { firstValueFrom } from 'rxjs';
import { BarcodeScannerDialogComponent } from './barcode-scanner-dialog.component';

/**
 * Single entry point for barcode scanning. Components inject this for the
 * camera flow; the hardware-wedge flow is handled by {@link ScanInputDirective}.
 * Both ultimately hand the component a decoded string, so callers stay agnostic
 * to the scan source.
 */
@Injectable({ providedIn: 'root' })
export class ScannerService {
  constructor(private dialog: MatDialog) {}

  /** Opens the camera dialog. Resolves with the decoded code, or null if cancelled. */
  async openCamera(): Promise<string | null> {
    const ref = this.dialog.open(BarcodeScannerDialogComponent, {
      width: '420px',
      disableClose: false,
    });
    const result = await firstValueFrom(ref.afterClosed());
    return this.normalize(result) || null;
  }

  /** Trims surrounding whitespace a scanner may append. */
  normalize(code: string | null | undefined): string {
    return (code ?? '').trim();
  }

  /** Validates an ISBN-10 or ISBN-13 check digit (no network call). */
  isValidIsbn(raw: string | null | undefined): boolean {
    const code = this.normalize(raw).replace(/[-\s]/g, '');
    if (/^\d{9}[\dX]$/i.test(code)) return this.isIsbn10(code);
    if (/^\d{13}$/.test(code)) return this.isIsbn13(code);
    return false;
  }

  private isIsbn10(code: string): boolean {
    let sum = 0;
    for (let i = 0; i < 9; i++) {
      sum += (i + 1) * Number(code[i]);
    }
    const last = code[9].toUpperCase();
    sum += 10 * (last === 'X' ? 10 : Number(last));
    return sum % 11 === 0;
  }

  private isIsbn13(code: string): boolean {
    let sum = 0;
    for (let i = 0; i < 13; i++) {
      sum += (i % 2 === 0 ? 1 : 3) * Number(code[i]);
    }
    return sum % 10 === 0;
  }
}
