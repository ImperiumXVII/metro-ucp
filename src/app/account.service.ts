import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

export interface Account {
  id: number;
	username: string;
	password: string;
	admin_level: number;
	rank: number;
	character_name: any;
	ip_address: string;
	platoon_a_cmd: boolean;
	platoon_d_cmd: boolean;
	awaiting_approval: boolean;
	d_platoon: boolean;
	a_platoon: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  constructor(private http: HttpClient) {}

  private _loggedIn = false;
  account: Account | null = null;

  get loggedIn() {
    return this._loggedIn;
  }

  set loggedIn(loggedIn: boolean) {
    this._loggedIn = loggedIn;
  }

  login(username: string, password: string) {
    this.http.get(`http://localhost:3000/login/${username}/${password}`, { responseType: 'text' }).subscribe(response => {
      if(response) {

      }
    });
  }
}
