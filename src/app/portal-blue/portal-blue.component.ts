import {
  ComponentPortal,
  DomPortal,
  Portal,
  TemplatePortal
} from "@angular/cdk/portal";
import {
  AfterViewInit,
  Component,
  TemplateRef,
  ViewChild,
  ViewContainerRef,
  ElementRef
} from "@angular/core";
import {
  ComponentPortalExample1,
  ComponentPortalExample2
} from "../cdk-portal-overview-example";

@Component({
  selector: "app-portal-blue",
  templateUrl: "./portal-blue.component.html",
  styleUrls: ["./portal-blue.component.css"]
})
export class PortalBlueComponent implements AfterViewInit {
  @ViewChild("templatePortalContent") templatePortalContent: TemplateRef<
    unknown
  >;
  @ViewChild("domPortalContent") domPortalContent: ElementRef<HTMLElement>;

  selectedPortal: Portal<any>;
  componentPortal1: ComponentPortal<ComponentPortalExample1>;
  componentPortal2: ComponentPortal<ComponentPortalExample2>;
  templatePortal: TemplatePortal<any>;
  domPortal: DomPortal<any>;

  constructor(private _viewContainerRef: ViewContainerRef) {}

  ngAfterViewInit() {
    this.componentPortal1 = new ComponentPortal(ComponentPortalExample1);
    this.componentPortal2 = new ComponentPortal(ComponentPortalExample2);

    this.templatePortal = new TemplatePortal(
      this.templatePortalContent,
      this._viewContainerRef
    );
    this.domPortal = new DomPortal(this.domPortalContent);
  }
}

/**  Copyright 2020 Google LLC. All Rights Reserved.
    Use of this source code is governed by an MIT-style license that
    can be found in the LICENSE file at http://angular.io/license */
