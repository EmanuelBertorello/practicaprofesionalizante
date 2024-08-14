import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NotfoundComponent } from '../notfound/notfound.component';
import { StockComponent } from '../stock/stock.component';


const routes: Routes = [
  { path: 'stock', component: StockComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
