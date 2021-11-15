import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BowlingComponent } from './bowling/bowling.component';

const routes: Routes = [
  { path: '', redirectTo: 'bowling', pathMatch: 'full' },
  { path: 'bowling', component: BowlingComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
