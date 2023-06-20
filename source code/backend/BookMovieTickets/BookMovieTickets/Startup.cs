using BookMovieTickets.Data;
using BookMovieTickets.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.HttpsPolicy;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Google.Apis.Gmail.v1;
using BookMovieTickets.Controllers;

namespace BookMovieTickets
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {

            services.AddControllers();
            // ADD DATABASE
            services.AddDbContext<BookMovieTicketsContext>(option => 
                option.UseSqlServer(Configuration.GetConnectionString("BookMovieTickets"))
            );

            // add interface
            services.AddScoped<IRoleRepository, RoleRepository>();
            services.AddScoped<ITypeLoginRepository, TypeLoginRepository>();
            services.AddScoped<IRankUserRepository, RankUserRepository>();
            services.AddScoped<IUserRepository, UserRepository>();
            services.AddScoped<ILocationRepository, LocationRepository>();
            services.AddScoped<ITypeCinemaRepository, TypeCinemaRepository>();
            services.AddScoped<ICinemaNameRepository, CinemaNameRepository>();
            services.AddScoped<ICinemaRoomRepository, CinemaRoomRepository>();
            services.AddScoped<IMovieRepository, MovieRepository>();
            services.AddScoped<IShowTimeRepository, ShowTimeRepository>();
            services.AddScoped<IHourTimeRepository, HourTimeRepository>();
            services.AddScoped<ITypeChairRepository, TypeChairRepository>();
            services.AddScoped<IChairRepository, ChairRepository>();
            services.AddScoped<IComboRepository, ComboRepository>();
            services.AddScoped<IPaymentRepository, PaymentRepository>();
            services.AddScoped<IBookTicketRepository, BookTicketRepository>();
            services.AddScoped<IBookTicketDetailRepository, BookTicketDetailRepository>();
            services.AddScoped<IChairStatusRepository, ChairStatusRepository>();
            services.AddScoped<ICommentRepository, CommentRepository>();
            services.AddScoped<IUserPointRepository, UserPointRepository>();

            services.AddSwaggerGen(c =>
            {
                c.SwaggerDoc("v1", new OpenApiInfo { Title = "BookMovieTickets", Version = "v1" });
            });

            // JWT
            var secretKey = Configuration["Jwt:SecretKey"];
            var secretKeyBytes = Encoding.UTF8.GetBytes(secretKey);
            services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme).AddJwtBearer(options =>
            {
                //options.RequireHttpsMetadata = false;
                //options.SaveToken = true;
                options.TokenValidationParameters = new TokenValidationParameters()
                {
                    //auto provide token
                    ValidateIssuer = false,
                    ValidateAudience = false,

                    //sign the token
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = new SymmetricSecurityKey(secretKeyBytes),

                    ClockSkew = TimeSpan.Zero
                };
            });

            // Xác thực Google
            services.AddAuthentication()
                .AddGoogle(option =>
                {
                    var gConfig = Configuration.GetSection("Authentication:Google");
                    option.ClientId = gConfig["ClientId"];
                    option.ClientSecret = gConfig["ClientSecret"];
                    //option.CallbackPath = "/api/tokengoogle";
                });

        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
                app.UseSwagger();
                app.UseSwaggerUI(c => c.SwaggerEndpoint("/swagger/v1/swagger.json", "BookMovieTickets v1"));
            }

            app.UseHttpsRedirection();

            app.UseRouting();
            app.UseCors(builder => builder
           .AllowAnyOrigin()
           .AllowAnyMethod()
           .AllowAnyHeader());

            app.UseAuthentication();

            app.UseAuthorization();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
            });
        }
    }
}
