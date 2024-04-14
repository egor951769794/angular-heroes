import { Component, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { Hero } from '../hero';
import { HeroService } from '../hero.service';
import { Subject, takeUntil, tap, filter } from 'rxjs';

@Component({
  selector: 'app-heroes',
  templateUrl: './heroes.component.html',
  styleUrls: ['./heroes.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeroesComponent {
  heroes : Hero[];
  filters : Array<any>;
  countries : Array<String>;
  minPopulation: number;
  maxPopulation: number;
  addCityCapitalCheck: boolean = false;

  private destroyed = new Subject<void>();
  constructor(private heroService : HeroService, private cdr: ChangeDetectorRef) {
    this.filters = [[], , false];
  }

  ngOnInit() {
    this.setFilters();
    this.getHeroes();
  }

  setFilters() : void {
    this.heroService.getHeroes().pipe(takeUntil(this.destroyed), tap(() => {this.cdr.markForCheck()})).subscribe(
      (heroes) => {
        this.heroes = heroes;
        this.countries = Array.from(new Set(heroes.map((city) => city.country)).values()).sort();
        this.filters[0] = Array.from({length: this.countries.length}, () => false);
        this.minPopulation = Math.min(...heroes.map((city) => city.population));
        this.maxPopulation = Math.max(...heroes.map((city) => city.population));
        this.filters[1] = this.maxPopulation;
        // this.heroes = heroes.filter((city) => city.population <= this.maxPopulation);
      }
    );
  }

  getHeroes() : void {
    this.heroService.getHeroes().pipe(takeUntil(this.destroyed), tap(() => {this.cdr.markForCheck()})).subscribe(
      (heroes) => {
        this.heroes = heroes;
        let selectedCountries: Array<String> = []; 
        for (let i = 0; i < this.filters[0].length; i++) {
          if (this.filters[0][i]) selectedCountries.push(this.countries[i]);
        }
        this.heroes = this.heroes
          .filter(hero => hero.population <= this.filters[1])
          .filter(hero => {
            if (this.filters[2]) {
              if (hero.isCapital) return true;
              else return false;
            } 
            return true;
          })
          .filter(hero => {
            if (!this.filters[0].includes(true)) return true;
            else {
              if (selectedCountries.includes(hero.country)) return true;
              else return false;
            }
          });
      }
    );
  }

  add(name: string, country: string, population: string): void {
    // alert(this.addCityCapitalCheck);
    name = name.trim();
    country = country.trim();
    if (!name || !country || isNaN(+population)) { return; }
    let hero = new Hero();
    hero.country = country;
    hero.name = name;
    hero.population = Number(population);
    hero.isCapital = this.addCityCapitalCheck;
    this.heroService.addHero(hero)
      .pipe(takeUntil(this.destroyed), tap(() => {this.cdr.markForCheck()}))
      .subscribe(hero => {
        this.heroes.push(hero);
      });
    this.addCityCapitalCheck = false;
  }

  delete(hero: Hero): void {
    this.heroes = this.heroes.filter(h => h !== hero);
    this.heroService.deleteHero(hero.id).pipe(takeUntil(this.destroyed)).subscribe();
  }
  ngOnDestroy() {
    this.destroyed.next();
    this.destroyed.complete();
  }
}
