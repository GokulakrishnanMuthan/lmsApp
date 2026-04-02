import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-barcodeprint',
  templateUrl: './barcodeprint.component.html',
  styleUrls: ['./barcodeprint.component.css']
})
export class BarcodeprintComponent {

  imagePath: any;
  constructor(@Inject(MAT_DIALOG_DATA) public data: string,
  private dialogRef: MatDialogRef<BarcodeprintComponent>) { 
    this.imagePath = data;
  }
  
}
