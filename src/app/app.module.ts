import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from 'src/material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';
import { LoginComponent } from './components/login/login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { RegisterComponent } from './components/register/register.component';
import { UserlistComponent } from './components/userlist/userlist.component';
import { UpdatepopupComponent } from './components/updatepopup/updatepopup.component';
import { BookComponent } from './components/book/book.component';
import { DeleteDialogComponent, DevoteComponent } from './components/devote/devote.component';
import { BookissueComponent } from './components/bookissue/bookissue.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { NewbookissueComponent } from './components/newbookissue/newbookissue.component';
import { NewbookComponent } from './components/newbook/newbook.component';
import { FormsModule } from '@angular/forms';
import { RetunbookComponent } from './components/retunbook/retunbook.component';
import { BookwiseissuelistComponent } from './components/bookwiseissuelist/bookwiseissuelist.component';
import { ReportComponent } from './components/report/report.component';
import { ReportbooklentdatewiseComponent } from './components/reportbooklentdatewise/reportbooklentdatewise.component';
import { ReportbooklentbookwiseComponent } from './components/reportbooklentbookwise/reportbooklentbookwise.component';


 
import { StoreModule } from '@ngrx/store';
import { reducer } from './ngrx/book.reducer';
import { BarcodeprintComponent } from './components/barcodeprint/barcodeprint.component';
import { RackListComponent } from './components/rack-list/rack-list.component';
import { RackEditComponent } from './components/rack-edit/rack-edit.component';
import { RackListReportComponent } from './components/rack-list-report/rack-list-report.component';
import { NewdevoteComponent } from './components/newdevote/newdevote.component';
import { SettingsComponent } from './components/settings/settings.component';
import { MatDialogModule } from '@angular/material/dialog';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    DashboardComponent,
    RegisterComponent,
    UserlistComponent,
    UpdatepopupComponent,
    BookComponent,
    DevoteComponent,
    BookissueComponent,
    NewbookissueComponent,
    NewbookComponent,
    RetunbookComponent,
    BookwiseissuelistComponent,
    ReportComponent,
    ReportbooklentdatewiseComponent,
    ReportbooklentbookwiseComponent,
    BarcodeprintComponent,
    RackListComponent,
    RackEditComponent,
    RackListReportComponent,
    NewdevoteComponent,
    SettingsComponent,
 DeleteDialogComponent  
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
    ReactiveFormsModule,
    HttpClientModule,
    ToastrModule.forRoot(),
    FlexLayoutModule,
    FormsModule,
    MatDialogModule,
    StoreModule.forRoot({ book: reducer })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { 
 
}
