import { AfterViewInit, Component, DestroyRef, inject, OnInit, ViewChild,Input ,ElementRef} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder,Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/service/auth.service';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatDialog, MatDialogRef} from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { HttpEventType, HttpResponse } from '@angular/common/http';
import { FileUploadServiceService } from 'src/app/service/file-upload-service.service';
import { ScannerService } from 'src/app/scanner/scanner.service';

@Component({
    selector: 'app-newbook',
    templateUrl: './newbook.component.html',
    styleUrls: ['./newbook.component.css'],
    standalone: false
})
export class NewbookComponent implements OnInit {

  private destroyRef = inject(DestroyRef);

  bookId!: number;
  editData:any;
  languages: any[];
  bookCondition: any[];
  bookStatus: any[];
  bookDetails: any;


  bookFrom=this.buider.group({
    id:0,
    rackNo:this.buider.control('',Validators.required),
    row:this.buider.control('',Validators.required),
    slNo:this.buider.control('',Validators.required),
    language:this.buider.control('',Validators.required),
    title:this.buider.control('',Validators.required),
    isbn:this.buider.control(''),
    author:this.buider.control('',Validators.required),
    publisher:this.buider.control('',Validators.required),
    year:this.buider.control('',Validators.required),
    bookCondition:this.buider.control('',Validators.required),
    bookStatus:this.buider.control('',Validators.required),
    remarks:this.buider.control('',),
    topic:this.buider.control(''),
    extn:this.buider.control(''),
    an:this.buider.control(''),
    sn:this.buider.control(''),
    qty:this.buider.control('1'),
    status:this.buider.control("Y"),
    accessno:this.buider.control(''),
    classno:this.buider.control(''),
    location:this.buider.control(''),
    totalCopies:this.buider.control(''),
    colno:this.buider.control(''),
  });

  currentFile?: File;
  progress = 0;
  message = '';
  constructor(private buider: FormBuilder,private toastr: ToastrService,
    private service: AuthService, private router: Router,public dialog: MatDialog,private activatedRoute: ActivatedRoute,private uploadService: FileUploadServiceService,
    private scanner: ScannerService){
   //this.loadBooks();
   this.languages=['TAMIL','ENGLISH','HINDI','SANSKRIT','MALAYALAM','KANNADA','TELUGU','SPANISH','GERMAN','PORTUGAL','ENGLISH HINDI','SANKRIT','SANSKRIT HINDI'
   ,'SANKRIT ENGLISH','GUJARATI','MARATHI','SANSKRIT/ HINDI'];
   this.bookCondition=['Good','Bound Books','Old and Damaged'];
   this.bookStatus=['Available','Issued','Removed','Missing','Duplicate'];
   
   
 }
  ngOnInit(): void {
   // console.log("bookId-->"+JSON.stringify(this.activatedRoute.queryParams)); 
    this.activatedRoute.queryParams.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((params) => {
      //console.log(params['bookid']);
        if(params['bookid'] != undefined){
          this.getBookbyId(params['bookid']);
          this.bookDetails=params['status'];
        }
    });
  }
  getBookbyId(id:any){
    if(id !=null && id !=""){
      this.service.getBookById(id).pipe(takeUntilDestroyed(this.destroyRef)).subscribe( res=>{
        this.editData=res;
     //   console.log("editData-->"+JSON.stringify(this.editData));
  
          this.bookFrom.setValue({ 
            id: this.bookDetails =="copy" ? 0: this.editData.id,
            rackNo:this.editData.rackNo,
            row:this.editData.row,
            slNo:this.editData.slNo,
            language:this.editData.language,
            topic:this.editData.topic,
             extn:this.editData.extn,
             an:this.editData.an,
             sn:this.editData.sn,
             title:this.editData.title,
            author:this.editData.author,
            isbn:this.editData.isbn,
            publisher:this.editData.publisher,
            year:this.editData.year, 
            bookCondition:this.editData.bookCondition, 
            bookStatus:this.editData.bookStatus, 
            remarks:this.editData.remarks, 
            qty:this.editData.qty, 
            status:this.editData.status,
            accessno:this.bookDetails =="copy" ? '': this.editData.accessno,
            classno:this.editData.classno,
            location:this.editData.location,
            totalCopies:this.editData.totalCopies,
            colno:this.editData.colno,
          });
        });
    }
  }




  
 bookMaster(){
  this.router.navigate(['book']);
 }

 /** Handles a scanned ISBN (hardware wedge via appScanInput, or camera). */
 onIsbnScan(code: string){
  const isbn = this.scanner.normalize(code);
  this.bookFrom.patchValue({ isbn });
  if(!this.scanner.isValidIsbn(isbn)){
    this.toastr.warning('Scanned value is not a valid ISBN');
  }
 }

 /** Opens the camera scanner and fills the ISBN field with the result. */
 async scanIsbn(){
  const code = await this.scanner.openCamera();
  if(code){ this.onIsbnScan(code); }
 }

 saveBook(){
  // console.log("bookFrom-->"+JSON.stringify(this.bookFrom.value));
  // console.log("bookFrom-->"+this.bookFrom.valid);
    if(this.bookFrom.valid){
        this.service.saveBook(this.bookFrom.value).pipe(takeUntilDestroyed(this.destroyRef)).subscribe( res=>{
        this.toastr.success("Registered Successfully.");
        this.router.navigate(['book']);
      })
  }else{
    this.toastr.warning('Please Enter Valid Data');
  }
 }



}
