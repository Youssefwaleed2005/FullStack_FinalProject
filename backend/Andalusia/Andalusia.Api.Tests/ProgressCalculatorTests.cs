using Andalusia.Api.Helpers;

namespace Andalusia.Api.Tests
{
    // progress = (attended + submitted + completed) / (past sessions + assignments + materials)
    public class ProgressCalculatorTests
    {
        [Fact]
        public void Nothing_to_do_yet_gives_zero()
        {
            Assert.Equal(0, ProgressCalculator.Calculate(0, 0, 0, 0, 0, 0));
        }

        [Fact]
        public void Everything_done_gives_one_hundred()
        {
            Assert.Equal(100, ProgressCalculator.Calculate(3, 3, 2, 2, 4, 4));
        }

        [Fact]
        public void Half_done_gives_fifty()
        {
            // 2 of 4 sessions, 1 of 2 assignments, 2 of 4 materials = 5 of 10
            Assert.Equal(50, ProgressCalculator.Calculate(2, 4, 1, 2, 2, 4));
        }

        [Fact]
        public void Materials_are_optional_parameters()
        {
            // 1 of 2 sessions + 1 of 2 assignments = 2 of 4
            Assert.Equal(50, ProgressCalculator.Calculate(1, 2, 1, 2));
        }

        [Fact]
        public void Result_is_rounded_to_the_nearest_whole_number()
        {
            // 1 of 3 = 33.3 → 33, 2 of 3 = 66.7 → 67
            Assert.Equal(33, ProgressCalculator.Calculate(1, 3, 0, 0));
            Assert.Equal(67, ProgressCalculator.Calculate(2, 3, 0, 0));
        }

        [Theory]
        [InlineData(0, 5, 0, 0, 0)]
        [InlineData(5, 5, 0, 0, 100)]
        [InlineData(0, 0, 3, 4, 75)]
        public void Works_with_only_sessions_or_only_assignments(int attended, int past, int submitted, int total, int expected)
        {
            Assert.Equal(expected, ProgressCalculator.Calculate(attended, past, submitted, total));
        }
    }
}
