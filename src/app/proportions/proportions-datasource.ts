import { DataSource } from '@angular/cdk/collections';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { map } from 'rxjs/operators';
import { Observable, of as observableOf, merge } from 'rxjs';

export interface Ingredient {
  name: string;
  weight: number;
}

export const FLOUR: string = "Flour";

export const DEFAULTS: Ingredient[] = [
  { name: FLOUR, weight: 0 },
  { name: "Water", weight: 0 },
  { name: "Yeast", weight: 0 },
  { name: "Salt", weight: 0 }
]
