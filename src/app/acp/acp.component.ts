import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AccountService } from '../account.service';

@Component({
  selector: 'app-acp',
  templateUrl: './acp.component.html',
  styleUrls: ['./acp.component.scss']
})
export class AcpComponent implements OnInit {

  constructor(public accountService: AccountService, public router: Router) { }

  ngOnInit(): void {
  }

}
