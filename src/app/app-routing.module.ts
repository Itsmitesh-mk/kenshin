import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
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
import { AddLeaveRulesComponent } from './leave-and-holiday/add-leave-rules/add-leave-rules.component';
import { AddHolidayComponent } from './leave-and-holiday/add-holiday/add-holiday.component';
import { LeaveRuleListComponent } from './leave-and-holiday/leave-rule-list/leave-rule-list.component';
import { HolidayListComponent } from './leave-and-holiday/holiday-list/holiday-list.component';
import { AddAnnoucementComponent } from './annoucement/add-annoucement/add-annoucement.component';
import { AnnoucementListComponent } from './annoucement/annoucement-list/annoucement-list.component';
import { AddDistributionComponent } from './distribution/add-distribution/add-distribution.component';
// import { DistributionListComponent } from './distribution/distribution-list/distribution-list.component';
import { DistributionDetailComponent } from './distribution/distribution-detail/distribution-detail.component';
import { AddLeadComponent } from './lead/add-lead/add-lead.component';
import { LeadListComponent } from './lead/lead-list/lead-list.component';
import { GiftDeatilComponent } from './pop_and_gift/gift-deatil/gift-deatil.component';
import { LeadDetailComponent } from './lead/lead-detail/lead-detail.component';
import { DistributionListComponent } from './distribution/distributor-list/distribution-list.component';
import { RetailerListComponent } from './distribution/retailer-list/retailer-list.component';
import { WholesalerListComponent } from './distribution/wholesaler-list/wholesaler-list.component';
import { EngineListComponent } from './distribution/engine-list/engine-list.component';
import { MechanicListComponent } from './distribution/mechanic-list/mechanic-list.component';
import { AddTaskComponent } from './task/add-task/add-task.component';
import { TaskListComponent } from './task/task-list/task-list.component';
import { AuthGuardLog }    from './auth-guard-log.service';
import { AuthGuard }    from './session.service';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import {  AssigntaskComponent } from './task/assigntask/assigntask.component';
import { AddFollowupComponent } from './followup/add-followup/add-followup.component';
import { FollowupListComponent } from './followup/followup-list/followup-list.component';
import { TaskDetailComponent } from './task/task-detail/task-detail.component';
import { AddOrderComponent } from './order/add-order/add-order.component';
import { OrderListComponent } from './order/order-list/order-list.component';
import { OrderDetailComponent } from './order/order-detail/order-detail.component';
import { CheckinComponent } from './checkin/checkin-list/checkin-list.component';

import { AddActivityComponent } from './activity/add-activity/add-activity.component';
import { AddTravelComponent } from './travel/add-travel/add-travel.component';
import { ListTravelComponent } from './travel/list-travel/list-travel.component';
import { DetailTravelComponent } from './travel/detail-travel/detail-travel.component';
import { AddExpenseComponent } from './expense/add-expense/add-expense.component';
import { ExpenseListComponent } from './expense/expense-list/expense-list.component';
import { ExpenseDetailComponent } from './expense/expense-detail/expense-detail.component';
import { DetailByDateComponent } from './expense/detail-by-date/detail-by-date.component';
import { ConcernListComponent } from './customer-concern/concern-list/concern-list.component';
import { AddConcernComponent } from './customer-concern/add-concern/add-concern.component';
import { ConcernDetailComponent } from './customer-concern/concern-detail/concern-detail.component';
import { AllFollowupListComponent } from './followup/all-followup-list/all-followup-list.component';
import { EditOrderComponent } from './order/edit-order/edit-order.component';
import { DraftDetailComponent } from './customer-concern/draft-detail/draft-detail.component';
import { RejectLeadComponent } from './reject-lead/reject-lead.component';
// import { UpdateConcernComponent } from './customer-concern/update-concern/update-concern.component';s
import { AddSchemeComponent } from './scheme/add-scheme/add-scheme.component';
import { LeaveApplyAddComponent } from './leave-apply/leave-apply-add/leave-apply-add.component';
import { LeaveApplyListComponent } from './leave-apply/leave-apply-list/leave-apply-list.component';
import { SchemeListComponent } from './scheme/scheme-list/scheme-list.component';
import { SchemeDetailComponent } from './scheme/scheme-detail/scheme-detail.component';
import { CheckinDetailComponent } from './checkin/checkin-detail/checkin-detail.component';

