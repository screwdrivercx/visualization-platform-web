import { Component, OnInit, ViewChild } from '@angular/core';
import { first } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { User } from '../_models';
import { AccountService, AlertService, VgenService, TemplateService, AnnouncementService } from '../_services';
import { OwlOptions } from 'ngx-owl-carousel-o'
import * as d3 from 'node_modules/d3';
import * as moment from 'node_modules/moment';
import * as Chart from 'node_modules/chart.js'

@Component({
templateUrl: 'home.component.html',
 styleUrls: ['./home.component.css']},
)
export class HomeComponent implements OnInit {
    user: User;
    items = null;
    role;
    count = 0;
    countActive = 0;
    apiUrl = environment.apiUrl;
    templates = null;
    announcements = null;
    logs = null;
    customOptions: OwlOptions = {
        loop: true,
        mouseDrag: true,
        touchDrag: false,
        pullDrag: false,
        dots: false,
        autoplay: true,
        autoplaySpeed: 5000,
        autoplayTimeout: 5000,
        autoplayHoverPause: true,
        navSpeed: 1000,
        navText: ['', ''],
        responsive: {
            0: {
                items: 1
            },
            400: {
                items: 2
            },
            740: {
                items: 3
            },
            940: {
                items: 4
            }
        },
        nav: true
    }

    constructor(private accountService: AccountService,
        private vgenService: VgenService,
        private alertService: AlertService,
        private TemplateService: TemplateService,
        private announcementService: AnnouncementService
    ) { }

    updateActivate(refId, status) {
        this.vgenService.updateActivate(refId, status)
            .subscribe(() => {
                this.count = 0;
                this.countActive = 0;
                this.vgenService.getAll()
                    .subscribe((items: any[]) => {
                        items.forEach(item => {
                            if (item.status == "active") {
                                this.count++;
                                this.countActive++;
                            }else{
                                this.count++;
                            }
                        });
                        this.items = items;
                    });
            });

        this.alertService.success("Update Visualization status Successfully", { keepAfterRouteChange: true, autoClose: true });

    }

    delete(id, refId) {
        let confirm_text = "Are you sure to delete This Visualization ?\nIt will be deleted permanently. \nrefId : " + refId;
        if (confirm(confirm_text)) {
            const item = this.items.find(x => x.id === id);
            item.isDeleting = true;
            if(item["status"] == "active"){
                this.countActive--;
            }
            this.vgenService.delete(id)
                .pipe(first())
                .subscribe(() => {
                    this.items = this.items.filter(x => x.id !== id)
                    this.count -= 1;
                });
            this.alertService.success('Visualization Deleted Successfully', { keepAfterRouteChange: true, autoClose: true });
        }
    }

    ngOnInit(): void {
        this.role = this.accountService.getRole();
        this.user = this.accountService.userValue;
        if (this.role == "user" || this.role == "designer") {
            this.announcementService.getLatest()
                .pipe(first())
                .subscribe((ann: any[]) => {
                    this.announcements = ann;
                })
            this.TemplateService.getAll()
                .pipe(first())
                .subscribe((templates: any[]) => {
                    this.templates = templates;
                });
            this.vgenService.getAll()
                .pipe(first())
                .subscribe((items: any[]) => {
                    items.forEach(item => {
                        if (item.status == "active") {
                            this.count++;
                            this.countActive++;
                        }else{
                            this.count++;
                        }
                    });
                    this.items = items.reverse();
                });
        }


    }
  @ViewChild ('logscatter') div;
    ngAfterViewInit() {
        if(this.role =="admin" ||this.role == "superadmin" ){
            this.accountService.getAllLog()
            .subscribe(res => {
              this.logs = res;
              this.count++;
              this.createLogScatter( this.div.nativeElement)
            });
        }
      }
    delete_(id: string) {
        let confirm_text = "Are you sure to delete this announcement ? This announcement will be deleted permanently."
        if(confirm(confirm_text)) {
            const announcement = this.announcements.find(x => x.id === id);
            announcement.isDeleting = true;
            this.announcementService.delete(id)
                .pipe(first())
                .subscribe(() => {
                    this.announcements = this.announcements.filter(x => x.id !== id);
                });
          }
    }

