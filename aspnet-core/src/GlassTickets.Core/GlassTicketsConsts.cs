using GlassTickets.Debugging;

namespace GlassTickets
{
    public class GlassTicketsConsts
    {
        public const string LocalizationSourceName = "GlassTickets";

        public const string ConnectionStringName = "Default";

        public const bool MultiTenancyEnabled = true;


        /// <summary>
        /// Default pass phrase for SimpleStringCipher decrypt/encrypt operations
        /// </summary>
        public static readonly string DefaultPassPhrase =
            DebugHelper.IsDebug ? "gsKxGZ012HLL3MI5" : "66e715effa9146768b61246e3ecac044";
    }
}
