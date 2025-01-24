import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';

// Interfaces for API responses and data
export interface RegistrationData {
  login: string;
  password: string;
}

export interface RegistrationResponse {
  status: boolean;
  customer_id?: string;
  token?: string;
  error?: string;
}

export interface User {
  customer_id: string;
  token: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private userSubject = new BehaviorSubject<User | null>(this.getStoredUser());
  public user$ = this.userSubject.asObservable();

  private readonly API_URL = 'https://api.brn.ai/customer/create/2X8WI2F0YE';

  constructor(private http: HttpClient) {}

  register(data: RegistrationData): Observable<RegistrationResponse> {
    return this.http.post<RegistrationResponse>(this.API_URL, data).pipe(
      tap(response => {    
            
        if (response.status && response.customer_id && response.token) {
          let user: User = {
            customer_id: response.customer_id,
            token: response.token
          };
          this.setUser(user);
        }
      }),
      catchError(error => {
        let errorResponse: RegistrationResponse = {
          status: false,
          error: error.error?.message || 'Registration failed. Please try again.'
        };
        throw errorResponse;
      })
    );
  }

  private setUser(user: User): void {
    localStorage.setItem('user', JSON.stringify(user));
    this.userSubject.next(user);
  }

  private getStoredUser(): User | null {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  }

  logout(): void {
    localStorage.removeItem('user');
    this.userSubject.next(null);
  }

  isAuthenticated(): boolean {
    return !!this.userSubject.value;
  }
}