import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie';
import { Account, AccountService } from './account.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent implements OnInit {
  
  title = 'metro-cup';

  constructor(private accountService: AccountService, private cookieService: CookieService, public router: Router) {}
  
  ngOnInit(): void {
    if(!this.accountService.loggedIn) {
      const cookie = this.cookieService.get('metro-loggedin');
      if(cookie === 'true') {
        const accountCookie = this.cookieService.getObject('metro-account');
        if(accountCookie) {
          this.accountService.account = <Account>accountCookie;
          this.accountService.loggedIn = true;
          this.router.navigateByUrl('/');
          return;
        }
      }
      this.router.navigateByUrl('/login');
      return;
    }

    if(!this.accountService.account) {
      const accountCookie = this.cookieService.getObject('metro-account');
      if(accountCookie) {
        this.accountService.account = <Account>accountCookie;
        this.router.navigateByUrl('/');
        return;
      }
      this.accountService.loggedIn = false;
      this.router.navigateByUrl('/login');
      return;
    }
  }
  
}
