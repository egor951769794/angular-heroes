import { Component, Input, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { Hero } from '../hero';
import { HeroService } from '../hero.service';

import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import { Subject, takeUntil, tap } from 'rxjs';


@Component({
  selector: 'app-hero-detail',
  templateUrl: './hero-detail.component.html',
  styleUrls: ['./hero-detail.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeroDetailComponent {
  @Input() hero : Hero;
  private destroyed = new Subject<void>();
  constructor(
    private route: ActivatedRoute,
    private heroService: HeroService,
    private location: Location,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.getHero();
  }

  getHero(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.heroService.getHero(id)
      .pipe(takeUntil(this.destroyed), tap(() => {this.cdr.markForCheck()}))
      .subscribe(hero => this.hero = hero);
  }
  goBack(): void {
    this.location.back();
  }

  save(): void {
    if (this.hero) {
      this.heroService.updateHero(this.hero)
        .pipe(takeUntil(this.destroyed))
        .subscribe(() => this.goBack());
    }
  }
  ngOnDestroy(): void {
    this.destroyed.next();
    this.destroyed.complete();
  }
}

