System.register(['angular2/core', "./user.factory", "angular2/common", "../lib/regex"], function(exports_1) {
    var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var __metadata = (this && this.__metadata) || function (k, v) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
    };
    var core_1, user_factory_1, common_1, regex_1;
    var UserSubscribeComponent;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (user_factory_1_1) {
                user_factory_1 = user_factory_1_1;
            },
            function (common_1_1) {
                common_1 = common_1_1;
            },
            function (regex_1_1) {
                regex_1 = regex_1_1;
            }],
        execute: function() {
            UserSubscribeComponent = (function () {
                function UserSubscribeComponent(userFactory, fb, regEx) {
                    this.associateShop = [{
                            name: "",
                            socialReason: '',
                            adress: "",
                            adress2: "",
                            city: "",
                            zipCode: "",
                            mobile: "",
                            phone: "",
                            fax: "",
                            mail: "",
                            tva: 0,
                            siret: 0,
                            adeli: 0,
                            nightBox: true,
                            transporteur: '',
                            openDay: "",
                            closeDay: "",
                            openHour: "",
                            closeHour: ""
                        }];
                    this.director = {
                        lastName: 'ezd,c',
                        firstName: 'ezlkd,',
                        phone: 'dk,q',
                        mail: 'd,qs;',
                    };
                    this.model = {
                        role: 0,
                        lastName: '',
                        firstName: '',
                        phone: '',
                        mail: '',
                        averageLens: 0,
                        providerLens: "",
                        averageGlasses: 0,
                        providerGlasses: "",
                        financialShop: "",
                        IBAN: 0,
                        BIC: 0,
                        financialMail: '',
                        paymentState: true,
                        deliverShop: "",
                        central: '',
                        comment: ''
                    };
                    this.isSame = {
                        director: 1,
                        deliverShop: false,
                        financialMail: 1,
                        financialShop: 1
                    };
                    this.user = {
                        role: 0,
                        lastName: '',
                        firstName: '',
                        phone: '',
                        mail: '',
                        averageLens: 0,
                        providerLens: "",
                        averageGlasses: 0,
                        providerGlasses: "",
                        financialShop: "",
                        IBAN: 0,
                        BIC: 0,
                        financialMail: '',
                        paymentState: true,
                        deliverShop: "",
                        central: '',
                        comment: ''
                    };
                    this.service = userFactory;
                    this.subscribeForm = fb.group({
                        'name': ['', common_1.Validators.compose([])],
                        'firstName': ['', common_1.Validators.compose([])],
                        'mail': ['', common_1.Validators.compose([])],
                        'phone': ['', common_1.Validators.compose([])],
                        'mobile': ['', common_1.Validators.compose([])]
                    });
                }
                UserSubscribeComponent.prototype.subscribe = function () {
                    if (this.subscribeForm.valid) {
                        this.user = this.model;
                        this.user.role = 0;
                        if (!this.isSame.financialMail) {
                            this.user.financialMail = this.model.financialMail;
                        }
                        else {
                            this.user.financialMail = this.associateShop[0].mail;
                        }
                        this.service.save(this.user, this.associateShop, this.director, this.isSame);
                    }
                };
                UserSubscribeComponent.prototype.addShop = function () {
                    this.associateShop.push({
                        name: "",
                        socialReason: '',
                        adress: "",
                        adress2: "",
                        city: "",
                        zipCode: "",
                        mobile: "",
                        phone: "",
                        fax: "",
                        mail: "",
                        tva: 0,
                        siret: 0,
                        adeli: 0,
                        nightBox: true,
                        transporteur: '',
                        openDay: "",
                        closeDay: "",
                        openHour: "",
                        closeHour: ""
                    });
                };
                UserSubscribeComponent.prototype.removeShop = function () {
                    if (this.associateShop.length > 1)
                        this.associateShop.pop();
                };
                UserSubscribeComponent = __decorate([
                    core_1.Component({
                        providers: [],
                        templateUrl: "app/User/user-subscribe.html",
                    }), 
                    __metadata('design:paramtypes', [user_factory_1.UserFactory, common_1.FormBuilder, regex_1.RegEx])
                ], UserSubscribeComponent);
                return UserSubscribeComponent;
            })();
            exports_1("UserSubscribeComponent", UserSubscribeComponent);
        }
    }
});
//# sourceMappingURL=user-subscribe.component.js.map