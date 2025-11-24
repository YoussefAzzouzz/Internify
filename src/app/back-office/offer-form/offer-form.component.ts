import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from "@angular/forms";
import { OfferService } from "../../services/offer.service";
import { ActivatedRoute, Router } from "@angular/router";

@Component({
  selector: 'app-offer-form',
  templateUrl: './offer-form.component.html',
  styleUrls: ['./offer-form.component.css']
})
export class OfferFormComponent implements OnInit {
  offerForm: FormGroup;
  isEditMode: boolean = false;
  offerId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private offerService: OfferService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.offerForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      image: ['', [Validators.required]],
      datePub: ['', Validators.required],
      dateExp: ['', Validators.required],
      category: ['', Validators.required]
    }, { validator: this.dateValidator });
  }

  // Validation personnalisée : Date d'expiration doit être après date de publication
  dateValidator(group: AbstractControl) {
    const datePub = new Date(group.get('datePub')?.value);
    const dateExp = new Date(group.get('dateExp')?.value);

    return dateExp > datePub ? null : { dateInvalid: true };
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.isEditMode = true;
        this.offerId = +id;
        this.loadOffer(this.offerId);
      }
    });
  }

  loadOffer(id: number): void {
    this.offerService.getOfferbyId(id).subscribe(offer => {
      if (offer) {
        this.offerForm.patchValue({
          title: offer.title || '',
          description: offer.description || '',
          image: offer.image || '',
          datePub: offer.datePub ? new Date(offer.datePub).toISOString().split('T')[0] : '',
          dateExp: offer.dateExp ? new Date(offer.dateExp).toISOString().split('T')[0] : '',
          category: offer.category || ''
        });
      }
    });
  }

  onSubmit(): void {
    if (this.offerForm.invalid) {
      return;
    }

    if (this.isEditMode) {
      this.offerService.updateOffer(this.offerId!, this.offerForm.value).subscribe(() => {
        this.router.navigate(['/back-office/offer']);
      });
    } else {
      this.offerService.addOffer(this.offerForm.value).subscribe(() => {
        this.router.navigate(['/back-office/offer']);
      });
    }
  }
}
