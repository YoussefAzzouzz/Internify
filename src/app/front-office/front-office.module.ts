import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FrontOfficeRoutingModule } from './front-office-routing.module';
import { FrontOfficeComponent } from './front-office.component';
import { HomeComponent } from './home/home.component';
import { AddContractComponent } from './add-contract/add-contract.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import { FrontOfficeContractsComponent } from './front-office-contracts/front-office-contracts.component';
import { UpdateContractComponent } from './update-contract/update-contract.component';
import { AddReportComponent } from './add-report/add-report.component';
import { DocumentsComponent } from './documents/documents.component';
import { ReportsComponent } from './reports/reports.component';
import { EmailVerificationComponent } from './email-verification/email-verification.component';
import { LoginComponent } from './login/login.component';
import { PasswordForgetComponent } from './password-forget/password-forget.component';
import { ProfileComponent } from './profile/profile.component';
import { ReclamationComponent } from './reclamation/reclamation.component';
import { RegisterComponent } from './register/register.component';
import { TwoFactorComponent } from './two-factor/two-factor.component';
import { DemandListComponent } from './demand-list/demand-list.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { ConversationComponent } from './conversation/conversation.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { ConversationSearchComponent } from './conversation-search/conversation-search.component';
import { MessageComponent } from './message/message.component';
import { OfferComponent } from './offer/offer.component';
import { OfferDetailsComponent } from './offer-details/offer-details.component';
import { OfferFormComponent } from './offer-form/offer-form.component';
import { UpdateOfferComponent } from './update-offer/update-offer.component';
import {authInterceptorProviders} from "./_helpers/auth.interceptor";





@NgModule({
  declarations: [
    FrontOfficeComponent,
    HomeComponent,
    AddContractComponent,
    FrontOfficeContractsComponent,
    UpdateContractComponent,
    AddReportComponent,
    DocumentsComponent,
    ReportsComponent,
    EmailVerificationComponent,
    LoginComponent,
    PasswordForgetComponent,
    ReclamationComponent,
    RegisterComponent,
    TwoFactorComponent,
    DemandListComponent,
    ConversationComponent,
    ConversationSearchComponent,
    MessageComponent,
    OfferComponent,
    OfferDetailsComponent,
    OfferFormComponent,
    UpdateOfferComponent

  ],
    imports: [
      MatSnackBarModule,
      ProfileComponent,

      ReactiveFormsModule,
        CommonModule,
        FrontOfficeRoutingModule,
        FormsModule,
        NgxPaginationModule

    ],
  providers: [
    authInterceptorProviders // ✅ register here
  ]
})
export class FrontOfficeModule { }
