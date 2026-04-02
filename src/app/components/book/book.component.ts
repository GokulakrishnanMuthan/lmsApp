import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { FormBuilder,Validators,FormControl, FormGroup, } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/service/auth.service';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatDialog, MatDialogRef} from '@angular/material/dialog';
import { Book } from 'src/app/interfaces/book';
import { DomSanitizer } from '@angular/platform-browser';

import { Store, State,select ,createSelector } from '@ngrx/store';
import { rowSearchFilter, rackSearchFilter,accessNoSearchFilter,titleSearchFilter,authorSearchFilter,publisherSearchFilter,languageSearchFilter,bookStatusSearchFilter } from '../../ngrx/book.actions';
import {AppState} from '../../ngrx/book.reducer';
import {BookState} from '../../ngrx/book.model';
import { BarcodeprintComponent } from '../barcodeprint/barcodeprint.component';

@Component({
  selector: 'app-book',
  templateUrl: './book.component.html',
  styleUrls: ['./book.component.css']
})
export class BookComponent {
  
 bookList:any;
 public dataSource: MatTableDataSource<Book>;
 displayedColumns: string[] = ['accessno','rack_no','row','language','title','book_status','book_condition','author', 'publisher','action'];
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
 public accessNoSearch = '';
 public bookStatusSearch = '';
 
 languages: any[];
 bookCondition: any[];
 bookStatus: any[];
 base64String: any;

 userRole:any;

 constructor(private buider: FormBuilder,private toastr: ToastrService,private service: AuthService, private router: Router,
  public dialog: MatDialog,private state: State<AppState>,private store: Store,private sanitizer: DomSanitizer){ 
    
    this.languages=['','TAMIL','ENGLISH','HINDI','SANSKRIT','MALAYALAM','KANNADA','TELUGU','SPANISH','GERMAN','PORTUGAL','ENGLISH HINDI','SANKRIT','SANSKRIT HINDI'
    ,'SANKRIT ENGLISH','GUJARATI','MARATHI','SANSKRIT/ HINDI'];
    this.bookCondition=['Good','Bound Books','Old and Damaged'];
    this.bookStatus=['','Available','Issued','Removed','Missing','Duplicate'];
    
    this.searchFormInit();
    this.loadBooks();
    //console.log("-->"+JSON.stringify(this.state.getValue().book))
    this.userRole=sessionStorage.getItem('userrole');
 }  

showActionItems(){
  return sessionStorage.getItem('userrole')==='admin'?true:false;
}
 ngOnInit() {
  this.searchFormInit();
  /* Filter predicate used for filtering table per different columns
  *  */
  //this.dataSource.filterPredicate = this.getFilterPredicate();
}


searchFormInit() {
  this.searchForm = new FormGroup({
    rackSearch: new FormControl(this.state.getValue().book.rackSearchFilterVal),
    rowSearch: new FormControl(this.state.getValue().book.rowSearchFilterVal)
    ,languageSearch: new FormControl(this.state.getValue().book.languageSearchFilterVal),
    bookNameSearch: new FormControl(this.state.getValue().book.titleSearchFilterVal),
    authorSearch: new FormControl(this.state.getValue().book.authorSearchFilterVal),
    publisherSearch: new FormControl(this.state.getValue().book.publisherSearchFilterVal),
    categorySearch: new FormControl(this.state.getValue().book.publisherSearchFilterVal),
    accessNoSearch: new FormControl(this.state.getValue().book.accessNoSearchFilterVal),
    bookStatusSearch: new FormControl(this.state.getValue().book.bookStatusSearchFilterVal),
  });

  
}

