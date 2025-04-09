import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  standalone: true,
  imports: [FormsModule,CommonModule,MatSnackBarModule],
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
  
  
export class SignupComponent implements OnInit {
  email = '';
  password = '';
  isLoginMode = false;
  isLoading = true;
  private router = inject(Router);

  constructor(private auth: AuthService) {}

  ngOnInit() {
    this.auth.getAuthState().subscribe(user => {
      if (user) {
        this.router.navigate(['/chat']);
      } else {
        this.isLoading = false; 
      }
    });
  }

  toggleMode() {
    this.isLoginMode = !this.isLoginMode;
  }

  onSubmit() {
    if (this.isLoginMode) {
      this.auth.login(this.email, this.password);
    } else {
      this.auth.signUp(this.email, this.password);
    }
  }
}
