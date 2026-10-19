namespace Andalusia.Api.Helpers
{
  
    public static class Roles
    {
        public const string Learner = "Learner";
        public const string Instructor = "Instructor";
        public const string Admin = "Admin";
        public const string ContentManager = "ContentManager";

        public const string AdminOrContentManager = Admin + "," + ContentManager;
        public const string AdminOrInstructor = Admin + "," + Instructor;
    }
}