import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[appSidenavDir]'
})
export class SidenavDirDirective {

  constructor(public viewContainerRef: ViewContainerRef) { }

}
