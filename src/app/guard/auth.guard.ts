import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/service/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard  {

  constructor(private toastr: ToastrService,private service: AuthService,private router: Router ) {}


  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

      if(this.service.isLoggedIn()){
        if (route.url.length > 0) {
          let menu = route.url[0].path;
          if (menu == 'user') {
            if (this.service.getUserRole() == 'admin') {
              return true;
            } else {
              this.router.navigate(['']);
                this.toastr.warning('You dont have access.')
              return false;
            }
          }else{
            return true;
          }
        } else {
          return true;
        }
        
      }else{
        this.router.navigate(['login']);
        return false;
      }
    
  }
  
}
