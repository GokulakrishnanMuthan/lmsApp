import { Injectable } from '@angular/core';
import qz from 'qz-tray';

/**
 * Thin wrapper around QZ Tray (https://qz.io) — a small agent the user installs
 * on the local machine that lets the browser talk to physical printers over a
 * WebSocket. The browser itself cannot enumerate OS printers, so this is the
 * only way to (a) check whether a barcode/label printer is installed and
 * (b) print straight to it without the browser print dialog.
 *
 * Running unsigned (no certificate) is fine for internal use — QZ Tray shows a
 * one-time "Allow" prompt on the desktop. For fully silent printing in
 * production, configure signing via qz.security.* with a signed certificate.
 */
@Injectable({ providedIn: 'root' })
export class QzPrinterService {
  /**
   * Name fragments that identify a barcode/label printer. Matched
   * case-insensitively against the installed printer names. Extend this list
   * if your printer reports an unusual name.
   */
  private readonly BARCODE_PRINTER_HINTS = [
    'zebra', 'zdesigner', 'zpl', 'tsc', 'godex', 'datamax', 'intermec',
    'sato', 'dymo', 'brother ql', 'label', 'barcode', 'gk420', 'gx430',
    'gc420', 'zd220', 'zd420',
  ];

  /** True when the QZ Tray agent is reachable and connected. */
  isConnected(): boolean {
    return !!qz.websocket && qz.websocket.isActive();
  }

  /**
   * Ensures a live connection to the local QZ Tray agent.
   * Rejects if the agent is not installed/running.
   */
  async connect(): Promise<void> {
    if (this.isConnected()) {
      return;
    }
    // QZ tries wss:// (secure) first and falls back to ws:// automatically.
    await qz.websocket.connect({ retries: 1, delay: 1 });
  }

  /** Lists every printer the agent can see. */
  async listPrinters(): Promise<string[]> {
    await this.connect();
    const found = await qz.printers.find();
    return Array.isArray(found) ? found : [found];
  }

  /**
   * Returns the name of the first installed barcode/label printer, or null if
   * none match {@link BARCODE_PRINTER_HINTS}.
   */
  async findBarcodePrinter(): Promise<string | null> {
    const printers = await this.listPrinters();
    const match = printers.find((name) =>
      this.BARCODE_PRINTER_HINTS.some((hint) =>
        name.toLowerCase().includes(hint),
      ),
    );
    return match ?? null;
  }

  /**
   * Sends a barcode label image to the given printer, sized to one physical
   * label. `base64` must be the raw base64 payload (no `data:` URI prefix).
   */
  async printLabelImage(
    printerName: string,
    base64: string,
    widthMm: number,
    heightMm: number,
  ): Promise<void> {
    await this.connect();
    const config = qz.configs.create(printerName, {
      units: 'mm',
      size: { width: widthMm, height: heightMm },
      colorType: 'grayscale',
      margins: 0,
    });
    const data = [
      {
        type: 'pixel',
        format: 'image',
        flavor: 'base64',
        data: base64,
      },
    ];
    await qz.print(config, data);
  }
}
