using Microsoft.Owin;
using Owin;

[assembly: OwinStartupAttribute(typeof(ContentAPITestSite.Startup))]
namespace ContentAPITestSite
{
    public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            ConfigureAuth(app);
        }
    }
}
