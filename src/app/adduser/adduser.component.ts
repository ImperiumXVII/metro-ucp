import { Component, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie';
import { AccountService } from '../account.service';

export interface SafeAccount {
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

  constructor(public accountService: AccountService, private cookieService: CookieService) { }

  usersAwaitingActivation: SafeAccount[] = [];
  activatedUsers: SafeAccount[] = [];

  async activateUser(username: string) {
    await this.accountService.activateAccount(username);
    this.activatedUsers.push(this.usersAwaitingActivation.find(u => u.username === username)!);
    this.usersAwaitingActivation = this.usersAwaitingActivation.filter(user => user.username !== username);
    if(username === this.accountService.account?.username) {
      this.accountService.account!.awaiting_approval = false;
      this.cookieService.putObject('metro-account', this.accountService.account!);
    }
  }

  async editUser(username: string) {
    alert('edit user ' + username);
  }

  async deactivateUser(username: string) {
    await this.accountService.deactivateAccount(username);
    this.usersAwaitingActivation.push(this.activatedUsers.find(u => u.username === username)!);
    this.activatedUsers = this.activatedUsers.filter(user => user.username !== username);
    if(username === this.accountService.account?.username) {
      this.accountService.account!.awaiting_approval = true;
      this.cookieService.putObject('metro-account', this.accountService.account!);
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
