import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import {routes} from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
     provideRouter(routes),
     provideClientHydration(), provideFirebaseApp(() => initializeApp({"projectId":"escuelaespecial2031-373be","appId":"1:336317830793:web:39a563d4cc9c67e2a75858","storageBucket":"escuelaespecial2031-373be.appspot.com","apiKey":"AIzaSyCc2ZJFiwfWyUoTgtSLV-vEUzRvckNaAdg","authDomain":"escuelaespecial2031-373be.firebaseapp.com","messagingSenderId":"336317830793","measurementId":"G-EG6ECKG4KL"})), provideAuth(() => getAuth()), provideFirestore(() => getFirestore())
  ]
};
