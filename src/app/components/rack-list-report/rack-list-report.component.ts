import { Component, DestroyRef, inject, ElementRef, ViewChild } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import { Observable, startWith, map } from 'rxjs';
import { Book } from 'src/app/interfaces/book';
import { AuthService } from 'src/app/service/auth.service';

import * as XLSX from 'xlsx';


@Component({
    selector: 'app-rack-list-report',
    templateUrl: './rack-list-report.component.html',
    styleUrls: ['./rack-list-report.component.css'],
    standalone: false
})
export class RackListReportComponent {
  myControl = new FormControl();
  filteredOptions: Observable<Book[]>;
  rackList:any;
  
  rackObj:any;
  
  
  @ViewChild('TABLE') table: ElementRef;
  bookTableList:any;
  dataSource:any;
  displayedColumns: string[] = ['rackName', 'title', 'subTitle', 'totalBooks'];
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  private destroyRef = inject(DestroyRef);

  constructor(private toastr: ToastrService,private service: AuthService){  }



  
  ngOnInit() {

    this.myControl = new FormControl();
      this.service.getAllRackListwithBookCount().pipe(takeUntilDestroyed(this.destroyRef)).subscribe( (res:any) =>{
         
         if(res.isValid){
          this.rackList = res.racksList;
          this.dataSource=new MatTableDataSource(this.rackList);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        //  console.log("-rackList->"+JSON.stringify(this.rackList)); 
        }
         
      });
  

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
 
 const workSheet = XLSX.utils.json_to_sheet(this.dataSource.data, {header:['rackName', 'title', 'subTitle', 'totalBooks']});
 const workBook: XLSX.WorkBook = XLSX.utils.book_new();
 XLSX.utils.book_append_sheet(workBook, workSheet, 'SheetName');
 XLSX.writeFile(workBook, 'rackwiseListreport.xlsx');
}


}
