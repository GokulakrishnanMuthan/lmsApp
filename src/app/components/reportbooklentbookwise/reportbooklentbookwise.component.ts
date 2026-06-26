import { Component, DestroyRef, inject, ElementRef, ViewChild } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import * as XLSX from 'xlsx';

import { Book } from 'src/app/interfaces/book';
import { AuthService } from 'src/app/service/auth.service';


@Component({
    selector: 'app-reportbooklentbookwise',
    templateUrl: './reportbooklentbookwise.component.html',
    styleUrls: ['./reportbooklentbookwise.component.css'],
    standalone: false
})
export class ReportbooklentbookwiseComponent {
  myControl = new FormControl();
  filteredOptions: Observable<Book[]>;
  bookList:Book[] = [];
  
  bookObj:any;
  
  
  @ViewChild('TABLE') table: ElementRef;
  bookTableList:any;
  dataSource:any;
  displayedColumns: string[] = ['title', 'devoteName', 'phoneNo', 'roomNo','issueDate','returnDate','bookReturnDate'];
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  private destroyRef = inject(DestroyRef);

  constructor(private toastr: ToastrService,private service: AuthService){  }



  
  ngOnInit() {

    this.myControl = new FormControl();
      this.service.getAvailableBooks().pipe(takeUntilDestroyed(this.destroyRef)).subscribe( (res:Book[]) =>{
         this.bookList = res;
         //console.log("-bookList->"+JSON.stringify(this.bookList[0]));
      });
  
      this.filteredOptions = this.myControl.valueChanges
      .pipe(
        startWith(''),
        map(value => typeof value === 'string' ? value : value.title),
        map(name => name ? this._filter(name) : this.bookList.slice())
      );

  }


  
  displayFn(book:any) {
    // console.log("--display book-->"+book);
     return book ? (book.title + '-' + book.language + '-' + book.author + '-' +book.publisher)  : '';
   }
 
   
   private _filter(name: string): Book[] {
     const filterValue = name.toLowerCase();
    // console.log("--filterValue-->"+filterValue);
    // console.log("--return-->"+this.bookList.filter(book => book.title.toLowerCase().indexOf(filterValue) === 0));
     return this.bookList.filter(book => book.title.toLowerCase().indexOf(filterValue) === 0);
   }
 
 
 selected(event: MatAutocompleteSelectedEvent): void {
  // console.log("-event->"+JSON.stringify(event.option.value));
   this.bookObj = this.bookList.find(t=>t.id ===event.option.value.id);
    //console.log("-bookObj->"+JSON.stringify(this.bookObj));
 }

 
 generateReport(){
  // console.log("bookFrom-->"+this.campaignOne.valid);
   if(this.bookObj  !=null && this.bookObj !=undefined){
     //console.log("bookFrom-->"+JSON.stringify(this.campaignOne.value));
     this.service.bookwiselentreport(this.bookObj.id).pipe(takeUntilDestroyed(this.destroyRef)).subscribe( res=>{
       this.bookTableList=res;
     // console.log("res-->"+JSON.stringify(res.toLocaleString.length))
      if(res.toLocaleString.length == 0){
        this.toastr.warning('No Search Result!!');
      }else{
        this.dataSource=new MatTableDataSource(this.bookTableList);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      }
      //console.log("res-->"+JSON.stringify(this.bookList.length))
      
   });

   }else{
     this.toastr.warning('Please Select Book');
   }
   
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
 XLSX.writeFile(workBook, 'booklentbookwisereport.xlsx');
}





}
