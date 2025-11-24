import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BackOfficeRoutingModule } from './back-office-routing.module';
import { BackOfficeComponent } from './back-office.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { DemandComponent } from './demand/demand.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import { DemandFormComponent } from './demand-form/demand-form.component';
import { DemandDetailsComponent } from './demand-details/demand-details.component';
import { BackOfficeLayoutComponent } from './back-office-layout/back-office-layout.component';
import { ContractListComponent } from './contract-list/contract-list.component';
import { ViewReportsComponent } from './view-reports/view-reports.component';
import {NgxPaginationModule} from "ngx-pagination";
import {PaginationComponent} from "ngx-bootstrap/pagination";
import { UserComponent } from './user/user.component';
import { ReclamationComponent } from './reclamation/reclamation.component';
import { Reclamation2Component } from './reclamation2/reclamation2.component';
import { NotificationsComponent } from './notifications/notifications.component';
import { ResponseFormComponent } from './response-form/response-form.component';
import { AllConversationsComponent } from './all-conversations/all-conversations.component';
import { ConversationStatsComponent } from './conversation-stats/conversation-stats.component';
import { MessageStatsComponent } from './message-stats/message-stats.component';
import { AddOfferWithImageComponent } from './add-offer-with-image/add-offer-with-image.component';
import { ApplicationFormComponent } from './application-form/application-form.component';
import { BestOffersChartComponent } from './best-offers-chart/best-offers-chart.component';
import { CommentComponent } from './comment/comment.component';
import { CommentFormComponent } from './comment-form/comment-form.component';
import { EditApplicationComponent } from './edit-application/edit-application.component';
import { OfferComponent } from './offer/offer.component';
import { OfferDetailsComponent } from './offer-details/offer-details.component';
import { OfferFormComponent } from './offer-form/offer-form.component';
import { OfferStatComponent } from './offer-stat/offer-stat.component';
import { OfferWithImageComponent } from './offer-with-image/offer-with-image.component';
import { ApplicationComponent } from './application/application.component';
import {authInterceptorProviders} from "../front-office/_helpers/auth.interceptor";






@NgModule({
  declarations: [
    UserComponent,
    BackOfficeComponent,
    DashboardComponent,
    DemandComponent,
    DemandFormComponent,
    DemandDetailsComponent,
    BackOfficeLayoutComponent,
    ContractListComponent,
    ViewReportsComponent,
    NotificationsComponent,
    ResponseFormComponent,
    AllConversationsComponent,
    ConversationStatsComponent,
    MessageStatsComponent,
    AddOfferWithImageComponent,
    ApplicationFormComponent,
    BestOffersChartComponent,
    CommentComponent,
    CommentFormComponent,
    EditApplicationComponent,
    OfferComponent,
    OfferDetailsComponent,
    OfferFormComponent,
    OfferStatComponent,
    OfferWithImageComponent
  ],
  imports: [
    CommonModule,
    ReclamationComponent,

    BackOfficeRoutingModule,
    ReactiveFormsModule,
    NgxPaginationModule,
    PaginationComponent,
    FormsModule
  ],
  providers: [
    authInterceptorProviders // ✅ register here
  ]
})
export class BackOfficeModule { }
