namespace Andalusia.Api.Helpers
{
    // One shared formula for course progress (used by instructor AND learner pages)
    // progress = everything done / everything that can be done so far
    //   done  = sessions attended (Present/Late) + assignments submitted + materials completed
    //   total = past sessions + all assignments + all materials
    public static class ProgressCalculator
    {
        public static int Calculate(
            int attendedSessions, int pastSessions,
            int submittedAssignments, int totalAssignments,
            int completedMaterials = 0, int totalMaterials = 0)
        {
            var total = pastSessions + totalAssignments + totalMaterials;
            if (total == 0) return 0;

            var done = attendedSessions + submittedAssignments + completedMaterials;
            return (int)Math.Round(done * 100.0 / total);
        }
    }
}
