import { Injectable } from "@angular/core";
import { HttpService } from "app/core/auth/Http.service";
import { CreateCustomerCommand } from "app/modules/admin/customer/models/CreateCustomerCommand";
import { CustomerDetailDto } from "app/modules/admin/customer/models/CustomerDetailDto";
import { endPoints } from "environments/endPoints";
import { Observable } from "rxjs";

@Injectable({
    providedIn: 'root'
})

export class PatientListService {
    constructor(private _httpService: HttpService) { }

    gtPatientList() : Observable<any>{    
        return this._httpService.getRequest(endPoints.patient.getPatientList);
    }

}