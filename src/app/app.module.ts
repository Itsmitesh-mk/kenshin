import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {NgxMaterialTimepickerModule} from 'ngx-material-timepicker';
import { routerTransition } from './router-animation/router-animation.component';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MaterialModule } from './material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LoginComponent } from './login/login.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { NavigationComponent } from './navigation/navigation.component';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import { MasterTabComponent } from './master-tab/master-tab/master-tab.component';
import { MasterTabListComponent } from './master-tab-list/master-tab-list/master-tab-list.component';
import { ProductListComponent } from './product/product-list/product-list.component';
import { ProductDetailComponent } from './product/product-detail/product-detail.component';
import { UserAddComponent } from './user/user-add/user-add.component';
import { SaleUserListComponent } from './user/sale-user-list/sale-user-list.component';
import { SaleUserDetailComponent } from './user/sale-user-detail/sale-user-detail.component';
import { SystemUserListComponent } from './user/system-user-list/system-user-list.component';
import { SystemUserDetailComponent } from './user/system-user-detail/system-user-detail.component';
import { TerritoryAddComponent } from './territory/territory-add/territory-add.component';
import { TerritoryListComponent } from './territory/territory-list/territory-list.component';
import { AddGiftComponent } from './pop_and_gift/add-gift/add-gift.component';
import { GiftListComponent } from './pop_and_gift/gift-list/gift-list.component';
import {GiftModalComponent}from './pop_and_gift/gift-modal/gift-modal.component';
import { AddLeaveRulesComponent } from './leave-and-holiday/add-leave-rules/add-leave-rules.component';
import { AddHolidayComponent } from './leave-and-holiday/add-holiday/add-holiday.component';
import { LeaveRuleListComponent } from './leave-and-holiday/leave-rule-list/leave-rule-list.component';
import { HolidayListComponent } from './leave-and-holiday/holiday-list/holiday-list.component';
import { FormsModule,ReactiveFormsModule} from '@angular/forms';
import { HttpClientModule } from '../../node_modules/@angular/common/http';
import { AddAnnoucementComponent } from './annoucement/add-annoucement/add-annoucement.component';
import { AnnoucementListComponent } from './annoucement/annoucement-list/annoucement-list.component';
import { AddressModalComponent } from './user/address-modal/address-modal.component';
import {SystemModalComponent}from './user/system-modal/system-modal.component';
import { EmailModalComponent } from './user/email-modal/email-modal.component';
import { ProductModalComponent } from './product/product-modal/product-modal.component';
import { AddDistributionComponent } from './distribution/add-distribution/add-distribution.component';
import { DistributionListComponent } from './distribution/distributor-list/distribution-list.component';
import { MyFilterPipe } from './shared/pipes/my-filter.pipe';
// import { UniquePipe } from './shared/pipes/unique-filter.pipe';

