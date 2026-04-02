import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/service/auth.service';
import { FileUploadServiceService } from 'src/app/service/file-upload-service.service';

@Component({
  selector: 'app-newdevote',
  templateUrl: './newdevote.component.html',
  styleUrls: ['./newdevote.component.css']
})
export class NewdevoteComponent {

  academicYear: string = '';
  
devoteeForm = this.buider.group({
  id: [0],
  name: this.buider.control('', Validators.required),
  phone: this.buider.control('', [
    Validators.required,
    Validators.pattern(/^[0-9]{10}$/) // exactly 10 digits
  ]),
  email: this.buider.control('', [Validators.required, Validators.email]),
  address: this.buider.control('', Validators.required),
  year: this.buider.control('', Validators.required),
  status: [1]   // default active
});


constructor(
  private buider: FormBuilder,
  private toastr: ToastrService,
  private service: AuthService,
  private router: Router,
  public dialog: MatDialog,
  private activatedRoute: ActivatedRoute,
  private uploadService: FileUploadServiceService
) {
  this.getAcademicYear();
}


getAcademicYear(): void {
  this.service.getAcademicYear().subscribe({
    next: (res: string) => {
      this.academicYear = res;
      this.devoteeForm.patchValue({ year: this.academicYear });
    },
    error: (err) => {
      console.error('Error fetching academic year', err);
    }
  });
}




  // ✅ Save Devotee form
  saveDevotee(): void {
    if (this.devoteeForm.invalid) {
      this.toastr.error('Please fill all required fields');
      return;
    }

    this.service.saveDevotee(this.devoteeForm.value).subscribe({
      next: (res) => {
        this.toastr.success('Devotee saved successfully');
        this.router.navigate(['devote']);  // redirect to devotee master page
      },
      error: (err) => {
        console.error('Error saving devotee', err);
        this.toastr.error('Error while saving devotee');
      }
    });
  }

  devoteeMaster(): void {
    this.router.navigate(['devote']);
  }
}