    createLogScatter(divAdmin:HTMLElement) :void{
       d3.select(divAdmin)
        .style('position','absolute')
        .style('left','15vw')
        .style("align-content", "center")
        d3.select(divAdmin).select('#chartContainer').append('canvas')
            .attr('id','canvas')
            .attr('width',1400)
            .style('height',800)
        let Rainbowcolor =d3.scaleSequential()
        .domain([0, 100])
        .interpolator(d3.interpolateRainbow);
        //preprocess
        let rawdata = this.logs.reverse();
        //splitData
        let datasets ={
            user:[],
            admin:[],
            designer:[]
        }
        let uniqueDate =[]

        for (let i = 0; i < rawdata.length; i++) {
            let diff =  Math.abs(moment(rawdata[0].createdAt).diff(moment(rawdata[i].createdAt),'days'));
            if(diff<5){
                let date  = moment(rawdata[i].createdAt).format("ll");
                if(!uniqueDate.includes(date)){
                    uniqueDate.push(date)
                }
                //rawdata.role  == 'user'
                if(rawdata[i].role  == 'user'){
                    rawdata[i]['diff'] = diff;
                    datasets.user.push(rawdata[i])
                }
                else if(rawdata[i].role  == 'designer'){
                    rawdata[i]['diff'] = diff;
                    datasets.designer.push(rawdata[i])
                }
                else if(rawdata[i].role  == 'admin' || rawdata[i].role == 'superadmin'){
                    rawdata[i]['diff'] = diff;
                    datasets.admin.push(rawdata[i])
                }
            }
            else{
                break;
            }
        }
       
        // uniqueDate = uniqueDate.reverse();
        // datasets.admin = datasets.admin.reverse();
        // datasets.designer = datasets.designer.reverse();
        // datasets.user = datasets.user.reverse();
        //userlogs
        let userslogs = {create:[0,0,0,0,0],update:[0,0,0,0,0],delete:[0,0,0,0,0],forgot:[0,0,0,0,0],reset:[0,0,0,0,0]}
        datasets.user.forEach(json=>{
            if(json.method == 'CREATE'){
                userslogs.create[json.diff]+=1;
            }
            else if(json.method == 'UPDATE'){
                userslogs.update[json.diff]+=1;
            }
            else if(json.method == 'DELETE'){
                userslogs.delete[json.diff]+=1;
            }
            else if(json.method == 'FORGOT_PASSWORD'){
                userslogs.forgot[json.diff]+=1;
            }
            else if(json.method == 'RESET_PASSWORD'){
                userslogs.reset[json.diff]+=1;
            }
        })
        let designerlogs = {create:[0,0,0,0,0],update:[0,0,0,0,0],delete:[0,0,0,0,0],forgot:[0,0,0,0,0],reset:[0,0,0,0,0]}
        datasets.designer.forEach(json=>{
            if(json.method == 'CREATE'){
                designerlogs.create[json.diff]+=1;
            }
            else if(json.method == 'UPDATE'){
                designerlogs.update[json.diff]+=1;
            }
            else if(json.method == 'DELETE'){
                designerlogs.delete[json.diff]+=1;
            }
            else if(json.method =='FORGOT_PASSWORD'){
                designerlogs.forgot[json.diff]+=1;
            }
            else if(json.method == 'RESET_PASSWORD'){
                designerlogs.reset[json.diff]+=1;
            }
        })
        console.log(designerlogs)
        let adminlogs = {create:[0,0,0,0,0],update:[0,0,0,0,0],delete:[0,0,0,0,0],forgot:[0,0,0,0,0],reset:[0,0,0,0,0]}
        datasets.admin.forEach(json=>{
            if(json.method == 'CREATE'){
                adminlogs.create[json.diff]+=1;
            }
            else if(json.method == 'UPDATE'){
                adminlogs.update[json.diff]+=1;
            }
            else if(json.method == 'DELETE'){
                adminlogs.delete[json.diff]+=1;
            }
            else if(json.method == 'FORGOT_PASSWORD'){
                adminlogs.forgot[json.diff]+=1;
            }
            else if(json.method == 'RESET_PASSWORD'){
                adminlogs.reset[json.diff]+=1;
            }
        })
        let barchartUser = {
            labels:uniqueDate,
            datasets:[{
                label:'Create',
                backgroundColor:'#00FA9A',
                stack:0,
                data:userslogs.create
            },
            {
                label:'Update',
                backgroundColor:'#48D1CC',
                stack:1,
                data:userslogs.update
            },
            {
                label:'Delete',
                backgroundColor:'#DC143C',
                stack:2,
                data:userslogs.delete
            },
            {
                label:'Forgot Password',
                backgroundColor:'#FFD700',
                stack:3,
                data:userslogs.forgot
            },
            {
                label:'Reset Password',
                backgroundColor:'#EE82EE',
                stack:3,
                data:userslogs.reset
            }
        ]
        }
			var ctx = document.getElementsByTagName('canvas')[0].getContext('2d');
			var bar = new Chart(ctx, {
				type: 'bar',
				data: barchartUser,
				options: {
					title: {
						display: true,
						text: 'User Logs'
					},
					tooltips: {
						mode: 'index',
						intersect: false
					},
					responsive: true,
					scales: {
						xAxes: [{
							stacked: true,
						}],
						yAxes: [{
							stacked: true
						}]
					}
				}
			});
        function render(role:string){
            let barData
            if(role =='Designer'){
                barData = designerlogs
                bar.config.options.title.text = 'Designer Logs'
            }
            else if(role == 'Admin'){
                barData = adminlogs
                bar.config.options.title.text = 'Admin Logs'
            }
            else if (role == 'User'){
                barData = userslogs
                bar.config.options.title.text = 'User Logs'
            }
            let barchartNew = {
                labels:uniqueDate,
                datasets:[{
                    label:'Create',
                    backgroundColor:'#00FA9A',
                    stack:0,
                    data:barData.create
                },
                {
                    label:'Update',
                    backgroundColor:'#48D1CC',
                    stack:1,
                    data:barData.update
                },
                {
                    label:'Delete',
                    backgroundColor:'#DC143C',
                    stack:2,
                    data:barData.delete
                },
                {
                    label:'Forgot Password',
                    backgroundColor:'#FFD700',
                    stack:3,
                    data:barData.forgot
                },
                {
                    label:'Reset Password',
                    backgroundColor:'#EE82EE',
                    stack:3,
                    data:barData.reset
                }
            ]
            }

            bar.config.data =barchartNew;
            bar.update();
        }
        d3.select(divAdmin).select('#chartContainer').append('div')
        .style('width',1000)
        .style('text-align','center')
        .style('top','15px')
        //.style('width','100%')
        .selectAll("text")
        .data(['User','Designer','Admin'])
        .enter()
        .append('button')
          .text(d=> {return d})
          .attr('class','labelBt')
          .attr('clicked',(d,i)=> {
            if(i==0){
            return true
          }
            return false})
          .style('color',(d,i)=> {
            if(i==0){
            return 'white'
          }
            return 'black'})
          .style('background-color',(d,i)=> {
            if(i==0){
            return 'black'
          }
            return 'white'})
          .attr('id',(d,i)=>i)
          .style('font-family','monospace')
          .style('font-weight',800)
          .on('click',btClicked)
          .on('mouseover',btMOver)
          .on('mouseout',btMout)
          function btClicked(){
            d3.selectAll('.labelBt')
                .style('color','black')
                .style('background-color','white')
                .attr('clicked',false);
            d3.select(this)
                .attr('clicked',true)
                .style('color','white')
                .style('background-color','black')
           render(d3.select(this).text())
          }
          function btMOver(){
            d3.select(this)
              .style('color','black')
              .style('background-color','grey')
          }
          function btMout(){
            if (d3.select(this).attr('clicked') == 'false'){
              d3.select(this)
              .style('color','black')
              .style('background-color','white')
            }
            else {
              d3.select(this)
              .style('color','white')
              .style('background-color','black')
            }
            }
}

}
