import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { AccountService } from './account.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent implements OnInit {
  
  title = 'metro-cup';

  constructor(private accountService: AccountService, private cookieService: CookieService, public router: Router) {}
  
  ngOnInit(): void {
    this.accountService.loggedIn = (/true/i).test(this.cookieService.get('metro-logged-in'));
    if(!this.accountService.loggedIn) {
      this.router.navigateByUrl('/login');
      return;
    }

    if(!this.accountService.account) {
      this.accountService.getAccountInfo(this.cookieService.get('metro-name'));
    }
  }
  
}
