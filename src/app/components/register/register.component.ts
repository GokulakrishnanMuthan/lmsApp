import { Component } from '@angular/core';
import { FormBuilder,Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/service/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {

  constructor(private buider: FormBuilder,private toastr: ToastrService, private service: AuthService, private router: Router){

  }

  registerFrom=this.buider.group({
    id:this.buider.control('',Validators.compose([Validators.required,Validators.minLength(5)])),
    name:this.buider.control('',Validators.required),
    password:this.buider.control('',Validators.compose([Validators.required,Validators.pattern('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&].{8,}')])),
    email:this.buider.control('',Validators.compose([Validators.required,Validators.email])),
    gender:this.buider.control('male'),
    role:this.buider.control(''),
    isActive:this.buider.control(false),
  });


  proceedRegistration(){
    if(this.registerFrom.valid){
        this.service.proceedRegister(this.registerFrom.value).subscribe( res=>{
          this.toastr.success("Registered Successfully.");
          this.router.navigate(['login']);
        })
    }else{
      this.toastr.warning('Please Enter Valid Data');
    }
  }
}
