import { Component,DoCheck } from '@angular/core';
import { Route, Router } from '@angular/router';
import { AuthService } from './service/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements DoCheck{
  title = 'lmsApp';
  isMenuRequired=false;
  isAdminRole=false;
  constructor(private router:Router,private service: AuthService){

  }
  ngDoCheck(): void {
    let currenturl=this.router.url;
    if(currenturl==="/login" || currenturl==='/register'){
      this.isMenuRequired=false;
    }else{
      this.isMenuRequired=true;
    }

    if(this.service.getUserRole()?.toString() ==="admin"){
      this.isAdminRole=true;
    }else{
      this.isAdminRole=false;
    }
  }

}
