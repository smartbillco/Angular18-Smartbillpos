import { ChangeDetectionStrategy, Component, ViewChild } from '@angular/core';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatAccordion } from '@angular/material/expansion';

@Component({
  selector: 'app-cliente-mov',
  templateUrl: './cliente-mov.component.html',
  styleUrls: ['./cliente-mov.component.css'],
  providers: [provideNativeDateAdapter()],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClienteMovComponent {
  @ViewChild(MatAccordion) accordion!: MatAccordion;

  openAll(): void {
    this.accordion.openAll();
  }

  closeAll(): void {
    this.accordion.closeAll();
  }
}