import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { OfferService } from '../../services/offer.service';
import { Offer } from '../../models/offer';

@Component({
  selector: 'app-update-offer',
  templateUrl: './update-offer.component.html',
  styleUrls: ['./update-offer.component.css']
})
export class UpdateOfferComponent implements OnInit {
  updateForm!: FormGroup;
  offerId!: number; // retrieved from the route
  selectedImage?: File;

  constructor(
    private fb: FormBuilder,
    private offerService: OfferService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.offerId = +this.route.snapshot.paramMap.get('id')!;

    this.updateForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      category: ['', Validators.required],
      datePub: ['', Validators.required],
      dateExp: ['', Validators.required],
      image: [null]
    });

    // Load offer by ID here if needed
  }

  onImageSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedImage = file;
    }
  }

  onSubmit(): void {
    if (this.updateForm.invalid) return;

    const values = this.updateForm.value;

    const datePubFormatted = this.formatDate(values.datePub);
    const dateExpFormatted = this.formatDate(values.dateExp);

    this.offerService.updateOfferWithImage(
      this.offerId,
      values.title,
      values.description,
      values.category,
      datePubFormatted,
      dateExpFormatted,
      this.selectedImage
    ).subscribe({
      next: () => this.router.navigate(['/front-office/internships-offers']),
      error: err => console.error('Update failed', err)
    });
  }

  private formatDate(dateString: string): string {
    // Converts '2025-04-14T01:00' => '2025-04-14 01:00:00.000000'
    return dateString.replace('T', ' ') + ':00.000000';
  }
}
