import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { QzPrinterService } from '../../printing/qz-printer.service';

@Component({
    selector: 'app-barcodeprint',
    templateUrl: './barcodeprint.component.html',
    styleUrls: ['./barcodeprint.component.css'],
    standalone: false
})
export class BarcodeprintComponent implements OnInit {

  // Physical size of ONE label on the dedicated label printer.
  // Change these to match your sticker stock (the printer must also be set
  // to this media size). Common book-label sizes: 50x25, 38x25, 40x30 mm.
  private readonly LABEL_WIDTH_MM = 50;
  private readonly LABEL_HEIGHT_MM = 25;

  /** Disables the Print button while a print job is in flight. */
  printing = false;

  /** Live barcode-printer detection state, shown as a status line in the dialog. */
  printerStatus: 'checking' | 'found' | 'none' | 'unavailable' = 'checking';
  detectedPrinter: string | null = null;

  imagePath: any;
 bookId: any;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { image: any, bookId: any },
    private dialogRef: MatDialogRef<BarcodeprintComponent>,
    private qz: QzPrinterService,
    private toastr: ToastrService
  ) {
    this.imagePath = data.image;
    this.bookId = data.bookId;
  }

  ngOnInit(): void {
    this.detectPrinter();
  }

  /** Probes QZ Tray for an installed barcode printer to drive the status line. */
  private async detectPrinter(): Promise<void> {
    this.printerStatus = 'checking';
    try {
      this.detectedPrinter = await this.qz.findBarcodePrinter();
      this.printerStatus = this.detectedPrinter ? 'found' : 'none';
    } catch {
      // QZ Tray agent not installed / not running.
      this.detectedPrinter = null;
      this.printerStatus = 'unavailable';
    }
  }

  /**
   * Print flow:
   *  1. Ask QZ Tray whether a barcode/label printer is installed.
   *  2. If one is found, send the label straight to it (no dialog).
   *  3. If QZ Tray isn't running or no barcode printer is found, fall back to
   *     the browser print dialog so the user can still print manually.
   */
  async print(): Promise<void> {
    if (this.printing) {
      return;
    }
    this.printing = true;
    try {
      const printer = await this.qz.findBarcodePrinter();
      if (!printer) {
        this.toastr.warning(
          'No barcode printer found. Falling back to the print dialog.',
          'Barcode print',
        );
        this.browserPrint();
        return;
      }

      const base64 = await this.imageToBase64();
      if (!base64) {
        this.toastr.error('Could not read the barcode image.', 'Barcode print');
        return;
      }

      await this.qz.printLabelImage(
        printer,
        base64,
        this.LABEL_WIDTH_MM,
        this.LABEL_HEIGHT_MM,
      );
      this.toastr.success(`Sent to ${printer}.`, 'Barcode print');
    } catch (err: any) {
      // Most common cause: QZ Tray agent not installed / not running.
      this.toastr.warning(
        'Barcode printer agent (QZ Tray) is not available. Falling back to the print dialog.',
        'Barcode print',
      );
      this.browserPrint();
    } finally {
      this.printing = false;
    }
  }

  /** Reads the rendered barcode <img> as raw base64 (no data: URI prefix). */
  private async imageToBase64(): Promise<string | null> {
    const img = document.getElementById('barcodeprint') as HTMLImageElement | null;
    if (!img?.src) {
      return null;
    }
    const blob = await fetch(img.src).then((r) => r.blob());
    const dataUrl: string = await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
    const comma = dataUrl.indexOf(',');
    return comma >= 0 ? dataUrl.slice(comma + 1) : null;
  }

 browserPrint() {
  // Pull the resolved blob URL from the rendered <img> so the new window can load it.
  const img = document.getElementById('barcodeprint') as HTMLImageElement | null;
  const src = img?.src;
  if (!src) {
    return;
  }

  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    return;
  }

  const w = this.LABEL_WIDTH_MM;
  const h = this.LABEL_HEIGHT_MM;

  // One label == one page. margin:0 + @page size keeps the printer from
  // treating it as an A4 sheet, so the barcode fills the actual label.
  printWindow.document.write(`
    <html>
      <head>
        <title>Print Barcode</title>
        <style>
          @page { size: ${w}mm ${h}mm; margin: 0; }
          html, body { margin: 0; padding: 0; }
          .label {
            box-sizing: border-box;
            width: ${w}mm;
            height: ${h}mm;
            padding: 1mm;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            overflow: hidden;
          }
          .label img {
            max-width: 100%;
            max-height: ${h - 6}mm;
            object-fit: contain;
          }
          .label .bookid {
            margin-top: 0.5mm;
            font: 600 8pt monospace;
            letter-spacing: 0.5px;
          }
        </style>
      </head>
      <body>
        <div class="label">
          <img src="${src}" alt="barcode" />
          <div class="bookid">Book ID: ${this.bookId}</div>
        </div>
        <script>
          var bc = document.querySelector('.label img');
          function go() { window.focus(); window.print(); window.close(); }
          if (bc && bc.complete) { go(); }
          else if (bc) { bc.onload = go; bc.onerror = go; }
          else { go(); }
        </script>
      </body>
    </html>
  `);
  printWindow.document.close();
}



}
