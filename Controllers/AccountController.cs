using System;
using System.Threading.Tasks;
using System.IdentityModel.Tokens.Jwt;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Logging;
using Microsoft.IdentityModel.Tokens;
using aspnetcore_signalr.Data;

namespace aspnetcore_signalr.Controllers
{
    [Route("[controller]/[action]")]
    public class AccountController : Controller
    {
        private static readonly SigningCredentials SigningCreds = new SigningCredentials(Startup.SecurityKey, SecurityAlgorithms.HmacSha256);

        private readonly SignInManager<ApplicationUser> _signInManager;
        private readonly ILogger _logger;
        private readonly JwtSecurityTokenHandler _tokenHandler = new JwtSecurityTokenHandler();

        public AccountController(SignInManager<ApplicationUser> signInManager, ILogger<AccountController> logger)
        {
            _signInManager = signInManager;
            _logger = logger;
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Logout()
        {
            await _signInManager.SignOutAsync();
            _logger.LogInformation("Usuário deslogado.");
            return RedirectToPage("/Index");
        }

        [HttpPost]
        public async Task<IActionResult> Token(string email, string password)
        {
            try
            {
                var user = await _signInManager.UserManager.FindByEmailAsync(email);
                if (user == null) 
                {
                    return Json(new 
                    {
                        error = "Login inválido."
                    });
                }

                var result = await _signInManager.CheckPasswordSignInAsync(user, password, lockoutOnFailure: false);
                if (result.Succeeded)
                {
                    var principal = await _signInManager.CreateUserPrincipalAsync(user);
                    var token = new JwtSecurityToken(
                        "SignalRAuthenticationSample",
                        "SignalRAuthenticationSample",
                        principal.Claims,
                        expires: DateTime.UtcNow.AddDays(30),
                        signingCredentials: SigningCreds
                    );

                    return Json(new
                    {
                        token = _tokenHandler.WriteToken(token)
                    });
                }
                else
                {
                    return Json(new
                    {
                        error = result.IsLockedOut ? "Usuário bloqueado." : "Login inválido."
                    });
                }
            }
            catch (Exception ex)
            {
                return Json(new 
                {
                    error = ex.ToString()
                });
            }
        }
    }
}