import {Component, OnInit,AfterViewInit,  ViewChild } from '@angular/core';
import {FormControl} from '@angular/forms';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import { FormBuilder,Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/service/auth.service';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatDialog, MatDialogRef} from '@angular/material/dialog';

import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';

import { Book } from 'src/app/interfaces/book';
import { Devote } from 'src/app/interfaces/devote';



@Component({
  selector: 'app-newbookissue',
  templateUrl: './newbookissue.component.html',
  styleUrls: ['./newbookissue.component.css']
})
export class NewbookissueComponent implements OnInit {
  
  myControl = new FormControl();
  filteredOptions: Observable<Book[]>;
  bookList:Book[] = [];
  
  issueBookList:Book[] = [];
  dateNow: Date = new Date();
  dutedateNow: Date = new Date();
  bookObj:any;
  devoteObj:any;
  devoteeList:any

  constructor(private buider: FormBuilder,private toastr: ToastrService,
    private service: AuthService, private router: Router,public dialog: MatDialog){  
    
 }

 dataSource:any;
 displayedColumns: string[] = ['title', 'language', 'author', 'publisher', 'year','action'];
 @ViewChild(MatPaginator) paginator!: MatPaginator;
 @ViewChild(MatSort) sort!: MatSort;


 registerFrom=this.buider.group({
  name:this.buider.control('',Validators.required),
  phone:this.buider.control('',[Validators.required, Validators.pattern('[6-9]\\d{9}')]),
  email:this.buider.control('',Validators.compose([Validators.required,Validators.email])),
  address:this.buider.control('',Validators.required),
  issueDate:this.buider.control(this.dateNow,Validators.required),
  dueDate:this.buider.control(this.dutedateNow,Validators.required),
 });




  ngOnInit() {

    this.dutedateNow.setDate( this.dateNow.getDate() + 7 );
    this.myControl = new FormControl();
      this.service.getAvailableBooks().subscribe( (res:Book[]) =>{
         this.bookList = res;
         //console.log("-bookList->"+JSON.stringify(this.bookList[0]));
      });

      this.service.getAllDevotes().subscribe( (res:Devote[]) =>{
          //console.log("-devoteList->"+JSON.stringify(res));
          this.devoteeList = res;
      } );
  
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

 addtoTable(){
  //console.log("-bookObj111->"+this.bookObj);

  if( this.bookObj==undefined){
    this.toastr.warning('Please Enter Book');
  }else{
      
    if(this.issueBookList.some(book => book.title === this.bookObj.title)){
      this.toastr.warning('Book Already Added ');
    }else{
     
    //  console.log("-bookObj->"+JSON.stringify(this.bookObj));
      this.issueBookList.push(this.bookObj);
      this.dataSource=new MatTableDataSource(this.issueBookList);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.myControl.reset('');
      //console.log("-issueBookList->"+JSON.stringify(this.issueBookList));
    }
    
  }
 
 }

 deleteBook(bookId:any){
  //console.log("bookId-->"+bookId);
 
  //this.issueBookList = this.issueBookList.filter(item => item.id !== bookId);
  let index = this.issueBookList.findIndex(d => d.id === bookId); //find index in your array
  this.issueBookList.splice(index, 1);
  this.dataSource=new MatTableDataSource(this.issueBookList);
  this.dataSource.paginator = this.paginator;
  this.dataSource.sort = this.sort;
  //console.log("bookId-->"+JSON.stringify(this.issueBookList));

 }


 saveBookissue(){
  //console.log("registerFrom-->"+JSON.stringify(this.registerFrom.value));
  if(this.registerFrom.valid && this.issueBookList.length > 0){
    this.toastr.warning('Success');
    this.service.saveIssueBook(this.issueBookList,this.registerFrom.value );
    this.router.navigate(['bookissue']);
}else{
   this.toastr.warning('Please Enter All Data');
}

 }


 cancel(){
  this.router.navigate(['bookissue']);
 }


 onFocusOutEvent(event: any){
  
  if(event.target.value !="" && event.target.value !=undefined){
    const tempArray = this.devoteeList.filter(item => item.name === event.target.value);
   
    if(tempArray !=undefined && tempArray.length > 0){
        this.devoteObj = tempArray[0];
          this.registerFrom.setValue({ name: this.devoteObj.name,email:this.devoteObj.email,address:this.devoteObj.address,phone: this.devoteObj.phone,issueDate:this.dateNow,dueDate:this.dutedateNow});
        }else{
          this.registerFrom.setValue({ name: event.target.value,email:'',address:'',issueDate:this.dateNow,dueDate:this.dutedateNow,phone: ''});
        }
    }
   
  }




}
