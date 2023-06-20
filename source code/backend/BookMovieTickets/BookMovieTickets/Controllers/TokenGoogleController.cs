using BookMovieTickets.Data;
using BookMovieTickets.Models;
using BookMovieTickets.Services;
using Google.Apis.Auth;
using Google.Apis.Auth.OAuth2.Requests;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Threading.Tasks;

namespace BookMovieTickets.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TokenGoogleController : ControllerBase
    {

        private readonly IConfiguration _configuration;
        private BookMovieTicketsContext _context;

        public TokenGoogleController(IConfiguration configuration, BookMovieTicketsContext context)
        {
            _configuration = configuration;
            _context = context;
        }

        public class TokenRequest
        {
            public string Token { get; set; }
        }

        [HttpPost]
        public IActionResult DecodeGoogleToken([FromBody] TokenRequest tokenRequest)
        {
            string token = tokenRequest.Token;

            GoogleJsonWebSignature.ValidationSettings validationSettings = new GoogleJsonWebSignature.ValidationSettings();
            validationSettings.Audience = new List<string>() { _configuration["Authentication:Google:ClientId"] };

            try
            {
                GoogleJsonWebSignature.Payload payload = GoogleJsonWebSignature.ValidateAsync(token, validationSettings).Result;

                // Trích xuất thông tin từ payload

                var Email = payload.Email;
                var Name = payload.Name;
                
                var _user = _context.Users.Where(x => x.Email.Equals(Email)).FirstOrDefault();

                if(_user != null)
                {
                    _context.SaveChanges();
                }
                else
                {
                    var user = new User();
                    user.Email = Email;
                    user.Fullname = Name;
                    user.LoginTypeId = 2;
                    _context.Users.Add(user);
                    _context.SaveChanges();
                    var _userPoint = new UserPoint();
                    _userPoint.UserId = user.Id;
                    _userPoint.RewardPoints = 0;
                    _userPoint.RewardPointsUsed = 0;
                    _context.Add(_userPoint);
                    _context.SaveChanges();
                }

                return Ok(new { Email = Email, Name = Name });
            }
            catch (InvalidJwtException)
            {
                // Token không hợp lệ
                return Unauthorized();
            }
            catch (Exception)
            {
                // Lỗi xác thực token
                return StatusCode(500);
            }
        }

    }
}
