import { AuthService } from './../core/services/auth.service';
import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
constructor(private router: Router, private jwtHelper: JwtHelperService, private authService: AuthService){}
  async canActivate(): Promise<boolean> {
      const token = localStorage.getItem("token");
      if (token && !this.jwtHelper.isTokenExpired(token)){
        if(token !== null)
        console.log('Decoded Token: ' + JSON.stringify(this.jwtHelper.decodeToken(token)));
        return true;
      }
      const isRefreshSuccess = await this.tryRefreshingTokens(token);
  if (!isRefreshSuccess) {
    this.router.navigate(['\login']);
  }
  return isRefreshSuccess;
  }


  private async tryRefreshingTokens(token: string): Promise<boolean> {
    // Try refreshing tokens using refresh token
    const refreshToken: string = localStorage.getItem("refreshToken");
    if (!token || !refreshToken) {
      return false;
    }
    const credentials = JSON.stringify({ accessToken: token, refreshToken: refreshToken });
    let isRefreshSuccess: boolean;
    try {
      const response = await this.authService.refresh(credentials);
      // If token refresh is successful, set new tokens in local storage.
      const newToken = (<any>response).body.accessToken;
      const newRefreshToken = (<any>response).body.refreshToken;
      localStorage.setItem("token", newToken);
      localStorage.setItem("refreshToken", newRefreshToken);
      isRefreshSuccess = true;
    }
    catch (ex) {
      isRefreshSuccess = false;
    }
    return isRefreshSuccess;
  }
}
