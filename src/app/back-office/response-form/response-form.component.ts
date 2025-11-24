import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ResponseService } from "../../services/response.service";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-response-form',
  templateUrl: './response-form.component.html',
  styleUrls: ['./response-form.component.css']
})
export class ResponseFormComponent implements OnInit {

  demandId!: number;
  responseForm!: FormGroup;  // Declare FormGroup

  constructor(
    private route: ActivatedRoute,
    private responseService: ResponseService,
    private router: Router,
    private fb: FormBuilder  // Inject FormBuilder
  ) { }

  ngOnInit() {
    this.demandId = this.route.snapshot.params['id'];

    this.responseForm = this.fb.group({
      comment: ['', [
        Validators.required,
        Validators.minLength(10),
        Validators.maxLength(1000)
      ]],
      status: ['Pending', [
        Validators.required,
        Validators.pattern('^(Pending|Approved|Rejected)$')
      ]]
    });

  }

  // Method to submit the response form
  submitResponse() {
    if (this.responseForm.valid) {
      const responseData = this.responseForm.value;
      console.log('Form Data:', responseData);

      this.responseService.addResponse(this.demandId, responseData.comment, responseData.status).subscribe(() => {
        const currentUrl = this.router.url;  // Get current route
        if (currentUrl.includes('/front-office')) {
          this.router.navigate(['/front-office/demand']);  // Navigate to front-office
        } else {
          this.router.navigate(['/back-office/demand']);  // Navigate to back-office
        }
      });
    }
  }

}
