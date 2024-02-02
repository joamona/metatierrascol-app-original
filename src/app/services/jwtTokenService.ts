import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class JWTTokenService {
  private token: string;
  private tokenTimestamp: number;

  constructor() {}

  setToken(token: string) {
    this.token = token;
    this.tokenTimestamp = Date.now();
  }

  getToken() {
    return this.token;
  }

  getTokenTimestamp() {
    return this.tokenTimestamp;
  }

  isTokenExpired(): boolean {
    return this.getRemainingTime() <= 0;
  }

  getRemainingTime(): number {
    if (!this.token || !this.tokenTimestamp) {
      return 0;
    }

    const durationToken = 3 * 24 * 60 * 60 * 1000; // 3 días en milisegundos
    const timeElapsed = Date.now() - this.tokenTimestamp;
    const remainingTime = durationToken - timeElapsed;
    return Math.max(0, Math.ceil(remainingTime / (60 * 60 * 1000))); // Convertir a horas
  }
}
