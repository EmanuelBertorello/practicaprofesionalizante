// auth.service.ts
import { inject, Injectable } from '@angular/core';
import {
  Auth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  authState,
  User as FirebaseUser,
} from '@angular/fire/auth';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';

export interface User {
  email?: string;
  password?: string;
  displayName?: string;
  uid?: string;
  photoURL?: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private _auth = inject(Auth);
  user$: Observable<FirebaseUser | null>;

  constructor() {
    this.user$ = authState(this._auth).pipe(
      tap((user: FirebaseUser | null) => console.log('User$ emitted:', user))
    );
  }

  get currentUser(): FirebaseUser | null {
    return this._auth.currentUser;
  }

  get user(): Observable<User | null> {
    return this.user$.pipe(
      map((firebaseUser: FirebaseUser | null) => {
        if (firebaseUser) {
          return {
            uid: firebaseUser.uid,
            email: firebaseUser.email || undefined,
            displayName: firebaseUser.displayName || undefined,
            photoURL: firebaseUser.photoURL || undefined,
          };
        } else {
          return null;
        }
      })
    );
  }

  signUp(user: User) {
    return createUserWithEmailAndPassword(
      this._auth,
      user.email!,
      user.password!
    );
  }

  signIn(user: User) {
    return signInWithEmailAndPassword(this._auth, user.email!, user.password!);
  }

  signInWithGoogle() {
    const provider = new GoogleAuthProvider();
    return signInWithPopup(this._auth, provider);
  }

  signOut() {
    return signOut(this._auth);
  }
}