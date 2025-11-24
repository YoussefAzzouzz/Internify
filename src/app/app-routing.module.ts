import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {AddContractComponent} from "./front-office/add-contract/add-contract.component";
import {ContractListComponent} from "./back-office/contract-list/contract-list.component";
import {FrontOfficeContractsComponent} from "./front-office/front-office-contracts/front-office-contracts.component";
import {UpdateContractComponent} from "./front-office/update-contract/update-contract.component";
import {AddReportComponent} from "./front-office/add-report/add-report.component";
import {ViewReportsComponent} from "./back-office/view-reports/view-reports.component";
import {DocumentsComponent} from "./front-office/documents/documents.component";
import { AuthGuard } from './front-office/_services/guards/auth.guard';
import { UnauthorizedComponent } from './front-office/_services/pages/unauthorized/unauthorized.component';

const routes: Routes = [

  { path: 'front-office', loadChildren: () => import('./front-office/front-office.module').then(m => m.FrontOfficeModule) },
  { path: 'back-office', loadChildren: () => import('./back-office/back-office.module').then(m => m.BackOfficeModule), canActivate: [AuthGuard]  },
  { path: '', redirectTo: '/front-office', pathMatch: 'full' }, // Default route
  { path: 'unauthorized', component: UnauthorizedComponent },

  { path: '**', redirectTo: '/front-office' } // Fallback route
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
