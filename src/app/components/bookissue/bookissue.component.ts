import { AfterViewInit, Component, DestroyRef, inject, ViewChild } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder,Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/service/auth.service';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatDialog, MatDialogRef} from '@angular/material/dialog';
import { UpdatepopupComponent } from '../updatepopup/updatepopup.component';
import {Observable} from "rxjs";

@Component({
    selector: 'app-bookissue',
    templateUrl: './bookissue.component.html',
    styleUrls: ['./bookissue.component.css'],
    standalone: false
})
export class BookissueComponent {

  private destroyRef = inject(DestroyRef);

  constructor(private buider: FormBuilder,private toastr: ToastrService,
    private service: AuthService, private router: Router,public dialog: MatDialog){  
   this.loadUsers();
 }

 userList:any;
 dataSource:any;
 displayedColumns: string[] = [ 'name', 'issueDate','expireDate','email','phone', 'address','action'];
 @ViewChild(MatPaginator) paginator!: MatPaginator;
 @ViewChild(MatSort) sort!: MatSort;


 loadUsers(){
 
  this.service.getAllBookIssues().pipe(takeUntilDestroyed(this.destroyRef)).subscribe( res=>{
    this.userList=res;
    //console.log("res-->"+JSON.stringify(res))
    this.dataSource=new MatTableDataSource(this.userList);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
});
 }


 applyFilter(event: Event) {
   const filterValue = (event.target as HTMLInputElement).value;
   this.dataSource.filter = filterValue.trim().toLowerCase();
 }

 updateUser(id:any){
  // console.log(id)
   this.dialog.open(UpdatepopupComponent, {
     width: '50%',enterAnimationDuration:'100ms',exitAnimationDuration:'50ms',data:{usercode:id}
   });
 }

 newissue(){
  this.router.navigate(['newbookissue']);
 }  

 
 returnBook(dObj:any){
 // this.router.navigate(['returnbook']);
  this.router.navigate(['returnbook'],{ queryParams: { devoteId: dObj.devoteId,issueDate:dObj.issueDate }});
  
 }


}
