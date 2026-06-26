import {Component, DestroyRef, inject, OnInit,AfterViewInit,  ViewChild } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
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
import { ScannerService } from 'src/app/scanner/scanner.service';


@Component({
    selector: 'app-retunbook',
    templateUrl: './retunbook.component.html',
    styleUrls: ['./retunbook.component.css'],
    standalone: false
})
export class RetunbookComponent {

  private destroyRef = inject(DestroyRef);

  retunBookList:any;
  dataSource:any;
  returnresponse:any;
  scanField = '';
 displayedColumns: string[] = [ 'title', 'issueDate','expireDate','bookreturnDate', 'comments'];
 @ViewChild(MatPaginator) paginator!: MatPaginator;
 @ViewChild(MatSort) sort!: MatSort;

  constructor(private buider: FormBuilder,private toastr: ToastrService,
    private service: AuthService, private router: Router,public dialog: MatDialog,private activatedRoute: ActivatedRoute,
    private uploadService: FileUploadServiceService,private dateAdapter: DateAdapter<Date>,
    private scanner: ScannerService){
   //this.loadBooks();
   this.dateAdapter.setLocale('en-GB'); //dd/MM/yyyy
 }
  ngOnInit(): void {
    //console.log("bookId-->"+JSON.stringify(this.activatedRoute.queryParams)); 
      this.activatedRoute.queryParams.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((params) => {
     // console.log(params['devoteId']);
      //.log(params['issueDate']); 
        if(params['devoteId'] != undefined && params['issueDate'] != undefined){
          //this.getBookbyId(params['bookid']);
          this.getReturnBooks(params['devoteId'],params['issueDate']);
        }
    });
  }

  getReturnBooks(devoteId:any,issueDate:any){
    this.service.getBookReturnDetails(devoteId, issueDate).pipe(takeUntilDestroyed(this.destroyRef)).subscribe(res => {
      this.applyReturnList(res);
    });
  }

  /** Normalises a return-details payload into the table data source. */
  private applyReturnList(res: any){
    const list = Array.isArray(res) ? res : (res?.bookIssueDetailsList ?? []);
    this.retunBookList = (list || []).map((book: any) => ({
      ...book,
      expireDate: book.expireDate ? this.parseDate(book.expireDate) : null,
    }));
    this.dataSource = new MatTableDataSource(this.retunBookList);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  /**
   * Handles a scanned access number. Tries a backend lookup for the open issue
   * of that copy; if the endpoint is unavailable or returns nothing, falls back
   * to filtering the copies already loaded for the member.
   */
  onAccessnoScan(code: string){
    const accessno = this.scanner.normalize(code);
    this.scanField = '';
    if(!accessno){ return; }

    this.service.getReturnByAccessno(accessno).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (res: any) => {
        const list = Array.isArray(res) ? res : (res?.bookIssueDetailsList ?? []);
        if(list && list.length){
          this.applyReturnList(res);
        }else{
          this.filterLoaded(accessno);
        }
      },
      error: () => this.filterLoaded(accessno),
    });
  }

  /** Opens the camera scanner and resolves the copy to return. */
  async scanBook(){
    const code = await this.scanner.openCamera();
    if(code){ this.onAccessnoScan(code); }
  }

  /** Client-side fallback: filter/highlight the already-loaded copies. */
  private filterLoaded(accessno: string){
    if(this.dataSource){
      this.dataSource.filter = accessno.toLowerCase();
      if((this.dataSource.filteredData?.length ?? 0) === 0){
        this.toastr.warning('No loaded copy matches ' + accessno);
      }
    }else{
      this.toastr.warning('No matching copy for ' + accessno + '. Open a member first.');
    }
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
    this.service.returnBook(this.retunBookList).pipe(takeUntilDestroyed(this.destroyRef)).subscribe((response: BookVO) => {
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
