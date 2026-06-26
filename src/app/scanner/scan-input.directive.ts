import { Directive, EventEmitter, HostListener, Input, Output } from '@angular/core';

/**
 * Captures input from a hardware "keyboard-wedge" barcode scanner.
 *
 * Such scanners emit the decoded characters as very fast keystrokes terminated
 * by an Enter key. We buffer characters that arrive in a rapid burst and emit
 * the full code on Enter. Slow (human) typing keeps resetting the buffer, so a
 * person can still type into the same field normally without triggering a scan.
 *
 * Usage:
 *   <input matInput appScanInput (scan)="onScan($event)">
 */
@Directive({
    selector: '[appScanInput]',
    standalone: false
})
export class ScanInputDirective {
  /** Max gap (ms) between keystrokes to still count as part of a scanner burst. */
  @Input() scanInterKeyThreshold = 35;
  /** Minimum buffer length to treat the burst as a real scan. */
  @Input() scanMinLength = 3;

  @Output() scan = new EventEmitter<string>();

  private buffer = '';
  private lastKeyTime = 0;

  @HostListener('keydown', ['$event'])
  onKeydown(event: KeyboardEvent): void {
    const now = event.timeStamp;

    if (event.key === 'Enter') {
      if (this.buffer.length >= this.scanMinLength) {
        const code = this.buffer;
        this.buffer = '';
        // Stop the Enter from submitting the surrounding form.
        event.preventDefault();
        this.scan.emit(code);
      } else {
        this.buffer = '';
      }
      return;
    }

    // Only accumulate single printable characters.
    if (event.key.length === 1) {
      if (now - this.lastKeyTime > this.scanInterKeyThreshold) {
        // Too slow to be a scanner -> assume human typing, start fresh.
        this.buffer = '';
      }
      this.buffer += event.key;
      this.lastKeyTime = now;
    }
  }
}
