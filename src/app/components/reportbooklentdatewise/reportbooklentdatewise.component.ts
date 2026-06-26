import {FormGroup, FormControl, FormsModule, ReactiveFormsModule, FormBuilder, Validators} from '@angular/forms';
import { DateAdapter } from '@angular/material/core';
import { AuthService } from 'src/app/service/auth.service';
import { ToastrService } from 'ngx-toastr';
import { AfterViewInit, Component, DestroyRef, inject, ViewChild, ElementRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatDialog, MatDialogRef} from '@angular/material/dialog';

import * as XLSX from 'xlsx';

const today = new Date();
const month = today.getMonth();
const year = today.getFullYear();



@Component({
    selector: 'app-reportbooklentdatewise',
    templateUrl: './reportbooklentdatewise.component.html',
    styleUrls: ['./reportbooklentdatewise.component.css'],
    standalone: false
})
export class ReportbooklentdatewiseComponent {

  
  @ViewChild('TABLE') table: ElementRef;
  bookList:any;
  dataSource:any;
  displayedColumns: string[] = ['title', 'devoteName', 'phoneNo', 'roomNo','issueDate','returnDate','bookReturnDate'];
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  private destroyRef = inject(DestroyRef);


  constructor(private service: AuthService, private fb: FormBuilder,private dateAdapter: DateAdapter<Date>,private toastr: ToastrService,){  
   //this.loadBooks();
  // this.dateAdapter.setLocale('en-GB'); //dd/MM/yyyy
 }

 campaignOne: FormGroup;

//  campaignOne = new FormGroup({
//   start: new FormControl('',Validators.required),
//   end: new FormControl(),
// });

ngOnInit() {
      this.campaignOne = this.fb.group({
        start: ['', Validators.required],
        end: ['', Validators.required],
      
      });
}


  generateReport(){
   // console.log("bookFrom-->"+this.campaignOne.valid);
   //console.log("bookFrom date-->"+JSON.stringify(this.campaignOne.value));
    if(this.campaignOne.valid){
      //console.log("bookFrom-->"+JSON.stringify(this.campaignOne.value));

     // console.log("bookFrom start-->"+this.campaignOne.value.start.toLocaleDateString('en-GB'));
      //console.log("bookFrom end-->"+this.campaignOne.value.end.toLocaleDateString('en-GB'));
      this.service.booklentdatewise(this.campaignOne.value.start.toLocaleDateString('en-GB'),this.campaignOne.value.end.toLocaleDateString('en-GB')).pipe(takeUntilDestroyed(this.destroyRef)).subscribe( res=>{
        this.bookList=res;
       //console.log("res-->"+JSON.stringify(this.bookList[0]))
       this.dataSource=new MatTableDataSource(this.bookList);
       this.dataSource.paginator = this.paginator;
       this.dataSource.sort = this.sort;
    });

    }else{
      this.toastr.warning('Please Select Date');
    }
    
  } 

  
 applyFilter(event: Event) {
  const filterValue = (event.target as HTMLInputElement).value;
  this.dataSource.filter = filterValue.trim().toLowerCase();
}  


ExportTOExcel()
{
 // const ws: XLSX.WorkSheet=XLSX.utils.table_to_sheet(this.table.nativeElement);
 // XLSX.utils.json_to_sheet(this.dataSource.data, {header:['dataprop1', 'dataprop2']});
 // const wb: XLSX.WorkBook = XLSX.utils.book_new();
 // XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
 
 // /* save to file */
 // XLSX.writeFile(wb, 'SheetJS.xlsx');
 
 const workSheet = XLSX.utils.json_to_sheet(this.dataSource.data, {header:['title', 'devoteName', 'phoneNo', 'roomNo','issueDate','returnDate','bookReturnDate']});
 const workBook: XLSX.WorkBook = XLSX.utils.book_new();
 XLSX.utils.book_append_sheet(workBook, workSheet, 'SheetName');
 XLSX.writeFile(workBook, 'booklentdatewisereport.xlsx');
}






}
