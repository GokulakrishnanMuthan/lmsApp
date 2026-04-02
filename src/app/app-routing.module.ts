import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { RegisterComponent } from './components/register/register.component';
import { LoginComponent } from './components/login/login.component';
import { UserlistComponent } from './components/userlist/userlist.component';
import { AuthGuard } from './guard/auth.guard';
import { BookComponent } from './components/book/book.component';
import { DevoteComponent } from './components/devote/devote.component';
import { BookissueComponent } from './components/bookissue/bookissue.component';
import { NewbookissueComponent } from './components/newbookissue/newbookissue.component';
import { NewbookComponent } from './components/newbook/newbook.component';
import { RetunbookComponent } from './components/retunbook/retunbook.component';
import { BookwiseissuelistComponent } from './components/bookwiseissuelist/bookwiseissuelist.component';
import { ReportComponent } from './components/report/report.component';
import { RackListComponent } from './components/rack-list/rack-list.component';
import { RackEditComponent } from './components/rack-edit/rack-edit.component';
import { NewdevoteComponent } from './components/newdevote/newdevote.component';
import { SettingsComponent } from './components/settings/settings.component';

const routes: Routes = [
  {path:'',component:DashboardComponent, canActivate:[AuthGuard]},
  {path:'register',component:RegisterComponent},
  {path:'login',component:LoginComponent},
  {path:'user',component:UserlistComponent, canActivate:[AuthGuard]},
  {path:'book',component:BookComponent, canActivate:[AuthGuard]},
  {path:'newbook',component:NewbookComponent, canActivate:[AuthGuard]},
  {path:'editbook/:id',component:NewbookComponent, canActivate:[AuthGuard]},
  {path:'devote',component:DevoteComponent, canActivate:[AuthGuard]},
   {path:'newdevote',component:NewdevoteComponent, canActivate:[AuthGuard]},
  {path:'bookissue',component:BookissueComponent, canActivate:[AuthGuard]},
  {path:'newbookissue',component:NewbookissueComponent, canActivate:[AuthGuard]},
  {path:'returnbook',component:RetunbookComponent, canActivate:[AuthGuard]},
  {path:'bookwiseissuelist',component:BookwiseissuelistComponent, canActivate:[AuthGuard]},
  {path:'report',component:ReportComponent, canActivate:[AuthGuard]},
  {path:'rackList',component:RackListComponent, canActivate:[AuthGuard]},
  {path:'rackEdit',component:RackEditComponent, canActivate:[AuthGuard]},
  {path:'settings',component:SettingsComponent, canActivate:[AuthGuard]},
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
