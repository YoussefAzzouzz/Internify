import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FrontOfficeComponent } from './front-office.component';
import {HomeComponent} from "./home/home.component";
import {AddContractComponent} from "./add-contract/add-contract.component";
import {ContractListComponent} from "../back-office/contract-list/contract-list.component";
import {UpdateContractComponent} from "./update-contract/update-contract.component";
import {AddReportComponent} from "./add-report/add-report.component";
import {ViewReportsComponent} from "../back-office/view-reports/view-reports.component";
import {DocumentsComponent} from "./documents/documents.component";
import {FrontOfficeContractsComponent} from "./front-office-contracts/front-office-contracts.component";
import {ReportsComponent} from "./reports/reports.component";
import { LoginComponent } from './login/login.component';
import { TwoFactorComponent } from './two-factor/two-factor.component';
import { ProfileComponent } from './profile/profile.component';
import { EmailVerificationComponent } from './email-verification/email-verification.component';
import { PasswordForgetComponent } from './password-forget/password-forget.component';
import { RegisterComponent } from './register/register.component';
import { ReclamationComponent } from './reclamation/reclamation.component';
import { DemandListComponent } from './demand-list/demand-list.component';
import { DemandFormComponent } from '../back-office/demand-form/demand-form.component';
import { DemandDetailsComponent } from '../back-office/demand-details/demand-details.component';
import { ResponseFormComponent } from '../back-office/response-form/response-form.component';
import { NotificationsComponent } from '../back-office/notifications/notifications.component';
import { ConversationComponent } from './conversation/conversation.component';
import { MessageComponent } from './message/message.component';
import { ConversationSearchComponent } from './conversation-search/conversation-search.component';
import { OfferFormComponent } from './offer-form/offer-form.component';
import { OfferComponent } from './offer/offer.component';
import { OfferDetailsComponent } from './offer-details/offer-details.component';
import { UpdateOfferComponent } from './update-offer/update-offer.component';



const routes: Routes = [
  { path: '', component: HomeComponent, children:[
      { path: 'documents', component: AddContractComponent },
      { path: 'contracts', component: ContractListComponent },
      { path: 'update-contract/:id', component: UpdateContractComponent },
      { path: 'add-report', component: AddReportComponent },
      { path: 'register', component: RegisterComponent },
      { path: 'Reclamation', component: ReclamationComponent },
      { path: 'demand', component: DemandListComponent },
      { path: 'add', component: DemandFormComponent },
      { path: 'edit/:id', component: DemandFormComponent },
      { path: 'details/:id', component: DemandDetailsComponent },
      { path: 'response/:id', component: ResponseFormComponent },
      { path: 'notifications', component: NotificationsComponent },
      { path: 'chat/:idUser', component: ConversationComponent },
      { path: 'chat/:idUser/:idConversation/message', component: MessageComponent },
      { path: 'chat/:idUser/:idConversation/search', component: ConversationSearchComponent },
      { path: 'internships-offers', component: OfferComponent },
      { path: 'add-offer', component: OfferFormComponent},
      { path: 'edit-offer/:id' , component: OfferFormComponent},
      {path:'offer-details/:id' , component:OfferDetailsComponent},
      {path:'update-offer/:id' , component:UpdateOfferComponent},


      {
        path: 'login',
        component: LoginComponent
      },

      {
        path: 'TwoFactor/:username/:message',
        component: TwoFactorComponent
      },


       {
        path: 'profile',
        component: ProfileComponent
      } ,
      { path: 'verify', component: EmailVerificationComponent },
      { path: 'passwordforget/:username', component: PasswordForgetComponent },
      { path: 'view-reports', component: ReportsComponent },

      { path: 'view', component: DocumentsComponent },
      { path: 'contract', component: FrontOfficeContractsComponent },
      { path: 'chat/:idUser', component: ConversationComponent }

    ] }

];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FrontOfficeRoutingModule { }
