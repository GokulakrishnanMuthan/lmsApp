import { Component } from '@angular/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/service/auth.service';
import { FileUploadServiceService } from 'src/app/service/file-upload-service.service';

@Component({
  selector: 'app-rack-edit',
  templateUrl: './rack-edit.component.html',
  styleUrls: ['./rack-edit.component.css']
})
export class RackEditComponent {
  rackForm: FormGroup;
  currentFile?: File;
  progress = 0;
  message = '';
  rackId: any;
  rackObj: any;

  constructor(
    private fb: FormBuilder,
    private toastr: ToastrService,
    private service: AuthService,
    private router: Router,
    public dialog: MatDialog,
    private activatedRoute: ActivatedRoute,
  ) {
    this.rackForm = this.fb.group({
      rackName: this.fb.control('', Validators.required),
      title: this.fb.control('', Validators.required),
      subTitle: this.fb.control('', Validators.required)
    });

    this.activatedRoute.queryParams.subscribe((params) => {
      this.rackId = params['rackId'];
     
      this.service.getRackById(this.rackId).subscribe( res=>{
        this.rackObj = res;
        this.rackForm.setValue({
          rackName: this.rackObj.rackName,
          title: this.rackObj.title,
          subTitle: this.rackObj.subTitle,
        });
      })
    
    });
  }

  bookMaster() {
    this.router.navigate(['rackList']);
  }
  
  saveRack(){
  // console.log("bookFrom-->"+this.bookFrom.valid);
    if(this.rackForm.valid){
        this.service.saveRack(this.rackForm.value).subscribe( res=>{
        this.toastr.success("Saved Successfully.");
        this.router.navigate(['rackList']);
      })
  }else{
    this.toastr.warning('Please Enter Valid Data');
  }
 }



}