 loadBooks(){
   this.service.getAllBooks().subscribe( res=>{
       this.bookList=res;
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
      const accessnoSearch = filterArray[0];
      const bookSearch = filterArray[1];
      const authorSearch = filterArray[2];
      const publisherSearch = filterArray[3];
      const categorySearch = filterArray[4];
      const rackSearch = filterArray[5];
      const languageSearch = filterArray[6];
      const rowSearch = filterArray[7];
      const bookStatusSearch = filterArray[8];
      

      const matchFilter = [];

      // Fetch data from row : ['rackNo','row','language','topic','title','bookStatus','bookCondition','author', 'publisher','action'];
      const booknameCol = row.title;
      const authorCol = row.author;
      const publisherCol = row.publisher;
      const categoryCol = row.topic;
      const rackNoCol = row.rack_no;
      const languageCol = row.language;
      const accessnoCol = row.accessno;
      const rowCol = row.row;
      const bookStausCol = row.book_status;

      // verify fetching data by our searching values
      const customFilter1 = booknameCol.toLowerCase().includes(bookSearch);
      const customFilter2 = authorCol.toLowerCase().includes(authorSearch);
      const customFilter3 = publisherCol.toLowerCase().includes(publisherSearch);
      const customFilter4 = categoryCol.toLowerCase().includes(categorySearch);
      const customFilter5 = rackNoCol.toLowerCase().includes(rackSearch);
      const customFilter6 = languageCol.toLowerCase().includes(languageSearch);
      const customFilter7 = accessnoCol.toLowerCase().includes(accessnoSearch);
      const customFilter8 = rowCol.toLowerCase().includes(rowSearch);
      const customFilter9 = bookStausCol.toLowerCase().includes(bookStatusSearch);

      // push boolean values into array
      matchFilter.push(customFilter1);
      matchFilter.push(customFilter2);
      matchFilter.push(customFilter3);
      matchFilter.push(customFilter4);
      matchFilter.push(customFilter5);
      matchFilter.push(customFilter6);
      matchFilter.push(customFilter7);
      matchFilter.push(customFilter8);
      matchFilter.push(customFilter9);
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
  var anS = this.searchForm.get('accessNoSearch').value;
  var rowS = this.searchForm.get('rowSearch').value;
  var bookStaS = this.searchForm.get('bookStatusSearch').value;

  this.store.dispatch(rowSearchFilter({ rsValue: rowS }))  
  this.store.dispatch(rackSearchFilter({ rackValue: rS })) 
   this.store.dispatch(accessNoSearchFilter({ anS: anS })) 
  this.store.dispatch(titleSearchFilter({ bS: bS })) 
   this.store.dispatch(authorSearchFilter({ aS: aS })) 
   this.store.dispatch(publisherSearchFilter({ pS: pS })) 
  this.store.dispatch(languageSearchFilter({ lS: lS })) 
  this.store.dispatch(bookStatusSearchFilter({ bookStaS: bookStaS })) 

  this.bookNameSearch = bS === null ? '' : bS;
  this.authorSearch = aS === null ? '' : aS;
  this.publisherSearch = pS === null ? '' : pS;
  this.categorySearch = cS === null ? '' : cS;
  this.rackSearch = rS === null ? '' : rS;
  this.languageSearch = lS === null ? '' : lS;
  this.accessNoSearch = anS === null ? '' : anS;
  this.rowSearch = rowS === null ? '' : rowS;
  this.bookStatusSearch = bookStaS === null ? '' : bookStaS;

  // create string of our searching values and split if by '$'
  const filterValue = this.accessNoSearch + '$'+this.bookNameSearch + '$' + this.authorSearch + '$' + this.publisherSearch + '$' + this.categorySearch + '$' + this.rackSearch+ '$' + this.languageSearch+ '$' + this.rowSearch+ '$' + this.bookStatusSearch;
  //console.log("filterValue-->"+filterValue)
  this.dataSource.filter = filterValue.trim().toLowerCase();
}

//  applyFilter(event: Event) {
//    const filterValue = (event.target as HTMLInputElement).value;
//    this.dataSource.filter = filterValue.trim().toLowerCase();
//  }  

 
 newbook(){
  this.router.navigate(['newbook']);
 }

 updateBook(id:any){
  //console.log("id-->"+id);
  //this.router.navigate(['newbook'],id);
  this.router.navigate(['newbook'],{ queryParams: { bookid: id,'status':'update' }});
  
 }

 
 copyBook(id:any){
  //console.log("id-->"+id);
  //this.router.navigate(['newbook'],id);
  this.router.navigate(['newbook'],{ queryParams: { bookid: id,'status':'copy' }});
  
 }

  printBarCode(id:any){
    this.service.printBarCode(id).subscribe( (res:any)=>{
      const unsafeImg = URL.createObjectURL(res);
      this.dialog.open(BarcodeprintComponent,{ data:this.sanitizer.bypassSecurityTrustUrl(unsafeImg)});
    });
    
  }

}
