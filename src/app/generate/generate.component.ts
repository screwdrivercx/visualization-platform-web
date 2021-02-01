import { Component, OnInit} from '@angular/core';
import { FormGroup, FormBuilder, Validators} from '@angular/forms';
import { MatStepper } from '@angular/material/stepper';
import { buffer, first } from 'rxjs/operators';
import { Router,ActivatedRoute } from '@angular/router';
import { VgenService,TemplateService,AlertService } from '../_services';

@Component({ templateUrl: 'generate.component.html' })
export class GenerateComponent implements OnInit {
  form: FormGroup;
  loading = false;
  submitted = false;
  templates = null;
  isDataValid = true;
  isConfigValid= true;
  isEditMode: Boolean
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  dataInputText: string;
  configInputText: string;
  refId: string;
  vname: string;
  isDataFileChange = false;
  isConfigFileChange = false;
  preconfig : Object;

  constructor(
    private route : ActivatedRoute,
    private router : Router,
    private alertService : AlertService,
    private vgenService : VgenService,
    private TemplateService : TemplateService,
    private _formBuilder: FormBuilder
  ) { }

  get f() { return this.secondFormGroup.controls; }
 
  setValue(value,stepper : MatStepper){
    this.firstFormGroup.patchValue({
      vname : value
    })
    this.vname = value;
    stepper.next();
  }

  onFileChange(type: string,event) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      console.log(file);
      if(type == "data"){
        this.isDataFileChange = true;
        this.secondFormGroup.patchValue({
          dataFileSource: file
        });
        this.dataInputText = this.secondFormGroup.get("dataFileSource").value.name;
      } else{
        this.isConfigFileChange = true;
        this.secondFormGroup.patchValue({
          configFileSource: file
        });
        this.configInputText = this.secondFormGroup.get("configFileSource").value.name;
      }
    }
    else{
      type == "data" ? this.dataInputText = "Select Data File" : this.configInputText = "Select Config File";
    }
  }

  submitSecond(stepper : MatStepper){
    this.submitted = true;
    // stop here if form is invalid

    console.log(this.f.data.errors);
    if (this.firstFormGroup.invalid || this.secondFormGroup.invalid) {
      return;
    }

    if(this.dataInputText.split(".").pop() != "csv" && this.dataInputText.split(".").pop() != "json"){
      this.isDataValid=false;
      return;
    }

    if(this.configInputText.split(".").pop() != "csv" && this.configInputText.split(".").pop() != "json"){
      this.isConfigValid = false;
      return;
    }

    this.isDataValid = this.isConfigValid = true;
    stepper.next();
  }

  ngOnInit(): void {
    this.refId = this.route.snapshot.params['refId'];
    this.isEditMode = this.refId ? true : false;
    this.TemplateService.getAll()
      .pipe(first())
      .subscribe(templates => this.templates = templates);

      this.dataInputText = "Select Data File";
      this.configInputText = "Select Config File";

      this.firstFormGroup = this._formBuilder.group({
        vname: ['', Validators.required]
      });

      if(!this.isEditMode){
          this.secondFormGroup = this._formBuilder.group({
          data: ['', Validators.required],
          config: ['', Validators.required],
          dataFileSource: ['', Validators.required],
          configFileSource: ['', Validators.required]
        });
      }
      
    if(this.isEditMode){
      this.secondFormGroup = this._formBuilder.group({
          data: [''],
          config: [''],
          dataFileSource: [''],
          configFileSource: ['']
        });
      this.vgenService.getPreconfig(this.refId).subscribe(preconfig  => {
        console.log(preconfig);
        this.preconfig = preconfig;
        this.dataInputText = this.preconfig["dataFileName"];
        this.configInputText = this.preconfig["configFileName"];
        this.vname = this.preconfig["vname"];
        this.firstFormGroup.patchValue({ vname : this.preconfig["vname"]});
      })  
    }
  }

  onSubmit(){
    this.loading = true;
    const formData = new FormData();

    if(!this.isEditMode){
      formData.append('dataset', this.secondFormGroup.get('dataFileSource').value);
      formData.append('config', this.secondFormGroup.get('configFileSource').value);

      this.vgenService.generate(this.firstFormGroup.get("vname").value, formData)
      .subscribe({
        next: (res) => {
          console.log(res);
          console.log(res["refId"]);
          if(res["refId"]){
            this.alertService.success('Generate Visualization successful', { keepAfterRouteChange: true });
            this.router.navigate(['/generate/result/',res["refId"]], { relativeTo: this.route });
          }
          else {
            this.alertService.error(res["message"],{ keepAfterRouteChange: true});
            this.loading = false;
          }
          
        },
        error: error => {
          this.alertService.error(error);
          this.loading = false;
        }
      });
    }
    else{
      var blob1 = new Blob([this.preconfig["data"]],{ type: this.dataInputText.split(".").pop() == "csv" ? 'application/vnd.ms-excel' : 'application/json'})
      var blob2 = new Blob([this.preconfig["config"]],{ type: this.configInputText.split(".").pop() == "csv" ? 'application/vnd.ms-excel' : 'application/json'})

      this.isDataFileChange && this.secondFormGroup.get("dataFileSource").value != '' ?
        formData.append('dataset', this.secondFormGroup.get('dataFileSource').value) :
        formData.append('dataset',blob1,this.dataInputText);           
      this.isConfigFileChange && this.secondFormGroup.get("configFileSource").value != '' ?
        formData.append('config', this.secondFormGroup.get('configFileSource').value) :
        formData.append('config',blob2,this.configInputText);   

      this.vgenService.update(this.refId,this.vname, formData)
      .subscribe({
        next : (res) => {
          console.log(res);
          console.log(res["refId"]);
          if(res["refId"]){
            this.alertService.success('Edit Visualization successful', { keepAfterRouteChange: true });
            this.router.navigate(['/generate/result/',res["refId"]], { relativeTo: this.route });
          }
          else {
            this.alertService.error(res["message"],{ keepAfterRouteChange: true});
            this.loading = false;
          }
        },
        error: error => {
          this.alertService.error(error);
          this.loading = false;
        }
      })  
    }
  }
}