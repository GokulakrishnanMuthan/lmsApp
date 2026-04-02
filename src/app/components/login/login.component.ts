import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/service/auth.service';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  constructor(
    private buider: FormBuilder,
    private toastr: ToastrService,
    private service: AuthService,
    private router: Router
  ) {
    sessionStorage.clear();
  }

  userdata: any;

  loginform = this.buider.group({
    name: this.buider.control('', Validators.required),
    password: this.buider.control('', Validators.required),
  });

  proceedLogin() {
    if (this.loginform.valid) {
      this.service.authentication(this.loginform).subscribe((res) => {
        this.userdata = res;
        if (this.userdata.valid) {
            sessionStorage.setItem('username', this.userdata.users.name);
            sessionStorage.setItem('userrole', this.userdata.users.role);
            this.router.navigate(['']);
        } else {
          this.toastr.error('Invalid Credentials');
        }
      });
    } else {
      this.toastr.warning('Please Enter All Values');
    }
  }
}
