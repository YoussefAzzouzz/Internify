import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BackOfficeLayoutComponent } from './back-office-layout/back-office-layout.component';  // Import the layout component
import { DashboardComponent } from './dashboard/dashboard.component';
import { DemandComponent } from './demand/demand.component';
import { DemandFormComponent } from './demand-form/demand-form.component';
import { DemandDetailsComponent } from './demand-details/demand-details.component';
import {AddContractComponent} from "../front-office/add-contract/add-contract.component";
import {ContractListComponent} from "./contract-list/contract-list.component";
import {UpdateContractComponent} from "../front-office/update-contract/update-contract.component";
import {AddReportComponent} from "../front-office/add-report/add-report.component";
import {ViewReportsComponent} from "./view-reports/view-reports.component";
import {DocumentsComponent} from "../front-office/documents/documents.component";
import {FrontOfficeContractsComponent} from "../front-office/front-office-contracts/front-office-contracts.component";
import { UserComponent } from './user/user.component';
import { ReclamationComponent } from './reclamation/reclamation.component';
import { Reclamation2Component } from './reclamation2/reclamation2.component';
import {ResponseFormComponent} from "./response-form/response-form.component";
import {NotificationsComponent} from "./notifications/notifications.component";
import { MessageStatsComponent } from './message-stats/message-stats.component';
import { AllConversationsComponent } from './all-conversations/all-conversations.component';
import { ConversationStatsComponent } from './conversation-stats/conversation-stats.component';
import { OfferComponent } from './offer/offer.component';
import { OfferFormComponent } from './offer-form/offer-form.component';
import { OfferDetailsComponent } from './offer-details/offer-details.component';
import { CommentComponent } from './comment/comment.component';
import { CommentFormComponent } from './comment-form/comment-form.component';
import { ApplicationFormComponent } from './application-form/application-form.component';
import { EditApplicationComponent } from './edit-application/edit-application.component';
import { ApplicationComponent } from './application/application.component';
import { BestOffersChartComponent } from './best-offers-chart/best-offers-chart.component';
import { AddOfferWithImageComponent } from './add-offer-with-image/add-offer-with-image.component';
import { OfferWithImageComponent } from './offer-with-image/offer-with-image.component';



const routes: Routes = [
  {
    path: '', component: BackOfficeLayoutComponent, children: [
      { path: 'documents', component: AddContractComponent },
      { path: 'contracts', component: ContractListComponent },
      { path: 'update-contract/:id', component: UpdateContractComponent },
      { path: 'add-report', component: AddReportComponent },
      { path: 'view-reports', component: ViewReportsComponent },
      { path: 'view', component: DocumentsComponent },
      { path: 'User', component: UserComponent },
      { path: 'Reclamation', component: ReclamationComponent },
      { path: 'Reclamation2', component: Reclamation2Component },



      { path: '', component: DashboardComponent },
      { path: 'demand', component: DemandComponent },
      { path: 'add', component: DemandFormComponent },
      { path: 'edit/:id', component: DemandFormComponent },
      { path: 'details/:id', component: DemandDetailsComponent },
      { path: 'response/:id', component: ResponseFormComponent },
      { path: 'notifications', component: NotificationsComponent },
    
      { path: 'chat', component: MessageStatsComponent },
      { path: 'conversations', component: AllConversationsComponent },
      { path: 'conversations/:id', component: ConversationStatsComponent },
      {path:'offer', component: OfferComponent},
      {path: 'add-offer', component:OfferFormComponent},
      {path: 'edit-offer/:id',component:OfferFormComponent},
      {path: 'details-offer/:id',component:OfferDetailsComponent},
      {path: 'comment' , component: CommentComponent },
      {path: 'edit-comment/:id' , component : CommentFormComponent},
      {path: 'add-app',component: ApplicationFormComponent},
      { path: 'edit-application/:id', component: EditApplicationComponent },
      { path: 'applications', component: ApplicationComponent },
      { path: 'best-offer' , component: BestOffersChartComponent},
      {path:'add-offer-image' , component: AddOfferWithImageComponent },
      {path:'offer-with-image' , component: OfferWithImageComponent}
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BackOfficeRoutingModule { }
