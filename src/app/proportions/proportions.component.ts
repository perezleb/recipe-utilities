import { Component, OnInit } from '@angular/core';
import { Ingredient, DEFAULTS, FLOUR } from './proportions-datasource';
import { FormControl, FormGroup, FormBuilder, FormArray, AbstractControl } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';

export interface IngredientFormGroupValue {
  name: string;
  weight: number;
}

@Component({
  selector: 'app-proportions',
  templateUrl: './proportions.component.html',
  styleUrls: ['./proportions.component.css']
})
export class ProportionsComponent implements OnInit {
  public dataSource: MatTableDataSource<Ingredient>;

  displayedColumns = ['name', 'weight', 'percentage'];
  public scaleFormControl = new FormControl(1);
  public ingredientsFormArray: FormArray;
  public formGroup: FormGroup;
  public recipeText: string = '';
  private ingredients: Ingredient[] = DEFAULTS;
  private ingredientsAtBaseScale: Map<string, number> = new Map();

  constructor(private fb: FormBuilder) {
  }

  ngOnInit() {
    this.ingredientsFormArray = this.fb.array([]);
    this.formGroup = this.fb.group({
      array: this.ingredientsFormArray
    });
    this.dataSource = new MatTableDataSource(this.ingredients);
    this.ingredients.forEach((ing: Ingredient) => {
      this.ingredientsFormArray.push(this.fb.group({
        name: [ing.name],
        weight: [ing.weight]
      }));
    })

    this.scaleFormControl.valueChanges.subscribe((scale: number) => {
      this.ingredientsFormArray.controls.forEach((group: FormGroup) => {
        group.controls['weight'].setValue(this.ingredientsAtBaseScale.get(group.controls['name'].value) * scale);
      });
    });
  }

  public setBaseScale(): void {
    this.ingredientsFormArray.value.forEach((value: IngredientFormGroupValue) => {
      this.ingredientsAtBaseScale.set(value.name, value.weight);
    });
  }

  public add(): void {
    this.ingredients.push({ name: '', weight: 0 });
    this.ingredientsFormArray.push(this.fb.group({
      name: [''],
      weight: [0]
    }));
    this.dataSource = new MatTableDataSource(this.ingredients);
  }

  public export(): void {
    this.recipeText = '';
    this.ingredientsFormArray.value.forEach((ing: IngredientFormGroupValue) => {
      this.recipeText += ing.weight + ' g ' + ing.name + '<br />';
    });
  }

  public getIngredientFormGroup(index: number): FormGroup {
    return this.ingredientsFormArray.controls[index] as FormGroup;
  }

  public getPercentage(index: number): string {
    const formGroup: IngredientFormGroupValue = this.ingredientsFormArray.controls[index].value;
    const flourWeight: AbstractControl = this.ingredientsFormArray.controls
      .find((control: AbstractControl) => control.value.name === FLOUR);
    if (flourWeight.value.weight === 0) {
      return '';
    }
    const ingWeight: number = formGroup.weight;
    const percentage: number = ingWeight / flourWeight.value.weight * 100;
    return percentage.toFixed(0);
  }
}