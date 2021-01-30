import { Component, OnInit} from '@angular/core';
import { FormGroup, FormBuilder, Validators} from '@angular/forms';
import { MatStepper } from '@angular/material/stepper';
import { first } from 'rxjs/operators';
import { Router,ActivatedRoute } from '@angular/router';
import { VgenService,TemplateService,AlertService } from '../_services';

@Component({ templateUrl: 'generate.component.html' })
export class GenerateComponent implements OnInit {
  form: FormGroup;
  loading = false;
  submitted = false;
  templates = null;
  isLinear = false;
  isDataValid = true;
  isConfigValid = true;
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  dataInputText: string;
  configInputText: string;
  

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
      templateName : value
    })

    stepper.next();
  }

  onFileChange(type: string,event) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      
      if(type == "data"){
        this.secondFormGroup.patchValue({
          dataFileSource: file
        });
        this.dataInputText = this.secondFormGroup.get("dataFileSource").value.name;
      } else{
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
    console.log("1");
    this.submitted = true;

    // stop here if form is invalid
    if (this.firstFormGroup.invalid || this.secondFormGroup.invalid) {
      console.log("2");
      return;
    }

    if(this.dataInputText.split(".").pop() != "csv" && this.dataInputText.split(".").pop() != "json"){
      console.log("3");
      this.isDataValid=false;
      return;
      
    }

    if(this.configInputText.split(".").pop() != "csv" && this.configInputText.split(".").pop() != "json"){
      console.log("4");
      this.isConfigValid = false;
      return;
    }

    console.log("5");
    this.isDataValid,this.isConfigValid = true;
    console.log( this.isDataValid,this.isConfigValid);
    stepper.next();
  }

  ngOnInit(): void {
    this.dataInputText = "Select Data File";
    this.configInputText = "Select Config File"
    this.firstFormGroup = this._formBuilder.group({
      templateName: ['', Validators.required]
    });
    this.secondFormGroup = this._formBuilder.group({
      data: ['', Validators.required],
      config: ['', Validators.required],
      dataFileSource: ['', Validators.required],
      configFileSource: ['', Validators.required]
    });

    this.TemplateService.getAll()
      .pipe(first())
      .subscribe(templates => this.templates = templates);
  }

  onSubmit(){
    const formData = new FormData();
    formData.append('dataset', this.secondFormGroup.get('dataFileSource').value);
    formData.append('config', this.secondFormGroup.get('configFileSource').value);
    this.loading = true;
    this.vgenService.generate(this.firstFormGroup.get("templateName").value, formData)
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
}