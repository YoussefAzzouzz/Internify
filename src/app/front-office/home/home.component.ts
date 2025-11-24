import { Component, OnInit } from '@angular/core';
import { TokenStorageService } from '../_services/token-storage.service';
import { ReclamationService } from '../_services/reclamation.service';



@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {

  /////
  isShown: boolean = false ; // hidden by default
  errorMessage!: string;
  resolvedReclamations!: any[];
  toggleShow() {
    this.isShown = ! this.isShown;

  }
/////
  private roles: string[] = [];
  isLoggedIn = false;
  showAdminBoard = false;
  showModeratorBoard = false;
  username?: string;
  user =  this.tokenStorageService.getUser();
  admin : any ;
  userResolvedReclamations: any[] = [];
  currentUsername: string = '';

  id!:number;






  constructor(private tokenStorageService: TokenStorageService,private ReclamationService: ReclamationService) { }


   showMessage = false;
  notificationCount = 1;
   // This is the total count of notifications triggered

  // Toggle visibility of the message box and increase notification count
  toggleMessage() {
    this.showMessage = !this.showMessage;

  }



  ngOnInit(): void {
    const user = this.tokenStorageService.getUser();
    this.id = user?.id;
    console.log('User ID:', this.id);



    this.isLoggedIn = !!this.tokenStorageService.getToken();

    if (this.isLoggedIn) {
      const user = this.tokenStorageService.getUser();

      // Extract role names as an array


  

     

      // Show admin board if the user has the admin role
      this.showAdminBoard = this.tokenStorageService.getUser().roles.includes('ROLE_ADMIN');


      this.username = user.username;


      this.ReclamationService.readResolvedReclamations().subscribe({
        next: (saveData) => {
          this.resolvedReclamations = saveData;

          this.userResolvedReclamations = saveData.filter(
            (reclamation: any) => reclamation.user?.username === user.username
          );

          this.notificationCount = this.userResolvedReclamations.length;

          console.log(this.userResolvedReclamations); // <-- Move this INSIDE the subscription
        },
        error: (err) => {
          console.error('Error fetching resolved reclamations', err);
        }
      });



    }
  }


logout(): void {
    this.tokenStorageService.signOut();
    window.location.reload();
  }

  handleNotificationClick() {
    this.showMessage = !this.showMessage;

    if (this.notificationCount > 0) {
      this.ReclamationService.deleteResolvedReclamations().subscribe({
        next: () => {
          this.resolvedReclamations = [];
          this.notificationCount = 0;
          console.log('Resolved reclamations cleared.');
        },
        error: (err) => {
          this.resolvedReclamations = [];
          this.notificationCount = 0;
          console.log('Resolved reclamations cleared.');        }
      });
    }}




  openAddDialog() {



  }

}