import { AllowanceComponent } from './allowance/allowance.component';
import { AddLeaveComponent } from './leave/add-leave/add-leave.component';
import { LeaveDetailComponent } from './leave/leave-detail/leave-detail.component';
import { LeaveListComponent } from './leave/leave-list/leave-list.component';
import { PopAndGiftDistributorListComponent } from './pop_and_gift-distributor/pop-and-gift-distributor-list/pop-and-gift-distributor-list.component';
import { PopAndGiftDistributorAddComponent } from './pop_and_gift-distributor/pop-and-gift-distributor-add/pop-and-gift-distributor-add.component';
import { LeaveRuleDetailComponent } from './leave-and-holiday/leave-rule-detail/leave-rule-detail.component';
import { EditleaveComponent } from './leave/editleave/editleave.component';
import { EditOutStationComponent } from './expense/edit-out-station/edit-out-station.component';
import { EditmiscComponent } from './expense/editmisc/editmisc.component';
import { EditLocalExpenseComponent } from './expense/edit-local-expense/edit-local-expense.component';
import { EditSalesPormotionComponent } from './expense/edit-sales-pormotion/edit-sales-pormotion.component';
import { EversionDetailComponent } from './pop_and_gift/eversion-detail/eversion-detail.component';
import { VendorAddComponent } from './vendor/vendor-add/vendor-add.component';
import { VendorListComponent } from './vendor/vendor-list/vendor-list.component';
import { VendorDetailComponent } from './vendor/vendor-detail/vendor-detail.component';
import { QrCodeDetailComponent } from './vendor/qr-code-detail/qr-code-detail.component';

