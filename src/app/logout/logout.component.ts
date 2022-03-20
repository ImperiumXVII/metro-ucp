import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AccountService } from '../account.service';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.scss']
})
export class LogoutComponent implements OnInit {

  secondsToRefresh = 3;

  constructor(private accountService: AccountService, private router: Router) { }

  ngOnInit(): void {
    this.accountService.currentlyLoggingOut = true;
    this.accountService.loggedIn = false;

    let interval = setInterval(() => {
      this.secondsToRefresh --;
      if(this.secondsToRefresh === 0) {
        clearInterval(interval);
        this.accountService.currentlyLoggingOut = false;
        this.router.navigateByUrl('/login');
      }
    }, 1000);
  }

}
