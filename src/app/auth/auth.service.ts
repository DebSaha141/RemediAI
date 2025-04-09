import { inject, Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BehaviorSubject } from 'rxjs';
import firebase from 'firebase/compat/app';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private snackBar = inject(MatSnackBar);
  private currentUserSubject = new BehaviorSubject<firebase.User | null>(null);

  constructor(private afAuth: AngularFireAuth, private router: Router) {
    this.afAuth.authState.subscribe((user) => {
      this.currentUserSubject.next(user);
    });
  }

  async signUp(email: string, password: string) {
    try {
      await this.afAuth.createUserWithEmailAndPassword(email, password);
      this.router.navigate(['/chat']);
    } catch (error) {
      this.snackBar.open(
        'Signup failed: ' + (error as Error).message,
        'Close',
        {
          duration: 4000,
          panelClass: ['snackbar-error'],
        }
      );
    }
  }

  async login(email: string, password: string) {
    try {
      await this.afAuth.signInWithEmailAndPassword(email, password);
      this.router.navigate(['/chat']);
    } catch (error) {
      this.snackBar.open('Login failed: ' + (error as Error).message, 'Close', {
        duration: 4000,
        panelClass: ['snackbar-error'],
      });
    }
  }

  getAuthState() {
    return this.afAuth.authState;
  }

  isLoggedIn(): boolean {
    return this.currentUserSubject.value !== null;
  }

  getCurrentUser(): firebase.User | null {
    return this.currentUserSubject.value;
  }

  async logout() {
    try {
      await this.afAuth.signOut();
      this.router.navigate(['/signup']);
    } catch (error) {
      this.snackBar.open(
        'Logout failed: ' + (error as Error).message,
        'Close',
        {
          duration: 4000,
          panelClass: ['snackbar-error'],
        }
      );
    }
  }
}
