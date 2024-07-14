import { Component, HostListener } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { LoaderService } from './services/loader.service';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  constructor(
    private spinner: NgxSpinnerService,
    private loaderService: LoaderService,
    private authService: AuthService
  ) {
    this.loaderService.isLoading.subscribe((show: boolean) => {
      if (show) {
        this.spinner.show();
      } else {
        this.spinner.hide();
      }
    });
  }

  @HostListener('document:click')
  @HostListener('document:keydown')
  resetTimer() {
    this.authService.resetTokenExpiration();
  }
}