import { Component } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthResponse } from '../models/auth.models';
import { LoadingService } from '../../../core/services/loading.service';
import { LoadingSpinnerComponent } from "../../../core/components/ui/loading-spinner/loading-spinner.component";

@Component({
  standalone: true,
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  imports: [CommonModule, ReactiveFormsModule, MatInputModule, MatButtonModule, MatCardModule, LoadingSpinnerComponent],
})
export class LoginComponent {
  form;
  isLoggingIn = false;

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router,
    private loadingService: LoadingService
  ) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  submit() {
    if (this.form.invalid || this.isLoggingIn) return;

    this.isLoggingIn = true;
    this.loadingService.show();

    this.auth.login(this.form.value as AuthResponse).subscribe((res) => {
      this.loadingService.hide();
      this.isLoggingIn = false;
      this.auth.saveUserInfo(res.token, res.id, res.email);
      this.router.navigate(['/todos']);
    }, () => {
      this.loadingService.hide();
      this.isLoggingIn = false;
    });
  }

  navigateToRegister() {
    this.router.navigate(['/register']);
  }

  get f() {
    return this.form.controls;
  }
}
