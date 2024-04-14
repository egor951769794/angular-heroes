import { ChangeDetectionStrategy, Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Hero } from '../hero';
import { HeroService } from '../hero.service';
import { Subject, takeUntil, tap } from 'rxjs';
 
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: [ './dashboard.component.css' ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardComponent implements OnInit {
  heroes: Hero[] = [];
  private destroyed = new Subject<void>();
 
  constructor(private heroService: HeroService, private cdr : ChangeDetectorRef) {}
 
  ngOnInit() {
    this.getHeroes();
  }
 
  getHeroes(): void {
    this.heroService.getHeroes()
      .pipe(takeUntil(this.destroyed), tap(() => {this.cdr.markForCheck()}))
      .subscribe(heroes => this.heroes = heroes.slice(1, 5));
  }
  ngOnDestroy(): void {
    this.destroyed.next();
    this.destroyed.complete();
  }
}
