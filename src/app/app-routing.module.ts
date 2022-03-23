import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AcpComponent } from './acp/acp.component';
import { AdduserComponent } from './adduser/adduser.component';
import { LoginComponent } from './login/login.component';
import { LogoutComponent } from './logout/logout.component';
import { PermissionsComponent } from './permissions/permissions.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'acp', component: AcpComponent },
  { path: 'acp/createuser', component: AdduserComponent },
  { path: 'acp/permissions', component: PermissionsComponent },
  { path: 'logout', component: LogoutComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
