namespace Andalusia.Api.Helpers
{
    // One shared formula for course progress (used by instructor AND learner pages)
    public static class ProgressCalculator
    {
        public static int Calculate(int attendedSessions, int pastSessions, int submittedAssignments, int totalAssignments)
        {
            var total = pastSessions + totalAssignments;
            if (total == 0) return 0;

            var done = attendedSessions + submittedAssignments;
            return (int)Math.Round(done * 100.0 / total);
        }
    }
}
