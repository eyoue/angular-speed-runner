import {
  CdkPortalOutletAttachedRef,
  ComponentPortal,
  Portal
} from "@angular/cdk/portal";
import {
  Component,
  ComponentRef,
  EventEmitter,
  Input,
  OnInit,
  Output
} from "@angular/core";
import { FormArray, FormBuilder, FormGroup } from "@angular/forms";
import { interval, Observable, Subject } from "rxjs";
import { takeUntil, takeWhile } from "rxjs/operators";

export const MAX_SYMBOLS = 10;
export const COUNT_PLAYERS = 120;
export const MIN_WRITE_SPEED = 500; // ms
export const MAX_WRITE_SPEED = 1750; //ms

@Component({
  selector: "cdk-portal-overview-example",
  templateUrl: "cdk-portal-overview-example.html",
  styleUrls: ["cdk-portal-overview-example.css"]
})
export class CdkPortalOverviewExample {
  public winner: string = "";
  public playersList = new Array(COUNT_PLAYERS);
  public playerOutletRef: ComponentPortal<
    ComponentPortalExample1
  > = new ComponentPortal(ComponentPortalExample1);
  private unsub$ = new Subject<boolean>();
  private playersOutletRefList = new Array();

  constructor(private fb: FormBuilder) {}

  winnerClear() {
    this.winner = "";
    this.unsub$.next();
    this.playerOutletRef = new ComponentPortal(ComponentPortalExample1);
  }

  setInputs(portalOutletRef: CdkPortalOutletAttachedRef, id: number) {
    portalOutletRef = portalOutletRef as ComponentRef<ComponentPortalExample1>;
    portalOutletRef.instance.id = id;
    const indexUpdEl = this.playersOutletRefList.findIndex(el => el.id === id);

    if (indexUpdEl >= 0) {
      this.playersOutletRefList.splice(indexUpdEl, 1);
    }
    this.playersOutletRefList.push({ id, portalOutletRef });

    portalOutletRef.instance.finisherId
      .pipe(takeUntil(this.unsub$))
      .subscribe((d: number) => {
        this.winner = d + "";
        this.playersOutletRefList.map(el => {
          el.portalOutletRef.instance.isFinish = true;
          return el;
        });
      });
  }
}

@Component({
  selector: "component-portal-1",
  template: `
    <label for="textInput">{{ id ? value : "Не явился" }}</label>
    <input
      *ngIf="id"
      type="text"
      [readonly]="finished"
      name="textInput"
      [(ngModel)]="value"
      (change)="onChange()"
      style="outline: none"
      [ngStyle]="{ border: isFinal && '2px solid green' }"
    />
  `
})
export class ComponentPortalExample1 implements OnInit {
  @Input() id: number;
  @Input() set isFinish(val: boolean) {
    !val ? this.start() : this.stop();
  }
  @Output() finisherId = new EventEmitter<number>();
  value = "";
  starter = 0;
  finished: boolean = false;

  onChange() {
    return this.isFinal && this.finisherId.emit(this.id);
  }

  makeLetter() {
    var possible = "abcdefghijklmnopqrstuvwxyz";
    return possible[this.randomInteger(0, possible.length - 1)];
  }

  randomInteger(min: number, max: number) {
    let rand = min - 0.5 + Math.random() * (max - min + 1);
    return Math.round(rand);
  }

  get isFinal() {
    return this.value.length >= MAX_SYMBOLS;
  }

  ngOnInit() {
    this.start();
  }

  start() {
    this.finished = false;
    interval(this.randomInteger(MIN_WRITE_SPEED, MAX_WRITE_SPEED))
      .pipe(takeWhile(() => this.finished != true))
      .subscribe(() => {
        this.value += this.makeLetter();
        this.onChange();
      });
  }

  stop() {
    this.finished = true;
  }
}
