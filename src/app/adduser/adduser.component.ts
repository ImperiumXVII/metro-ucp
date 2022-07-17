import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie';
import { environment } from 'src/environments/environment';
import { AccountService } from '../account.service';

export interface SafeAccount {
  id: number;
  username: string;
  character_name: string;
  ip_address: string;
}

@Component({
  selector: 'app-adduser',
  templateUrl: './adduser.component.html',
  styleUrls: ['./adduser.component.scss']
})
export class AdduserComponent implements OnInit {

  constructor(public accountService: AccountService, private cookieService: CookieService, private router: Router) { }

  usersAwaitingActivation: SafeAccount[] = [];
  activatedUsers: SafeAccount[] = [];

  async activateUser(username: string) {
    await this.accountService.activateAccount(username);
    this.activatedUsers.push(this.usersAwaitingActivation.find(u => u.username === username)!);
    this.usersAwaitingActivation = this.usersAwaitingActivation.filter(user => user.username !== username);
    if(username === this.accountService.account?.username) {
      this.accountService.account!.awaiting_approval = false;
      this.cookieService.putObject(environment.cookie_object, this.accountService.account!);
    }
  }

  async editUser(userId: number) {
    this.router.navigateByUrl('acp/accounts/edit/' + userId);
  }

  async deactivateUser(username: string) {
    await this.accountService.deactivateAccount(username);
    this.usersAwaitingActivation.push(this.activatedUsers.find(u => u.username === username)!);
    this.activatedUsers = this.activatedUsers.filter(user => user.username !== username);
    if(username === this.accountService.account?.username) {
      this.accountService.account!.awaiting_approval = true;
      this.cookieService.putObject(environment.cookie_object, this.accountService.account!);
    }
  }

  displayUser(user: SafeAccount) {
    return `${user.character_name} (${user.username}) - ${user.ip_address}`;
  }

  async ngOnInit(): Promise<void> {
    this.accountService.gettingDeactivatedUsers = true;
    const allUsers = await Promise.all([
      this.accountService.getUsersAwaitingActivation(),
      this.accountService.getActivatedUsers()
    ]);
    this.usersAwaitingActivation = allUsers[0];
    this.activatedUsers = allUsers[1];
    this.accountService.gettingDeactivatedUsers = false;
  }

}
