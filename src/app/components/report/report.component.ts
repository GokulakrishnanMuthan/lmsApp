import { AfterViewInit, Component, DestroyRef, inject, ViewChild, ElementRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder,Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/service/auth.service';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatDialog, MatDialogRef} from '@angular/material/dialog';
import * as XLSX from 'xlsx';
import {FormGroup, FormControl, FormsModule, ReactiveFormsModule} from '@angular/forms';
import { DateAdapter } from '@angular/material/core';
import { Book } from 'src/app/interfaces/book';

const today = new Date();
const month = today.getMonth();
const year = today.getFullYear();


@Component({
    selector: 'app-report',
    templateUrl: './report.component.html',
    styleUrls: ['./report.component.css'],
    standalone: false
})
export class ReportComponent {

  
  @ViewChild('TABLE') table: ElementRef;

  private destroyRef = inject(DestroyRef);

  constructor(private buider: FormBuilder,private toastr: ToastrService,
    private service: AuthService, private router: Router,public dialog: MatDialog,private dateAdapter: DateAdapter<Date>){
   this.loadBooks();
   this.dateAdapter.setLocale('en-GB'); //dd/MM/yyyy
 }

 bookList:any;
 bookListReport:any;
 dataSource:any;
 displayedColumns: string[] = ['rackNo','row','language','topic','title', 'isbn', 'author', 'publisher','action'];
 @ViewChild(MatPaginator) paginator!: MatPaginator;
 @ViewChild(MatSort) sort!: MatSort;

 
 public searchForm: FormGroup;
 public rackSearch = '';
 public rowSearch = '';
 public languageSearch = '';
 public bookNameSearch = '';
 public authorSearch = '';
 public publisherSearch = '';
 public categorySearch = '';

 
 campaignOne = new FormGroup({
  start: new FormControl(new Date(year, month, 13)),
  end: new FormControl(new Date(year, month, 16)),
});


ngOnInit() {
  this.searchFormInit();
  /* Filter predicate used for filtering table per different columns
  *  */
  //this.dataSource.filterPredicate = this.getFilterPredicate();
}


searchFormInit() {
  this.searchForm = new FormGroup({
    rackSearch: new FormControl(''),rowSearch: new FormControl(''),languageSearch: new FormControl(''),bookNameSearch: new FormControl(''),
    authorSearch: new FormControl(''),publisherSearch: new FormControl(''),categorySearch: new FormControl('')
  });
}

 loadBooks(){
   this.service.getAllBooks().pipe(takeUntilDestroyed(this.destroyRef)).subscribe( res=>{
       this.bookList=res;
       this.bookListReport=res;
      // console.log("res-->"+JSON.stringify(this.bookList[0]))
       this.dataSource=new MatTableDataSource(this.bookList);
       this.dataSource.filterPredicate = this.getFilterPredicate();
       this.dataSource.paginator = this.paginator;
       this.dataSource.sort = this.sort;
   });
 }


  /* this method well be called for each row in table  */
  getFilterPredicate() {
    return (row: Book, filters: string) => {
      // split string per '$' to array
      const filterArray = filters.split('$');
      const bookSearch = filterArray[0];
      const authorSearch = filterArray[1];
      const publisherSearch = filterArray[2];
      const categorySearch = filterArray[3];
      const rackSearch = filterArray[4];
      const languageSearch = filterArray[5];
      const rowSearch = filterArray[6];

      const matchFilter = [];

      // Fetch data from row : ['rackNo','row','language','topic','title','bookStatus','bookCondition','author', 'publisher','action'];
      const booknameCol = row.title;
      const authorCol = row.author;
      const publisherCol = row.publisher;
      const categoryCol = row.topic;
      const rackNoCol = row.rack_no;
      const languageCol = row.language;
      const rowCol = row.row;
      
      // verify fetching data by our searching values
      const customFilter1 = booknameCol.toLowerCase().includes(bookSearch);
      const customFilter2 = authorCol.toLowerCase().includes(authorSearch);
      const customFilter3 = publisherCol.toLowerCase().includes(publisherSearch);
      const customFilter4 = categoryCol.toLowerCase().includes(categorySearch);
      const customFilter5 = rackNoCol.toLowerCase().includes(rackSearch);
      const customFilter6 = languageCol.toLowerCase().includes(languageSearch);
      const customFilter7 = rowCol.toLowerCase().includes(rowSearch);


      
      
      // push boolean values into array
      matchFilter.push(customFilter1);
      matchFilter.push(customFilter2);
      matchFilter.push(customFilter3);
      matchFilter.push(customFilter4);
      matchFilter.push(customFilter5);
      matchFilter.push(customFilter6);
      matchFilter.push(customFilter7);
      // return true if all values in array is true
      // else return false
      return matchFilter.every(Boolean);
    };
  }

 
 applyFilter() {

  var bS = this.searchForm.get("bookNameSearch").value;
  var aS = this.searchForm.get('authorSearch').value;
  var pS = this.searchForm.get("publisherSearch").value;
  var cS = this.searchForm.get('categorySearch').value;
  var rS = this.searchForm.get("rackSearch").value;
  var lS = this.searchForm.get('languageSearch').value;
  var roS = this.searchForm.get('rowSearch').value;


  this.bookNameSearch = bS === null ? '' : bS;
  this.authorSearch = aS === null ? '' : aS;
  this.publisherSearch = pS === null ? '' : pS;
  this.categorySearch = cS === null ? '' : cS;
  this.rackSearch = rS === null ? '' : rS;
  this.languageSearch = lS === null ? '' : lS;
  this.rowSearch = roS === null ? '' : roS;

  // create string of our searching values and split if by '$'
  const filterValue = this.bookNameSearch + '$' + this.authorSearch + '$' + this.publisherSearch + '$' + this.categorySearch + '$' + this.rackSearch+ '$' + this.languageSearch+'$' + this.rowSearch;
 //console.log("filterValue-->"+filterValue)
  this.dataSource.filter = filterValue.trim().toLowerCase();
}

//  applyFilter(event: Event) {
//    const filterValue = (event.target as HTMLInputElement).value;
//    this.dataSource.filter = filterValue.trim().toLowerCase();
//  }  


ExportTOExcel()
{
  // const ws: XLSX.WorkSheet=XLSX.utils.table_to_sheet(this.table.nativeElement);
  // XLSX.utils.json_to_sheet(this.dataSource.data, {header:['dataprop1', 'dataprop2']});
  // const wb: XLSX.WorkBook = XLSX.utils.book_new();
  // XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
  
  // /* save to file */
  // XLSX.writeFile(wb, 'SheetJS.xlsx');
  
  const workSheet = XLSX.utils.json_to_sheet(this.dataSource.filteredData, {header:['rack_no','row','language','topic','title', 'isbn', 'author', 'publisher','action']});
  const workBook: XLSX.WorkBook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workBook, workSheet, 'SheetName');
  XLSX.writeFile(workBook, 'bookmasterreport.xlsx');
}


  step = 0;

  setStep(index: number) {
    this.step = index;
  }

  nextStep() {
    this.step++;
  }

  prevStep() {
    this.step--;
  }
}
