import { AfterViewInit, Component, Inject, ViewChild } from '@angular/core';
import { FormBuilder,Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/service/auth.service';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef, MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'app-devote',
  templateUrl: './devote.component.html',
  styleUrls: ['./devote.component.css']
})
export class DevoteComponent {

  constructor(private buider: FormBuilder,private toastr: ToastrService,
    private service: AuthService, private router: Router,public dialog: MatDialog){  
   this.loadDevotes();
 }

 devoteList:any;
 dataSource:any;
 displayedColumns: string[] = ['name', 'phone', 'email','address','year', 'action'];
 @ViewChild(MatPaginator) paginator!: MatPaginator;
 @ViewChild(MatSort) sort!: MatSort;


 loadDevotes(){
   this.service.getAllDevotes().subscribe( res=>{
       this.devoteList=res;
      // console.log("res-->"+JSON.stringify(res))
       this.dataSource=new MatTableDataSource(this.devoteList);
       this.dataSource.paginator = this.paginator;
       this.dataSource.sort = this.sort;
   });
 }


 applyFilter(event: Event) {
   const filterValue = (event.target as HTMLInputElement).value;
   this.dataSource.filter = filterValue.trim().toLowerCase();
 }

 newDevote(){
  this.router.navigate(['newdevote']);
 }

deleteDevotee(devotee: any) {
  const dialogRef = this.dialog.open(DeleteDialogComponent, {
    width: '600px',
    data: devotee
  });

  dialogRef.afterClosed().subscribe(result => {
    if (result === 'confirm') {
      
      this.service.deleteDevotee(devotee.id).subscribe({
        next: () => {
          this.toastr.success('Devote deleted successfully');
          this.loadDevotes(); // refresh the table
        },
        error: () => {
          this.toastr.error('Failed to delete devote');
        }
      });
    }
  });
}



}

@Component({
  selector: 'app-delete-dialog',
  template: `
    <h2 mat-dialog-title>Confirm Delete</h2>
    <mat-dialog-content>
      Are you sure you want to delete <b>{{data.name}}</b>?
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="dialogRef.close()">Cancel</button>
      <button mat-raised-button color="warn" (click)="dialogRef.close('confirm')">
        Delete
      </button>
    </mat-dialog-actions>
  `,
})
export class DeleteDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<DeleteDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}
}
