import { Routes } from '@angular/router';
import { StockComponent } from './stock/stock.component';
import { RecetasComponent } from './recetas/recetas.component';
import { InfoComponent } from './info/info.component';
import { NotfoundComponent } from './notfound/notfound.component';
import { IndexComponent } from './index/index.component';

export  const routes: Routes = [
  { path: 'stock', component: StockComponent,},
  {path: "recetas", component:RecetasComponent},
  {path: "info", component:InfoComponent},
  {path: "index", component:IndexComponent},
  {path: '**',component:NotfoundComponent}
];

