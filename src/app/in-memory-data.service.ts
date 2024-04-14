import { InMemoryDbService } from 'angular-in-memory-web-api';
import { Hero } from './hero';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class InMemoryDataService implements InMemoryDbService {
  createDb() {
    const heroes = [
      { id: 11, name: 'Omsk', population: 1110000, isCapital: false, country: 'Russia'},
      { id: 12, name: 'Moscow', population: 13100000, isCapital: true, country: 'Russia' },
      { id: 13, name: 'Saint P', population: 5600000, isCapital: false, country: 'Russia' },
      { id: 14, name: 'London', population: 9640000, isCapital: true, country: 'Britain' },
      { id: 15, name: 'Los Angeles', population: 3900000, isCapital: false, country: 'USA' },
      { id: 16, name: 'San Francisco', population: 830000, isCapital: false, country: 'USA' },
      { id: 17, name: 'New Dehli', population: 8900000, isCapital: true, country: 'India' },
      { id: 18, name: 'Toronto', population: 2500000, isCapital: false, country: 'Canada' }
    ];
    return {heroes};
  }

  // Overrides the genId method to ensure that a hero always has an id.
  // If the heroes array is empty,
  // the method below returns the initial number (11).
  // if the heroes array is not empty, the method below returns the highest
  // hero id + 1.
  genId(heroes: Hero[]): number {
    return heroes.length > 0 ? Math.max(...heroes.map(hero => hero.id)) + 1 : 11;
  }
}