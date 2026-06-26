import { Component, DestroyRef, inject, ViewChild } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormBuilder, Validators } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Observable, startWith, map } from 'rxjs';
import { Book } from 'src/app/interfaces/book';
import { Devote } from 'src/app/interfaces/devote';
import { AuthService } from 'src/app/service/auth.service';
import { UpdatepopupComponent } from '../updatepopup/updatepopup.component';

@Component({
    selector: 'app-rack-list',
    templateUrl: './rack-list.component.html',
    styleUrls: ['./rack-list.component.css'],
    standalone: false
})
export class RackListComponent {

  private destroyRef = inject(DestroyRef);

  constructor(private buider: FormBuilder,private toastr: ToastrService,
    private service: AuthService, private router: Router,public dialog: MatDialog){  
   this.loadUsers();
 }

 racksList:any;
 dataSource:any;
 displayedColumns: string[] = [ 'rackName', 'title','subTitle','action'];
 @ViewChild(MatPaginator) paginator!: MatPaginator;
 @ViewChild(MatSort) sort!: MatSort;


 loadUsers(){
 
  this.service.getAllRackList().pipe(takeUntilDestroyed(this.destroyRef)).subscribe( (res: any) => {
    
    if(res.isValid){
      this.racksList=res.racksList;
      this.dataSource=new MatTableDataSource(this.racksList);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }
    
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
  //console.log("id-->"+JSON.stringify(dObj));
 // this.router.navigate(['returnbook']);
  this.router.navigate(['rackEdit'],{ queryParams: { rackId: dObj.rackId } });
  
 }



}
