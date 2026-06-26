import { AfterViewInit, Component, OnDestroy } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Html5Qrcode, Html5QrcodeSupportedFormats } from 'html5-qrcode';

/**
 * Camera-based barcode scanner shown in a Material dialog.
 *
 * Closes with the decoded string on a successful scan, or `null` if the user
 * cancels / the camera cannot be started. Supports the 1D symbologies used by
 * books (EAN/UPC for ISBN, Code128/Code39 for internal access-number labels).
 */
@Component({
    selector: 'app-barcode-scanner-dialog',
    templateUrl: './barcode-scanner-dialog.component.html',
    styleUrls: ['./barcode-scanner-dialog.component.css'],
    standalone: false
})
export class BarcodeScannerDialogComponent implements AfterViewInit, OnDestroy {
  readonly readerId = 'barcode-reader';
  error = '';

  private scanner?: Html5Qrcode;
  private running = false;

  constructor(private dialogRef: MatDialogRef<BarcodeScannerDialogComponent>) {}

  ngAfterViewInit(): void {
    this.scanner = new Html5Qrcode(this.readerId, {
      formatsToSupport: [
        Html5QrcodeSupportedFormats.EAN_13,
        Html5QrcodeSupportedFormats.EAN_8,
        Html5QrcodeSupportedFormats.UPC_A,
        Html5QrcodeSupportedFormats.UPC_E,
        Html5QrcodeSupportedFormats.CODE_128,
        Html5QrcodeSupportedFormats.CODE_39,
      ],
      verbose: false,
    });

    // Enumerate cameras first so we can fall back to a front-facing webcam
    // (laptops/desktops rarely expose a rear "environment" camera, and asking
    // for one that doesn't exist fails with NotFoundError instead of falling back).
    Html5Qrcode.getCameras()
      .then((cameras) => {
        if (!cameras || cameras.length === 0) {
          this.error =
            'No camera was found on this device. Connect a camera (or use a phone/tablet) to scan barcodes.';
          return undefined;
        }

        // Prefer a back/rear camera when present; otherwise use the first one.
        const back = cameras.find((c) => /back|rear|environment/i.test(c.label));
        const cameraId = (back ?? cameras[0]).id;

        return this.scanner!.start(
          cameraId,
          { fps: 10, qrbox: { width: 280, height: 160 } },
          (decodedText) => this.close(decodedText),
          () => {
            /* per-frame "not found" callback — ignore, fires constantly */
          },
        ).then(() => (this.running = true));
      })
      .catch((err) => (this.error = 'Unable to start camera: ' + err));
  }

  cancel(): void {
    this.close(null);
  }

  private close(result: string | null): void {
    if (this.scanner && this.running) {
      this.running = false;
      this.scanner
        .stop()
        .catch(() => undefined)
        .then(() => this.dialogRef.close(result));
    } else {
      this.dialogRef.close(result);
    }
  }

  ngOnDestroy(): void {
    if (this.scanner && this.running) {
      this.running = false;
      this.scanner.stop().catch(() => undefined);
    }
  }
}
