using System.ComponentModel.DataAnnotations;

namespace GlassTickets.Users.Dto
{
    public class ChangeUserLanguageDto
    {
        [Required]
        public string LanguageName { get; set; }
    }
}