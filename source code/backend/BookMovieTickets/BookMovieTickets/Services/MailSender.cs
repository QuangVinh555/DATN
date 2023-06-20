using QRCoder;
using System;
using System.Collections.Generic;
using System.Drawing;
using System.Drawing.Imaging;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Mail;
using System.Threading.Tasks;

namespace BookMovieTickets.Services
{
    public class MailSender
    {
        public void MailSenders(string email, string body, string header)
        {
            string username = "voquangvinh555@gmail.com";
            string password = "dgxfkioyftadixyh";
            // Thiết lập thông tin máy chủ SMTP
            SmtpClient client = new SmtpClient("smtp.gmail.com", 587);
            client.EnableSsl = true;
            client.UseDefaultCredentials = false;
            client.Credentials = new NetworkCredential(username, password);

            // Thiết lập thông tin email
            MailMessage mailMessage = new MailMessage();
            mailMessage.From = new MailAddress(username);
            mailMessage.To.Add(email);
            mailMessage.Subject = header;
            mailMessage.IsBodyHtml = true;
            mailMessage.Body = body;

            // Gửi email
            client.Send(mailMessage);
        }
    }
}
