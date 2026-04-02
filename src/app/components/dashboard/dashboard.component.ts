import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/service/auth.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {

  bookCount:any;
  devoteCount:any;
  bookIssueCount:any;
  overDueBooks:any;
  currentFromDate:any;
  currentToDate:any;
  
  constructor( private service: AuthService, private router: Router){  
   this.loadDashboardDetails();
 }

  loadDashboardDetails(){

    this.service.loadDashboardDetails().subscribe( res=>{
        //  console.log("LOAD Dashboard->"+JSON.stringify(res))
          this.bookCount=res[0].bookCount;
          this.devoteCount=res[0].devoteCount;
          this.bookIssueCount=res[0].bookIssueCount;
          this.overDueBooks=res[0].overDueBooks;
          this.currentToDate=res[0].currentToDate;
          this.currentFromDate=res[0].currentFromDate;
      });

  }

  gotoBookLent(){
    this.router.navigate(['/bookwiseissuelist']);
  }

  editYear(){
    this.router.navigate(['/settings']);
  }
}
