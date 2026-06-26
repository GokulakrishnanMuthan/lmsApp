import { Component, DestroyRef, inject, OnInit ,Inject} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder,Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/service/auth.service';
import {MatDialog,MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';


@Component({
    selector: 'app-updatepopup',
    templateUrl: './updatepopup.component.html',
    styleUrls: ['./updatepopup.component.css'],
    standalone: false
})
export class UpdatepopupComponent implements OnInit{

  private destroyRef = inject(DestroyRef);

  roleList:any;
  editData:any;

  registerFrom=this.buider.group({
    id:this.buider.control(''),
    name:this.buider.control(''),
    password:this.buider.control(''),
    email:this.buider.control(''),
    role: this.buider.control('', Validators.required),
    isActive:this.buider.control(false),
  });



  constructor(private buider: FormBuilder,private toastr: ToastrService, private service: AuthService, 
    private router: Router, @Inject(MAT_DIALOG_DATA) public data: any,private dialogref: MatDialogRef<UpdatepopupComponent>){

  }
  ngOnInit(): void {
      this.service.getAllRole().pipe(takeUntilDestroyed(this.destroyRef)).subscribe( res=>{
        this.roleList=res;
      })
      if(this.data.usercode !=null && this.data.usercode !=""){
        this.service.getByCode(this.data.usercode).pipe(takeUntilDestroyed(this.destroyRef)).subscribe( res=>{
          this.editData=res;
        //  console.log("this.editData.value-->"+JSON.stringify(this.editData));
          this.registerFrom.setValue({id: this.editData.id,name: this.editData.name,password: this.editData.password,email: this.editData.email,
            role: this.editData.role,isActive: this.editData.isActive});
        })
      }
  }

  
  updateUser(){
    // if(this.registerFrom.valid){
    //     this.service.proceedRegister(this.registerFrom.value).subscribe( res=>{
    //       this.toastr.success("Registered Successfully.");
    //       this.router.navigate(['login']);
    //     })
    // }else{
    //   this.toastr.warning('Please Enter Valid Data');
    // }
    //console.log("this.registerFrom.value-->"+JSON.stringify(this.registerFrom.value));
    this.service.updateUser(this.registerFrom.value.id, this.registerFrom.value).pipe(takeUntilDestroyed(this.destroyRef)).subscribe(res => {
      this.toastr.success('Updated successfully.');
      this.dialogref.close();
    });

  }



}
