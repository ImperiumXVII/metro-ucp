import { Component, OnInit, ElementRef } from '@angular/core';
import { AccountService } from '../account.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  constructor(private accountService: AccountService, private element: ElementRef) { }

  ngOnInit(): void {

  }

  processLogin() {
    const username = this.element.nativeElement.querySelector('#metro-ucp-username').value;
    const password = this.element.nativeElement.querySelector('#metro-ucp-password').value;
    this.accountService.login(username, password);
  }

}
