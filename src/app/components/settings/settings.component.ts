import { Component, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Validators, FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/service/auth.service';
import { FileUploadServiceService } from 'src/app/service/file-upload-service.service';

@Component({
    selector: 'app-settings',
    templateUrl: './settings.component.html',
    styleUrls: ['./settings.component.css'],
    standalone: false
})
export class SettingsComponent {

 private destroyRef = inject(DestroyRef);

 currentYear: any;
 showForm = false;

  yearForm = this.buider.group({
    fromDate: ['', Validators.required],
    toDate: ['', Validators.required],
  });
  
    devoteeFrom=this.buider.group({
        id:0,
        name:this.buider.control('',Validators.required),
        phoneno:this.buider.control('',Validators.required),
        email:this.buider.control('',Validators.required),
        room:this.buider.control('',Validators.required),
        year:this.buider.control('',Validators.required),
       
      });
      constructor(private buider: FormBuilder,private toastr: ToastrService,
        private service: AuthService, private router: Router,public dialog: MatDialog,private activatedRoute: ActivatedRoute,private uploadService: FileUploadServiceService){  
        
       }
  

  ngOnInit() {
    this.loadCurrentYear();
  }

  loadCurrentYear() {
    this.service.getCurrentYear().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (res) => (this.currentYear = res),
      error: () => (this.currentYear = null),
    });
  }


   saveNextYear(){
         if (this.yearForm.valid) {
          const { fromDate, toDate } = this.yearForm.value;
          this.service.addNextYear(fromDate!, toDate!).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
            next: () => {
              this.toastr.success('Next academic year added');
              this.loadCurrentYear();
            },
            error: () => this.toastr.error('Failed to add year'),
          });
    }
   }
      
    backdashboard(){
    this.router.navigate(['']);
   }
   
   cancelForm() {
  this.showForm = false;
  this.yearForm.reset();
}

}