import { AddDiscountComponent } from './discount/add-discount/add-discount.component';
import { DiscountListComponent } from './discount/discount-list/discount-list.component';
import { DistributionDetailComponent } from './distribution/distribution-detail/distribution-detail.component';
import { DistributionOrderListComponent } from './distribution/distribution-order-list/distribution-order-list.component';
import { AddLeadComponent } from './lead/add-lead/add-lead.component';
import { LeadListComponent } from './lead/lead-list/lead-list.component';
import { GiftDeatilComponent } from './pop_and_gift/gift-deatil/gift-deatil.component';
import { LeadDetailComponent } from './lead/lead-detail/lead-detail.component';
import { RetailerListComponent } from './distribution/retailer-list/retailer-list.component';
import { WholesalerListComponent } from './distribution/wholesaler-list/wholesaler-list.component';
import { MechanicListComponent } from './distribution/mechanic-list/mechanic-list.component';
import { EngineListComponent } from './distribution/engine-list/engine-list.component';
import { AddTaskComponent } from './task/add-task/add-task.component';
import { TaskListComponent } from './task/task-list/task-list.component';
import {  AssigntaskComponent } from './task/assigntask/assigntask.component';
import { AuthGuardLog }    from './auth-guard-log.service';
import { AuthGuard }    from './session.service';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AddFollowupComponent } from './followup/add-followup/add-followup.component';
import { FollowupListComponent } from './followup/followup-list/followup-list.component';
import { TaskDetailComponent } from './task/task-detail/task-detail.component';
import { UpdateNetworkComponent } from './distribution/update-network/update-network.component';
import { UpdateNetworkAddressComponent } from './distribution/update-network-address/update-network-address.component';
import { AddOrderComponent } from './order/add-order/add-order.component';
import { OrderListComponent } from './order/order-list/order-list.component';
import { OrderDetailComponent } from './order/order-detail/order-detail.component';
import { CheckinComponent } from './checkin/checkin-list/checkin-list.component';
import { AddActivityComponent } from './activity/add-activity/add-activity.component';
import { UpdateLeadComponent } from './lead/update-lead/update-lead.component';
import { AddTravelComponent } from './travel/add-travel/add-travel.component';
import { ListTravelComponent } from './travel/list-travel/list-travel.component';
import { DetailTravelComponent } from './travel/detail-travel/detail-travel.component';
import { UpdateTravelComponent } from './travel/update-travel/update-travel.component';
import { AddExpenseComponent } from './expense/add-expense/add-expense.component';
import { ExpenseListComponent } from './expense/expense-list/expense-list.component';
import { ExpenseDetailComponent } from './expense/expense-detail/expense-detail.component';
import { DetailByDateComponent } from './expense/detail-by-date/detail-by-date.component';
import { AnnoucementDetailComponent } from './annoucement/annoucement-detail/annoucement-detail.component';
import { TerritoryDetailComponent } from './territory/territory-detail/territory-detail.component';
import { ListOrderComponent } from './order/list-order/list-order.component';
import { ConcernListComponent } from './customer-concern/concern-list/concern-list.component';
import { AddConcernComponent } from './customer-concern/add-concern/add-concern.component';
import { ConcernDetailComponent } from './customer-concern/concern-detail/concern-detail.component';
import { DetailorderlistComponent } from './order/detailorderlist/detailorderlist.component';
import { AllFollowupListComponent } from './followup/all-followup-list/all-followup-list.component';
import { EditOrderComponent } from './order/edit-order/edit-order.component';
import { OtherAddressComponent } from './order/other-address/other-address.component';
import { ReadMassageComponent } from './annoucement/read-massage/read-massage.component';
import { ReadPopupComponent } from './annoucement/read-popup/read-popup.component';
import { UniquePipe } from './annoucement/annoucement-list/unique-filter.pipe';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';
// import { LocalStorageService }  from './local-storage.Service';
import { DraftDetailComponent } from './customer-concern/draft-detail/draft-detail.component';
import { UpdateConcernComponent } from './customer-concern/update-concern/update-concern.component';
// import {NgxScrollToFirstInvalidModule} from '@ismaestro/ngx-scroll-to-first-invalid';
// import { FileSaverModule } from 'ngx-filesaver';

import {NgxScrollToFirstInvalidModule} from '@ismaestro/ngx-scroll-to-first-invalid';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { PlaceModalComponent } from './territory/place-modal/place-modal.component';
import { NgxEditorModule } from 'ngx-editor';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { AngularFontAwesomeModule } from 'angular-font-awesome';
import { RejectLeadComponent } from './reject-lead/reject-lead.component';
import { AddSchemeComponent } from './scheme/add-scheme/add-scheme.component';
import { LeaveApplyAddComponent } from './leave-apply/leave-apply-add/leave-apply-add.component';
import { LeaveApplyListComponent } from './leave-apply/leave-apply-list/leave-apply-list.component';
import { SchemeListComponent } from './scheme/scheme-list/scheme-list.component';
import { SchemeDetailComponent } from './scheme/scheme-detail/scheme-detail.component';
import { EditSchemeComponent } from './scheme/edit-scheme/edit-scheme.component';
import { CheckinDetailComponent } from './checkin/checkin-detail/checkin-detail.component';
import { AllowanceComponent } from './allowance/allowance.component';
import { DocumentEndImageComponent } from './distribution/document-end-image/document-end-image.component';
import { CitiesModalComponent } from './cities-modal/cities-modal.component';
import { AddLeaveComponent } from './leave/add-leave/add-leave.component';
import { LeaveDetailComponent } from './leave/leave-detail/leave-detail.component';
import { LeaveListComponent } from './leave/leave-list/leave-list.component';
import { SchemepopupComponent } from './order/schemepopup/schemepopup.component';
import { UpdateStatusComponent } from './customer-concern/update-status/update-status.component';
import { EditdateSchemeComponent } from './scheme/editdate-scheme/editdate-scheme.component';

