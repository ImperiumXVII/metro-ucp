import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  constructor(private http: HttpClient) {}

  private _loggedIn = false;
  adminLevel = 0;

  get loggedIn() {
    return this._loggedIn;
  }

  set loggedIn(loggedIn: boolean) {
    this._loggedIn = loggedIn;
  }

  login(username: string, password: string) {
    this.http.get(`http://localhost:3000/login/${username}/${password}`, { responseType: 'text' }).subscribe(response => {
      console.log(response);
    });
  }
}
