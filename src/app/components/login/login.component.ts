import { Component, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/service/auth.service';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css'],
    standalone: false
})
export class LoginComponent {

  private destroyRef = inject(DestroyRef);

  constructor(
    private buider: FormBuilder,
    private toastr: ToastrService,
    private service: AuthService,
    private router: Router
  ) {
    sessionStorage.clear();
  }

  userdata: any;
  hide = true;
  loading = false;

  loginform = this.buider.group({
    name: this.buider.control('', Validators.required),
    password: this.buider.control('', Validators.required),
  });

  proceedLogin() {
    if (this.loginform.valid) {
      this.loading = true;
      this.service.authentication(this.loginform).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
        next: (res) => {
          this.userdata = res;
          if (this.userdata.valid) {
            sessionStorage.setItem('username', this.userdata.users.name);
            sessionStorage.setItem('userrole', this.userdata.users.role);
            this.router.navigate(['']);
          } else {
            this.toastr.error('Invalid Credentials');
          }
          this.loading = false;
        },
        error: () => {
          this.toastr.error('Unable to sign in. Please try again.');
          this.loading = false;
        },
      });
    } else {
      this.loginform.markAllAsTouched();
      this.toastr.warning('Please Enter All Values');
    }
  }
}
