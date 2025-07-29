using Abp.Configuration.Startup;
using Abp.Localization.Dictionaries;
using Abp.Localization.Dictionaries.Xml;
using Abp.Reflection.Extensions;

namespace GlassTickets.Localization
{
    public static class GlassTicketsLocalizationConfigurer
    {
        public static void Configure(ILocalizationConfiguration localizationConfiguration)
        {
            localizationConfiguration.Sources.Add(
                new DictionaryBasedLocalizationSource(GlassTicketsConsts.LocalizationSourceName,
                    new XmlEmbeddedFileLocalizationDictionaryProvider(
                        typeof(GlassTicketsLocalizationConfigurer).GetAssembly(),
                        "GlassTickets.Localization.SourceFiles"
                    )
                )
            );
        }
    }
}