import { VideoModalComponent } from './pop_and_gift/video-modal/video-modal.component';
import { WalletDetailModalComponent } from './pop_and_gift-distributor/wallet-detail-modal/wallet-detail-modal.component';
import { PopAndGiftDistributorListComponent } from './pop_and_gift-distributor/pop-and-gift-distributor-list/pop-and-gift-distributor-list.component';
import { PopAndGiftDistributorAddComponent } from './pop_and_gift-distributor/pop-and-gift-distributor-add/pop-and-gift-distributor-add.component';
import { LeaveRuleDetailComponent } from './leave-and-holiday/leave-rule-detail/leave-rule-detail.component';
import { StatusModalComponent } from './pop_and_gift-distributor/status-modal/status-modal.component';
import { DatePipe } from '@angular/common';
import { EditleaveComponent } from './leave/editleave/editleave.component';
import { AddDistributorComponent } from './scheme/add-distributor/add-distributor.component';
import { PendingOrderComponent } from './order/pending-order/pending-order.component';
import { AddOnDetailComponent } from './travel/add-on-detail/add-on-detail.component';
import { EditOutStationComponent } from './expense/edit-out-station/edit-out-station.component';
import { EditmiscComponent } from './expense/editmisc/editmisc.component';
import { EditSalesPormotionComponent } from './expense/edit-sales-pormotion/edit-sales-pormotion.component';
import { EditLocalExpenseComponent } from './expense/edit-local-expense/edit-local-expense.component';
import { RemarkModalComponent } from './checkin/remark-modal/remark-modal.component';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { ImageModalComponent } from './customer-concern/image-modal/image-modal.component';
import { EversionDetailComponent } from './pop_and_gift/eversion-detail/eversion-detail.component';
import { VendorAddComponent } from './vendor/vendor-add/vendor-add.component';
import { VendorListComponent } from './vendor/vendor-list/vendor-list.component';
import { VendorDetailComponent } from './vendor/vendor-detail/vendor-detail.component';
// import { PurchaseOrderAddComponent } from './purchase-order/purchase-order-add/purchase-order-add.component';
// import { PurchaseOrderListComponent } from './purchase-order/purchase-order-list/purchase-order-list.component';
// import { PurchaseOrderDetailComponent } from './purchase-order/purchase-order-detail/purchase-order-detail.component';
import { QrCodeDetailComponent } from './vendor/qr-code-detail/qr-code-detail.component';
import { VendorUpdateComponent } from './vendor/vendor-update/vendor-update.component';
import { EditmodelComponent } from './product/editmodel/editmodel.component';
import { RemainingLeaveComponent } from './leave/remaining-leave/remaining-leave.component';
@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HeaderComponent,
    FooterComponent,
    NavigationComponent,
    // AuthGuardLog,
    // AuthGuard,
    TaskListComponent,
    AddTaskComponent,
    MasterTabComponent,
    ProductListComponent,
    MasterTabListComponent,
    ProductDetailComponent,
    UserAddComponent,
    SaleUserListComponent,
    SaleUserDetailComponent,
    SystemUserListComponent,
    SystemUserDetailComponent,
    SystemModalComponent,
    TerritoryAddComponent,
    TerritoryListComponent,
    AddGiftComponent,
    GiftListComponent,
    AddLeaveRulesComponent,
    AddHolidayComponent,
    LeaveRuleListComponent,
    HolidayListComponent,
    AddAnnoucementComponent,
    AnnoucementListComponent,
    AddressModalComponent,
    EmailModalComponent,
    ProductModalComponent,
    AddDistributionComponent,
    DistributionListComponent,
    AddDiscountComponent,
    DiscountListComponent,
    DistributionDetailComponent,
    DistributionOrderListComponent,
    MyFilterPipe,
    UniquePipe,
    AddLeadComponent,
    LeadListComponent,
    GiftDeatilComponent,
    LeadDetailComponent,
    RetailerListComponent,
    EngineListComponent,
    WholesalerListComponent,
    MechanicListComponent,
    DashboardComponent,
    AssigntaskComponent,
    GiftModalComponent,
    AddFollowupComponent,
    FollowupListComponent,
    TaskDetailComponent,
    UpdateNetworkComponent,
    UpdateNetworkAddressComponent,
    AddOrderComponent,
    OrderListComponent,
    OrderDetailComponent,
    CheckinComponent,
    AddActivityComponent,
    UpdateLeadComponent,
    AddTravelComponent,
    ListTravelComponent,
    DetailTravelComponent,
    UpdateTravelComponent,
    AddExpenseComponent,
    ExpenseListComponent,
    ExpenseDetailComponent,
    DetailByDateComponent,
    AnnoucementDetailComponent,
    TerritoryDetailComponent,
    ListOrderComponent,
    ConcernListComponent,
    AddConcernComponent,
    ConcernDetailComponent,
    DetailorderlistComponent,
    AllFollowupListComponent,
    EditOrderComponent,
    OtherAddressComponent,
    ReadMassageComponent,
    ReadPopupComponent,
    DraftDetailComponent,
    UpdateConcernComponent,
    PlaceModalComponent,
    RejectLeadComponent,
    AddSchemeComponent,
    LeaveApplyAddComponent,
    LeaveApplyListComponent,
    SchemeListComponent,
    SchemeDetailComponent,
    EditSchemeComponent,
    CheckinDetailComponent,
    AllowanceComponent,
    DocumentEndImageComponent,
    CitiesModalComponent,
    AddLeaveComponent,
    LeaveDetailComponent,
    LeaveListComponent,
    SchemepopupComponent,
    UpdateStatusComponent,
    EditdateSchemeComponent,
    VideoModalComponent,
    WalletDetailModalComponent,
    PopAndGiftDistributorListComponent,
    PopAndGiftDistributorAddComponent,
    LeaveRuleDetailComponent,
    StatusModalComponent,
    EditleaveComponent,
    AddDistributorComponent,
    PendingOrderComponent,
    AddOnDetailComponent,
    EditOutStationComponent,
    EditmiscComponent,
    EditSalesPormotionComponent,
    EditLocalExpenseComponent,
    RemarkModalComponent,
    ImageModalComponent,
    EversionDetailComponent,
    VendorAddComponent,
    VendorListComponent,
    VendorDetailComponent,
    QrCodeDetailComponent,
    VendorUpdateComponent,
    EditmodelComponent,
    RemainingLeaveComponent
    
    
  ],
  imports: [
    BrowserModule,
    InfiniteScrollModule,
    // FileSaverModule,
    // NgxScrollToFirstInvalidModule,
    AppRoutingModule,
    NgxMaterialTimepickerModule,
    NgMultiSelectDropDownModule.forRoot(),
    FormsModule,
    HttpClientModule,
    MatSnackBarModule,
    MaterialModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
    NgxScrollToFirstInvalidModule,
    NgxEditorModule,
    AngularFontAwesomeModule,
    TooltipModule.forRoot()
  ],
  
  entryComponents:[
    StatusModalComponent,
    AddressModalComponent,
    SystemModalComponent,
    SchemepopupComponent,
    EmailModalComponent,
    UpdateNetworkComponent,
    ProductModalComponent,
    GiftModalComponent,
    UpdateNetworkAddressComponent,
    UpdateLeadComponent,
    UpdateTravelComponent,
    ListOrderComponent,
    DetailorderlistComponent,
    OtherAddressComponent,
    ReadMassageComponent,
    ReadPopupComponent,
    UpdateConcernComponent,
    PlaceModalComponent,
    RejectLeadComponent,
    EditSchemeComponent,
    DocumentEndImageComponent,
    CitiesModalComponent,
    EditdateSchemeComponent,
    AddDistributorComponent,
    PendingOrderComponent,
    AddOnDetailComponent,
    VideoModalComponent,
    RemarkModalComponent,
    ImageModalComponent,
    EditmodelComponent,
    RemainingLeaveComponent,
    WalletDetailModalComponent
  ],
  
  providers: [
    AuthGuardLog,
    // LocalStorageService,
    AuthGuard,
    DatePipe
  ],
  bootstrap: [AppComponent]
})


export class AppModule { }
