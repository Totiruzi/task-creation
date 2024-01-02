import { Injectable, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService implements OnDestroy {
  isLoggedIn: boolean = false;

  constructor(private router: Router) {
    // Start listening to storage events
    this.start();
  }

  public login = () => {
    // Do the APIs For Auth
    this.isLoggedIn = true;

    // Route to home page
    this.router.navigate(['']);
  };

  public logOut = () => {
    // Do the APIs For Auth
    this.isLoggedIn = false;

    // Route to login page
    this.router.navigate(['/login']);

    // Set the logout flag in localStorage
    localStorage.setItem('logout-event', Date.now().toString());
  };

  // Bind the eventListener
  private start(): void {
    window.addEventListener("storage", this.storageEventListener.bind(this));
  }

  // Logout only when key is 'logout-event'
  private storageEventListener(event: StorageEvent): void {
    if (event.storageArea === localStorage) {
      if (event?.key && event.key === 'logout-event') {
        this.logOut();
      }
    }
  }

  // Handle active listeners when onDestroy
  private stop(): void {
    window.removeEventListener("storage", this.storageEventListener.bind(this));
  }

  ngOnDestroy(): void {
    this.stop();
  }
}
