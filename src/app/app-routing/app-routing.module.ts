import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { notfoundc } from '../notfound/notfound.component';
import { NotfoundComponent } from '../notfound/notfound.component';


const routes: Routes = [
  { path: '404', component: NotfoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }