import { Component, OnInit, ViewChild } from '@angular/core';
import { PaymentMethodsDto } from '../../definition/paymentmethods/models/PaymentMethodsDto';
import { PaymentMethodservice } from 'app/core/services/definition/paymentmethods/paymentmethods.service';
import { MatPaginator } from '@angular/material/paginator';
import { SaleBuyListDto } from '../../retail/model/SaleBuyListDto';
import { MatTableDataSource } from '@angular/material/table';
import { SweetalertType } from 'app/modules/bases/enums/sweetalerttype.enum';
import { GeneralService } from 'app/core/services/general/general.service';
import { SweetAlertDto } from 'app/modules/bases/models/SweetAlertDto';
import { TranslocoService } from '@ngneat/transloco';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { SaleBuyService } from 'app/core/services/ratail/salebuy.service';

@Component({
    selector: 'app-cashtransactions',
    templateUrl: './cashtransactions.component.html',
    styleUrls: ['./cashtransactions.component.css'],
})
export class CashtransactionsComponent implements OnInit {
    displayedColumns: string[] = [
        'date',
        'type',
        'invoiceNo',
        'supplierName',
        'payment',
        'netPrice',
        'kdv',
        'discount',
        'total',
        // 'actions',
    ];
    @ViewChild(MatPaginator) paginator: MatPaginator;

    formGroup: FormGroup;

    salebuyLists: SaleBuyListDto[] = [];
    dataSource = new MatTableDataSource<SaleBuyListDto>(this.salebuyLists);
    isUpdateButtonActive: boolean;

    payments: PaymentMethodsDto[] = [];

    constructor(
        private _paymentmethodsService: PaymentMethodservice,
        private _translocoService: TranslocoService,
        private _formBuilder: FormBuilder,
        private _salebuyservice: SaleBuyService,
    ) {}

    ngOnInit() {
        this.paymentsList();

        this.formGroup = this._formBuilder.group({
            begindate: new FormControl(this.calculateEndDate()), // Bugünün tarihi
            endDate: new FormControl(new Date()), // Yedi gün önceki tarih
            paymenttype : ['all'],
          });
    }

    calculateEndDate(): Date {
        const today = new Date();
        const sevenDaysAgo = new Date(today);
        sevenDaysAgo.setDate(today.getDate() - 7);
        return sevenDaysAgo;
      }

    paymentsList() {
        this._paymentmethodsService
            .getPaymentMethodsList()
            .subscribe((response) => {
                this.payments = response.data;
                console.log(this.payments);
            });
    }

    public redirectToUpdate = (id: string) => {
        this.isUpdateButtonActive = true;
        // const selectedStore = this.storeList.find((store) => store.id === id);
        // if (selectedStore) {
        //     const dialogRef = this._dialog.open(
        //         CreateEditStoreDialogComponent,
        //         {
        //             maxWidth: '100vw !important',
        //             disableClose: true,
        //             data: selectedStore
        //         }
        //     );

        //     dialogRef.afterClosed().subscribe((response) => {
        //         if (response.status) {
        //             this.getStoreList();
        //         }
        //     });
        // }
    };

    public redirectToDelete = (id: string) => {
        const sweetAlertDto = new SweetAlertDto(
            this.translate('sweetalert.areYouSure'),
            this.translate('sweetalert.areYouSureDelete'),
            SweetalertType.warning
        );
        GeneralService.sweetAlertOfQuestion(sweetAlertDto).then(
            (swalResponse) => {
                if (swalResponse.isConfirmed) {
                    const model = {
                        id: id,
                    };
                    // this._storeservice
                    //     .deletedStores(model)
                    //     .subscribe((response) => {
                    //         if (response.isSuccessful) {
                    //             this.getStoreList();
                    //             const sweetAlertDto2 = new SweetAlertDto(
                    //                 this.translate('sweetalert.success'),
                    //                 this.translate('sweetalert.transactionSuccessful'),
                    //                 SweetalertType.success
                    //             );
                    //             GeneralService.sweetAlert(sweetAlertDto2);
                    //         } else {
                    //             console.error('Silme işlemi başarısız.');
                    //         }
                    //     });
                }
            }
        );
    };

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

    getRecordFilter() {
       
        var paymentypeId = this.getFormValueByName("paymenttype");
        debugger;

        const model = {
            paymentType : (paymentypeId == 'all' ? 0 : paymentypeId),
            beginDate: this.getFormValueByName("begindate"),
            endDate: this.getFormValueByName("endDate")
        }
        this._salebuyservice.getBuySaleFilterList(model).subscribe((response) => {
            this.salebuyLists = response.data;
            console.log(this.salebuyLists);
        });

    }

    getFormValueByName(formName: string): any {
        return this.formGroup.get(formName).value;
    }


}
