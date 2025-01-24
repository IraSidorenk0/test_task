import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { timer, Subscription } from 'rxjs';

@Component({
  selector: 'app-registration',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule],
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent implements OnInit, OnDestroy {
  registrationForm: FormGroup = new FormGroup({
    email: new FormControl(''),
    password: new FormControl('')
  });
  submitted = false;
  errorMessage = '';
  isLoading = false;
  private errorMessageTimer: Subscription | null = null;
  private formErrorTimer: Subscription | null = null;

  constructor(
    private formBuilder: FormBuilder, 
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.registrationForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [
        Validators.required, 
        Validators.minLength(8),
        Validators.pattern(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/)
      ]]
    });
  }

  onSubmit() {
    this.submitted = true;
    this.errorMessage = '';
    this.clearFormErrorTimer();

    if (this.registrationForm.invalid) {
      this.startFormErrorTimer();
      return;
    }

    // Set loading state
    this.isLoading = true;

    // Prepare registration data
    let registrationData = {
      login: this.registrationForm.get('email')?.value,
      password: this.registrationForm.get('password')?.value
    };

    // Make API call
    this.authService.register(registrationData).subscribe({
      next: (response) => {
        if (response.status) {
          this.router.navigate(['/landing']);
        } else {
          this.errorMessage = 'Registration failed. Please try again.';
          this.startErrorMessageTimer();
        }
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = error.error?.message || 'An unexpected error occurred';
        this.startErrorMessageTimer();
        this.isLoading = false;
      }
    });
  }

  private startErrorMessageTimer() {
    // Clear any existing timer
    if (this.errorMessageTimer) {
      this.errorMessageTimer.unsubscribe();
    }

    this.errorMessageTimer = timer(5000).subscribe(() => {
      this.errorMessage = '';
    });
  }

  private startFormErrorTimer() {
    // Clear any existing timer
    this.clearFormErrorTimer();

    // Start a new timer to clear form errors after 5 seconds
    this.formErrorTimer = timer(5000).subscribe(() => {
      this.submitted = false;
    });
  }

  private clearFormErrorTimer() {
    if (this.formErrorTimer) {
      this.formErrorTimer.unsubscribe();
      this.formErrorTimer = null;
    }
  }

  ngOnDestroy() {
    if (this.errorMessageTimer) {
      this.errorMessageTimer.unsubscribe();
    }
    this.clearFormErrorTimer();
  }

  // Getter for easy access to form fields
  get f() { return this.registrationForm.controls; }
}