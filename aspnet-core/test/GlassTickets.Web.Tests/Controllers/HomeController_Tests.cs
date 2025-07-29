using System.Threading.Tasks;
using GlassTickets.Models.TokenAuth;
using GlassTickets.Web.Controllers;
using Shouldly;
using Xunit;

namespace GlassTickets.Web.Tests.Controllers
{
    public class HomeController_Tests: GlassTicketsWebTestBase
    {
        [Fact]
        public async Task Index_Test()
        {
            await AuthenticateAsync(null, new AuthenticateModel
            {
                UserNameOrEmailAddress = "admin",
                Password = "123qwe"
            });

            //Act
            var response = await GetResponseAsStringAsync(
                GetUrl<HomeController>(nameof(HomeController.Index))
            );

            //Assert
            response.ShouldNotBeNullOrEmpty();
        }
    }
}