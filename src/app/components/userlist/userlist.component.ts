import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { FormBuilder,Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/service/auth.service';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatDialog, MatDialogRef} from '@angular/material/dialog';
import { UpdatepopupComponent } from '../updatepopup/updatepopup.component';



@Component({
  selector: 'app-userlist',
  templateUrl: './userlist.component.html',
  styleUrls: ['./userlist.component.css']
})
export class UserlistComponent {

  constructor(private buider: FormBuilder,private toastr: ToastrService,
     private service: AuthService, private router: Router,public dialog: MatDialog){  
    this.loadUsers();
  }

  userList:any;
  dataSource:any;
  displayedColumns: string[] = [ 'name', 'email','role', 'action'];
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;


  loadUsers(){
    this.service.getAll().subscribe( res=>{
        this.userList=res;
       // console.log("res-->"+JSON.stringify(res))
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

}
