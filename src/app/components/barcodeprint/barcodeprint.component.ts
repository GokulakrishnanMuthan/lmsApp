import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-barcodeprint',
  templateUrl: './barcodeprint.component.html',
  styleUrls: ['./barcodeprint.component.css']
})
export class BarcodeprintComponent {

  imagePath: any;
 bookId: any;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { image: any, bookId: any },
    private dialogRef: MatDialogRef<BarcodeprintComponent>
  ) { 
    this.imagePath = data.image;
    this.bookId = data.bookId;
  }

 printBarcode() {
  const printContents = document.getElementById('barcodeprint')?.outerHTML;
  const printWindow = window.open('', '_blank');
  if (printWindow && printContents) {
    printWindow.document.write(`
      <html>
        <head><title>Print Barcode</title></head>
         <h3>Book ID: ${this.bookId}</h3>
        <body style="margin:0; text-align:center;">
          ${printContents}
          <script>
            window.onload = function() {
              window.print();
              window.close();
            }
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  }
}



}
