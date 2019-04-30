import { Injectable } from '@angular/core';
import { URLSearchParams } from '@angular/http';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import 'rxjs/add/operator/toPromise';
import { Observable } from 'rxjs';

import { BASE_URI } from '../../app/app.environment';

/**
 * Represents the login service.
 */
@Injectable()
export class LoginService {

  /**
   * Create the service
   * @param {Http} http
   */
  constructor(
    private http: HttpClient) { }

  /**
   * Login the user with oAuth
   * @param  {string}   username
   * @param  {string}   password
   * @return {Promise}
   */
  login(username: string, password: string): Observable<string> {
    const urlSearchParams = new URLSearchParams();
    urlSearchParams.append('grant_type', 'password');
    urlSearchParams.append('client_id', 'dasho');
    urlSearchParams.append('client_secret', '$ecret');
    urlSearchParams.append('username', username);
    urlSearchParams.append('password', password);
    const body = urlSearchParams.toString();

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/x-www-form-urlencoded'
      })
    };

    return this.http.post<string>(`${BASE_URI}oauth/token`, body, httpOptions);
  }

  /**
   * Send the forget password email
   * @param  {string}   email
   * @return {Promise}
   */
  forgetPassword(email: string): Observable<boolean> {
    const API_URL = `${BASE_URI}api/pwdreset`;
    const BODY = JSON.stringify({
      username: email
    });

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };

    return this.http.post<boolean>(API_URL, BODY, httpOptions);
  }

  /**
   * Sign up a new User
   * @param {string} email
   * @param {string} password
   * @return {Promise}
   */
  signUp(email: string, password: string): Observable<boolean> {
    const API_URL = `${BASE_URI}api/account`;
    const BODY = JSON.stringify({
      email: email,
      password: password
    });

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };

    return this.http.post<boolean>(API_URL, BODY, httpOptions);
  }
}