const routes: Routes = [
  { path: "", component: LoginComponent, canActivate:[AuthGuardLog]},
  { path: "dashboard", component: DashboardComponent, canActivate:[AuthGuard]},
  { path: "add-task", component: AddTaskComponent, canActivate:[AuthGuard]},
  { path: "assigntask/:id", component: AssigntaskComponent, canActivate:[AuthGuard]},
  { path: "task-list", component: TaskListComponent, canActivate:[AuthGuard]},
  { path: "product-list", component: ProductListComponent,canActivate:[AuthGuard]},
  { path: "product-detail/:id", component:  ProductDetailComponent, canActivate:[AuthGuard]},
  { path: "user-add", component: UserAddComponent, canActivate:[AuthGuard]},
  { path: "sale-user-list", component: SaleUserListComponent, canActivate:[AuthGuard] },
  { path: "sale-user-detail/:id", component: SaleUserDetailComponent,canActivate:[AuthGuard]  },
  { path: "system-user-list", component: SystemUserListComponent, canActivate:[AuthGuard] },
  { path: "system-user-detail/:id", component: SystemUserDetailComponent, canActivate:[AuthGuard] },
  { path: "territory-add/:id", component: TerritoryAddComponent,  canActivate:[AuthGuard]},
  { path: "territory-list", component: TerritoryListComponent, canActivate:[AuthGuard] },
  { path: "pop_and_gift", component: AddGiftComponent,canActivate:[AuthGuard] },
  { path: "gift-list", component: GiftListComponent,  canActivate:[AuthGuard]},
  { path: "add-leave-rules/:id", component: AddLeaveRulesComponent, canActivate:[AuthGuard] },
  { path: "add-holiday", component: AddHolidayComponent, canActivate:[AuthGuard] },
  { path: "leave-rule-list", component: LeaveRuleListComponent,  canActivate:[AuthGuard]},
  { path: "holiday-list", component: HolidayListComponent, canActivate:[AuthGuard]},
  { path: "add-annoucement", component: AddAnnoucementComponent, canActivate:[AuthGuard] },
  { path: "annoucement-list", component: AnnoucementListComponent, canActivate:[AuthGuard] },
  { path: "add-distribution", component: AddDistributionComponent, canActivate:[AuthGuard] },
  { path: "distribution-list", component: DistributionListComponent,  canActivate:[AuthGuard]},
  { path: "distribution-detail/:id", component: DistributionDetailComponent, canActivate:[AuthGuard] },
  { path: "add-lead", component: AddLeadComponent, canActivate:[AuthGuard] },
  { path: "lead-list", component: LeadListComponent, canActivate:[AuthGuard] },
  { path: "gift-deatil/:id", component: GiftDeatilComponent,canActivate:[AuthGuard]  },
  { path: "lead-detail/:id", component: LeadDetailComponent,canActivate:[AuthGuard] },
  { path: "retailer-list", component: RetailerListComponent, canActivate:[AuthGuard] },
  { path: "wholesaler-list", component: WholesalerListComponent,canActivate:[AuthGuard]  },
  { path: "engine-list", component: EngineListComponent,canActivate:[AuthGuard]  },
  { path: "mechanic-list", component: MechanicListComponent,canActivate:[AuthGuard]  },
  { path: "add-followup/:id", component: AddFollowupComponent, canActivate:[AuthGuard]  },
  { path: "followup-list", component: FollowupListComponent, canActivate:[AuthGuard]  },
  { path: "task-detail/:id", component: TaskDetailComponent, canActivate:[AuthGuard]  },
  { path: "checkin-list", component: CheckinComponent, canActivate:[AuthGuard]  },
  { path: "add-order", component: AddOrderComponent, canActivate:[AuthGuard]  },
  { path: "order-list", component: OrderListComponent, canActivate:[AuthGuard]  },
  { path: "order-detail/:id", component: OrderDetailComponent, canActivate:[AuthGuard]  },
  { path: "edit-order/:id", component: EditOrderComponent, canActivate:[AuthGuard]  },
  { path: "add-activity", component: AddActivityComponent, canActivate:[AuthGuard]  },
  { path: "add-travel", component: AddTravelComponent, canActivate:[AuthGuard]  },
  { path: "list-travel", component: ListTravelComponent, canActivate:[AuthGuard]  },
  { path: "detail-travel/:id", component: DetailTravelComponent, canActivate:[AuthGuard]  },
  { path: "add-expense", component: AddExpenseComponent, canActivate:[AuthGuard]  },
  { path: "expense-list", component: ExpenseListComponent, canActivate:[AuthGuard]  },
  { path: "expense-detail/:id", component: ExpenseDetailComponent, canActivate:[AuthGuard]  },
  { path: "detail-by-date/:id", component: DetailByDateComponent, canActivate:[AuthGuard]  },
  { path: "concern-list", component: ConcernListComponent, canActivate:[AuthGuard]  },
  { path: "add-concern", component: AddConcernComponent, canActivate:[AuthGuard]  },
  { path: "concern-detail/:id", component: ConcernDetailComponent, canActivate:[AuthGuard]  },
  { path: "all-followup-list/:id", component: AllFollowupListComponent, canActivate:[AuthGuard]  },
  { path: "draft-detail/:id", component: DraftDetailComponent, canActivate:[AuthGuard]  },
  { path: "reject-lead", component: RejectLeadComponent, canActivate:[AuthGuard]  },
  { path: "add-scheme", component: AddSchemeComponent, canActivate:[AuthGuard]  },
  { path: "leave-apply", component: LeaveApplyAddComponent, canActivate:[AuthGuard]  },
  { path: "leave-apply-list", component: LeaveApplyListComponent, canActivate:[AuthGuard]  },
  { path: "scheme-list", component: SchemeListComponent, canActivate:[AuthGuard]  },
  { path: "scheme-detail/:id", component: SchemeDetailComponent, canActivate:[AuthGuard]  },
  // { path: "scheme-detail", component: SchemeDetailComponent},
  { path: "checkin-detail/:id", component: CheckinDetailComponent, canActivate:[AuthGuard]  },
  { path: "checkin-detail/:id/:date", component: CheckinDetailComponent, canActivate:[AuthGuard]  },
  
  { path: "add-leave", component: AddLeaveComponent, canActivate:[AuthGuard]  },
  { path: "leave-detail/:id", component: LeaveDetailComponent, canActivate:[AuthGuard]  },
  { path: "leave-list", component: LeaveListComponent, canActivate:[AuthGuard]  },
  // { path: "update-concern", component: UpdateConcernComponent, canActivate:[AuthGuard]  },
  
  { path: "allowance", component: AllowanceComponent, canActivate:[AuthGuard]},
  { path: "pop-and-gift-distributor-list", component: PopAndGiftDistributorListComponent, canActivate:[AuthGuard] },
  { path: "pop-and-gift-distributor-add", component: PopAndGiftDistributorAddComponent, canActivate:[AuthGuard] },
  { path: "leave-rule-detail/:id", component: LeaveRuleDetailComponent, canActivate:[AuthGuard] },
  { path: "editleave/:id", component: EditleaveComponent, canActivate:[AuthGuard] },
  { path: "edit-out-station/:id", component: EditOutStationComponent, canActivate:[AuthGuard] },
  { path: "editmisc/:id", component: EditmiscComponent, canActivate:[AuthGuard] },
  { path: "edit-local-expense/:id", component: EditLocalExpenseComponent, canActivate:[AuthGuard] },
  { path: "edit-sales-pormotion/:id", component: EditSalesPormotionComponent, canActivate:[AuthGuard] },
  { path: "eversion-detail/:id", component: EversionDetailComponent, canActivate:[AuthGuard] },
  { path: "vendor-add", component: VendorAddComponent, canActivate:[AuthGuard] },
  { path: "vendor-list", component: VendorListComponent, canActivate:[AuthGuard] },
  { path: "vendor-detail/:id", component: VendorDetailComponent, canActivate:[AuthGuard] },
  { path: "qr-code-detail", component: QrCodeDetailComponent, canActivate:[AuthGuard] },
  
];

@NgModule({
  
  
  imports: [
    RouterModule.forRoot(routes),
    
    
  ],
  exports: [
    // AuthGuardLog,
    // AuthGuard,
    RouterModule]
  })
  export class AppRoutingModule { }
  