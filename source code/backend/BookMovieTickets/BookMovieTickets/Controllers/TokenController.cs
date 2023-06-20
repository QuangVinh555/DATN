using BookMovieTickets.Data;
using BookMovieTickets.Models;
using BookMovieTickets.Views;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;

namespace BookMovieTickets.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TokenController : ControllerBase
    {
        private readonly BookMovieTicketsContext _context;
        private IConfiguration _configuration;

        public TokenController(BookMovieTicketsContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
        }

        [HttpPost]
        public IActionResult CreateToken(TokenDTO dto)
        {
            var _user = new User();
            try
            {
                if (dto != null && !string.IsNullOrEmpty(dto.Email) && !string.IsNullOrEmpty(dto.Password))
                {
                    byte[] bytes = Encoding.UTF8.GetBytes(dto.Password);
                    string passwordEncoding = Convert.ToBase64String(bytes);
                    _user = _context.Users.Where(x => x.Email == dto.Email && x.Password == passwordEncoding).SingleOrDefault();
                    if (_user != null)
                    {
                        return Ok(new MessageVM
                        {
                            Message = "Authenticate Success",
                            Data = GenerateToken(_user)
                        });
                    }
                    else
                    {
                        return NotFound("Username hoặc Password nhập sai");
                    }
                }
                else
                {
                    return BadRequest("Username and Password are required");
                }
            }
            catch(Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        private string GenerateToken(User user)
        {
            var secretKey = _configuration["Jwt:SecretKey"];
            var jwtTokenHandler = new JwtSecurityTokenHandler();
            var secretKeyBytes = Encoding.UTF8.GetBytes(secretKey);
            var tokenDescription = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new[]
            {
                    new Claim("Id", user.Id.ToString()),
                    new Claim("Username", user.Fullname),
                    new Claim("Email",user.Email),
                    new Claim("PhoneNumber",user.PhoneNumber),
                    new Claim("RoleId",user.RoleId.ToString()),
                    new Claim("TokenId",Guid.NewGuid().ToString())
                }),
                Expires = DateTime.UtcNow.AddHours(int.Parse(_configuration["Jwt:Expire"])),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(secretKeyBytes), SecurityAlgorithms.HmacSha512Signature)
            };

            var token = jwtTokenHandler.CreateToken(tokenDescription);

            return jwtTokenHandler.WriteToken(token);
        }
    }
}
