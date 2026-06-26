import { Component, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/service/auth.service';

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.css'],
    standalone: false
})
export class DashboardComponent {

  private destroyRef = inject(DestroyRef);

  bookCount: any;
  devoteCount: any;
  bookIssueCount: any;
  overDueBooks: any;
  availableBooks: any;
  rackCount: any;
  currentFromDate: any;
  currentToDate: any;

  loading = true;
  loadError = false;

  recentIssues: any[] = [];
  recentColumns: string[] = ['name', 'issueDate', 'expireDate', 'phone', 'address'];

  constructor(private service: AuthService, private router: Router) {
    this.loadDashboardDetails();
    this.loadRackCount();
    this.loadRecentIssues();
  }

  loadDashboardDetails() {
    this.loading = true;
    this.loadError = false;
    this.service.loadDashboardDetails().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (res) => {
        const data = Array.isArray(res) && res.length ? res[0] : null;
        if (!data) {
          this.loadError = true;
          this.loading = false;
          return;
        }
        this.bookCount = data.bookCount;
        this.devoteCount = data.devoteCount;
        this.bookIssueCount = data.bookIssueCount;
        this.overDueBooks = data.overDueBooks;
        this.currentToDate = data.currentToDate;
        this.currentFromDate = data.currentFromDate;
        // Books on the shelf right now = total minus those currently lent out.
        const total = Number(data.bookCount);
        const lent = Number(data.bookIssueCount);
        this.availableBooks =
          isNaN(total) || isNaN(lent) ? '-' : Math.max(total - lent, 0);
        this.loading = false;
      },
      error: () => {
        this.loadError = true;
        this.loading = false;
      },
    });
  }

  loadRackCount() {
    this.service.getAllRackListwithBookCount().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (res: any) => {
        this.rackCount = Array.isArray(res) ? res.length : '-';
      },
      error: () => (this.rackCount = '-'),
    });
  }

  loadRecentIssues() {
    this.service.getAllBookIssues().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (res: any) => {
        this.recentIssues = Array.isArray(res) ? res.slice(0, 5) : [];
      },
      error: () => (this.recentIssues = []),
    });
  }

  gotoBooks() {
    this.router.navigate(['/book']);
  }

  gotoLent() {
    this.router.navigate(['/bookissue']);
  }

  gotoDevotes() {
    this.router.navigate(['/devote']);
  }

  gotoRacks() {
    this.router.navigate(['/rackList']);
  }

  gotoBookLent() {
    this.router.navigate(['/bookwiseissuelist']);
  }

  editYear() {
    this.router.navigate(['/settings']);
  }
}
