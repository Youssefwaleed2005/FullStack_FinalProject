namespace Andalusia.Api.Enums
{
    public enum CourseType { Offline, Online }

    public enum CatalogStatus { Draft, ComingSoon, OpenForEnrollment, Full, InProgress, Completed }

    public enum ApplicationStatus { Submitted, Accepted, Rejected, Cancelled }

    public enum PaymentStatus { Pending, Paid, Failed, Refunded }

    public enum PaymentMethod { Card, Cash, BankTransfer }

    public enum EnrollmentStatus { Active, Paused, Completed, Cancelled }

    public enum PartnerType { Partner, Accreditation }
}