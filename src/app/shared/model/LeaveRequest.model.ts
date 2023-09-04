export interface LeaveModel {
    key?: string | null;
    email?: string;
    status: string;
    typeOfLeave: string;
    startDate: string;
    endDate: string;
    reason: string;
}