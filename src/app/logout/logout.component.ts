import { Component, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { AccountService } from '../account.service';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.scss']
})
export class LogoutComponent implements OnInit {

  constructor(private accountService: AccountService, private cookieService: CookieService) { }

  ngOnInit(): void {
    this.cookieService.set('metro-logged-in', 'false');
    this.cookieService.set('metro-name', '');
    delete this.accountService.account;
  }

}
