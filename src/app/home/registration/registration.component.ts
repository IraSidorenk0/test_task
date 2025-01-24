import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-registration',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule],
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent implements OnInit {
  registrationForm: FormGroup = new FormGroup({
    email: new FormControl(''),
    password: new FormControl('')
  });
  submitted = false;
  errorMessage = '';
  isLoading = false;

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

    if (this.registrationForm.invalid) {
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
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Registration error', error);
        this.errorMessage = error.error?.message || 'An unexpected error occurred';
        this.isLoading = false;
      }
    });
  }

  // Getter for easy access to form fields
  get f() { return this.registrationForm.controls; }
}