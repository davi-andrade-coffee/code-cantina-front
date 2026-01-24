import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Dependent } from '../models/dependent.model';

@Component({
  selector: 'client-dependent-selector',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div *ngIf="people?.length" class="flex items-center gap-2">
      <span class="text-xs opacity-70">Visualizando:</span>
      <select
        class="select select-sm select-bordered"
        [value]="selectedId"
        (change)="selectionChange.emit($any($event.target).value)"
      >
        <option *ngFor="let person of people" [value]="person.id">
          {{ person.name }} ({{ person.relation }})
        </option>
      </select>
    </div>
  `,
})
export class DependentSelectorComponent {
  @Input() people: Dependent[] | null = [];
  @Input() selectedId: string | null = null;
  @Output() selectionChange = new EventEmitter<string>();
}
