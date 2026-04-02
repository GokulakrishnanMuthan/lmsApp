import {Component, OnInit,AfterViewInit,  ViewChild } from '@angular/core';
import {FormControl} from '@angular/forms';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import { FormBuilder,Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/service/auth.service';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatDialog, MatDialogRef} from '@angular/material/dialog';

import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { FileUploadServiceService } from 'src/app/service/file-upload-service.service';
import { DateAdapter } from '@angular/material/core';
import { BookVO } from 'src/app/interfaces/bookVo';


@Component({
  selector: 'app-retunbook',
  templateUrl: './retunbook.component.html',
  styleUrls: ['./retunbook.component.css']
})
export class RetunbookComponent {

  retunBookList:any;
  dataSource:any;
  returnresponse:any;
 displayedColumns: string[] = [ 'title', 'issueDate','expireDate','bookreturnDate', 'comments'];
 @ViewChild(MatPaginator) paginator!: MatPaginator;
 @ViewChild(MatSort) sort!: MatSort;

  constructor(private buider: FormBuilder,private toastr: ToastrService,
    private service: AuthService, private router: Router,public dialog: MatDialog,private activatedRoute: ActivatedRoute,
    private uploadService: FileUploadServiceService,private dateAdapter: DateAdapter<Date>){  
   //this.loadBooks();
   this.dateAdapter.setLocale('en-GB'); //dd/MM/yyyy
 }
  ngOnInit(): void {
    //console.log("bookId-->"+JSON.stringify(this.activatedRoute.queryParams)); 
      this.activatedRoute.queryParams.subscribe((params) => {
     // console.log(params['devoteId']);
      //.log(params['issueDate']); 
        if(params['devoteId'] != undefined && params['issueDate'] != undefined){
          //this.getBookbyId(params['bookid']);
          this.getReturnBooks(params['devoteId'],params['issueDate']);
        }
    });
  }

  getReturnBooks(devoteId:any,issueDate:any){

    this.service.getBookReturnDetails(devoteId, issueDate).subscribe(res => {
       this.retunBookList=res;
     //  console.log("return book details"+JSON.stringify(this.retunBookList))
          this.retunBookList = this.retunBookList.map((book: any) => {
          return {
            ...book,
       expireDate: book.expireDate ? this.parseDate(book.expireDate) : null,
       // bookreturnDate: book.bookreturnDate ? this.parseDate(book.bookreturnDate) : null
          };
});

// console.log("return book details---"+JSON.stringify(this.retunBookList))


    this.dataSource = new MatTableDataSource(this.retunBookList);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  });


  }

private parseDate(dateStr: string): Date | null {
  if (!dateStr) return null;
  const parts = dateStr.split('-');
  if (parts.length !== 3) return null;
  const [day, month, year] = parts.map(Number);
  return new Date(year, month - 1, day);
}

private formatDate(date: Date | null): string | null {
  if (!date) return null;
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
}


  saveBookReturnDetails(){
   //console.log("retunBookList-->"+JSON.stringify(this.retunBookList));
    this.service.returnBook(this.retunBookList).subscribe((response: BookVO) => {
       // console.log(response)
        this.returnresponse= response;
       // console.log("-->"+JSON.stringify(this.returnresponse))
       // console.log("-->"+this.returnresponse.valid)
        if(this.returnresponse.valid){
          this.toastr.warning('Success');
          this.router.navigate(['bookissue']);
        }else{
          this.toastr.warning('Error: Please contact Admin!!');
        }
      
      
    });
    
  }

  
 cancel(){
  this.router.navigate(['bookissue']);
 }



}
