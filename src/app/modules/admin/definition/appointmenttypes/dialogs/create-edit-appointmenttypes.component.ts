import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TranslocoService } from '@ngneat/transloco';
import { AppointmentTypesDto } from '../models/appointmentTypesDto';
import { AppointmentTypeservice } from 'app/core/services/definition/appointmenttypes/appointmenttypes.service';
import { TaxesDto } from '../../taxes/models/taxesDto';
import { TaxisService } from 'app/core/services/definition/taxis/taxis.service';
import { CreateAppointmentTypesCommand } from '../models/createAppointmentTypesCommand';
import { SweetAlertDto } from 'app/modules/bases/models/SweetAlertDto';
import { SweetalertType } from 'app/modules/bases/enums/sweetalerttype.enum';
import { GeneralService } from 'app/core/services/general/general.service';
import { UpdateAppointmentTypesCommand } from '../models/updateAppointmentTypesCommand';

@Component({
  selector: 'app-create-edit-appointmenttypes',
  templateUrl: './create-edit-appointmenttypes.component.html',
  styleUrls: ['./create-edit-appointmenttypes.component.css']
})
export class CreateEditAppointmenttypesComponent implements OnInit {

  selectedappointmenttypes: AppointmentTypesDto;
  buttonDisabled = false;
  appointmentType: FormGroup;
  showPriceRatio: boolean = false;

  taxisList: TaxesDto[] = [];

  constructor(
    private _dialogRef: MatDialogRef<any>,
    private _formBuilder: FormBuilder,
    private _translocoService: TranslocoService,
    private _appointmenttypesService: AppointmentTypeservice,
    private _taxisService: TaxisService,
    @Inject(MAT_DIALOG_DATA) public data: AppointmentTypesDto
  ) {
    this.selectedappointmenttypes = data;
  }

  ngOnInit() {
    this.getTaxisList();

    this.appointmentType = this._formBuilder.group({
      remark: ['', Validators.required],
      isDefaultPrice: [false],
      price: [0],
      taxisId : ['00000000-0000-0000-0000-000000000000']
    });
    this.fillFormData(this.selectedappointmenttypes);

    
  }

  fillFormData(selectedappointmentType: AppointmentTypesDto) {

    if (this.selectedappointmenttypes !== null) {
      this.appointmentType.setValue({
        remark: selectedappointmentType.remark,
        isDefaultPrice: selectedappointmentType.isDefaultPrice,
        price : selectedappointmentType.price,
        taxisId : selectedappointmentType.taxisId
      });
      this.togglePriceInput(selectedappointmentType.isDefaultPrice);
    }
  }

  closeDialog(): void {
    this._dialogRef.close({ status: null });
  }

  addOrUpdateStore(): void {
    this.buttonDisabled = true;
    this.selectedappointmenttypes
      ? this.updateAppointmentType()
      : this.addAppointmentType();
  }

  togglePriceInput(checked: boolean) {
    if (checked) {
      this.showPriceRatio = true;
    } else {
      this.showPriceRatio = false;
    }
  }

  addAppointmentType(): void {

      const item = new CreateAppointmentTypesCommand(
        this.getFormValueByName('price'),
        this.getFormValueByName('taxisId'),
        this.getFormValueByName('remark'),
        this.getFormValueByName('isDefaultPrice'),
      );

      this._appointmenttypesService.createAppointmentTypes(item).subscribe(
        (response) => {
          if (response.isSuccessful) {
            this.showSweetAlert('success');
            this._dialogRef.close({
              status: true,
            });
          } else {
            this.showSweetAlert('error');
          }
        },
        (err) => {
          console.log(err);
        }
      );

  }

  updateAppointmentType(): void {

    const item = new UpdateAppointmentTypesCommand(
      this.selectedappointmenttypes.id,
      this.getFormValueByName('price'),
      this.getFormValueByName('taxisId'),
      this.getFormValueByName('remark'),
      this.getFormValueByName('isDefaultPrice'),
    );

    this._appointmenttypesService.updateAppointmentTypes(item).subscribe(
      (response) => {
        if (response.isSuccessful) {
          this.showSweetAlert('success');
          this._dialogRef.close({
            status: true,
          });
        } else {
          this.showSweetAlert('error');
        }
      },
      (err) => {
        console.log(err);
      }
    );

  }

  getTaxisList(): void {
    this._taxisService.getTaxisList().subscribe((response) => {
      this.taxisList = response.data;
    });
  }

  getFormValueByName(formName: string): any {
    return this.appointmentType.get(formName).value;
  }
  
  showSweetAlert(type: string): void {
    if (type === 'success') {
      const sweetAlertDto = new SweetAlertDto(
        this.translate('sweetalert.success'),
        this.translate('sweetalert.transactionSuccessful'),
        SweetalertType.success
      );
      GeneralService.sweetAlert(sweetAlertDto);
    } else {
      const sweetAlertDto = new SweetAlertDto(
        this.translate('sweetalert.error'),
        this.translate('sweetalert.transactionFailed'),
        SweetalertType.error
      );
      GeneralService.sweetAlert(sweetAlertDto);
    }
  }

  translate(key: string): any {
    return this._translocoService.translate(key);
  }

}
